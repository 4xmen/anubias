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
            // must finalize BEFORE swapping onEditComponent, otherwise the pending
            // fastChangeDetector (or lazyChange) burst would resolve its "end value"
            // against the NEW component's fields -> a corrupted/meaningless undo command
            this.commit('ide/FINALIZE_FAST_CHANGE_DETECTOR');
            clearTimeout(fastChangeTimer);
            fastChangeTimer = null;

            // lazyChange can also be mid-flight when the component switches
            // (e.g. user dragging, then clicks another component before mouseup fires)
            // so it needs the same "close it out properly" treatment
            if (state.lazyChange.isActive) {
                if (state.lazyChange.startValue !== state.lazyChange.value) {
                    // create undo command here (same rule as UPDATE_LAZY_CHANGE_STATE)
                }
                state.lazyChange.isActive = false;
                state.lazyChange.startValue = null;
                state.lazyChange.fields = [];
                state.lazyChange.value = null;
            }

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
            // needed so the setTimeout callback below can commit back into the store
            const store = this;

            let payloadKeys = Object.keys(payload);
            const firstKey = payloadKeys[0];

            // fastChangeDetector is only a FALLBACK: while lazyChange is active it already
            // guarantees a predictable undo command, so skip fast-change tracking entirely
            if (!state.lazyChange.isActive) {
                const now = Date.now();
                const isSameField = state.fastChangeDetector.field === firstKey;
                const isWithinFastWindow = (now - state.fastChangeDetector.lastTime) < 300;

                if (isSameField && isWithinFastWindow) {
                    // still inside the same burst on the same field:
                    // keep the original `start` value, just push the window forward
                    state.fastChangeDetector.lastTime = now;
                } else {
                    // either a different field started changing, or too much time passed
                    // since the last edit -> whatever burst we were tracking (if any) is over
                    store.commit('ide/FINALIZE_FAST_CHANGE_DETECTOR');

                    // start tracking a brand new potential burst for this field
                    state.fastChangeDetector.field = firstKey;
                    state.fastChangeDetector.start = state.onEditComponent[firstKey];
                    state.fastChangeDetector.lastTime = now;
                }

                // fallback inactivity timer: if the user simply stops editing altogether,
                // there is no future commit to naturally detect "burst is over", so we
                // schedule this timer ourselves to finalize it after 300ms of silence
                clearTimeout(fastChangeTimer);
                fastChangeTimer = setTimeout(() => {
                    store.commit('ide/FINALIZE_FAST_CHANGE_DETECTOR');
                }, 300);
            }

            let valueHolder = null;
            // commit properties to show in live-preview
            for (const key in payload) {
                state.onEditComponent[key] = payload[key];
                if (state.lazyChange.isActive) {
                    valueHolder = payload[key];
                }
            }

            // note: why we handle this values look at lazyChange comments
            if (state.lazyChange.isActive) {
                this.dispatch('ide/lazyChangeCurrentValue', valueHolder);
                if (state.lazyChange.fields.length === 0) {
                    this.dispatch('ide/lazyChangeSetFields', payloadKeys);
                }
            }
        },

        // finalizes whatever fast-change burst is currently tracked (if any).
        // called either when a new field/burst starts, or by the inactivity timer above.
        FINALIZE_FAST_CHANGE_DETECTOR(state) {
            const field = state.fastChangeDetector.field;
            if (field === null) {
                return; // nothing was being tracked, nothing to do
            }

            const startValue = state.fastChangeDetector.start;
            const endValue = state.onEditComponent[field];

            if (startValue !== endValue) {
                // create undo command here (field, startValue -> endValue)
                console.log('fastUndo',startValue,endValue, field);
            }

            // reset so the next edit can start tracking a clean, fresh burst
            state.fastChangeDetector.field = null;
            state.fastChangeDetector.start = null;
            state.fastChangeDetector.lastTime = 0;
        },

        UPDATE_LAZY_CHANGE_STATE(state, payload) {
            if (payload.name === 'isActive' && payload.value === false && state.lazyChange.startValue !== state.lazyChange.value &&  state.lazyChange.fields.length > 0) {
                console.log('lazyUndo',state.lazyChange.startValue, state.lazyChange.value, state.lazyChange.fields);
                // state.lazyChange.startValue = state.lazyChange.value;
                // create undo command here
            }
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
        lazyChangeDone({commit}) {
            commit('UPDATE_LAZY_CHANGE_STATE', {
                name: 'isActive',
                value: false,
            });
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
        }
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