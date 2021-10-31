<template>
  <div id="app">
    <div class="title-bar">
      <div class="controls" v-if="!isOnline">
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
    <div id="dropable" ref="dropable"></div>
    <div id="router" ref="appRouter" @dragstart="dragStart" @dragover="dragOver" @dragend="dragEnd" @drop="drop">
      <router-view/>
    </div>
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
import {fnc} from '@/assets/js/functions';

let array_move = function(arr, old_index, new_index) {
  if (new_index >= arr.length) {
    var k = new_index - arr.length + 1;
    while (k--) {
      arr.push(undefined);
    }
  }
  arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
  return arr; // for testing
};

var closeDrag;
export default {
  name: 'App',
  data: function () {
    return {
      title: '',
      isSaved: false,
      isOnline : window.ide.isOnline,
      isInternalDrag: false,
    }
  },
  methods: {
    dragStart:function () {
      this.isInternalDrag = true;
    },
    dropLeave:function () {
      this.$refs.dropable.style.display = 'none';
    },
    dragEnd:function () {
      this.isInternalDrag = false;
    },
    dragOver:function () {
      if (!this.isInternalDrag){
        this.$refs.dropable.style.opacity = 1;
        this.$refs.appRouter.classList.add('blur');
        let self = this;
        clearTimeout(closeDrag);
        closeDrag = setTimeout(function () {
          self.$refs.dropable.style.opacity = 0;
          self.$refs.appRouter.classList.remove('blur');
        },1000);
      }
    },
    drop:function (e) {
      // console.log('drop');
      e.preventDefault();
      var self = this;
      // console.log(e.dataTransfer.files);
      let files = e.dataTransfer.files;
      if (files[0] !== undefined){
        //
        let f = files[0];
        // console.log();
        let extChecker = f.name.split('.');
        if (extChecker[extChecker.length-1] == 'anb'){
          let reader = new FileReader();
          reader.readAsText(f, "UTF-8");
          reader.onload = function (e) {
            try {
              let json = JSON.parse(e.target.result);
              window.appData = json;
              window.project.file = f.path;
              window.project.folder = f.path.substr(0,f.path.length - f.name) ;
              window.alertify.success('Project loaded :' + json.project.name);
              // go to verify
              self.$router.push('/projectLoaded');
            } catch(e) {
              window.alertify.error("Error to parse anb file");
            }

          }
          reader.onerror = function () {
            window.alertify.error("Error reading file");
          }
        }else{
          window.alertify.error('Invalid file type :(');
        }
      }
    },
    closeApp: function () {
      if (this.title.length == 0 || !window.ide.settings.exitConfirm){
        window.api.send('app-close', window.appData);
      }
      if (this.isSaved && this.title.length > 0){
        window.api.send('app-close', window.appData);
      }else{
        window.alertify.confirm('The project not saved ,Are you sure to ?', 'Close confirm', function () {
          window.api.send('app-close', window.appData);
        },function () {

        });
      }
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
    document.body.addEventListener("dragover", evt => {
      evt.preventDefault();
    });

    document.addEventListener('keyup',function (e) {
      if (e.key == 'Escape'){
        try {
          if (self.$router.history.current.name != 'home'){
            self.$router.go(-1);
          }
        } catch(e) {
          // console.log('');
          console.log(e.message);
        }

      }
    })

    window.api.send('storage-get', 'setting');
    // load opened file receive command
    window.api.receive('selected-file', (data) => {
      // load data
      window.project.file = data.file;
      window.project.folder = data.folder;
      window.project.isSave = true;
      window.appData = data.data;
      window.alertify.success('Project loaded :' + data.basename);

      let inx = window.ide.settings.recents.indexOf(window.project.file);
      if (inx === -1){
        window.ide.settings.recents.unshift(window.project.file);
        if (window.ide.settings.recents.length > 5){
          window.ide.settings.recents.pop();
        }
      }else{
          window.ide.settings.recents = array_move(window.ide.settings.recents,inx,0);
      }
      let  datas = {key: 'setting', value: window.ide.settings, silent: true};
      window.api.send('storage-set', datas );

      // go to verify
      self.$router.push('/projectLoaded');
    });

    window.api.receive("storage-back", (data) => {
      if (data.key == 'setting') {
        delete data.key ;
        data = fnc.fixSetting(data);

        window.ide.settings = data;
      }
    });

    window.api.receive('build-success', (data) => {
      if (data && window.ide.isDebuging) {
        window.alertify.success('Hot reload! 🔥');
        window.api.send("update-project", {});
      }
    });

    window.api.receive("app-exit", () => {
        self.closeApp();
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
  },watch:{
    isSaved: function (e) {
      window.project.isSave = e;
    },
  }
}
</script>

<style>
#app {
  padding-top: 31px;
}

#router{
  transition: 300ms;
}

#dropable{
  position: fixed;
  left: 0;
  right: 0;
  top: 31px;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  z-index: 99999;
  align-items: center;
  justify-content: center;
  display: flex;
  opacity: 0;
  transition: 1s;
  pointer-events: none;
}

#dropable:after{
  position: fixed;
  font-size: 45px;
  content: 'You can drop project here';
  text-align: center;
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
  width: calc(100% - 155px);
  padding: 5px;
  position: relative;
  right: 40px;
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
