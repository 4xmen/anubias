import projectTemplate from './assets/projectTemplate.json';
import ide from './ideStore';
import Store from 'electron-store';

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
        }
    },
    actions: {
        createProject(context, project) {
            context.commit('CREATE_PROJECT', project);
        },
        loadProject(context, project) {
            context.commit('LOAD_PROJECT', project);
        },

    },
    getters: {
        getPage: (state) => (i) => {
            return state.project.pages[i];
        }
    }
};

export default projectStore;