import { getCurrentWindow } from "@tauri-apps/api/window";

const win = getCurrentWindow();

window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        win.close();
    }
});