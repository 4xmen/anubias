import projectTemplate from './assets/projectTemplate.json';
import ide from './ideStore';

/***
 * project store to store all data about project
 * like: project info, components
 */
const projectStore = {
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
            state.project = project;
        },
    },
    actions: {
        createProject(context, project) {
            context.commit('CREATE_PROJECT', project);
        }
    },
    getters: {}
};

export default projectStore;