import {MenuItemConstructorOptions, shell, dialog, ipcRenderer, ipcMain} from 'electron';
import ide from './ide';
import * as fs from "fs";
import path from "path";

// import project from '../../src/stores/projectStore.js';

class AppMenu {
    // instance of electorn win
    private _win: any;
    // instance of ide class
    private _ide: any;
    // keep project
    private _hasProject: boolean;

    /**
     * menu states
     * @private
     */
    private _menuStats: object = {
        canSave: false,
        canUndo: false,
        canRedo: false,
        canPaste: false,
        canCut: false,
        canCopy: false,
        canOnlineBuild: false,
    };

    constructor(win) {
        this._win = win;
        this._ide = new ide(win);
        this._hasProject = false;
        this.addMenuEvents();
    }



    addMenuEvents(){

        /**
         * open project events
         */
        try {
            this._win.openProject = async (): Promise<boolean> =>{
                let result = await dialog.showOpenDialog(this._win, {
                    title: 'Open project',
                    defaultPath: '~/',
                    filters: [
                        {name: 'Anubias project', extensions: ['anb']},
                        {name: 'All Files', extensions: ['*']}
                    ],
                });

                if (!result.canceled) {

                    try {

                        const fileName = result.filePaths[0];
                        const projectContent = fs.readFileSync(fileName, 'utf-8');
                        const projectData = JSON.parse(projectContent);
                        this._win.webContents.send('load-project-data',projectData);
                        return  true
                    } catch (e) {
                        console.log(e.message);
                        this._win.webContents.send('toast', 'error', 'file load error: '+e.message);
                        return  false;
                    }
                }else{
                    return false;
                }

            }
        } catch(e) {
            console.log(e.message);
        }

    }

    /**
     * set menu status
     * @param name
     * @param status
     */
    setMenuState(name: string, status: boolean): void {
        this._menuStats[name] = status;
    }

    /**
     * get menu status
     * @param name
     */
    getMenuState(name: string): boolean {
        return this._menuStats[name];
    }

    /**
     * change has project state
     * @param status
     */
    setHasProject(status: boolean): void {
        this._hasProject = status;
    }

    public menu(): MenuItemConstructorOptions[] {
        // main menu initialize
        let menu = [
            this.getFileItems(),
            {
                label: "&View",
                submenu: [
                    {
                        label: 'Toggle &Full Screen',
                        accelerator: 'F11',
                        click: () => {
                            this._win.setFullScreen(!this._win.isFullScreen());
                        },
                    },
                    {
                        label: 'Toggle &Dev tools',
                        accelerator: 'F12',
                        click: () => {
                            this._win.webContents.toggleDevTools();
                        },
                    },
                ]
            },
            {
                label: "&IDE",
                submenu: [
                    {
                        label: '&Settings',
                        accelerator: 'CommandOrControl+Alt+S',
                        click: () => {

                        },
                    },
                    {type: 'separator'},
                    {
                        label: '&Test devops tools',
                        accelerator: 'CommandOrControl+Alt+T',
                        click: () => {

                        },
                    },
                    {
                        label: '&Emulators',
                        accelerator: 'CommandOrControl+Alt+E',
                        click: () => {
                            this._win.webContents.toggleDevTools();
                        },
                    },
                ]
            },
            {
                label: "&Help",
                submenu: [
                    {
                        label: '&Documents',
                        accelerator: 'CommandOrControl+F1',
                        click: async () => {
                            await shell.openExternal('https://anubias.app/doc/#/');
                        },
                    },
                    {
                        label: '&About',
                        click: () => {

                        },
                    },
                ]
            },
        ];

        // if has project insert to menu items edit & project
        if (this._hasProject) {
            menu.splice(1, 0, this.getEditItems());
            menu.splice(2, 0, this.getProjectItems());
        }
        return menu;
    }

    /**
     * create project menu items
     * @private
     */
    private getProjectItems(): object {
        return {
            label: "&Project",
            enabled: this._hasProject,
            submenu: [
                {
                    label: 'Project &options',
                    accelerator: 'CommandOrControl+Shift+p',
                    click: () => {

                    },
                },
                {type: 'separator'},
                {
                    label: '&Debug',
                    accelerator: 'F9',
                    click: () => {

                    },
                },
                {
                    label: '&Hard Debug',
                    click: () => {

                    },
                },
                {
                    label: 'Hot &reload',
                    accelerator: 'CommandOrControl+R',
                    click: () => {

                    },
                },
                {
                    label: '&PWA debug (web)',
                    accelerator: 'Shift+F9',
                    click: () => {
                    },
                },
                {type: 'separator'},
                {
                    label: '&Build',
                    accelerator: 'CommandOrControl+F9',
                    click: () => {
                    },
                },
                {
                    label: '&Online build',
                    accelerator: 'CommandOrControl+Shift+B',
                    click: () => {
                    },
                },

            ]
        };
    }

