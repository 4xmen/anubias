import {  MenuItemConstructorOptions } from 'electron';
class AppMenu{
    private win: any;

    constructor(win) {
        this.win = win;
    }

    menu() : MenuItemConstructorOptions[] {
        return  [
            {
                label: "&File",
                submenu: [
                    {
                        label: "Create new project",
                        accelerator: 'CommandOrControl+N'
                    }
                ]
            },
            {
                label: "&Edit",
                submenu:  [
                    { label: '&Undo', accelerator: 'CommandOrControl+Z'},
                    { label: '&Redo', accelerator: 'CommandOrControl+Y' },
                    { type: 'separator' },
                    { label: 'C&ut', accelerator: 'CommandOrControl+X' },
                    { label: '&Copy', accelerator: 'CommandOrControl+C'},
                    { label: '&Paste', accelerator: 'CommandOrControl+V'},
                    // {
                    //     label: 'Select All',
                    //     accelerator: 'CommandOrControl+A',
                    //     selector: 'selectAll:',
                    // },
                ],
            },
            {
                label: "&View",
                submenu: [
                    {
                        label: 'Toggle &Full Screen',
                        accelerator: 'F11',
                        click: () => {
                            this.win.setFullScreen(!this.win.isFullScreen());
                        },
                    },
                    {
                        label: 'Toggle &Dev tools',
                        accelerator: 'F12',
                        click: () => {
                            this.win.webContents.toggleDevTools();
                        },
                    },
                ]
            }
        ];
    }
}

export {AppMenu};