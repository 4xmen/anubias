import Vue from 'vue';
import App from './App.vue';
import router from "./router";

/*eslint-disable */
// load global script
import  "script-loader!jquery";
import  "script-loader!flickity/dist/flickity.pkgd.min";
import  "script-loader!alertifyjs/build/alertify.min";
import  "script-loader!materialize-css/dist/js/materialize.min";
/*eslint-enable */
Vue.config.productionTip = false;
require('@/assets/js/winVars.js');


new Vue({
  router,
  render: h => h(App),
  mounted() {
    // this.$router.push("/");
  }
}).$mount("#app");

