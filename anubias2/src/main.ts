import {createApp} from 'vue';
import { createWebHistory, createRouter } from "vue-router";

import "./css";
import App from './app.vue';
import './ide/ide-api';
import store from './stores/store';
import routes from "./ide/router";


const router = createRouter({
        // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
        history: createWebHistory(),
        routes, // short for `routes: routes`
});

const app = createApp(App);

app.use(store);
app.use(router);

app.mount('#anubias-app').$nextTick(() => {
        postMessage({payload: 'removeLoading'}, '*');
});


