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
    try {
        let calced = paddingValue.split(',');
        let result = '';
        for (const c of calced) {
            result += (parseFloat(c) * scale * (invert ? -1 : 1)).toString() + 'px ';
        }
        return result;
    } catch (e) {
        return '0';
    }
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
    try {

        return value.toString().slice(-1) == '%' ?
            (!isHeight ?
                (document.querySelector('#mobile').offsetWidth / 100) * parseFloat(value.toString().substr(0, value.length - 1) - 4) + 'px' :
                (document.querySelector('#mobile').offsetHeight / 100) * parseFloat(value.toString().substr(0, value.length - 1)) + 'px')
            : (parseFloat(value) * scale * coefficient) + 'px';

    } catch (e) {
        return value.toString().slice(-1) == '%' ?
            (!isHeight ?
                (document.querySelector('.container').offsetWidth / 200) * parseFloat(value.toString().substr(0, value.length - 1) - 4) + 'px' :
                (document.querySelector('.container').offsetHeight / 200) * parseFloat(value.toString().substr(0, value.length - 1)) + 'px')
            : (parseFloat(value) * scale * coefficient) + 'px';
    }
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
    if (data.pages === undefined) {
        data.pages = true;
    }
    if (data.proxy === undefined) {
        data.proxy = false;
    }
    if (data.sidebar === undefined) {
        data.sidebar = true;
    }
    if (data.fontSize === undefined) {
        data.fontSize = 18;
    }
    if (data.codeStyle === undefined) {
        data.codeStyle = 'vs-dark';
    }
    if (data.recents === undefined) {
        data.recents = [];
    }
    return data;
}

let downloadObjectAsJson = function (exportObj, exportName) {
    let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    let downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".anb");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}


/**
 * name duplicator fixer children
 * @param namesList
 * @param parent
 * @returns {*}
 */
let nameDuplicatorFixerForChildren = function (namesList, parent) {
    console.log(parent.name);
    if (parent.child !== undefined) {
        if (namesList.indexOf(parent.child.name) !== -1) {
            parent.child.name += '_new';
            while (namesList.indexOf(parent.child.name) !== -1) {
                parent.child.name += '_new';
            }
        }
        if (parent.child.child !== undefined || parent.child.children !== undefined) {
            namesList = nameDuplicatorFixerForChildren(namesList, parent.child);
        }
        namesList.push(parent.child.name);
    } else if (parent.children !== undefined) {
        for (const cm of parent.children) {
            if (namesList.indexOf(cm.name) !== -1) {
                while (namesList.indexOf(cm.name) !== -1) {
                    cm.name += '_new';
                }
            }
            namesList.push(cm.name);
            if (cm.child !== undefined || cm.children !== undefined) {
                namesList = nameDuplicatorFixerForChildren(namesList, cm);
            }
        }
    }
    return namesList;
};

/**
 * check duplicate names
 */
let nameDuplicateFixer = function () {
    console.log('duplicator');
    for (const page of window.appData.pages) {
        let namesList = [];
        for (const cm of page.children.visual) {
            if (namesList.indexOf(cm.name) !== -1) {
                while (namesList.indexOf(cm.name) !== -1) {
                    cm.name += '_new';
                }
            }
            namesList.push(cm.name);
            if (cm.child !== undefined || cm.children !== undefined) {
                namesList = nameDuplicatorFixerForChildren(namesList, cm);
            }
        }
    }
}

/**
 * check children or child for code
 * @param nodeList
 * @param name
 * @param key
 * @returns {{path: string, find: boolean}}
 */
let checkChildren = function (nodeList, name, key) {
    let result = {
        find: false,
        path: ''
    };
    if (nodeList.children !== undefined) {
        result.path = '.children';
        for (const k in nodeList.children) {
            let node = nodeList.children[k];
            if (node.name === name) {
                result.path += '[' + k + '].' + key;
                result.find = true;
                return result;
            }
            if (node.child !== undefined || node.children !== undefined) {
                let tmp = checkChildren(node, name, key);
                if (tmp.find == true) {
                    result.path = '[' + k + '].' + tmp.path;
                    result.find = true;
                    return result;
                }
            }
        }

    } else if (nodeList.child != undefined) {
        result.path = '.child';
        if (nodeList.child.name === name) {
            result.find = true;
            result.path += '.' + key;
            return result;
        }

        if (nodeList.child.child !== undefined || nodeList.child.children !== undefined) {
            let tmp = checkChildren(nodeList.child, name, key);
            if (tmp.find == true) {
                result.path = '.child' + tmp.path;
                result.find = true;
                return result;
            }
        }
    }
    return result;
};

