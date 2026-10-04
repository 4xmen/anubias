use crate::message::send_log;
use anyhow::{anyhow, bail, Context, Result};
use icns::{IconFamily, IconType, Image as IcnsImage, PixelFormat};
use image::imageops::overlay;
use image::{imageops::FilterType, DynamicImage, ImageFormat};
use rayon::prelude::*;
use std::fs::{self, File};
use std::io::BufWriter;
use std::path::{Path, PathBuf};
use tauri::{async_runtime, AppHandle};

/// Contains the original source image used to generate all requested icon sizes.
///
/// The original image is kept unchanged so every output size is generated
/// directly from the highest-quality source instead of being resized from
/// another already-resized image.
pub struct IconMaster {
    source: DynamicImage,
    base: DynamicImage,
}

impl IconMaster {
    /// Creates a new `IconMaster` from an already decoded image.
    ///
    /// The image is stored as-is and is used as the source for every generated
    /// icon. Keeping the original source avoids cumulative quality loss when
    /// generating multiple output sizes.
    pub fn new(source: DynamicImage, base: DynamicImage) -> Self {
        // Keep the original image untouched for all future resize operations.
        Self { source, base }
    }

    /// Opens an image from disk and creates an `IconMaster`.
    ///
    /// The image is decoded immediately so subsequent operations can reuse the
    /// same decoded source without opening the file again.
    pub fn open(source_path: impl AsRef<Path>, base_path: impl AsRef<Path>) -> Result<Self> {
        // Resolve the path once so it can be included in any decoding error.
        let path = source_path.as_ref();
        let path2 = base_path.as_ref();

        let source = image::open(path)
            .with_context(|| format!("failed to open source image: {}", path.display()))?;
        let base = image::open(path2)
            .with_context(|| format!("failed to open base image: {}", path2.display()))?;

        Ok(Self::new(source, base))
    }

    /// Resizes the source image to a square and saves it to the destination.
    ///
    /// The resize is always performed from the original source image using
    /// Lanczos3 filtering. The output format is inferred from the destination
    /// file extension.
    ///
    /// ICNS is intentionally not handled here because an ICNS file is a
    /// multi-resolution icon container rather than a single resized image.
    pub fn resize_and_save(&self, size: u32, dest: impl AsRef<Path>) -> Result<()> {
        // Reject zero-sized output before passing dimensions to the image library.
        if size == 0 {
            bail!("icon size must be greater than zero");
        }

        // Resolve the destination path once so all errors include the same path.
        let dest = dest.as_ref();

        // Determine the output format before doing the resize so an unsupported
        // destination extension fails before allocating the resized image.
        let format = image_format_from_path(dest)
            .with_context(|| format!("failed to determine output format for {}", dest.display()))?;

        // Resize directly from the original source to avoid cumulative quality loss.
        let image = self.source.resize_exact(size, size, FilterType::Lanczos3);

        // Convert to RGBA8 so every normal raster output has a predictable
        // 8-bit-per-channel representation before encoding.
        let image = image.to_rgba8();

        // Write the encoded image to disk and preserve the destination path in
        // the error chain if the encoder or filesystem operation fails.
        image
            .save_with_format(dest, format)
            .with_context(|| format!("failed to save resized image to {}", dest.display()))?;

        Ok(())
    }

    pub fn resize_and_save_with_overlay(&self, size: u32, dest: impl AsRef<Path>) -> Result<()> {
        // Reject zero-sized or small output before passing dimensions to the image library.
        if size < 10 {
            bail!("icon size must be greater than 10");
        }

        // Resolve the destination path once so all errors include the same path.
        let dest = dest.as_ref();

        // Determine the output format before doing the resize so an unsupported
        // destination extension fails before allocating the resized image.
        let format = image_format_from_path(dest)
            .with_context(|| format!("failed to determine output format for {}", dest.display()))?;

        // get base image bg squar rounded white
        let base_path = base_image_root();

        let mut base_image = self
            .base
            .resize_exact(size, size, FilterType::Lanczos3)
            .to_rgba8();

        // new size & offset
        let new_size = (size as f32 * 0.6) as u32;
        let offset = (size as f32 * 0.2) as i64;

        // Resize directly from the original source to avoid cumulative quality loss.
        let image = self
            .source
            .resize_exact(new_size, new_size, FilterType::Lanczos3);

        // Convert to RGBA8 so every normal raster output has a predictable
        // 8-bit-per-channel representation before encoding.
        let image = image.to_rgba8();

        // merge 2 image
        overlay(&mut base_image, &image, offset, offset);

        // Write the encoded image to disk and preserve the destination path in
        // the error chain if the encoder or filesystem operation fails.
        base_image.save_with_format(dest, format).with_context(|| {
            format!(
                "failed to save merged & resized image to {}",
                dest.display()
            )
        })?;

        Ok(())
    }

