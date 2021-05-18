/**
 * main application data
 * @type {{pages: [], project: {isDark: boolean, xColor: string, bgColor: string, name: string, version: string, isRTL: boolean, textColor: string}}}
 */
window.appData = {
    project: {
        name: '',
        version: '1.0.0',
        isDark: false,
        isRTL: false,
        xColor: 'Colors.green',
        textColor: '#000000',
        bgColor: '#ffffff',
    },
    pages: []
};
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