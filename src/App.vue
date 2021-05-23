<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
// add css file to project
require('vazir-font/dist/font-face.css')
require('@fortawesome/fontawesome-free/css/all.min.css')
require('material-icons/iconfont/material-icons.css');
require('materialize-css/dist/css/materialize.min.css');
require('alertifyjs/build/css/alertify.min.css');
require('flickity/dist/flickity.min.css');
require('./assets/css/style.css');

export default {
  name: 'App',
  components: {
    // mainPage
  },mounted() {
    var self = this;
    // load opened file receive command
    window.api.receive('selected-file', (data) => {
      // load data
      window.project.file = data.file;
      window.project.folder = data.project;
      window.project.isSave = true;
      window.appData = data.data;
      window.alertify.success('Project loaded :' + data.basename);
      // go to verify
      self.$router.push('/projectLoaded');
    });
    // get message receive command send by electron
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