    /// Resizes the source image to a square, places it centered with padding,
    /// and replaces transparency with a solid background color.
    ///
    /// The icon itself is scaled to 80% of the target size (10% padding on each
    /// side) so it never touches the edges of the background. Fully transparent
    /// pixels become `bg`; semi-transparent pixels (< 95% opacity) are blended
    /// with `bg`; highly opaque pixels keep their original color.
    ///
    /// Useful for iOS and web assets that reject transparency.
    ///
    /// # Arguments
    /// * `size` - Desired square side length in pixels (must be ≥ 10)
    /// * `dest` - Destination path; format is inferred from the extension
    /// * `bg`   - Solid background color (RGBA). Typical value is opaque white:
    ///            `image::Rgba([255, 255, 255, 255])`
    pub fn resize_and_save_with_background(
        &self,
        size: u32,
        dest: impl AsRef<Path>,
        bg: image::Rgba<u8>,
    ) -> Result<()> {
        if size < 10 {
            bail!("icon size must be greater than or equal to 10");
        }

        let dest = dest.as_ref();

        let format = image_format_from_path(dest)
            .with_context(|| format!("failed to determine output format for {}", dest.display()))?;

        // Solid background canvas of the final size.
        let mut canvas = image::RgbaImage::from_pixel(size, size, bg);

        // Icon is 80% of the canvas, centered (10% padding on each side).
        let icon_size = (size as f32 * 0.8) as u32;
        let offset = ((size - icon_size) / 2) as i64;

        // Resize from the original high-quality source.
        let mut icon = self
            .source
            .resize_exact(icon_size, icon_size, FilterType::Lanczos3)
            .to_rgba8();

        // Resolve transparency against the chosen background color.
        apply_background(&mut icon, bg);

        // Place the processed icon in the center of the canvas.
        image::imageops::overlay(&mut canvas, &icon, offset, offset);

        canvas.save_with_format(dest, format).with_context(|| {
            format!("failed to save image with background to {}", dest.display())
        })?;

        Ok(())
    }

    /// Generates an ICNS file using the standard macOS icon representations.
    ///
    /// The generated family contains normal and Retina representations where
    /// supported by the ICNS format. For example, a 512x512 screen icon at 2x
    /// density is stored using a 1024x1024 pixel image.
    pub fn save_icns_default(&self, dest: impl AsRef<Path>) -> Result<()> {
        // Define the screen sizes and their pixel densities used for the default
        // macOS icon family. The second value is the Retina density.
        const TARGETS: &[(u32, u32)] = &[
            (16, 1),
            (16, 2),
            (32, 1),
            (32, 2),
            (64, 1),
            (128, 1),
            (128, 2),
            (256, 1),
            (256, 2),
            (512, 1),
            (512, 2),
        ];

        self.save_icns(TARGETS, dest)
    }

