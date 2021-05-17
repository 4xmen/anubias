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

window.project = {
    folder: '',
    file: '',
    isSave: false,
}

window.devices = require('../json/devices.json').data;
window.colors = require('../json/colors.json').data;
window.material_icons = require('../json/mateialIcons.json').data;
window.defaults = {};
window.defaults.page = require('../json/defaults/defPage.json');
window.defaults.preloader = require('../json/defaults/defPreloader.json');