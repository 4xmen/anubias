/**
 * preload help us to connect ide to electron app
 * This is like server/client relation
 */

/**
 * require electron js ipc and context bridge
 */
const {
    contextBridge,
    ipcRenderer
} = require("electron");
// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
    "api", {
        send: (channel, data) => {
            // whitelist channels
            let validChannels = ["toMain",
                'openWeb',
                'open-file-dialog',
                'save-as-file-project',
                'save-project',
                'open-file-dialog-project',
                'open-file-image',
                'command',
                'update-project',
                'app-close',
                'app-max',
                'app-min',
                'devtools',
                'emulator',
                'storage-get',
                'storage-set',
            ];
            if (validChannels.includes(channel)) {
                ipcRenderer.send(channel, data);
            }
        },
        receive: (channel, func) => {
            let validChannels = [
                "fromMain",
                'selected-file',
                'saved-file',
                'message',
                'image-selected',
                'terminal',
                'terminal-error',
                'build-success',
                'emulator',
                'emulator-terminal',
                'storage-back',
                'app-exit'
            ];
            if (validChannels.includes(channel)) {
                // Deliberately strip event as it includes `sender`
                ipcRenderer.on(channel, (event, ...args) => func(...args));
            }
        }
    }
);