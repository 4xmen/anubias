import {ipcMain, shell} from 'electron';

// api receive by main
ipcMain.on('close',(_event, ...args) => {
    console.log('close',args);
});

ipcMain.on('open-website',async (_event, ...args) => {
    await shell.openExternal(args[0]);
});


