import projectTemplate from './assets/projectTemplate.json';
import ide from './ideStore';
import {invoke} from '@tauri-apps/api/core'
import {getUniqueName} from "../ide/js/component-control";
import {useToast} from "vue-toastification";
// import {state} from "vue-tsc/out/shared";
import defaultPage from './components/defaultPage.json';
import {LazyStore} from '@tauri-apps/plugin-store';
import {fixName, generateCommandId, generateHashId, safeClone, unixTimestamp} from "../ide/js/system-functions.js";
import {PreviewManager} from "../ide/js/preview-manager.js";
import {ask, save} from "@tauri-apps/plugin-dialog";
import {HashMapManager} from "../ide/js/hashmap-manager.js";
import {find} from "sortablejs/src/utils.js";

const storage = new LazyStore('ide.json', {autoSave: false});

// const storage = new Store();
const toast = useToast();


/***
 * project store to store all data about project
 * like: project info, components
 */
const projectStore = {
    namespaced: true,
    state: () => ({
        /**
         * If you update this state
         * you need to update new-project.vue too
         */
        project: projectTemplate,
        previews: new PreviewManager(),
        projectFile: '',
        projectPath: '',
        isSave: true,
        lastLoadProjectNotify: 0,
        backups: [],
        hashmaps: new HashMapManager(),
        undoStack: [],
        redoStack: [],
    }),
    mutations: {
        RENEW_HASHMAP(state) {
            state.hashmaps.renew( state.project );
        },
        CREATE_PROJECT(state, project) {
            state.project = project;
            project.pages.forEach((page) => {
                state.previews.register(page.hash);
            });
        },
        LOAD_PROJECT(state, project) {
            state.project = project;
            state.lastLoadProjectNotify = unixTimestamp();

            project.pages.forEach((page) => {
                state.previews.register(page.hash);
            });
        },
        SET_LAST_LOADED_PROJECT(state, project) {
            state.lastLoadedProject = project;
        },
        ADD_COMPONENT_TO_PAGE(state, {pageIndex, isVisual, component}) {
            // console.log;
            let c = safeClone(component); // we can't use structuredClone or {...component}
            c.hash = generateHashId();
            let dataMap = {
                parent: state.project.pages[pageIndex].hash,
                hash: c.hash,
                type: 'visual'
            }
            // console.log(c);
            // check is app app bar
            if (c.type === 'appbar') {
                c.name = getUniqueName(state.project.pages[pageIndex], component.name);
                if (c.name === 'appbar2') {
                    // show warning
                    let msg = `You can't add ${c.type} more!`;
                    toast.warning(msg);
                } else {
                    state.project.pages[pageIndex].children.visual.unshift(c);
                }
            } else {
                // usual components
                c.name = getUniqueName(state.project.pages[pageIndex], component.name);
                if (isVisual) {
                    state.project.pages[pageIndex].children.visual.push(c);
                } else {
                    state.project.pages[pageIndex].children.nonVisual.push(c);
                    dataMap.type =  'nonVisual';
                }
            }

            state.hashmaps.addComponent(dataMap);

            const undoCommand = {
                id: generateCommandId(),
                entity: "COMPONENT",
                action: "ADD",
                targetId: c.hash,
                payload: {
                    parent: dataMap.parent,
                    data: structuredClone(c),
                    type: dataMap.type,
                },
            };
            this.dispatch('ide/setMenuState', {name: 'CanSave', state: true});
            this.dispatch('ide/setCanScreenshot', true);
            this.dispatch('project/changeSaveState', false);
            this.dispatch('project/pushUndoCommand', undoCommand);

        },
        CLEAR_REDO(state) {
          state.redoStack = [];
            this.dispatch('ide/setMenuState', {name: 'CanRedo', state: false});
        },
        PUSH_UNDO_COMMAND(state, command) {
            state.undoStack.push(command);
            this.dispatch('ide/setMenuState', {name: 'CanUndo', state: true});
        },
        PUSH_REDO_COMMAND(state, command) {
            state.redoStack.push(command);
            this.dispatch('ide/setMenuState', {name: 'CanRedo', state: true});
        },
        SET_PAGE_PREVIEW(state, {pageIndex, image}) {

            // console.log('preview:',pageIndex, image);
            try {
                if (image !== undefined) {
                    state.previews.update(state.project.pages[pageIndex].hash, image);
                }
            } catch (e) {
                console.log(`Update preview problem: ${e.message}`);
            }

        },
        UPDATE_PAGES(state, pages) {
            state.project.pages = pages;
        },
        ADD_NEW_PAGE(state) {

            // create new page
            let newPage = {...defaultPage};
            // store names to check duplicate name
            let names = [];
            for (const page of state.project.pages) {
                names.push(page.name);
            }
            //
            let i = (parseInt(state.project.pages.length));
            // check for unique name
            do {
                i++;
                newPage.name = 'page' + i;
            } while (names.indexOf(newPage.name) !== -1)
            newPage.hash = generateHashId();
            // add page finaly
            state.project.pages.push(newPage);
            // console.log('before reg',newPage.hash);
            state.previews.register(newPage.hash);
        },
        REMOVE_PAGE(state, index) {
            if (state.project.pages.length > 1) {
                state.project.pages.splice(index, 1);
            } else {
                toast.warning("You can't remove the last page of project");
            }
        },
        UPDATE_PROJECT_DATA(state, payload) {
            state[payload.key] = payload.value;
            this.dispatch('ide/setTitle');
        },
        UPDATE_PROJECT_PREVIEWS(state, payload) {
            for (let preview of payload) {
                const bytes = new Uint8Array(preview.data);
                if (state.previews.has(preview.page_id)) {
                    state.previews.update(preview.page_id, new Blob([bytes]));
                } else {
                    state.previews.register(preview.page_id, new Blob([bytes]));
                    state.previews.update(preview.page_id, new Blob([bytes]));
                }
            }
        },
        SET_BACKUP_LIST(state, list) {
            state.backups = list;
        },
        IGNORE_BACKUPS(state) {
            state.backups = [];
        },
        SET_PROJECT_FILE(state, path) {
            state.projectFile = path;
        },
    },
    actions: {

        undo({state,dispatch,commit}) {
            let command = state.undoStack.pop();
            commit("PUSH_REDO_COMMAND", command);

            switch(command.action) {
                case 'ADD':
                    if (command.entity === "COMPONENT"){
                        // remove component
                        dispatch('removeComponent', command.targetId);
                    }else if (command.entity === "PAGE"){
                        // remove page
                    } else {
                        console.warn("Unknown command Entity", command.entity);
                    }
                    break;
                default:
                    console.error('Unknown action', command);
            }
            dispatch('updateRedoUndoMenu');
        },
        redo({state,dispatch,commit}) {
            let command = state.redoStack.pop();
            switch(command.action) {
                case 'ADD':
                    if (command.entity === "COMPONENT"){
                        // restore component
                        dispatch('restoreComponent', command);
                    }else if (command.entity === "PAGE"){
                        // restore page
                    } else {
                        console.warn("Unknown command Entity", command.entity);
                    }
                    break;
                default:
                    console.error('Unknown action', command);
            }
            commit("PUSH_UNDO_COMMAND", command);

            dispatch('updateRedoUndoMenu');
        },


        makeUndoCommandChangeOnEditComponentProperty(state, command) {

        },
        updateRedoUndoMenu({state,dispatch}) {
            if (state.redoStack.length === 0) {
                dispatch('ide/setMenuState', {name: 'CanRedo', state: false},{root: true});
            }
            if (state.undoStack.length === 0) {
                dispatch('ide/setMenuState', {name: 'CanUndo', state: false},{root: true});
            }
        },
        pushUndoCommand({commit}, command) {
            commit('PUSH_UNDO_COMMAND', command);
        },
        pushRedoCommand({commit}, command) {
            commit('PUSH_REDO_COMMAND', command);
        },
        removeComponent({state}, component_hash) {
            //find component hash index
            const componentIndex = state.hashmaps.findComponentIndex(component_hash);

            if (componentIndex !== -1) {
                const componentHashMap = state.hashmaps.getComponent(component_hash);

                // remove component from hashmap
                state.hashmaps.removeComponent(component_hash);

                // find page component
                const page = state.project.pages.find(p => p.hash === componentHashMap.parent);

                if (page) {
                    // check component type
                    if (componentHashMap.type === 'visual') {
                        const visualIndex = page.children.visual.findIndex(
                            c => c.hash === component_hash
                        );
                        if (visualIndex !== -1) {
                            page.children.visual.splice(visualIndex, 1);
                        }
                    } else if (componentHashMap.type === 'nonVisual') {
                        const nonVisualIndex = page.children.nonVisual.findIndex(
                            c => c.hash === component_hash
                        );
                        if (nonVisualIndex !== -1) {
                            page.children.nonVisual.splice(nonVisualIndex, 1);
                        }
                    }
                }
            }
        },
        restoreComponent({state}, command) {
            // // restore hashmap
            state.hashmaps.restore(command.targetId);
            // // restore component
            state.project.pages[state.hashmaps.findPageIndex(command.payload.parent)].children[command.payload.type].push(safeClone(command.payload.data));
        },

        async createProject({commit, dispatch}, project) {
            project.anubias = ide.getters.version(ide.state());
            await storage.set('lastLoadedProject', project);
            await storage.set('lastLoadedProjectPath', "");
            commit('CREATE_PROJECT', project);
            commit('RENEW_HASHMAP');
            // await dispatch('loadProject', project);
            toast.success('Project initialized...');
            dispatch('ide/setTitle', null, {root: true});
            this.dispatch('ide/setMenuState', {name: 'IsProjectLoaded', state: true});
            this.dispatch('ide/setMenuState', {name: 'CanSave', state: true});
            dispatch('ide/setActivePage', project.entryPoint, {root: true});
        },

        async loadProject({commit, dispatch, state}, project) {

            // if this comment not need again must remove
            commit('LOAD_PROJECT', project);
            commit('RENEW_HASHMAP');
            await storage.set('lastLoadedProject', project);
            await storage.set('lastLoadedProjectPath', state.projectFile);

            dispatch('ide/setActivePage', project.entryPoint, {root: true});

            toast.success('Project loaded...');
            dispatch('ide/setMenuState', {name: 'IsProjectLoaded', state: true}, {root: true});
            dispatch('ide/setTitle', null, {root: true});

            // check auto save backup
            await dispatch('listBackups', state.project.hash);

        },

        async prepareProjectFile({commit, dispatch}, path) {
            const result = await invoke("load_project", {
                path
            });

            commit('SET_PROJECT_FILE', path);
            await dispatch('loadProject', JSON.parse(result.project));
            setTimeout(() => {
                dispatch('updateProjectPreview', result.previews);
            }, 100);
        },

        async loadLastProject({commit, dispatch, state}) {

            let path = await storage.get('lastLoadedProjectPath');
            if (path !== '') {
                dispatch("prepareProjectFile", path);
                return;
            }
            let project = await storage.get('lastLoadedProject');

            // if this comment not need again must remove
            commit('LOAD_PROJECT', project);
            commit('RENEW_HASHMAP');

            dispatch('ide/setActivePage', project.entryPoint, {root: true});

            toast.success('Project loaded...');
            dispatch('ide/setMenuState', {name: 'IsProjectLoaded', state: true}, {root: true});
            dispatch('ide/setTitle', null, {root: true});

            // check auto save backup
            await dispatch('listBackups', state.project.hash);
        },

        async listBackups({commit}, hash) {
            let backups = await invoke('list_backups', {hash});
            commit("SET_BACKUP_LIST", backups);
            if (backups.length > 0) {
                toast.warning(`${backups.length} backups available`);
            }
        },


        async saveProject({state, commit, dispatch}, path = null) {
            // save project just save project by project path
            // so If save as is need to change project path
            const req = {
                path: path ?? state.projectFile,
                project: JSON.stringify(state.project),
                previews: await state.previews.export()
            };
            if (await invoke('save_project', {request: req})) {
                commit('UPDATE_PROJECT_DATA', {key: 'isSave', value: true});
            }
            dispatch('clearBackup', unixTimestamp());
            commit('IGNORE_BACKUPS');
        },
        /**
         * add component to page
         * @param context
         * @param pageIndex : Number
         * @param isVisual : Boolean
         * @param component : Object anubias component object
         */
        addComponentToPage(context, {pageIndex, isVisual, component}) {
            // const currentPageIndex = this.
            context.commit('ADD_COMPONENT_TO_PAGE', {
                pageIndex: pageIndex,
                isVisual: isVisual,
                component: component
            });

            context.commit("CLEAR_REDO");
        },
        updatePagePreview(context, {pageIndex, image}) {
            context.commit('SET_PAGE_PREVIEW', {
                pageIndex: pageIndex,
                image: image,
            });
            this.dispatch('ide/setCanScreenshot', false);
        },
        updatePages(context, pages) {
            context.commit('SET_PAGE_PREVIEW', pages);
        },
        addNewPageProject(context) {
            context.commit('ADD_NEW_PAGE');
        },
        removePage(context, i) {
            context.commit('REMOVE_PAGE', i);
        },
        changeSaveState(context, isSave) {
            context.commit('UPDATE_PROJECT_DATA', {key: 'isSave', value: isSave});
            invoke('set_menu_state', {state: "CanSave", value: true})
                .catch(err => console.error('Menu update failed:', err))
        },
        updateProjectPreview(context, previews) {
            context.commit('UPDATE_PROJECT_PREVIEWS', previews);
        },
        async autoSave({state}) {
            if (state.isSave) {
                return false;
            }
            const req = {
                path: null,
                project: JSON.stringify(state.project),
                previews: await state.previews.export(),
            };
            return await invoke('autosave_project_backup', {
                request: req,
                hash: state.project.hash,
                timestamp: unixTimestamp(),
            });
        },
        async projectSaveRequest(context) {
            if (context.state.projectFile === "") {
                let lastFolder = localStorage.getItem("lastFolder") || "";

                const path = await save({
                    defaultPath: lastFolder,
                    multiple: false,
                    directory: false,
                    filters: [
                        {name: "Anubias files", extensions: ["anb"]},
                        {name: "All files", extensions: ["*"]},
                    ],
                });

                if (!path) return;
                const fixedPath = fixName(path);
                const fileExists = await invoke("path_exists", {path: fixedPath});


                if (fileExists) {
                    const ok = await ask("OMG :), Do you want to overwrite project file?", {
                        title: "Confirm overwrite",
                        kind: "warning",
                    });

                    if (!ok) return;
                }

                const folder = fixedPath.substring(0, fixedPath.lastIndexOf("/"));
                localStorage.setItem("lastFolder", folder);
                await context.dispatch("saveProject", fixedPath);
            } else {
                await context.dispatch("saveProject");
            }
        },
        async clearBackup(context, timestamp) {
            return await invoke('delete_old_backups', {hash: context.state.project.hash, timestamp});
        },
    },
    getters: {
        getPage: (state) => (i) => {
            if (state.project.pages == undefined || state.project.pages[i] === undefined) {
                return {};
            }
            return state.project.pages[i];
        },
        appColor: (state) => {
            return state.project.appColor;
        },
        isRTL: (state) => {
            return state.project.isRTL;
        },
        isDark: (state) => {
            return state.project.isDark;
        },
        pages: (state) => {
            return state.project.pages;
        },
    }
};

export default projectStore;