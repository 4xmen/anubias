<template>
  <div id="app">
    <div class="title-bar">
      <div class="controls">
        <div class="circle red" @click="closeApp"> <i class="fa fa-times"></i>  </div>
        <div class="circle yellow darken-2" @click="maxApp"> <i class="fa fa-expand-alt"></i> </div>
        <div class="circle green lighten-2" @click="minApp"> <i class="fa fa-minus"></i> </div>
      </div>
      <div class="movable">
        Anubias
      <span v-if="title.length > 0"> -</span>
      {{title}}
      <span v-if="!isSaved">*</span>
      </div>
    </div>
    <router-view/>
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
require('vue-context/dist/css/vue-context.css');
require('./assets/css/style.css');

export default {
  name: 'App',
  data: function () {
    return {
      title: '',
      isSaved: false,
    }
  },
  methods: {
    closeApp: function () {
      window.api.send('app-close', window.appData);
    },
    maxApp: function () {
      window.api.send('app-max', window.appData);
    },
    minApp: function () {
      window.api.send('app-min', window.appData);
      // console.log(this.prj.name);
    }
  },
  components: {
    // mainPage
  }, mounted() {
    var self = this;
    // load opened file receive command
    window.api.receive('selected-file', (data) => {
      // load data
      window.project.file = data.file;
      window.project.folder = data.folder;
      window.project.isSave = true;
      window.appData = data.data;
      window.alertify.success('Project loaded :' + data.basename);
      // go to verify
      self.$router.push('/projectLoaded');
    });

    window.api.receive('build-success', (data) => {
      if (data && window.ide.isDebuging) {
        window.alertify.success('Hot reload! 🔥');
        window.api.send("update-project", {});
      }
    });

    // get message receive command send by electron
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
          if (data.save){
            self.isSaved = true;
          }
          break;
        default:
          window.alertify.message(data.msg);
      }
    });
  }
}
</script>

<style>
#app {
  padding-top: 31px;
}


.title-bar {
  text-align: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  background: #21252b;
}

.title-bar .controls {
  float: left;
  padding: 5px;

}
.title-bar .movable{
  -webkit-user-select: none;
  -webkit-app-region: drag;
  display: inline-block;
  width: calc(100% - 90px);
  padding: 5px;
}

.title-bar .circle{
  width: 14px ;
  height: 14px;
  margin-left: 7px;
  margin-right: 3px;
  background: red;
  display: inline-block;
  margin-top: 3px;
  position: relative;
}

.title-bar .circle i{
  color: #333;
  opacity: 0;
  transition: 500ms;
  position: absolute;
  top: 2px;
  left: 3px;
  font-size: 9px;
}

.title-bar .circle:first-child i{
  left: 4px;
}
.title-bar .circle:hover i{
  opacity: 1;
}
</style>
