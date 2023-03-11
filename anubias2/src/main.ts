import {createApp} from 'vue';
import "./css";
import App from './Anubias.vue';
import './samples/node-api';
import store from './stores/store';


const app = createApp(App);

app.use(store);

app.mount('#anubias-app').$nextTick(() => {
        postMessage({payload: 'removeLoading'}, '*');
});


