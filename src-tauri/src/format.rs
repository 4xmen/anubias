pub mod app {

    pub const MAGIC: [u8; 8] = *b"ANUBIAS\0";

    pub const fn version(major: u16, minor: u16, patch: u16) -> u16 {
        (major << 11) | (minor << 6) | patch
    }

    pub const VERSION: u16 = version(2, 0, 0);

    pub fn random_seed() -> u64 {
        rand::random()
    }
}
