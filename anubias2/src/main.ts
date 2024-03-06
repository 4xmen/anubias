import {createApp} from 'vue';

import "./css";
import App from './app.vue';
import store from './stores/store';
import router from "./ide/router";
import toast from "vue-toastification";

import './ide/ide-api';
// css for plugins
import "vue-toastification/dist/index.css";

const vueApp = createApp(App);
import {ipcRenderer} from 'electron';

let oldProject: string = '';

// toast default options
const toastOption = {
    position: "bottom-right",
    timeout: 10000,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    hideProgressBar: false,
    closeButton: "button",
    icon: true,
    rtl: false
};

vueApp.use(store);
vueApp.use(router);
vueApp.use(toast, toastOption);


store.subscribe((mutation, state) => {
    // console.log(state);
    ipcRenderer.send('update-store-data', JSON.stringify(state));

    if (mutation.type.startsWith("project")) {
        let projectName = state.project.project.name;
        let  project = JSON.stringify(state.project.project);
        const isSaved = state.project.isSave;
        // console.log('savee', isSaved);
        // check if project changed then:
        // update menu
        // promise to screenshot
        if (oldProject != project) {
            oldProject = project;

            store.dispatch('project/changeSaveState',false);
            store.dispatch('ide/setMenuCanSave',!isSaved);
            store.dispatch('ide/setCanScreenshot',true);
        }
        if (!isSaved) {
            projectName += '*';
        }
        store.commit('ide/CHANGE_IDE_TITLE', projectName);
    }


});


// vueApp.toast = toast;

vueApp.mount('#anubias-app').$nextTick(() => {
    postMessage({payload: 'removeLoading'}, '*');
});


