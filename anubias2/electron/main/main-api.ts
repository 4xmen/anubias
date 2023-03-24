import {ipcMain, shell} from 'electron';
const Store = require('electron-store');
const store = new Store();

// api receive by main
ipcMain.on('close',(_event, ...args) => {
    console.log('close',args);
});

ipcMain.on('open-website',async (_event, ...args) => {
    await shell.openExternal(args[0]);
});

ipcMain.handle('electron-store-get-data', (event, key) => {
    return store.get(key);
});