    /// Generates an ICNS file containing the requested screen sizes and densities.
    ///
    /// Each tuple contains `(screen_size, density)`. The actual pixel dimensions
    /// are calculated as `screen_size * density`, and the resulting image is
    /// assigned to the corresponding `IconType` provided by the `icns` crate.
    ///
    /// This allows callers to explicitly control the generated ICNS contents
    /// without exposing ICNS binary-format details.
    pub fn save_icns(&self, targets: &[(u32, u32)], dest: impl AsRef<Path>) -> Result<()> {
        // Reject an empty target list because it would produce an unusable
        // ICNS family with no icon entries.
        if targets.is_empty() {
            bail!("at least one ICNS target is required");
        }

        // Resolve the destination path once so every filesystem error can
        // reference the exact output path.
        let dest = dest.as_ref();

        // Create the ICNS container that will hold all generated representations.
        let mut family = IconFamily::new();

        for &(screen_size, density) in targets {
            // Validate the logical icon size before calculating pixel dimensions.
            if screen_size == 0 {
                bail!("ICNS screen size must be greater than zero");
            }

            // A density of zero has no useful meaning for an icon representation.
            if density == 0 {
                bail!(
                    "ICNS density must be greater than zero for {}x{}",
                    screen_size,
                    screen_size
                );
            }

            // Calculate the actual pixel dimensions stored in the ICNS entry.
            let pixel_size = screen_size.checked_mul(density).ok_or_else(|| {
                anyhow!(
                    "ICNS pixel size overflow for {}x{} at {}x density",
                    screen_size,
                    screen_size,
                    density
                )
            })?;

            // Ask the icns crate to resolve the exact icon type for this
            // pixel size and density instead of guessing the underlying OSType.
            let icon_type = IconType::from_pixel_size_and_density(pixel_size, pixel_size, density)
                .ok_or_else(|| {
                    anyhow!(
                        "no supported ICNS icon type for {}x{} at {}x density",
                        screen_size,
                        screen_size,
                        density
                    )
                })?;

            // Generate this representation directly from the original source.
            let image = self
                .source
                .resize_exact(pixel_size, pixel_size, FilterType::Lanczos3)
                .to_rgba8();

            // Convert the image crate's RGBA buffer into the representation
            // expected by the icns crate.
            let icns_image = rgba_to_icns_image(&image).with_context(|| {
                format!(
                    "failed to convert {}x{} icon to ICNS image",
                    pixel_size, pixel_size
                )
            })?;

            // Add the image using the explicitly resolved ICNS type so Retina
            // density is preserved instead of being inferred incorrectly.
            family
                .add_icon_with_type(&icns_image, icon_type)
                .with_context(|| {
                    format!(
                        "failed to add {}x{} @ {}x icon to ICNS family",
                        screen_size, screen_size, density
                    )
                })?;
        }

        // Create the destination file only after the entire family has been
        // successfully generated in memory.
        let file = File::create(dest)
            .with_context(|| format!("failed to create ICNS file {}", dest.display()))?;

        // Buffer the filesystem writes so ICNS serialization does not perform
        // unnecessary small writes directly against the filesystem.
        let writer = BufWriter::new(file);

        // Serialize the complete icon family and preserve the output path in
        // case the underlying writer or ICNS encoder reports an error.
        family
            .write(writer)
            .with_context(|| format!("failed to write ICNS file {}", dest.display()))?;

        Ok(())
    }
}

/// Converts an RGBA8 image from the `image` crate into an `icns::Image`.
///
/// The conversion uses the exact raw RGBA byte buffer produced by
/// `image::RgbaImage`, avoiding an unnecessary intermediate image format.
fn rgba_to_icns_image(image: &image::RgbaImage) -> Result<IcnsImage> {
    // Copy the raw RGBA bytes into a Vec because icns::Image::from_data takes
    // ownership of the pixel buffer.
    let data = image.as_raw().clone();

    // Construct an ICNS image using the crate's documented RGBA pixel format.
    IcnsImage::from_data(PixelFormat::RGBA, image.width(), image.height(), data)
        .context("icns rejected the RGBA image data")
}

/// Resolves a normal raster image format from the destination file extension.
///
/// ICNS is deliberately excluded because it is handled by `save_icns`.
fn image_format_from_path(path: &Path) -> Result<ImageFormat> {
    // Read the extension and normalize it to lowercase for predictable matching.
    let extension = path
        .extension()
        .and_then(|extension| extension.to_str())
        .map(str::to_ascii_lowercase)
        .ok_or_else(|| {
            anyhow!(
                "destination has no supported image extension: {}",
                path.display()
            )
        })?;

    // Map supported extensions to the corresponding image encoder.
    match extension.as_str() {
        "png" => Ok(ImageFormat::Png),
        "jpg" | "jpeg" => Ok(ImageFormat::Jpeg),
        "webp" => Ok(ImageFormat::WebP),
        "bmp" => Ok(ImageFormat::Bmp),
        "gif" => Ok(ImageFormat::Gif),
        "ico" => Ok(ImageFormat::Ico),
        "tif" | "tiff" => Ok(ImageFormat::Tiff),
        "icns" => bail!("ICNS output must be generated with save_icns() or save_icns_default()"),
        _ => bail!("unsupported output image format: {}", extension),
    }
}

fn base_image_root() -> PathBuf {
    PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("assets/base.png")
}

