import {ipcMain } from 'electron';

// api receive by main
ipcMain.on('close',(_event, ...args) => {
    console.log('close',args);
});


