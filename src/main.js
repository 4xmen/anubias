import {createApp} from 'vue';

// app css
import "./ide/css/style.css";

import App from './app.vue';

import store from './stores/store.js';
import router from "./ide/router.js";
import toast from "vue-toastification";
//
import './ide/ide-api';
// css for plugins
import "vue-toastification/dist/index.css";
import 'vazirmatn/Vazirmatn-Variable-font-face.css';
import 'remixicon/fonts/remixicon.css';
import 'material-icons';

// define prtotypes
Object.defineProperty(String.prototype, 'capitalize', {
    value: function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
    },
    enumerable: false
});

//
const vueApp = createApp(App);


let oldProject = '';
//
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

// initial ide data
await store.dispatch("ide/initialize"); //

vueApp.use(store);
vueApp.use(router);
vueApp.use(toast, toastOption);

vueApp.mount('#anubias-app').$nextTick(() => {
    postMessage({payload: 'removeLoading'}, '*');
});
//
//