/**
 * find variable path for tabs
 * @param key key of for edit
 * @param properties all propeties of this component
 * @param currentPage current page
 * @param isVisual  is visual component
 * @returns {string|boolean} path of variable otherwise return false
 */
let findVarPath = function (key, properties, currentPage, isVisual = 1) {
    // find path name cuz it's uniqe in page
    let name = properties.name;
    // ge all page elements to check
    let node = window.appData.pages[currentPage];
    // init path of var
    let path = 'window.appData.pages[' + currentPage + '].';
    // check visual or non visual
    if (isVisual === 1) {
        path += 'children.visual'
        node = node.children.visual;
    } else {
        node = node.children.nonvisual;
        path += 'children.nonvisual';
    }
    // each all element
    for (const k in node) {
        let n = node[k];
        if (n.name === name) {
            return path + '[' + k + '].' + key;
        }
    }
    // not find check all children recursive
    for (const k in node) {
        let n = node[k];
        if (n.children !== undefined || n.child !== undefined) {
            let result = checkChildren(n, name, key);
            if (result.find == true) {
                return path + '[' + k + ']' + result.path;
            }
        }
    }
    return false;

};

/*eslint-disable */
let menuInit = function () {
    function $(selector, context) {
        context = context || document;
        return context["querySelectorAll"](selector);
    }

    function forEach(collection, iterator) {
        for (var key in Object.keys(collection)) {
            iterator(collection[key]);
        }
    }

    function showMenu(menu) {
        var menu = this;
        var ul = $("ul", menu)[0];

        if (!ul || ul.classList.contains("-visible")) return;

        menu.classList.add("-active");
        ul.classList.add("-animating");
        ul.classList.add("-visible");
        setTimeout(function () {
            ul.classList.remove("-animating")
        }, 25);
    }

    function hideMenu(menu) {
        var menu = this;
        var ul = $("ul", menu)[0];

        if (!ul || !ul.classList.contains("-visible")) return;

        menu.classList.remove("-active");
        ul.classList.add("-animating");
        setTimeout(function () {
            ul.classList.remove("-visible");
            ul.classList.remove("-animating");
        }, 300);
    }

    function hideAllInactiveMenus(menu) {
        var menu = this;
        forEach(
            $("li.-hasSubmenu.-active:not(:hover)", menu.parent),
            function (e) {
                e.hideMenu && e.hideMenu();
            }
        );
    }

    forEach($(".Menu li.-hasSubmenu"), function (e) {
        e.showMenu = showMenu;
        e.hideMenu = hideMenu;
    });

    forEach($(".Menu > li.-hasSubmenu"), function (e) {
        e.addEventListener("click", showMenu);
    });

    forEach($(".Menu > li.-hasSubmenu li"), function (e) {
        e.addEventListener("mouseenter", hideAllInactiveMenus);
    });

    forEach($(".Menu > li.-hasSubmenu li.-hasSubmenu"), function (e) {
        e.addEventListener("mouseenter", showMenu);
    });

    document.addEventListener("click", hideAllInactiveMenus);
};

let getDuplicates = function (arr) {
    let obj = {}, dup = [];
    for (let i = 0, l = arr.length; i < l; i++) {
        let val = arr[i];
        if (obj[val] /**[hasOwnProperty]*/) {
            /**[is exists]*/
            if (dup.find(a => a == val)) continue;
            /**[put Unique One]*/
            dup.push(val);
            continue;
        }
        ;
        /**[hold for further use]*/
        obj[val] = true;
    }
    return dup;
};

let findChildNames = function (component) {
    let names = [];
    if (component.child !== undefined || component.children !== undefined) {
        if (component.child !== undefined) {
            names.push(component.child.name);
            names = names.concat(findChildNames(component.child));
        } else {
            for (const comp of component.children) {
                names.push(comp.name);
                names = names.concat(findChildNames(comp));
            }
        }
    }
    return names;
}

let findProjectErrors = function () {
    // check name
    let pages = window.appData.pages;
    let names;
    let err = '';
    let valid = true;
    for (const page of pages) {
        names = [];
        for (const component of page.children.visual) {
            names.push(component.name);
            names = names.concat(findChildNames(component));
        }
        let result = getDuplicates(names);
        if (result.length > 0) {
            valid = false;
            err += '<b><q>'+page.name + '</q></b> has duplicate names: <br> <ul> <li>' + result.join('</li><li>') +'</li></ul><hr>';
        }
    }
    if (err !== ''){
        valid = false;
        err += 'Note: Name in one page must be unique.';
    }
    return {valid: valid, err: err}

};
/*eslint-enable */

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
    findVarPath,
    downloadObjectAsJson,
    nameDuplicateFixer,
    menuInit,
    findProjectErrors
}
export {
    fnc
}

