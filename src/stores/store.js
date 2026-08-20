import { createStore } from 'vuex';
import ideStore from './ideStore.js';
import projectStore from './projectStore.js';

const store = createStore({
    modules: {
        ide: ideStore,
        project: projectStore,
    },
    namespaced: true,
});

if (import.meta.hot) {
    import.meta.hot.accept('./ideStore.js', (newIdeStore) => {
        if (newIdeStore) {
            store.hotUpdate({
                modules: {
                    ide: newIdeStore.default,
                },
            });
        }
    });

    import.meta.hot.accept('./projectStore.js', (newProjectStore) => {
        if (newProjectStore) {
            store.hotUpdate({
                modules: {
                    project: newProjectStore.default,
                },
            });
        }
    });
}

export default store;