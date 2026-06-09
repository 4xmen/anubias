// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    // std::env::set_var("WEBKIT_DISABLE_DMABUF_RENDERER", "1");
    anubias2_lib::run()
}
