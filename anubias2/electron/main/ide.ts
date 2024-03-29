/**
 * ide class for all ide main actions
 * like:
 * - control project
 * - debug and build project
 * - get update data
 * - etc.
 */

class IDE {
    // instance of electron js windows
    private _win: any;

    constructor(win) {
        this._win = win;
    }

    public async openProject(){
        this._win.webContents.send('hello-world');
        return '';
    }
    public async createProject(){
        this._win.webContents.send('redirect','/new-project')
    }
}

export default  IDE;