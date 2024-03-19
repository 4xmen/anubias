import store from "../../stores/store";
import * as htmlToImage from 'html-to-image';
import {toPng, toJpeg, toBlob, toPixelData, toSvg} from 'html-to-image';

let project = store.state.project;
let ide = store.state.ide;
/**
 * get color from color list array
 * @param color
 * @returns {string|*}
 */
const getColor = (color) => {
    if (color.indexOf('0x') !== -1) {
        return '#' + color.substr(10, 6) + color.substr(8, 2);
    }
    for (const clr of ide.colors) {
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
const color2web = (color, isActiveWidget = true) => {
    if (color === 'null') {
        if (isActiveWidget) {
            return getColor(project.project.appColor);
        } else {
            if (project.project.isDark) {
                return "#222222";
            }
        }
        return getColor(project.project.appColor);
    } else {
        return getColor(color);
    }
};

/**
 *
 * @param value : String of properties
 * @param isHeight : Boolean is height value
 * @returns {string} size with px | %
 */
const getSize = (value, isHeight = false) => {
    // WIP: need complete later
    if (value.toString().indexOf('%') != -1) {
        return value;
    }
    return value + 'px';
};

/**
 * padding or margin to web usage
 * @param value
 * @returns {string}
 */

const calcPaddingOrMargin = (value) => {
    try {
        let calced = value.split(',');
        let result = '';
        for (const c of calced) {
            result += (parseFloat(c)).toString() + 'px ';
        }
        return result;
    } catch (e) {
        return '0';
    }
};

/**
 * make screenshot of element
 * @param selector css selector
 * @returns {Promise<string>} base64 string
 */
const createScreenShot = async (selector) => {
    return await htmlToImage.toPng(document.querySelector(selector));
};


/**
 * move index in array
 * @param arr
 * @param fromIndex
 * @param toIndex
 */
const arrayMove = function (arr, fromIndex, toIndex) {
    let element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
    return arr;
};

/**
 * get unix timestamp
 * @returns {number}
 */
const unixTimestamp = function () {
    return Math.round(+new Date() / 1000);
};


/**
 * flutter object to usual string
 * @param title
 * @returns {string}
 */
const fixFlutterObjectTitle = function (title) {
    if (title === 'null') {
        return 'Default';
    }
    let tmp = title.toString().split('.');
    return tmp[tmp.length - 1];
};


/**
 * detect is lang rtl or not
 * @param langCode like "en" or "fa"
 * @returns {boolean}
 */
const isRTLLanguage = function (langCode) {
    // List of RTL language codes
    const rtlLanguages = [
        'ar', 'arb', 'arq', 'ary', 'az', 'ckb', 'dv', 'fa', 'he', 'khw', 'ks', 'ku', 'mzn', 'nqo',
        'pnb', 'ps', 'sd', 'ug', 'ur', 'uz', 'yi', 'zgh'
    ];

    // Convert the input language code to lowercase for case-insensitive matching
    langCode = langCode.toLowerCase();

    // Check if the language code is in the list of RTL languages
    return rtlLanguages.includes(langCode);
}

export {
    color2web,
    getColor,
    getSize,
    calcPaddingOrMargin,
    createScreenShot,
    arrayMove,
    unixTimestamp,
    fixFlutterObjectTitle,
    isRTLLanguage,
};