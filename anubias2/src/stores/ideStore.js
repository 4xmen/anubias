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
        devices: devices,
        colors: colors,
    }),
    mutations: {
        changeIdeTitle(state, title) {
            document.querySelector('title').innerText = title;
            state.title = title;
        },
        toggleComponentsCollapse(state) {
            state.components.collapsed = !state.components.collapsed;
        },
        togglePropertiesCollapse(state) {
            state.properties.collapsed = !state.properties.collapsed;
        },
        togglePagesCollapse(state) {
            state.pages.collapsed = !state.pages.collapsed;
        },
        updateDeviceZoom(state, zoom) {
            state.device.zoom = zoom;
        },
        updateDeviceOrient(state, orient) {
            state.device.orient = orient;
        },
        updateDeviceActive(state, index) {
            state.device.active = index;
        },
    },
    actions: {
        setIdeTitle(context, title) {
            context.commit('changeIdeTitle', title);
        },
        toggleComponentsCollapse(context) {
            context.commit('toggleComponentsCollapse');
        },
        togglePropertiesCollapse(context) {
            context.commit('togglePropertiesCollapse');
        },
        togglePagesCollapse(context) {
            context.commit('togglePagesCollapse');
        },
    },
    getters: {}
};

export default ideStore;