/***
 * ide store, storing ide information
 * like: devices, tabs , panel states
 */
import devices from "./assets/devices.json"; // import devices info
import colors from './assets/colors.json'; // import material colors
import componentsList from "./components/components-list.json"; // import components info
/**
 * import default component lists
 */
import componentAppbarDefault from './components/defaultAppbar.json';
import componentButtonDefault from './components/defaultButton.json';
import componentCircleButtonDefault from './components/defaultCircleButton.json';
import componentColumnDefault from './components/defaultColumn.json';
import componentContainerDefault from './components/defaultContainer.json';
import componentDividerDefault from './components/defaultDivider.json';
import componentDropdownDefault from './components/defaultDropdown.json';
import componentGridDefault from './components/defaultGrid.json';
import componentIconDefault from './components/defaultIcon.json';
import componentImageDefault from './components/defaultImage.json';
import componentInputDefault from './components/defaultInput.json';
import componentMenuDefault from './components/defaultMenu.json';
import componentNavbarDefault from './components/defaultNavbar.json';
import componentPageDefault from './components/defaultPage.json';
import componentPreloaderDefault from './components/defaultPreloader.json';
import componentRowDefault from './components/defaultRow.json';
import componentTextDefault from './components/defaultText.json';
import componentToggleDefault from './components/defaultToggle.json';

/**
 * import other modules
 */
import Store from 'electron-store';
import {ipcRenderer} from "electron";
const storage = new Store();


const ideStore = {
    namespaced: true,
    state:  () => ({
        title: 'Anubias',
        appName: 'Anubias',
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
            collapsed: storage.get('componentsCollapsed'),
            mode: 'grid',
        },
        defaultComponents:{
            appbar: componentAppbarDefault,
            button: componentButtonDefault,
            circleButton: componentCircleButtonDefault,
            column: componentColumnDefault,
            container: componentContainerDefault,
            divider: componentDividerDefault,
            dropdown: componentDropdownDefault,
            grid: componentGridDefault,
            icon: componentIconDefault,
            image: componentImageDefault,
            input: componentInputDefault,
            menu: componentMenuDefault,
            navbar: componentNavbarDefault,
            page: componentPageDefault,
            preloader: componentPreloaderDefault,
            row: componentRowDefault,
            text: componentTextDefault,
            toggle: componentToggleDefault,
        },
        properties: {
            collapsed: storage.get('propertiesCollapsed'),
            classic: false,
        },
        logs: {
            collapsed: storage.get('logsCollapsed'),
        },
        pages: {
            currentPage: {},
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
        draggedData: {},
        dropArea:'',
        onEditComponent:{},
    }),
    mutations: {
        CHANGE_IDE_TITLE(state, title) {
            document.querySelector('title').innerText = title;
            state.title = title;
        },
        SET_ON_EDIT_COMPONENT(state, component) {
            state.onEditComponent = component;
        },
        TOGGLE_COMPONENTS_COLLAPSE(state) {
            state.components.collapsed = !state.components.collapsed;
            storage.set('componentsCollapsed', state.components.collapsed);
        },
        TOGGLE_PROPERTIES_COLLAPSE(state) {
            state.properties.collapsed = !state.properties.collapsed;
            storage.set('propertiesCollapsed', state.properties.collapsed);
        },
        TOGGLE_LOGS_COLLAPSE(state) {
            state.logs.collapsed = !state.logs.collapsed;
            storage.set('logsCollapsed', state.logs.collapsed);
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
        SET_ACTIVE_PAGE(state, pageIndex) {
            state.pages.currentPage = this.getters['project/getPage'](pageIndex);
            state.activePage = pageIndex;
        },
        UPDATE_CURRENT_PAGE(state, info) {
            state.pages.currentPage = info;
        },
        SET_DRAG_DATA(state, data) {
            state.draggedData = data;
        },
        SET_DROP_AREA(state, area) {
            state.dropArea = area;
        },
        SET_MENU_CAN_UNDO(state, data){
            state.menu.canUndo = data;
        },
    },
    actions: {
        setIdeTitle: {
            root: true,
            handler(namespacedContext, title) {
                namespacedContext.commit('CHANGE_IDE_TITLE', title);
            }
        },
        setOnEditComponent: {
            root: true,
            handler(namespacedContext, component) {
                namespacedContext.commit('SET_ON_EDIT_COMPONENT', component);
            }
        },
        setDragData(context,data) {
            context.commit('SET_DRAG_DATA',data);
        },
        setDropArea(context, area) {
            context.commit('SET_DROP_AREA', area);
        },
        toggleComponentsCollapse(context) {
            context.commit('TOGGLE_COMPONENTS_COLLAPSE');
        },
        togglePropertiesCollapse(context) {
            context.commit('TOGGLE_PROPERTIES_COLLAPSE');
        },
        toggleLogsCollapse(context) {
            context.commit('TOGGLE_LOGS_COLLAPSE');
        },
        setMenuCanUndo(context, data) {
            // console.log(data,'undo');
            context.commit('SET_MENU_CAN_UNDO', data);
            ipcRenderer.send('set-menu-state', 'canUndo', data);
        },
        /**
         * set active page index
         * @param context
         * @param page : Number
         */
        setActivePage(context, page) {
            context.commit('SET_ACTIVE_PAGE', page);
        },
    },
    getters: {
        version(state) {
            return state.version.major + '.' +
                state.version.minor + '.' +
                state.version.patch + '-' +
                state.version.suffix;
        },
        currentPage(state) {
            return state.pages.currentPage;
        },
        activePageIndex(state){
            return state.activePage;
        },
        defaultColors(state){
            let colors = {};
            for( const color of state.colors) {
              colors[color.value] = color.color ;
            }
            return colors;
        },
        defaultColorsArray(state){
            return  state.colors.map((color)=>{
                return color.color;
            })
        },
    }
};



export default ideStore;