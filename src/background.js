'use strict'

import {app, protocol, BrowserWindow} from 'electron'
import {createProtocol} from 'vue-cli-plugin-electron-builder/lib'
import installExtension, {VUEJS_DEVTOOLS} from 'electron-devtools-installer'
import path from 'path'
import fs from "fs";

const ipc = require('electron').ipcMain
const dialog = require('electron').dialog
const isDevelopment = process.env.NODE_ENV !== 'production';
var win;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
    {scheme: 'app', privileges: {secure: true, standard: true}}
])

async function createWindow() {

    // Create the browser window.
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {

            // Use pluginOptions.nodeIntegration, leave this alone
            // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
            // nodeIntegration: true,
            // enableRemoteModule: true,
            // contextIsolation: false ,
            enableRemoteModule: false, // turn off remote
            nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
            preload: path.join(__dirname, 'preload.js')
        }
    })
    win.removeMenu();
    win.maximize();


    if (process.env.WEBPACK_DEV_SERVER_URL) {
        // Load the url of the dev server if in development mode
        await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
        if (!process.env.IS_TEST) win.webContents.openDevTools()
    } else {
        createProtocol('app')
        // Load the index.html when not in development
        win.loadURL('app://./index.html');
    }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
    if (isDevelopment && !process.env.IS_TEST) {
        // Install Vue Devtools
        try {
            await installExtension(VUEJS_DEVTOOLS)
        } catch (e) {
            console.error('Vue Devtools failed to install:', e.toString())
        }
    }
    createWindow()

})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
    if (process.platform === 'win32') {
        process.on('message', (data) => {
            if (data === 'graceful-exit') {
                app.quit()
            }
        })
    } else {
        process.on('SIGTERM', () => {
            app.quit()
        })
    }
}
/**
 * sample of open file
 */
ipc.on('open-file-dialog', function (event) {
    dialog.showOpenDialog({
        properties: ['openFile']
    }, function (files) {
        if (files) event.sender.send('selected-file', files)
    })
});

/**
 * open project progress
 */
ipc.on('open-file-dialog-project', function (event) {
    // show open dialog
    dialog.showOpenDialog({
        title: 'Open Anubias project',
        filters: [
            {name: 'Anubias project', extensions: ['anb']},
            {name: 'All Files', extensions: ['*']}
        ],
        // properties: {showOverwriteConfirmation: true,}
        properties: ['openFile']
    }).then(function (files) {
        // when done check is canceled or not
        if (!files.canceled) {
            // or not send msg try to read and open file
            win.webContents.send('message', {type: 'info', 'msg': 'try to open ' + path.basename(files.filePaths[0])});
            // store project file name
            let filename = files.filePaths[0];
            // read project file
            try {
                fs.readFile(filename, 'utf8', function (err, data) {
                    // then when loaded send data to ide
                    win.webContents.send('selected-file', {
                        file: filename,
                        basename: path.basename(filename),
                        folder: path.dirname(filename),
                        data: JSON.parse(data)
                    });
                })
            } catch(e) {
                win.webContents.send('message', 'error ' + e.message);
            }
        }
    })
});

/**
 * save project as progress
 */
ipc.on('save-as-file-project', function (event, arg) {
    // show save dialog
    dialog.showSaveDialog(arg.dialog).then(function (data) {
        try {
            // then check is canceled?
            if (data.canceled){
                win.webContents.send('message', {type: 'info', 'msg': 'Canceled'});
                return false;
            }
            // prepare file name to save
            let filename = data.filePath.trim();
            // check user added extention ".anb" or not
            if (filename.substr(filename.length - 4) !== '.anb') {
                // or not we add ext to prepared file name
                filename += '.anb';
            }
            // send msg try to read and open file
            win.webContents.send('message', {type: 'info', 'msg': 'try to save ' + path.basename(filename)});
            // try to write into selected file
            fs.writeFile(filename, JSON.stringify(arg.data), function (err) {
                if (err) { // send failed msg if can't :(
                    win.webContents.send('message', {type: 'error', 'msg': 'error: ' + path.basename(filename)});
                }
                // otherwise we saved send msg to ide saved :)
                win.webContents.send('message', {type: 'success', 'msg': path.basename(filename) + ' saved'});
            });
        } catch (e) {
            win.webContents.send('message', 'error ' + e.message);

        }

    });

});
/**
 * save project
 */
ipc.on('save-project', function (event, arg) {
        // if(fileName === undefined) return
        // event.sender.send('message', fileName)
        try {
            // prepare file name to save
            let filename = arg.project.file;
            // send msg to ide try to save
            win.webContents.send('message', {type: 'info', 'msg': 'try to save ' + path.basename(filename)});
            // save appData to project
            fs.writeFile(filename, JSON.stringify(arg.data), function (err) {
                if (err) { // send failed msg if can't :(
                    win.webContents.send('message', {type: 'error', 'msg': 'error: ' + path.basename(filename)});
                }
                // otherwise we saved send msg to ide saved :)
                win.webContents.send('message', {type: 'success', 'msg': path.basename(filename) + ' saved'});
            });
        } catch (e) {
            win.webContents.send('message', 'error ' + e.message);

        }
});