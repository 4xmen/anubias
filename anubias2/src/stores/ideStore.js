/***
 * ide store, storing ide information
 * like: devices, tabs , panel states
 */
import devices from "./assets/devices.json"; // import devices info
import colors from './assets/colors.json'; // import material colors
import componentsList from "./components/components-list.json"; // import components info
const ideStore = {
    state: () => ({
        title: 'Anubias',
        version: {
            major: 2,
            minor: 0,
            patch: 0,
            suffix: 'alpha'
        },
        tabs: {},
        // panel states
        components: {
            list: componentsList,
            collapsed: false,
            mode: 'list',
        },
        properties: {
            collapsed: false,
        },
        pages: {
            collapsed: false,
        },
        // active device preview
        device: {
            active: 0,
            orient: 0,
            zoom: 0,
        },
        // menu status depends on `app-menu.ts`
        menu: {
            canSave: false,
            canUndo: false,
            canRedo: false,
            canPaste: false,
            canCut: false,
            canCopy: false,
            canOnlineBuild: false,
        },
        activePage: 0,
        devices: devices,
        colors: colors,
    }),
    mutations: {
        CHANGE_IDE_TITLE(state, title) {
            document.querySelector('title').innerText = title;
            state.title = title;
        },
        TOGGLE_COMPONENTS_COLLAPSE(state) {
            state.components.collapsed = !state.components.collapsed;
        },
        TOGGLE_PROPERTIES_COLLAPSE(state) {
            state.properties.collapsed = !state.properties.collapsed;
        },
        TOGGLE_PAGES_COLLAPSE(state) {
            state.pages.collapsed = !state.pages.collapsed;
        },
        UPDATE_DEVICE_ZOOM(state, zoom) {
            state.device.zoom = zoom;
        },
        UPDATE_DEVICE_ORIENT(state, orient) {
            state.device.orient = orient;
        },
        UPDATE_DEVICE_ACTIVE(state, index) {
            state.device.active = index;
        },
    },
    actions: {
        setIdeTitle(context, title) {
            context.commit('CHANGE_IDE_TITLE', title);
        },
        toggleComponentsCollapse(context) {
            context.commit('TOGGLE_COMPONENTS_COLLAPSE');
        },
        togglePropertiesCollapse(context) {
            context.commit('TOGGLE_PROPERTIES_COLLAPSE');
        },
        togglePagesCollapse(context) {
            context.commit('TOGGLE_PAGES_COLLAPSE');
        },
    },
    getters: {
        version(state) {
            return state.version.major + '.' +
                state.version.minor + '.' +
                state.version.patch + '-' +
                state.version.suffix;
        }
    }
};

export default ideStore;