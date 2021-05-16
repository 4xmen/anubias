import Vue from 'vue';
import App from './App.vue';
import router from "./router";
/*eslint-disable */
import  "script-loader!jquery";
import  "script-loader!jquery.nicescroll/dist/jquery.nicescroll.min";
import  "script-loader!alertifyjs/build/alertify.min";
import  "script-loader!materialize-css/dist/js/materialize.min";
// import  "script-loader!./assets/js/functions";

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

