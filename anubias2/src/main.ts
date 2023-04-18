import {createApp} from 'vue';

import "./css";
import App from './app.vue';
import store from './stores/store';
import router from "./ide/router";
import toast from "vue-toastification";

import './ide/ide-api';
// css for plugins
import "vue-toastification/dist/index.css";

const app = createApp(App);

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

app.use(store);
app.use(router);
app.use(toast, toastOption);

// app.toast = toast;

app.mount('#anubias-app').$nextTick(() => {
        postMessage({payload: 'removeLoading'}, '*');
});