/// Applies a solid background color to an RGBA image according to transparency rules.
///
/// - Fully transparent pixels (alpha == 0) are replaced with `bg`.
/// - Pixels with alpha < 95% are alpha-composited over `bg`.
/// - Pixels with alpha >= 95% keep their original RGB and become fully opaque.
///
/// After this pass every pixel is opaque, which is required by platforms that
/// reject transparency in launcher / favicon assets.
fn apply_background(image: &mut image::RgbaImage, bg: image::Rgba<u8>) {
    // 95% of 255 ≈ 242
    const THRESHOLD: u8 = 242;

    for pixel in image.pixels_mut() {
        let alpha = pixel[3];

        if alpha == 0 {
            // Pure transparency → solid background
            *pixel = bg;
        } else if alpha < THRESHOLD {
            // Semi-transparent → standard "over" compositing
            let a = f32::from(alpha) / 255.0;
            let inv = 1.0 - a;

            pixel[0] = (f32::from(pixel[0]) * a + f32::from(bg[0]) * inv).round() as u8;
            pixel[1] = (f32::from(pixel[1]) * a + f32::from(bg[1]) * inv).round() as u8;
            pixel[2] = (f32::from(pixel[2]) * a + f32::from(bg[2]) * inv).round() as u8;
            pixel[3] = 255;
        } else {
            // Nearly or fully opaque → keep color, force opaque
            pixel[3] = 255;
        }
    }
}
fn generate_icons(app: AppHandle, source: &str, project_root: &str) -> Result<()> {
    let src = Path::new(source);
    let root = Path::new(project_root);
    // Load the source image once and reuse it for every generated icon.
    let icon = IconMaster::open(src, base_image_root())?;

    // Common solid white background used by iOS / web assets.
    let white = image::Rgba([255, 255, 255, 255]);

    send_log(&app, "Start icon generation...");
    send_log(&app, "Start icon generation...");

    // ---------- Android ----------
    send_log(&app, "Generate Android Icons:");
    {
        let jobs = [
            (
                48,
                root.join("android/app/src/main/res/mipmap-mdpi/ic_launcher.png"),
            ),
            (
                72,
                root.join("android/app/src/main/res/mipmap-hdpi/ic_launcher.png"),
            ),
            (
                96,
                root.join("android/app/src/main/res/mipmap-xhdpi/ic_launcher.png"),
            ),
            (
                144,
                root.join("android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png"),
            ),
            (
                192,
                root.join("android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png"),
            ),
        ];

        let results: Vec<Result<()>> = jobs
            .into_par_iter()
            .map(|(size, path)| icon.resize_and_save(size, path))
            .collect();

        for result in results {
            result?;
        }
    }
    send_log(&app, "Generate Android Success.");

    // ---------- macOS ----------

    send_log(&app, "Generate macOS Icons:");
    {
        let jobs = [
            (
                16,
                root.join("macos/Runner/Assets.xcassets/AppIcon.appiconset/app_icon_16.png"),
            ),
            (
                32,
                root.join("macos/Runner/Assets.xcassets/AppIcon.appiconset/app_icon_32.png"),
            ),
            (
                64,
                root.join("macos/Runner/Assets.xcassets/AppIcon.appiconset/app_icon_64.png"),
            ),
            (
                128,
                root.join("macos/Runner/Assets.xcassets/AppIcon.appiconset/app_icon_128.png"),
            ),
            (
                256,
                root.join("macos/Runner/Assets.xcassets/AppIcon.appiconset/app_icon_256.png"),
            ),
            (
                512,
                root.join("macos/Runner/Assets.xcassets/AppIcon.appiconset/app_icon_512.png"),
            ),
            (
                1024,
                root.join("macos/Runner/Assets.xcassets/AppIcon.appiconset/app_icon_1024.png"),
            ),
        ];

        let results: Vec<Result<()>> = jobs
            .into_par_iter()
            .map(|(size, path)| icon.resize_and_save_with_overlay(size, path))
            .collect();

        for result in results {
            result?;
        }
    }
    send_log(&app, "Generate macOS Success.");
    // icon.save_icns_default("dist/AppIcon.icns")?;

    // ----------------------------------
    //          with white bg
    // ----------------------------------

    // ---------- iOS ----------
    send_log(&app, "Generate iOS Icons:");
    {
        let jobs = [
            (
                20,
                root.join("ios/Runner/Assets.xcassets/AppIcon.appiconset/Icon-App-20x20@1x.png"),
                white,
            ),
            (
                40,
                root.join("ios/Runner/Assets.xcassets/AppIcon.appiconset/Icon-App-20x20@2x.png"),
                white,
            ),
            (
                60,
                root.join("ios/Runner/Assets.xcassets/AppIcon.appiconset/Icon-App-20x20@3x.png"),
                white,
            ),
            (
                29,
                root.join("ios/Runner/Assets.xcassets/AppIcon.appiconset/Icon-App-29x29@1x.png"),
                white,
            ),
            (
                58,
                root.join("ios/Runner/Assets.xcassets/AppIcon.appiconset/Icon-App-29x29@2x.png"),
                white,
            ),
            (
                87,
                root.join("ios/Runner/Assets.xcassets/AppIcon.appiconset/Icon-App-29x29@3x.png"),
                white,
            ),
            (
                40,
                root.join("ios/Runner/Assets.xcassets/AppIcon.appiconset/Icon-App-40x40@1x.png"),
                white,
            ),
            (
                80,
                root.join("ios/Runner/Assets.xcassets/AppIcon.appiconset/Icon-App-40x40@2x.png"),
                white,
            ),
            (
                120,
                root.join("ios/Runner/Assets.xcassets/AppIcon.appiconset/Icon-App-40x40@3x.png"),
                white,
            ),
            (
                50,
                root.join("ios/Runner/Assets.xcassets/AppIcon.appiconset/Icon-App-50x50@1x.png"),
                white,
            ),
            (
                100,
                root.join("ios/Runner/Assets.xcassets/AppIcon.appiconset/Icon-App-50x50@2x.png"),
                white,
            ),
            (
                57,
                root.join("ios/Runner/Assets.xcassets/AppIcon.appiconset/Icon-App-57x57@1x.png"),
                white,
            ),
            (
                114,
                root.join("ios/Runner/Assets.xcassets/AppIcon.appiconset/Icon-App-57x57@2x.png"),
                white,
            ),
            (
                60,
                root.join("ios/Runner/Assets.xcassets/AppIcon.appiconset/Icon-App-60x60@1x.png"),
                white,
            ),
            (
                120,
                root.join("ios/Runner/Assets.xcassets/AppIcon.appiconset/Icon-App-60x60@2x.png"),
                white,
            ),
            (
                180,
                root.join("ios/Runner/Assets.xcassets/AppIcon.appiconset/Icon-App-60x60@3x.png"),
                white,
            ),
            (
                72,
                root.join("ios/Runner/Assets.xcassets/AppIcon.appiconset/Icon-App-72x72@1x.png"),
                white,
            ),
            (
                144,
                root.join("ios/Runner/Assets.xcassets/AppIcon.appiconset/Icon-App-72x72@2x.png"),
                white,
            ),
            (
                76,
                root.join("ios/Runner/Assets.xcassets/AppIcon.appiconset/Icon-App-76x76@1x.png"),
                white,
            ),
            (
                152,
                root.join("ios/Runner/Assets.xcassets/AppIcon.appiconset/Icon-App-76x76@2x.png"),
                white,
            ),
            (
                167,
                root.join(
                    "ios/Runner/Assets.xcassets/AppIcon.appiconset/Icon-App-83.5x83.5@2x.png",
                ),
                white,
            ),
            (
                1024,
                root.join(
                    "ios/Runner/Assets.xcassets/AppIcon.appiconset/Icon-App-1024x1024@1x.png",
                ),
                white,
            ),
        ];

        let results: Vec<anyhow::Result<()>> = jobs
            .into_par_iter()
            .map(|(size, path, white)| icon.resize_and_save_with_background(size, path, white))
            .collect();

        for result in results {
            result?;
        }
    }
    send_log(&app, "Generate iOS Success.");

    // ---------- Web ----------
    send_log(&app, "Generate Web Icons:");
    {
        let jobs = [
            (16, root.join("web/favicon.png")),
            (192, root.join("web/icons/Icon-192.png")),
            (512, root.join("web/icons/Icon-512.png")),
            (192, root.join("web/icons/Icon-maskable-192.png")),
            (512, root.join("web/icons/Icon-maskable-512.png")),
        ];

        let results: Vec<anyhow::Result<()>> = jobs
            .into_par_iter()
            .map(|(size, path)| icon.resize_and_save_with_background(size, path, white))
            .collect();

        for result in results {
            result?;
        }
    }
    send_log(&app, "Generate Web Success.");

    // ---------- Windows ----------
    send_log(&app, "Generate Windows Icons:");
    icon.resize_and_save(256, root.join("windows/runner/resources/app_icon.ico"))?;
    send_log(&app, "Generate Windows Success.");

    Ok(())
}

/// Generates all platform icons from the given source image.
///
/// This command runs the heavy image-processing work on a blocking thread pool
/// so the main/async runtime is never blocked.
#[tauri::command]
pub async fn generate_icons_command(
    app: AppHandle,
    source: String,
    project_root: String,
) -> Result<(), String> {
    // Move ownership into the blocking task.
    let result = async_runtime::spawn_blocking(move || generate_icons(app, &source, &project_root))
        .await
        .map_err(|e| format!("task join error: {e}"))?; // JoinError

    result.map_err(|e| e.to_string()) // anyhow::Error → String
}
