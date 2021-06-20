/**
 * ide version :)
 * @type {{}}
 */
window.ide = {
    majorVersion: 0,
    minorVersion: 7,
    patchVersion: 0,
    version:function () {
      return this.majorVersion + '.' + this.minorVersion + '.' + this.patchVersion;
    },
    isDebuging: false,
    isInitReload: false,
};
/**
 * sample application date
 */
window.sample = {
    project: {
        name: '',
        version: '1.0.0',
        isDark: false,
        isRTL: false,
        xColor: 'Colors.green',
        textColor: '#000000',
        bgColor: '#ffffff',
        mainPage: 0
    },
    pages: [],
    version: window.ide.version()
};
/**
 * main application data
 * @type {{pages: [], project: {isDark: boolean, xColor: string, bgColor: string, name: string, version: string, isRTL: boolean, textColor: string}}}
 */
window.appData = JSON.parse(JSON.stringify(window.sample));
/**
 * App loaded project dir
 * @type {{folder: string, file: string, isSave: boolean}}
 */
window.project = {
    folder: '',
    file: '',
    isSave: false,
}
/**
 * load ide data from json file
 */
window.devices = require('../json/devices.json').data;
window.colors = require('../json/colors.json').data;
window.material_icons = require('../json/mateialIcons.json').data;
window.components = require('../json/components.json').data;
/**
 * load default flutter widget properties
 */
window.defaults = {};
window.defaults.page = require('../json/defaults/defPage.json');
window.defaults.preloader = require('../json/defaults/defPreloader.json');
window.defaults.appbar = require('../json/defaults/defAppbar.json');
window.defaults.text = require('../json/defaults/defText.json');
window.defaults.icon = require('../json/defaults/defIcon.json');
window.defaults.image = require('../json/defaults/defImage.json');
window.defaults.button = require('../json/defaults/defButton.json');
window.defaults.circleButton = require('../json/defaults/defCircleButton.json');