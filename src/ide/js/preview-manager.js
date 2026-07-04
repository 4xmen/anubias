import {inspectBlob} from "./system-functions.js";

/**
 * Runtime preview cache.
 *
 * Stores page previews independently from the project state.
 *
 * Responsibilities:
 * - Register pages
 * - Store preview blobs
 * - Generate object URLs
 * - Release browser resources
 *
 * This class is intentionally NOT reactive.
 */
export class PreviewManager {
    constructor() {
        this.previews = new Map();
    }

    /**
     * Register a page.
     *
     * Safe to call multiple times.
     */
    register(pageId) {
        if (this.previews.has(pageId)) {
            return;
        }

        if (!this.previews.has(pageId)) {
            this.previews.set(pageId, {
                blob: null,
                url: null,
                dirty: false,
                updatedAt: 0,
            });
        }
    }

    /**
     * Update a page preview.
     */
    update(pageId, blob) {
        const preview = this.previews.get(pageId);

        if (!preview) {
            throw new Error(`Preview "${pageId}" is not registered.`);
        }

        if (preview.url) {
            URL.revokeObjectURL(preview.url);
        }

        preview.blob = blob;
        preview.url = URL.createObjectURL(blob);
        preview.dirty = true;
        preview.updatedAt = Date.now();
        // update force
        // this.previews = new Map(this.previews);
        // debug
        // inspectBlob(blob,'after');
    }

    /**
     * Get preview metadata.
     */
    get(pageId) {
        return this.previews.get(pageId) ?? null;
    }

    /**
     * Get preview url for rendering.
     */
    getUrl(pageId) {
        return this.previews.get(pageId)?.url ?? null;
    }

    /**
     * Remove a preview.
     */
    remove(pageId) {
        const preview = this.previews.get(pageId);

        if (!preview) {
            return;
        }

        if (preview.url) {
            URL.revokeObjectURL(preview.url);
        }

        this.previews.delete(pageId);
    }

    /**
     * Mark every preview as saved.
     */
    markSaved() {
        for (const preview of this.previews.values()) {
            preview.dirty = false;
        }
    }

    /**
     * Returns previews for serialization.
     */
    serialize() {
        return [...this.previews.entries()]
            .filter(([, preview]) => preview.blob)
            .map(([pageId, preview]) => ({
                pageId,
                blob: preview.blob,
            }));
    }

    /**
     * Release every object URL.
     */
    clear() {
        for (const preview of this.previews.values()) {
            if (preview.url) {
                URL.revokeObjectURL(preview.url);
            }
        }

        this.previews.clear();
    }

    /**
     * Returns true if a preview is registered.
     */
    has(pageId) {
        return this.previews.has(pageId);
    }

    /**
     * Returns the internal preview collection.
     *
     * Intended for iteration during serialization
     * or debugging.
     *
     * Do not mutate the returned Map directly.
     */
    all() {
        return this.previews;
    }

    /**
     * Export to save into project file
     * @returns {Promise<*[]>}
     */
    async export() {
        const previews = [];

        for (const [page_id, preview] of this.previews) {

            if (!preview.blob) continue;

            previews.push({
                page_id,
                data: new Uint8Array(await preview.blob.arrayBuffer())
            });

        }
        return previews;

    }
}