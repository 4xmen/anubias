'use strict'


import {app, protocol, BrowserWindow, remote, globalShortcut} from 'electron'
import {createProtocol} from 'vue-cli-plugin-electron-builder/lib'
import installExtension, {VUEJS_DEVTOOLS} from 'electron-devtools-installer'
import path from 'path'
import fs from "fs";
import {isArray} from "vue-context/src/js/utils";

const cp = require('child_process');
const ipc = require('electron').ipcMain
const dialog = require('electron').dialog
const isDevelopment = process.env.NODE_ENV !== 'production';
const isDev = process.mainModule.filename.indexOf('app.asar') === -1;
const storage = require('electron-json-storage');

console.log('-------------------------STORAGE------------------------------');
console.log(storage.getDefaultDataPath());
console.log('--------------------------ASMVM-------------------------------');

var win;
var underDebug;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
    {scheme: 'app', privileges: {secure: true, standard: true}}
])

async function createWindow() {

    // Create the browser window.
    let iconPath = 'public/256x256.png';
    if (isDev) {
        if (process.platform == 'darwin') {
            iconPath = 'public/icon.icns';
        }
    } else {
        iconPath = process.resourcesPath + '/resources/icons/512x512.png';
        if (process.platform == 'darwin') {
            iconPath = process.resourcesPath + '/resources/icons/icon.icns';
        }
    }
    win = new BrowserWindow({
        icon: iconPath,
        width: 1000,
        height: 600,
        minHeight: 600,
        minWidth: 800,
        frame: false,
        webPreferences: {

            // Use pluginOptions.nodeIntegration, leave this alone
            // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
            // nodeIntegration: true,
            // enableRemoteModule: true,
            // contextIsolation: false ,
            enableRemoteModule: false, // turn off remote
            nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
            preload: path.join(__dirname, 'preload.js'),
            webSecurity: false
        }
    })
    win.removeMenu();
    win.maximize();
    // win.webContents.openDevTools();


    if (process.env.WEBPACK_DEV_SERVER_URL) {
        // Load the url of the dev server if in development mode
        await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
        // if (!process.env.IS_TEST) win.webContents.openDevTools()
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

    // CommandOrControl
    globalShortcut.register('Alt+F4', () => {
        win.webContents.send('app-exit', {});
    });



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
        if (files) {
            event.sender.send('selected-file', files);
        }
    })
});
/**
 * sample of open image file
 */
ipc.on('open-file-image', function (event) {
    dialog.showOpenDialog({
        title: 'Open image',
        filters: [
            {name: 'image files', extensions: ['jpg', 'png', 'gif']},
            {name: 'All Files', extensions: ['*']}
        ],
        // properties: {showOverwriteConfirmation: true,}
        properties: ['openFile']
    }).then(function (files) {
        try {
            // when done check is canceled or not
            if (!files.canceled) {
                let img = fs.readFileSync(files.filePaths[0]).toString('base64');
                win.webContents.send('image-selected', 'data:image/' + path.extname(files.filePaths[0]) + ';base64,' + img);
            }
        } catch (e) {
            win.webContents.send('message', {type: 'error', 'error': files.toString()});
        }


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
            } catch (e) {
                win.webContents.send('message', {type: 'error', 'error': e.message});
            }
        }
    })
});

/**
 * open project direct for recent
 */
ipc.on('open-project-direct', function (event, arg) {

    let filename = arg;
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
    } catch (e) {
        win.webContents.send('message', {type: 'error', 'error': e.message});
    }
});

/**
 * save project as progress
 */
ipc.on('save-as-file-project', function (event, arg) {
    // show save dialog
    dialog.showSaveDialog(arg.dialog).then(function (data) {
        try {
            // then check is canceled?
            if (data.canceled) {
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
                win.webContents.send('message', {
                    type: 'success',
                    'msg': path.basename(filename) + ' saved',
                    'save': true
                });
            });
        } catch (e) {
            win.webContents.send('message', {type: 'error', 'error': e.message});

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
            win.webContents.send('message', {type: 'success', 'msg': path.basename(filename) + ' saved', 'save': true});
        });
    } catch (e) {
        win.webContents.send('message', {type: 'error', 'error': e.message});

    }
});

/**
 * Run emulator command line
 */
