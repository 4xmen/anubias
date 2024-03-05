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

let oldIsSaved = true;
let oldProjectName = '';

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

    let projectName = state.project.project.name;
    const isSaved = state.project.isSaved;
    // if (state.project.isSave){
    //         projectName += '*'
    // }
    if (oldProjectName != projectName || isSaved != oldIsSaved) {
        oldProjectName = projectName;
        oldIsSaved = isSaved;
        if (!isSaved){
            projectName += '*';
        }
        store.commit('ide/CHANGE_IDE_TITLE', projectName);
    }
});


// vueApp.toast = toast;

vueApp.mount('#anubias-app').$nextTick(() => {
    postMessage({payload: 'removeLoading'}, '*');
});


