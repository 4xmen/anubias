import projectTemplate from './assets/projectTemplate.json';
import ide from './ideStore';
import Store from 'electron-store';
import {ipcRenderer} from 'electron';
import {getUniqueName} from "../ide/js/component-control";

const storage = new Store();
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
        projectFile: '',
        projectPath: '',
        isSave: true,
    }),
    mutations: {

        CREATE_PROJECT(state, project) {
            project.anubias = ide.getters.version(ide.state());
            storage.set('lastCreatedProject', project);
            this.commit('project/LOAD_PROJECT', project);

        },
        LOAD_PROJECT(state, project) {
            state.project = project;
            // ide.actions.setIdeTitle(,ide.state().appName + ' - '+ project.name );
            let title = ide.state().appName + ' - ' + project.name;
            this.dispatch('setIdeTitle', title);
            storage.set('lastLoadedProject', project);
            this.dispatch('ide/setActivePage', project.entryPoint);
            ipcRenderer.send('set-has-project',true);
        },
        ADD_COMPONENT_TO_PAGE(state, {pageIndex, isVisual, component}) {
            // console.log;
            let c = {...component};
            c.name = getUniqueName(state.project.pages[pageIndex],component.name);
            if (isVisual){
                state.project.pages[pageIndex].children.visual.push(c);
            }else{
                state.project.pages[pageIndex].children.nonVisual.push(c);
            }
            this.dispatch('ide/setMenuCanUndo',true);
        },
    },
    actions: {
        /**
         *
         * @param context
         * @param project : Object anubias project object
         */
        createProject(context, project) {
            context.commit('CREATE_PROJECT', project);
        },
        /**
         *
         * @param context
         * @param project : Object anubias project object
         */
        loadProject(context, project) {
            context.commit('LOAD_PROJECT', project);
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
            context.commit('ADD_COMPONENT_TO_PAGE',{ pageIndex: pageIndex, isVisual: isVisual, component: component });
        },

    },
    getters: {
        getPage: (state) => (i) => {
            return state.project.pages[i];
        }
    }
};

export default projectStore;