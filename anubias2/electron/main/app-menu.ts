import {MenuItemConstructorOptions, shell} from 'electron';
import ide from './ide';

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
    setHasProject(status: boolean):void{
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
                    accelerator: 'CommandOrControl+O'
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
                    }
                },
                {
                    label: "&Save as project",
                    accelerator: 'CommandOrControl+Shift+S',
                    enabled: this._hasProject,
                    click: async () => {
                        // await this.ide.createProject();
                    }
                },
                {
                    label: "&Close project",
                    accelerator: 'CommandOrControl+Shift+W',
                    enabled: this._hasProject,
                    click: async () => {
                        // await this.ide.createProject();
                    }
                }
            );
        }
        return fileMenu;
    }


}

export {AppMenu};