ipc.on('emulator', async function (eventevent, data) {

    // console.log(process.env.PATH);

    try {
        let cwd = __dirname;
        if (isDev) {
            cwd += '/..';
        } else {
            cwd = process.resourcesPath;
        }
        cwd += '/resources';
        if (data.cwd) {
            cwd = cwd + '/' + data.cwd;
        }
        let cmd = data.command;
        if (process.platform === 'win32' || process.platform === 'win64') {
            cwd = cwd.replaceAll(/\//g, '\\') + '\\';
            data = data.replaceAll(/\//g, '\\');
            // cmd = cmd.replaceAll(/\.\/anubias-engine/g, 'php anubias-engine');
        }

        // get setting and fix path problem
        var setting = await storage.getSync('setting');
        if (setting.env != undefined && setting.env.length > 0) {
            data = 'export PATH="$PATH:' + setting.env + '" && ' + data;
        }
        if (setting.pathFix != undefined && setting.pathFix) {
            if (await fs.existsSync(require('os').homedir() + '/.bash_profile')) {
                data = '. ' + require('os').homedir() + '/.bash_profile && ' + data;
            }
            if (await fs.existsSync(require('os').homedir() + '/.zprofile')) {
                data = '. ' + require('os').homedir() + '/.zprofile && ' + data;
            }
        }

        console.log('-----------------------emulator command--------------------');
        console.log(data);
        let child = cp.exec(data, {
            cwd: cwd,
            env: {
                PATH: process.env.PATH
            }
        }, function (error, stdout, stderr) {
            if (!error) {
                // win.webContents.send('terminal', stdout);
                if (data.indexOf('list-avds') != -1) {
                    win.webContents.send('emulator', stdout);
                } else {
                    // win.webContents.send('message', {type: 'info', 'msg': stdout});
                }
                // win.webContents.send('message', {type: 'info', 'msg': stderr});
            }
            // else {
            //     // win.webContents.send('emulator-terminal', {err: true, data : stdout + stderr});
            // }
        });
        child.stdout.on('data', function (dataz) {
            if (data.indexOf('list-avds') == -1) {
                win.webContents.send('emulator-terminal', {err: false, data: dataz});
            }
        });
        child.stderr.on('data', function (dataz) {
            if (data.indexOf('list-avds') == -1) {
                win.webContents.send('emulator-terminal', {err: true, data: dataz});
            }
        });
    } catch (e) {
        console.log(e.message);
    }


});
/**
 * Run command line
 */
ipc.on('command', async function (eventevent, data) {
    //

    let cwd = __dirname;
    if (isDev) {
        cwd += '/..';
    } else {
        cwd = process.resourcesPath;
    }
    cwd += '/resources';
    if (data.cwd) {
        cwd = cwd + '/' + data.cwd;
    }
    let cmd = data.command;
    if (process.platform === 'win32' || process.platform === 'win64') {
        cwd = cwd.replaceAll(/\//g, '\\') + '\\';
        cmd = cmd.replaceAll(/\//g, '\\');
    }
    // cmd = cmd.replaceAll(/\.\/anubias-engine/g, 'php anubias-engine');

    // console.log(cmd);
    // fs.writeFileSync('/home/freeman/log', process.resourcesPath);
    var setting = await storage.getSync('setting');
    if (setting.env != undefined && setting.env.length > 0) {
        data = 'export PATH="$PATH:' + setting.env + '" && ' + data;
    }
    if (setting.pathFix != undefined && setting.pathFix) {
        if (await fs.existsSync(require('os').homedir() + '/.bash_profile')) {
            data = '. ' + require('os').homedir() + '/.bash_profile && ' + data;
        }
        if (await fs.existsSync(require('os').homedir() + '/.zprofile')) {
            data = '. ' + require('os').homedir() + '/.zprofile && ' + data;
        }
    }

    console.log('-----------------------other command--------------------');
    console.log(data.command);
    let child = cp.exec(cmd, {
        cwd: cwd,
        env: {
            PATH: process.env.PATH
        }
    }, function (error, stdout, stderr) {
        if (!error) {
            // win.webContents.send('terminal', stdout);
            if (data.isUpdate !== undefined) {
                win.webContents.send('build-success', true);
            }
            // win.webContents.send('message', {type: 'info', 'msg': stderr});
        } else {
            win.webContents.send('terminal', stdout);
            win.webContents.send('terminal-error', error.message);
        }
    });
    if (data.isDebug !== undefined) {
        underDebug = child;
    }
    child.stdout.on('data', function (data) {
        win.webContents.send('terminal', data);
    });
});
/**
 * Update project and hot restart
 */
ipc.on('update-project', function (eventevent, data) {
    try {
        underDebug.stdin.write("R");
        win.webContents.send('message', {type: 'success', 'msg': 'hot restart'});

    } catch (e) {
        win.webContents.send('message', {type: 'error', 'msg': error.message});
    }

});

/**
 * open link in browser
 */
ipc.on('openWeb', function (eventevent, data) {
    require('electron').shell.openExternal(data);
});

/**
 * Close app
 */
ipc.on('app-close', function (eventevent, data) {
    app.quit();
});
/**
 * maximize or unmaximize app
 */
ipc.on('app-max', function (eventevent, data) {
    win.isMaximized() ? win.unmaximize() : win.maximize();
});
/**
 * minimize app
 */
ipc.on('app-min', function (eventevent, data) {
    win.minimize();
});
/**
 * open dev tools
 */
ipc.on('devtools', function (eventevent, data) {
    win.webContents.toggleDevTools();
});
/**
 * get storage values
 */
ipc.on('storage-get', function (eventevent, key) {

    storage.get(key, function (error, data) {
        if (error) {
            win.webContents.send('message', {type: 'error', 'msg': error});
        } else {
            data.key = key;
            win.webContents.send('storage-back', data);
        }
    });
})
/**
 * set storage values
 */
ipc.on('storage-set', function (eventevent, data) {
    storage.set(data.key, data.value, function (error) {
        if (error) {
            console.log(error);
            win.webContents.send('message', {type: 'error', 'msg': error});
        } else {
            if (data.silent === undefined || !data.silent) {
                win.webContents.send('message', {type: 'success', 'msg': 'Setting saved'})
            }
        }
        // win.webContents.send('storage-back',data);
    });
})
