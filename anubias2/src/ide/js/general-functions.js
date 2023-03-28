import store from "../../stores/store";

let project = store.state.project;
let ide = store.state.ide;
/**
 * get color from color list array
 * @param color
 * @returns {string|*}
 */
let getColor = (color) => {
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
let color2web = (color, isActiveWidget = true) => {
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
let getSize = (value, isHeight = false) => {
    // WIP: need complete later
    return value;
}

/**
 * padding or margin to web usage
 * @param value
 * @returns {string}
 */

let calcPaddingOrMargin = (value) => {
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
}

export {
    color2web,
    getColor,
    getSize,
    calcPaddingOrMargin,
};