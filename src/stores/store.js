import {createStore} from 'vuex' ;
import ideStore from "./ideStore.js";
import projectStore from "./projectStore.js";


const store = createStore({
    modules: {
        ide: ideStore,
        project: projectStore,
    },
    namespaced: true,
});

export default store;