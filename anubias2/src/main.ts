import {createApp} from 'vue';

import "./css";
import App from './app.vue';
import store from './stores/store';
import router from "./ide/router";
import './ide/ide-api';

const app = createApp(App);



app.use(store);
app.use(router);


app.mount('#anubias-app').$nextTick(() => {
        postMessage({payload: 'removeLoading'}, '*');
});


