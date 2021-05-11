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
require('./assets/css/style.css');

export default {
  name: 'App',
  components: {
    // mainPage
  },mounted() {
  }
}
</script>

<style>

</style>
