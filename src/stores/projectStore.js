import projectTemplate from './assets/projectTemplate.json';
import ide from './ideStore';
import { invoke } from '@tauri-apps/api/core'
import {getUniqueName} from "../ide/js/component-control";
import {useToast} from "vue-toastification";
// import {state} from "vue-tsc/out/shared";
import defaultPage from './components/defaultPage.json';
import { LazyStore } from '@tauri-apps/plugin-store';
import {generatePageId} from "../ide/js/system-functions.js";
import {PreviewManager} from "../ide/js/preview-manager.js";

const storage = new LazyStore('ide.json', { autoSave: false });

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
    }),
    mutations: {

        async CREATE_PROJECT(state, project) {
            project.anubias = ide.getters.version(ide.state());
            await storage.set('lastCreatedProject', project);
            console.log(await storage.get('lastCreatedProject'));
            await this.commit('project/LOAD_PROJECT', project);
            toast.success("Project initialized...");
        },
        async LOAD_PROJECT(state, project) {

            state.project = project;

            // if this comment not need again must remove
            // ide.actions.setIdeTitle(,ide.state().appName + ' - '+ project.name );
            // let title = ide.state().appName + ' - ' + project.name;
            // this.dispatch('setIdeTitle', title);

            // console.log('[pro',project);
            await storage.set('lastLoadedProject', project);
            // ipcRenderer.send('set-has-project', true);
            await invoke('set_has_project', {
                status: true
            })
            this.dispatch('ide/setActivePage', project.entryPoint);
            // check duplicate notify
            if (Math.round(+new Date() / 1000) > state.lastLoadProjectNotify + 2) {
                toast.success("Project loaded...");
                state.lastLoadProjectNotify = Math.round(+new Date() / 1000);
            }

            // add previews object
            project.pages.forEach((page) => {
                state.previews.register(page.id);
            });
        },
        async BACKUP_PROJECT(state) {
            // console.log(JSON.stringify(state.project).length);
            // console.log(JSON.stringify(storage.get('lastLoadedProject')).length);
            if (JSON.stringify(state.project) !== JSON.stringify(storage.get('lastLoadedProject'))) {
               await storage.set('backupProject', state.project);
            }
        },
        async RESTORE_PROJECT(state) {
            // console.log(storage.get('backupProject'));
            this.commit('project/LOAD_PROJECT', await storage.get('backupProject'));
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
            this.dispatch('ide/setMenuCanUndo', true);
            this.dispatch('ide/setCanScreenshot', true);
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
            newPage.id = generatePageId();
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
        },
    }
    ,
    actions: {
        /**
         *
         * @param context
         * @param project : Object anubias project object
         */
        async createProject(context, project) {
           await context.commit('CREATE_PROJECT', project);
        },
        /**
         *
         * @param context
         * @param project : Object anubias project object
         */
        async loadProject(context, project) {
            await context.commit('LOAD_PROJECT', project);
        },
        backupProject(context) {
            context.commit('BACKUP_PROJECT');
        },
        restoreProject(context) {
            context.commit('RESTORE_PROJECT');
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
        changeSaveState(context,isSave){
          context.commit('UPDATE_PROJECT_DATA',{key: 'isSave',value: isSave});
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