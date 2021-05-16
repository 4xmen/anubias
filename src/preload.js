// const { remote } = require('electron');
// console.log(remote);
// let currWindow = remote.BrowserWindow.getFocusedWindow();
//
// console.log(remote);
// window.closeCurrentWindow = function(){
//     currWindow.close();
// }

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
            let validChannels = ["toMain",'open-file-dialog','save-as-file-project','save-project','open-file-dialog-project'];
            if (validChannels.includes(channel)) {
                ipcRenderer.send(channel, data);
            }
        },
        receive: (channel, func) => {
            let validChannels = ["fromMain",'selected-file','saved-file','message'];
            if (validChannels.includes(channel)) {
                // Deliberately strip event as it includes `sender`
                ipcRenderer.on(channel, (event, ...args) => func(...args));
            }
        }
    }
);