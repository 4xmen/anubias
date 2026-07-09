import projectTemplate from './assets/projectTemplate.json';
import ide from './ideStore';
import {invoke} from '@tauri-apps/api/core'
import {getUniqueName} from "../ide/js/component-control";
import {useToast} from "vue-toastification";
// import {state} from "vue-tsc/out/shared";
import defaultPage from './components/defaultPage.json';
import {LazyStore} from '@tauri-apps/plugin-store';
import {fixName, generateHashId, unixTimestamp} from "../ide/js/system-functions.js";
import {PreviewManager} from "../ide/js/preview-manager.js";
import {ask, save} from "@tauri-apps/plugin-dialog";

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
    }),
    mutations: {


        CREATE_PROJECT(state, project) {
            state.project = project;
        },
        LOAD_PROJECT(state, project) {
            state.project = project;
            state.lastLoadProjectNotify = unixTimestamp();

            project.pages.forEach((page) => {
                state.previews.register(page.id);
            });
        },
        SET_LAST_LOADED_PROJECT(state, project) {
            state.lastLoadedProject = project;
        },
        ADD_COMPONENT_TO_PAGE(state, {pageIndex, isVisual, component}) {
            // console.log;
            let c = {...component};
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
                }
            }
            this.dispatch('ide/setMenuState', {name: 'CanUndo', state: true});
            this.dispatch('ide/setMenuState', {name: 'CanSave', state: true});
            this.dispatch('ide/setCanScreenshot', true);
            this.dispatch('project/changeSaveState', false);

        },
        SET_PAGE_PREVIEW(state, {pageIndex, image}) {

            try {
                if (image !== undefined) {
                    state.previews.update(state.project.pages[pageIndex].id, image);
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
            newPage.id = generateHashId();
            // add page finaly
            state.project.pages.push(newPage);
            state.previews.register(newPage.id);
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
                // preview.data یک array است، درست تبدیل کن
                const bytes = new Uint8Array(preview.data);
                state.previews.update(preview.page_id, new Blob([bytes]));
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
        }
    },
    actions: {
        async createProject({commit, dispatch}, project) {
            project.anubias = ide.getters.version(ide.state());
            await storage.set('lastLoadedProject', project);
            commit('CREATE_PROJECT', project);
            // await dispatch('loadProject', project);
            toast.success('Project initialized...');
            dispatch('ide/setTitle', null, {root: true});
        },

        async loadProject({commit, dispatch, state}, project) {

            // if this comment not need again must remove
            commit('LOAD_PROJECT', project);

            await storage.set('lastLoadedProject', project);
            await invoke('set_has_project', {status: true});

            dispatch('ide/setActivePage', project.entryPoint, {root: true});

            toast.success('Project loaded...');
            dispatch('ide/setMenuState', {name: 'IsProjectLoaded', state: true}, {root: true});
            dispatch('ide/setTitle', null, {root: true});

            // check auto save backup
            await dispatch('listBackups', state.project.hash);

        },

        async loadLastProject({commit, dispatch, state}) {

            let project = await storage.get('lastLoadedProject');
            // if this comment not need again must remove
            commit('LOAD_PROJECT', project);

            await invoke('set_has_project', {status: true});

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


        async saveProject({state, commit}, path = null) {
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
            if (context.state.projectFile === ""){
                let lastFolder = localStorage.getItem("lastFolder") || "";

                const path = await save({
                    defaultPath: lastFolder,
                    multiple: false,
                    directory: false,
                    filters: [
                        { name: "Anubias files", extensions: ["anb"] },
                        { name: "All files", extensions: ["*"] },
                    ],
                });

                if (!path) return;
                const fixedPath = fixName(path);
                const fileExists = await invoke("path_exists", { path: fixedPath });


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
            }else{
                await context.dispatch("saveProject");
            }
        }
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