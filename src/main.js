import Vue from 'vue';
import App from './App.vue';
import router from "./router";
import Particles from "particles.vue";

import VueFinalModal from 'vue-final-modal';
/*eslint-disable */
// load global script
import "script-loader!jquery";
import "script-loader!flickity/dist/flickity.pkgd.min";
import "script-loader!alertifyjs/build/alertify.min";
import "script-loader!materialize-css/dist/js/materialize.min";
/*eslint-enable */
Vue.config.productionTip = false;
require('@/assets/js/winVars.js');

Vue.use(Particles);

Vue.use(VueFinalModal({
    componentName: 'VueFinalModal',
    key: '$vfm',
    dynamicContainerName: 'ModalsContainer'
}));

new Vue({
    router,
    render: h => h(App),
    mounted() {
        // this.$router.push("/");
    }
}).$mount("#app");

