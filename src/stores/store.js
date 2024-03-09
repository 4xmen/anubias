import {createStore} from 'vuex' ;
import ideStore from "./ideStore";
import projectStore from "./projectStore";


const store = createStore({
    modules: {
        ide: ideStore,
        project: projectStore,
    },
    namespaced: true,
});

export default store;