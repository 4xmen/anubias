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
require('material-icons/iconfont/material-icons.css');
require('materialize-css/dist/css/materialize.min.css');
require('alertifyjs/build/css/alertify.min.css');
require('./assets/css/style.css');

export default {
  name: 'App',
  components: {
    // mainPage
  },mounted() {
    var self = this;
    window.api.receive('selected-file', (data) => {
      window.project.file = data.file;
      window.project.folder = data.project;
      window.project.isSave = true;
      self.$router.push('/projectLoaded');
      window.appData = data.data;
      window.alertify.success('Project loaded :' + data.basename);
    });
    window.api.receive("message", (data) => {
      switch (data.type) {
        case 'warning':
          window.alertify.warning(data.msg,10);
          break;
        case 'error':
          window.alertify.error(data.msg,10);
          break;
        case 'success':
          window.alertify.success(data.msg,10);
          break;
        default:
          window.alertify.message(data.msg,10);
      }
    });
  }
}
</script>

<style>
  #app{
  }
</style>
