
/**
 * find sub components names
 * @param component
 * @returns {*[]}
 */
let getChildNames = (component) => {
    let names = [];
    // chek for has child or not
    if (component.child !== undefined || component.children !== undefined) {
        if (component.child !== undefined) {
            names.push(component.child.name);
            names = names.concat(getChildNames(component.child));
        } else {
            for (const comp of component.children) {
                names.push(comp.name);
                names = names.concat(getChildNames(comp));
            }
        }
    }
    return names;
}
/**
 * find all page components name
 * @param page
 * @returns {*[]}
 */
let getPageAllNames = (page) => {
    let names = [];
    for (const component of page.children.visual) {
        names.push(component.name);
        names = names.concat(getChildNames(component));
    }
    for (const component of page.children.nonVisual) {
        names.push(component.name);
        names = names.concat(getChildNames(component));
    }
    return names;

}

/**
 * find unique of  new component for current page
 * @param page
 * @param name
 * @returns {*}
 */
let getUniqueName = (page, name) => {
    let names = getPageAllNames(page);
    let i = 1;
    while (names.indexOf(name + i.toString()) !== -1) {
        i++;
    }
    return name + i;
}

export {
    getUniqueName,
}

