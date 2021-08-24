let html2canvas = require('html2canvas');
let getScreenshotOfElement = function (element, callback) {
    html2canvas(element, {
        scrollX: 0,
        scrollY: -window.scrollY
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
    if (color.indexOf('0x') != -1) {
        return '#' + color.substr(10, 6) + color.substr(8, 2);
    }
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
    if (color === 'null') {
        if (isActiveWidget) {
            return getColor(window.appData.project.appColor);
        } else {
            if (window.appData.project.isDark) {
                return "#222222";
            }
        }
        return getColor(window.appData.project.appColor);
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
 * move index in array
 * @param arr
 * @param fromIndex
 * @param toIndex
 */
let arrayMove = function (arr, fromIndex, toIndex) {
    let element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
}

/**
 * get OS (win|linux|mac|etc.)
 * @returns {null|string}
 */
let getOS = function () {
    var userAgent = window.navigator.userAgent,
        platform = window.navigator.platform,
        macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
        windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
        iosPlatforms = ['iPhone', 'iPad', 'iPod'],
        os = null;

    if (macosPlatforms.indexOf(platform) !== -1) {
        os = 'Osx';
    } else if (iosPlatforms.indexOf(platform) !== -1) {
        os = 'iOS';
    } else if (windowsPlatforms.indexOf(platform) !== -1) {
        os = 'Windows';
    } else if (/Android/.test(userAgent)) {
        os = 'Android';
    } else if (!os && /Linux/.test(platform)) {
        os = 'Linux';
    }

    return os;
}
/**
 *
 * @param value of properties
 * @param scale sacale of display
 * @param coefficient coefficient of size
 * @param isHeight is hieght val
 * @returns {string} size with px | %
 */
let getSize = function (value, scale, coefficient = 2.75, isHeight = false) {
    return value.toString().slice(-1) == '%' ?
        (!isHeight?value:(document.querySelector('#mobile').offsetHeight / 100) * parseFloat(value.toString().substr(0,value.length-1)) +'px')
        : (parseFloat(value) * scale * coefficient) + 'px';
}


let linkify = function (inputText) {
    let replacedText, replacePattern1, replacePattern2, replacePattern3;

    //URLs starting with http://, https://, or ftp://
    replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gim;
    replacedText = inputText.replace(replacePattern1, '<a onclick="window.api.send(\'openWeb\',\'$1\')" >$1</a>');

    //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
    replacePattern2 = /(^|[^/])(www\.[\S]+(\b|$))/gim;
    replacedText = replacedText.replace(replacePattern2, '$1<a onclick="window.api.send(\'openWeb\',\'$2\')" target="_blank">$2</a>');

    //Change email addresses to mailto:: links.
    replacePattern3 = /(([a-zA-Z0-9\-_.])+@[a-zA-Z_]+?(\.[a-zA-Z]{2,6})+)/gim;
    replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');

    return replacedText;
}

let fixSetting = function (data) {
    if (data.performanceMode === undefined) {
        data.performanceMode = false;
    }
    if (data.pathFix === undefined) {
        data.pathFix = false;
    }
    if (data.exitConfirm === undefined) {
        data.exitConfirm = true;
    }
    if (data.env === undefined) {
        data.env = '';
    }
    return data;
}

let downloadObjectAsJson = function (exportObj, exportName){
    let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    let downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".anb");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

/**
 * for export
 */
let fnc = {
    clone,
    takeScreenShot,
    color2web,
    calcPadding,
    arrayMove,
    getOS,
    getSize,
    linkify,
    fixSetting,
    downloadObjectAsJson
}
export {
    fnc
}
