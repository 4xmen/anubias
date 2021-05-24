let html2canvas = require('html2canvas');
let getScreenshotOfElement = function (element, callback) {
    html2canvas(element, {
    }).then(function (canvas) {

        callback(canvas.toDataURL("image/png").split("data:image/png;base64,").join(''));
    },);
}

let takeScreenShot = function (id, cl) {
    getScreenshotOfElement(document.querySelector(id), function (data) {
        let back = "data:image/png;base64," + data;
        cl(back);
    });
};

/**
 * clone new object for reuse variable
 * @param obj
 * @returns {any}
 */
let clone = function (obj) {
    return JSON.parse(JSON.stringify(obj));
}
/**
 * get color from color list array
 * @param color
 * @returns {string|*}
 */
let getColor = function (color) {
    for (const clr of window.colors) {
        if (clr.value === color) {
            return clr.color;
        }
    }
    return '#000000';

};
/**
 * convert flutter color to web color
 * @param color
 * @param isActiveWidget
 * @returns {string|*}
 */
let color2web = function (color, isActiveWidget = true) {
    if (color === 'default') {
        if (isActiveWidget) {
            return getColor(window.appData.project.xColor);
        } else {
            if (window.appData.project.isDark) {
                return "#222222";
            }
        }
        return getColor(window.appData.project.xColor);
    } else {
        return getColor(color);
    }
};

let calcPadding = function (paddingValue, scale = 1, invert = false) {
    let calced = paddingValue.split(',');
    let result = '';
    for (const c of calced) {
        result += (parseFloat(c) * scale * (invert ? -1 : 1)).toString() + 'px ';
    }
    return result;
}

/**
 * for export
 */
let fnc = {
    clone,
    takeScreenShot,
    color2web,
    calcPadding
}
export {
    fnc
}
