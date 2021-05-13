<template>
  <div id="app">
<!--    <img alt="Vue logo" src="./assets/logo.png">-->
<!--    <main-page></main-page>-->
    <router-view />
  </div>
</template>

<script>
// import mainPage from './components/pages/MainAppPage';
//
require('vazir-font/dist/font-face.css')
require('@fortawesome/fontawesome-free/css/all.min.css')
require('semantic-ui-css/semantic.min.css');
require('material-icons/iconfont/material-icons.css');
require('alertifyjs/build/css/alertify.min.css');
require('alertifyjs/build/css/themes/semantic.min.css');
require('./assets/css/style.css');

export default {
  name: 'App',
  components: {
    // mainPage
  },mounted() {
    window.api.receive("message", (data) => {
      switch (data.type) {
        case 'warning':
          window.alertify.warning(data.msg);
          break;
        case 'error':
          window.alertify.error(data.msg);
          break;
        case 'success':
          window.alertify.success(data.msg);
          break;
        default:
          window.alertify.message(data.msg);
      }
    });
  }
}
</script>

<style>

</style>