    /**
     * create edit menu items
     * @private
     */
    private getEditItems(): object {
        return {
            label: "&Edit",
            enabled: this._hasProject,
            submenu: [
                {
                    label: '&Undo',
                    accelerator: 'CommandOrControl+Z',
                    enabled: this._hasProject && this.getMenuState('canUndo'),
                },
                {
                    label: '&Redo',
                    accelerator: 'CommandOrControl+Y',
                    enabled: this._hasProject && this.getMenuState('canRedo'),
                },
                {type: 'separator'},
                {
                    label: 'C&ut',
                    accelerator: 'CommandOrControl+X',
                    enabled: this._hasProject && this.getMenuState('canCut'),
                },
                {
                    label: '&Copy',
                    accelerator: 'CommandOrControl+C',
                    enabled: this._hasProject && this.getMenuState('canCopy'),
                },
                {
                    label: '&Paste',
                    accelerator: 'CommandOrControl+V',
                    enabled: this._hasProject && this.getMenuState('canPaste'),
                },
            ],
        };
    }

    /**
     * create file menu items
     * depends to has project status
     * @private
     */
    private getFileItems(): object {
        let fileMenu = {
            label: "&File",
            submenu: [
                {
                    label: "Create &new project",
                    accelerator: 'CommandOrControl+N',
                    enabled: true,
                    click: async () => {
                        await this._ide.createProject();
                    }
                },
                {
                    label: "&Open project",
                    enabled: true,
                    accelerator: 'CommandOrControl+O',
                    click: async () => {
                        const opened = await this._win.openProject();
                        if (opened){
                            this._win.webContents.send('go-to-main-page');
                        }
                    }
                }
            ]
        };
        if (this._hasProject) {
            fileMenu.submenu.push(
                JSON.parse('{"type": "separator"}'), // stringy for error type [typescript]
                {
                    label: "Save project",
                    accelerator: 'CommandOrControl+S',
                    enabled: this._hasProject && this.getMenuState('canSave'),
                    click: async () => {
                        // await this.ide.createProject();
                        if (this._win.vuexStore.project.projectFile != '') {
                            try {
                                await fs.writeFileSync(this._win.vuexStore.project.projectFile, JSON.stringify(this._win.vuexStore.project.project), 'utf-8');
                                this._win.webContents.send('toast', 'success', 'Project saved!');
                                this._win.webContents.send('update-project-data', 'isSave', true);
                                this._menuStats['canSave'] = false;
                            } catch (e) {
                                this._win.webContents.send('toast', 'error', 'Save error: ' + e.message);
                                console.log(e.message);
                            }
                        }
                    }
                },
                {
                    label: "&Save as project",
                    accelerator: 'CommandOrControl+Shift+S',
                    enabled: this._hasProject,
                    click: async () => {
                        // await this.ide.createProject();
                        // console.log();
                        // // const storeData = await  ipcMain.
                        // console.log(storeData);


                        // const storeData = ipcMain.emit('get-store-data',function (e) {
                        //     console.log(e);
                        // });
                        // console.log(storeData);

                        let result = await dialog.showSaveDialog(this._win, {
                            title: 'Save project as',
                            defaultPath: '~/' + this._win.vuexStore.project.project.name.split(' ').join('-') + '.anb',
                            filters: [
                                {name: 'Anubias project', extensions: ['anb']},
                                {name: 'All Files', extensions: ['*']}
                            ],
                        });

                        // save project
                        if (!result.canceled) {
                            // write on file
                            try {
                                await fs.writeFileSync(result.filePath, JSON.stringify(this._win.vuexStore.project.project), 'utf-8');
                                this._win.webContents.send('toast', 'success', 'Project saved as: ' + result.filePath);
                                // update ide data after save
                                this._menuStats['canSave'] = false;
                                this._hasProject = true;
                                this._win.webContents.send('update-project-data', 'isSave', true);
                                this._win.webContents.send('update-project-data', 'projectFile', result.filePath);
                                this._win.webContents.send('update-project-data', 'projectPath', path.dirname(result.filePath));
                            } catch (e) {
                                console.log(e.message);
                                this._win.webContents.send('toast', 'error', 'Save error: ' + e.message);
                            }


                            // WIP: need added to recent files


                        }

                    }
                },
                {
                    label: "&Close project",
                    accelerator: 'CommandOrControl+Shift+W',
                    enabled: this._hasProject,
                    click: async () => {
                        // await this.ide.createProject();
                        console.log('close project');

                    }
                }
            );
        }
        return fileMenu;
    }


}

export {AppMenu};