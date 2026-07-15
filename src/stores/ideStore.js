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

import {LazyStore} from '@tauri-apps/plugin-store';
import {getCurrentWebviewWindow} from "@tauri-apps/api/webviewWindow";
const FAST_CHANGE_WINDOW_MS = 300;
const FAST_CHANGE_IDLE_TIMEOUT_MS = 300;

const storage = new LazyStore('ide.json', {autoSave: false});
let fastChangeTimer = null;

import {invoke} from "@tauri-apps/api/core";

const ideStore = {
    namespaced: true,
    state: () => ({
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
            collapsed: false,
            mode: 'grid',
        },
        defaultComponents: {
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
            collapsed: false,
            classic: false,
        },
        logs: {
            collapsed: false,
        },
        pages: {
            currentPage: {},
        },
        sideBar: {
            activeIndex: 0,
        },
        // active device preview
        device: {
            active: 0,
            orient: 0,
            zoom: 0,
        },
        menu: {
            CanSave: false,
            CanUndo: false,
            CanRedo: false,
            // canPaste: false,
            // canCut: false,
            // canCopy: false,
            // canOnlineBuild: false,
            IsProjectLoaded: false,

        },
        confirm: {
            title: "Confirm",
            text: "Are you sure?",
            onConfirm() {
            },
            onCancel() {
            },
            enabled: false,
        },
        activePage: 0,
        devices: devices,
        colors: colors,
        draggedData: {},
        dropArea: '',
        canScreenshot: false,
        disableRestoreProject: true,
        modals: {
            restore: false,
        },
        appLogs: [],
        onEditComponent: {},
        // enables predictable undo commands during rapid user edits
        // by batching changes in expected fast-change areas (textarea, draggable elements & etc.)
        // to preserve the livePreview feature and keep onEditComponent state predictable
        // final point: why we track this? cuz we need generate best feeling UndoCommand
        lazyChange: {
            // track is on fast change or not
            isActive: false,
            // hold padding of start point of fast change
            startValue: null,
            // hold fields
            fields: [],
            // last value
            value: null,
        },
        // fallback detector for unexpected intense changes that bypass lazyChange prediction
        // ensures we can still generate proper undo commands even when user activity is unpredictable
        // final point: why we track this? cuz we need generate best feeling UndoCommand
        fastChangeDetector: {
            // last edit time
            lastTime: 0,
            // detect field is same or not
            field: null,
            // start point of fast change
            start: null,
        }
    }),
    mutations: {
        IDE_INIT(state, payload) {
            state.components.collapsed = payload.components;
            state.properties.collapsed = payload.properties;
            state.logs.collapsed = payload.logs;
        },
        CHANGE_IDE_TITLE(state, title) {
            document.querySelector('title').innerText = state.appName + ' - ' + title;
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
        SET_MENU_STATE(state, payload) {
            state.menu[payload.name] = payload.state;
        },
        SET_CAN_SCREENSHOT(state, data) {
            state.canScreenshot = data;
        },
        SET_SIDEBAR_INDEX(state, index) {
            state.sideBar.activeIndex = index;
        },
        SET_PROJECT_LOADING(state, payload) {
            state.projectLoading = payload;
        },
        SHOW_CONFIRM(state, data) {
            // console.log('fire confirm!',data);
            state.confirm.onConfirm = data.onConfirm;
            state.confirm.onCancel = data.onCancel;
            state.confirm.text = data.text;
            state.confirm.title = data.title;
            state.confirm.enabled = true;

        },
        HIDE_CONFIRM(state) {
            state.confirm.enabled = false;
        },
        CHANGE_MODAL_STATE(state, {name, isShow}) {
            // console.log(name, isShow);
            state.modals[name] = isShow;
        },
        ADD_LOG(state, payload) {
            state.appLogs.push(payload);
        },
        CLEAR_LOGS(state) {
            state.appLogs = [];
        },
        SET_ON_EDIT_PROPERTIES(state, payload) {
            for (const key in payload) {
                state.onEditComponent[key] = payload[key];
            }
        },
        SET_FAST_CHANGE_DETECTOR(state, { field, start, lastTime }) {
            state.fastChangeDetector.field = field;
            state.fastChangeDetector.start = start;
            state.fastChangeDetector.lastTime = lastTime;
        },
        RESET_FAST_CHANGE_DETECTOR(state) {
            state.fastChangeDetector.field = null;
            state.fastChangeDetector.start = null;
            state.fastChangeDetector.lastTime = 0;
        },

        UPDATE_LAZY_CHANGE_STATE(state, payload) {
            state.lazyChange[payload.name] = payload.value;
        },
    },
    actions: {
        async initialize(context) {
            let payload = {
                components: await storage.get('componentsCollapsed'),
                properties: await storage.get('propertiesCollapsed'),
                logs: await storage.get('logsCollapsed')

            }
            context.commit("IDE_INIT", payload);
        },
        setIdeTitle: {
            root: true,
            handler(namespacedContext, title) {
                namespacedContext.commit('CHANGE_IDE_TITLE', title);
            }
        },
        setOnEditComponent: {
            root: true,
            handler(namespacedContext, component) {
                // must finalize BEFORE swapping onEditComponent, otherwise the pending
                // fastChangeDetector (or lazyChange) burst would resolve its "end value"
                // against the NEW component's fields -> a corrupted/meaningless undo command
                clearTimeout(fastChangeTimer);
                fastChangeTimer = null;
                namespacedContext.dispatch('finalizeFastChangeDetector');
                namespacedContext.commit('SET_ON_EDIT_COMPONENT', component);
            }
        },
        setDragData(context, data) {
            context.commit('SET_DRAG_DATA', data);
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
        /**
         *
         * @param context
         * @param payload {onConfirm: Function, onCancel: Function, text: String, title: String}
         */
        showConfirm(context, payload) {
            if (payload.onConfirm === undefined) {
                console.warn('Confirm function nessesary');
                return;
            }
            if (payload.onCancel === undefined) {
                payload.onCancel = () => {
                };
            }
            if (payload.text === undefined) {
                payload.text = 'Are you sure?';
            }
            if (payload.title === undefined) {
                payload.title = 'Confirm';
            }

            context.commit('SHOW_CONFIRM', {
                onConfirm: payload.onConfirm,
                onCancel: payload.onCancel,
                text: payload.text,
                title: payload.title,
            });
        },
        async setMenuState(context, {name, state}) {
            // console.log('called',{name, state});
            context.commit('SET_MENU_STATE', {
                name: name,
                state: state,
            });
            return invoke('set_menu_state', {state: name, value: state})
                .catch(err => console.error('Menu update failed:', err))
        },
        async ResetMenuState(context) {
            for (const name in context.state.menu) {
                await context.dispatch("setMenuState", {name, state: false})
            }
        },
        setCanScreenshot(context, data) {
            // console.log(data,'undo');
            context.commit('SET_CAN_SCREENSHOT', data);
        },
        /**
         * set active page index
         * @param context
         * @param pageIndex : Number
         */
        setActivePage(context, pageIndex) {
            context.commit('SET_ACTIVE_PAGE', pageIndex);
        },
        async setTitle({state, getters, rootState}) {
            let title = state.title + ' v' + getters.version;
            if (rootState.project.project.name.length > 0) {
                title = (rootState.project.isSave ? '' : '● ') + rootState.project.project.name + ' - ' + title;
            }
            await getCurrentWebviewWindow().setTitle(title);
        },
        addLog({commit}, message) {
            // console.log('msg', message);
            commit('ADD_LOG', message);
        },
        lazyChangeStart({commit}, startValue) {
            commit('UPDATE_LAZY_CHANGE_STATE', {
                name: 'isActive',
                value: true,
            });
            commit('UPDATE_LAZY_CHANGE_STATE', {
                name: 'startValue',
                value: startValue,
            });
        },
        lazyChangeDone({commit,state}) {
            if (state.lazyChange.startValue !== state.lazyChange.value &&  state.lazyChange.fields.length > 0) {
                console.log('lazyUndo',state.lazyChange.startValue, state.lazyChange.value, state.lazyChange.fields);
                // create undo command here
            }
            commit('UPDATE_LAZY_CHANGE_STATE', {
                name: 'isActive',
                value: false,
            })
            commit('UPDATE_LAZY_CHANGE_STATE', {
                name: 'fields',
                value: [],
            });

        },
        lazyChangeSetFields({commit}, fields) {
            commit('UPDATE_LAZY_CHANGE_STATE', {
                name: 'fields',
                value: fields
            });
        },
        lazyChangeCurrentValue({commit}, currentValue) {
            commit('UPDATE_LAZY_CHANGE_STATE', {
                name: 'value',
                value: currentValue,
            });
        },
        setOnEditProperties({ state, commit, dispatch }, payload) {
            const payloadKeys = Object.keys(payload);
            const firstKey = payloadKeys[0];

            if (!state.lazyChange.isActive) {
                const now = Date.now();
                // ASSUMPTION: outside lazyChange we never receive multi-key payloads.
                // fastChangeDetector only tracks payloadKeys[0] and silently ignores the rest.
                // if this fires, someone added a multi-field commit path outside lazyChange
                // and fastChangeDetector logic below needs a real refactor to handle it.
                if (payloadKeys.length > 1) {
                    console.warn(
                        '[fastChangeDetector] received multi-key payload outside lazyChange:',
                        payloadKeys,
                        '— fastChangeDetector only tracks the first key; refactor needed if this is intentional.'
                    );
                }

                const isSameField = state.fastChangeDetector.field === firstKey;
                const isWithinWindow = (now - state.fastChangeDetector.lastTime) < FAST_CHANGE_WINDOW_MS;

                if (!isSameField || !isWithinWindow) {
                    dispatch('finalizeFastChangeDetector');
                    commit('SET_FAST_CHANGE_DETECTOR', {
                        field: firstKey,
                        start: state.onEditComponent[firstKey],
                        lastTime: now,
                    });
                } else {
                    commit('SET_FAST_CHANGE_DETECTOR', {
                        field: firstKey,
                        start: state.fastChangeDetector.start,
                        lastTime: now,
                    });
                }

                clearTimeout(fastChangeTimer);
                fastChangeTimer = setTimeout(() => {
                    dispatch('finalizeFastChangeDetector');
                }, FAST_CHANGE_IDLE_TIMEOUT_MS);
            }

            commit('SET_ON_EDIT_PROPERTIES', payload);

            if (state.lazyChange.isActive) {
                dispatch('lazyChangeCurrentValue', payload[firstKey]);
                if (state.lazyChange.fields.length === 0) {
                    dispatch('lazyChangeSetFields', payloadKeys);
                }
            }
        },

        finalizeFastChangeDetector({ state, commit }) {
            const field = state.fastChangeDetector.field;
            if (field === null) return;

            const startValue = state.fastChangeDetector.start;
            const endValue = state.onEditComponent[field];

            if (startValue !== endValue) {
                // create undo command here
                console.log('fastUndo',startValue, endValue, field);
            }

            commit('RESET_FAST_CHANGE_DETECTOR');
        },
    },
    getters: {
        version(state) {
            return state.version.major + '.' +
                state.version.minor + '.' +
                state.version.patch + '-' +
                state.version.suffix;
        },
        // async title(state,getters, rootState) {
        //     let title = state.title  + ' v' +getters.version ;
        //     if (rootState.project.project.name.length > 0){
        //         title = (rootState.project.isSave?'':'● ') + rootState.project.project.name + title;
        //     }
        //
        //     await getCurrentWebviewWindow().setTitle(title);
        //
        // },
        currentPage(state) {
            return state.pages.currentPage;
        },
        activePageIndex(state) {
            return state.activePage;
        },
        defaultColors(state) {
            let colors = {};
            for (const color of state.colors) {
                colors[color.value] = color.color;
            }
            return colors;
        },
        defaultColorsArray(state) {
            return state.colors.map((color) => {
                return color.color;
            })
        },
    }
};


export default ideStore;