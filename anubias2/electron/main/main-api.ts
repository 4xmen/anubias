import {ipcMain, shell, BrowserWindow, Menu} from 'electron';
import {AppMenu} from './app-menu';
const Store = require('electron-store');
const store = new Store();
let win = null;
let menuapp = null;
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

//
ipcMain.on ("app-started", (event, args) => {
    win =  BrowserWindow.getFocusedWindow();

    menuapp = new AppMenu(win);
    let menu = Menu.buildFromTemplate(menuapp.menu());
    Menu.setApplicationMenu(menu);
});
ipcMain.on ("set-has-project", (event, ...args) => {
    menuapp.setHasProject(args[0]);
    let menu = Menu.buildFromTemplate(menuapp.menu());
    Menu.setApplicationMenu(menu);
});

ipcMain.on ("set-menu-state", (event, ...args) => {
    menuapp.setMenuState(args[0],args[2]);
    let menu = Menu.buildFromTemplate(menuapp.menu());
    Menu.setApplicationMenu(menu);
});

