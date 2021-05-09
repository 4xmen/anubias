<template>
  <div id="app">
<!--    <img alt="Vue logo" src="./assets/logo.png">-->
    <main-page></main-page>
  </div>
</template>

<script>
import mainPage from './components/pages/MainAppPage';
require('vazir-font/dist/font-face.css')
require('@fortawesome/fontawesome-free/css/all.min.css')

export default {
  name: 'App',
  components: {
    mainPage
  }
}
</script>

<style>
*{
  padding: 0;
  margin: 0;
  border-spacing: 0;
}
body{
  background: #272c34;
  color: #eeeeee;
  font-family: Vazir,tahoma ,serif;
  padding-bottom: 15%;
  overflow-x: hidden;
}
</style>
