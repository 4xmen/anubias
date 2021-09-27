<!--the main menu of ide-->
<template>
  <div class="navbar-fixed">
    <ul id="dropdown1" class="dropdown-content grey darken-3">
      <li>
        <a @click="newProject">
          <i class="fa fa-plus"></i>
          New project
          <span class="shortcut">
            Ctrl+N
          </span>
        </a>
      </li>
      <li>
        <a @click="openProject">
          <span v-if="!isOnline">
          <i class="fa fa-folder-open"></i>
            Open project
          </span>
          <span v-else>
            <i class="fa fa-upload"></i>
            Upload project
          </span>
          <span class="shortcut">
            Ctrl+O
          </span>
        </a>
      </li>
      <li :class="(cantEditPrj?' disabled':'')">
        <a @click="save">
          <span v-if="!isOnline">
          <i class="fa fa-save"></i>
          Save project
          </span>
          <span v-else>
            <i class="fa fa-download"></i>
            Download Project
          </span>
          <span class="shortcut">
            Ctrl+S
          </span>
        </a>
      </li>
      <li v-if="!isOnline" :class="(cantEditPrj?' disabled':'')">
        <a @click="saveAs">

          <i class="fa fa-save"></i>
          Save project as
        </a>
      </li>
      <li :class="(cantEditPrj?' disabled':'')">
        <a @click="closeProject">
          <i class="fa fa-times"></i>
          Close project
          <span class="shortcut">
            Ctrl+Shit+W
          </span>
        </a>
      </li>
    </ul>
    <ul id="dropdown2" class="dropdown-content grey darken-3">
      <li :class="(cantEditPrj?' disabled':'')">
        <router-link :to="cantEditPrj?'':'/project'">
          <i class="fa fa-cog"></i>
          Project info
        </router-link>
      </li>
      <li v-if="!isOnline" :class="(cantEditPrj?' disabled':'')">
        <a @click="debug">
          <i class="fa fa-bug"></i>
          Debug
          <span class="shortcut">
            F9
          </span>
        </a>
      </li>
      <li v-if="!isOnline" :class="(cantEditPrj?' disabled':'')">
        <a @click="debugWeb">
          <i class="fa fa-bug"></i>
          Debug Web (PWA)
          <span class="shortcut">
            Alt+F9
          </span>
        </a>
      </li>
      <li v-if="!isOnline" :class="(cantEditPrj?' disabled':'')">
        <a @click="build">
          <i class="fa fa-hammer"></i>
          Build
          <span class="shortcut">
            Ctrl+F9
          </span>
        </a>
      </li>
      <li v-if="!isOnline" @click="hotReload" :class="(!startDebug?' disabled':'')">
        <a>
          <i class="fa fa-fire"></i>
          Hot reload
          <span class="shortcut">
            Ctrl+R
          </span>
        </a>
      </li>
      <li @click="onlineBuild" :class="(cantEditPrj?' disabled':'')">
        <a>
          <i class="fa fa-cloud"></i>
          Online Build
          <span class="shortcut">
            Ctrl+Shift+B
          </span>
        </a>
      </li>
    </ul>
    <ul id="dropdown3" class="dropdown-content grey darken-3">
      <!--      <li @click="test">-->
      <!--        <a>-->
      <!--          <i class="fa fa-eye"></i>-->
      <!--          EngineTest-->
      <!--          <span class="shortcut">-->
      <!--            Ctrl+Shift+F9-->
      <!--          </span>-->
      <!--        </a>-->
      <!--      </li>-->
      <li v-if="!isOnline" @click="startEmulator">
        <a>
          <i class="fa fa-mobile"></i>
          Emulator & Check
          <!--          <span class="shortcut">-->
          <!--            Ctrl+Shift+S-->
          <!--          </span>-->
        </a>
      </li>
      <li v-if="!isOnline" @click="showSetting">
        <a>
          <i class="fa fa-cogs"></i>
          Setting
          <span class="shortcut">
            Ctrl+Shift+S
          </span>
        </a>
      </li>
      <li @click="devTools">
        <a>
          <i class="fa fa-eye-dropper"></i>
          DevTools
          <span class="shortcut">
            Ctrl+Shift+I
          </span>
        </a>
      </li>
    </ul>
    <nav class="top-nav">
      <div class="nav-wrapper grey darken-4">
        <ul class="left">
          <li class="logo active" @click="openSite('https://anubias.app')">
            <a><img src="@/assets/img/logo.svg" alt=""></a>
          </li>
          <li>
            <a class="dropdown-trigger" href="#!" data-target="dropdown1">
              File <i class="material-icons right">arrow_drop_down</i>
            </a>
          </li>
          <li>
            <a class="dropdown-trigger" href="#!" data-target="dropdown2">
              Project <i class="material-icons right">arrow_drop_down</i>
            </a>
          </li>
          <li>
            <a class="dropdown-trigger" href="#!" data-target="dropdown3">
              Application <i class="material-icons right">arrow_drop_down</i>
            </a>
          </li>
          <!--          <li><a href="badges.html">Components</a></li>-->
          <!--          <li><a href="collapsible.html">JavaScript</a></li>-->
          <li v-if="id != null || download != null" class="">
            <span v-if="download == null">
            Online compile: {{ compileStatus }}  <span class="fa fa-spinner fa-spin"></span>
            </span>
            <a v-else @click="openSite(download)">
              <span class="fa fa-download"></span>
              Download APK &nbsp; <i class="fa fa-smile"></i>
            </a>

          </li>
        </ul>
        <ul id="nav-mobile" class="right">
          <li>
            <router-link to="/about">About</router-link>
          </li>
        </ul>
      </div>
    </nav>
    <input type="file" style="display: none" ref="dialog" accept=".anb"/>
  </div>
</template>

<script>
/*eslint-disable */
/*eslint-enable */
import {fnc} from '@/assets/js/functions';
import axios from 'axios';
import https from 'https';

export default {
  name: "AppMenuElement",
  data: function () {
    return {
      appData: window.appData,
      startDebug: window.ide.isDebuging,
      isOnline: window.ide.isOnline,
      id: null,
      compileStatus: 'Uploading',
      download: null,
      isOnlineCompile: false,
    }
  },
  mounted() {
    var $ = window.jQuery;
    $(".dropdown-trigger").dropdown();
    var self = this;
    setInterval(function () {
      if (self.id != null && self.id != -1) {
        const agent = new https.Agent({
          rejectUnauthorized: false,
        });
        let url = 'https://build.anubias.app/api/status/'
        if (window.ide.settings.proxy) {
          url = 'http://78.141.225.223/api/status/';
        }
        axios({
          baseURL: url + self.id,
          method: 'get',
          config: {

            maxRedirects: 0,
            httpsAgent: agent,
            headers: {
              'Content-Type': 'multipart/form-data',
            }
          }
        }) // http://build.anubias.app/api/compile
            .then(function (e) {
              // console.log('SUCCESS!!', e);
              console.log(e.data);
              self.compileStatus = e.data.status;
              if (self.compileStatus == 'SUCCESSFUL') {
                self.download = e.data.download;
                self.id = null;
                self.isOnlineCompile = false;

                var n = self;
                do {
                  n = n.$parent;
                } while (n.currentProperties === undefined);
                n.download = self.download;
                n.showDownloadModal = true;
                window.alertify.success('Congratulation, Download your app,. Look at menu :) ');
              } else if (self.compileStatus === 'FAIL') {
                window.alertify.error('Sorry, Compile failed :(');
                self.id = null;
                self.isOnlineCompile = false;
              }
            }).catch(function (e) {
            window.alertify.error(e.message);
        });
      }
    }, 3000);

    $(document).unbind('keyup.mainMenuShortcut').bind('keyup.mainMenuShortcut', function (e) {
      if (e.ctrlKey && e.shiftKey && e.key === 'S') {
        self.showSetting();
        return;
      }
      if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        self.devTools();
        return;
      }
      if (e.ctrlKey && e.shiftKey && e.key === 'B') {
        self.onlineBuild();
        return;
      }
      if (e.ctrlKey && e.key === 's') {
        self.save();
        return;
      }
      if (e.ctrlKey && e.key === 'n') {
        self.newProject();
        return;
      }
      if (e.ctrlKey && e.shiftKey && e.key === 'F9') {
        self.test();
        return;
      }
      if (e.ctrlKey && e.key === 'F9') {
        self.build();
        return;
      }
      if (e.altKey && e.key === 'F9') {
        self.debugWeb();
        return;
      }
      if (e.ctrlKey && e.key === 'r') {
        self.hotReload();
        return;
      }
      if (e.ctrlKey && e.shiftKey && e.key === 'W') {
        self.closeProject();
        return;
      }
      if (e.key === 'F9') {
        self.debug();
        return;
      }
      if (e.ctrlKey && e.key === 'o') {
        self.openProject();
        return;
      }


    });

  }, methods: {
    closeProject: function () {
      if (this.cantEditPrj || this.isOnline) {
        return false;
      }
      window.project = {
        folder: '',
        file: '',
        isSave: false,
      };
      window.appData = fnc.clone(window.sample);
      window.appData.pages.push(fnc.clone(window.defaults.page));
      window.appData.pages[0].name += '1';
      this.$router.go(this.$router.currentRoute);
    },
    devTools: function () {
      window.api.send("devtools", "");
    },
    openSite: function (web) {
      window.api.send("openWeb", web);
    },
    onlineBuild: function () {

      if (this.isOnlineCompile) {
        window.alertify.warning('You must wait to compile complete, then try again.');
        return false;
      }
      document.querySelector("#preloader").style.display = 'flex';
      this.compileStatus = 'Uploading';
      this.id = '-1';
      window.alertify.message('Online compile started, Please wait a few moments. Look at menu :) ');
      this.download = null;
      this.isOnlineCompile = true;
      var self = this;
      let blob = new Blob([JSON.stringify(window.appData)], {type: 'text/json;charset=utf-8'});
      let formData = new FormData();
      formData.append('anubias_file', blob, 'anubias_file.anb');

      const agent = new https.Agent({
        rejectUnauthorized: false,
      });

      let url = 'https://build.anubias.app/api/compile'
      var timeout = 60000;
      if (window.ide.settings.proxy) {
        url = 'https://anubias.4xmen.ir/?compile';
        timeout *= 2;
      }
      axios({
        baseURL: url,
        // baseURL: '',
        method: 'post',
        data: formData,
        timeout: timeout,
        config: {
          maxRedirects: 0,
          httpsAgent: agent,
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }
      }) // http://build.anubias.app/api/compile
          .then(function (e) {
            document.querySelector("#preloader").style.display = 'none';
            // console.log('SUCCESS!!', e);
            self.id = e.data.request_id;
          }).catch(function (e) {
        window.alertify.error(e.message);
        if (e.message === 'Network Error' && !window.ide.settings.proxy){
          window.alertify.warning('Maybe your ip blocked and need to use proxy setting (Open setting and active proxy)',30);
        }
        self.id = null;
        self.isOnlineCompile = false;
        document.querySelector("#preloader").style.display = 'none';
      });
    },
    hotReload: function () {
      if (!this.startDebug) {
        window.alertify.warning('Hot reload failed');
      } else {
        this.save();
        let data = {
          isUpdate: true,
          command: './' + this.engineName + ' -b ' + window.project.file,
        }
        window.api.send("command", data);
      }

    }
    ,
    showSetting: function () {
      this.$router.push('/setting');
    }
    ,
    startEmulator: function () {
      if (window.appData.project.name == '' || (window.project.isSave && window.appData.project.name != '')) {
        this.$router.push('/emulator');
        return;
      }
      let self = this;
      window.alertify.confirm('Are you sure to leave page if you not saved, all data has been lose?',
          'Remove confirm', function () {
            self.$router.push('/emulator');
          }
          , function () {

          });
    }
    ,
    test: function () {
      this.$parent.TerminalShow();
      let data = {
        command: './' + this.engineName,
      }
      window.api.send("command", data);
    }
    ,
    debug: function () {
      if (this.cantEditPrj || this.isOnline) {
        return false;
      }
      this.$parent.TerminalShow();
      this.startDebug = true;
      window.ide.isDebuging = true;
      let data = {
        isDebug: true,
        command: './' + this.engineName + ' -b ' + window.project.file + ' && cd ' + window.project.folder + '/src && flutter run',
      }
      window.api.send("command", data);
    }
    ,
    debugWeb: function () {
      if (this.cantEditPrj || this.isOnline) {
        return false;
      }
      this.$parent.TerminalShow();
      this.startDebug = true;
      window.ide.isDebuging = true;
      let data = {
        isDebug: true,
        command: './' + this.engineName + ' -b ' + window.project.file + ' && cd ' + window.project.folder + '/src && flutter run -d chrome',
      }
      window.api.send("command", data);
    }
    ,
    build: function () {
      if (this.cantEditPrj || this.isOnline) {
        return false;
      }
      this.$parent.TerminalShow();
      this.startDebug = true;
      window.ide.isDebuging = true;
      let data = {
        isDebug: false,
        command: './' + this.engineName + ' -b ' + window.project.file + ' && cd ' + window.project.folder + '/src && flutter build apk',
      }
      window.api.send("command", data);
    }
    ,
    save: function () {

      // check can edit project
      if (this.cantEditPrj) {
        return false;
      }

      if (this.isOnline) {
        // download project
        fnc.downloadObjectAsJson(window.appData,
            window.appData.project.name.split(' ').join('-'));
        return true;
      }
      // if not saved yet run save as auto
      if (window.project.file === '') {
        this.saveAs();
        return false;
      }
      // otherwise try to save
      window.appData.version = window.ide.version();
      var data = {
        project: window.project,
        data: window.appData
      };
      window.api.send("save-project", data);
    }
    ,
    openProject: function () {
      var self = this;
      if (this.isOnline) {
        // open file
        this.$refs.dialog.click();
        this.$refs.dialog.onchange = function () {
          if (this.files[0] != undefined) {
            let file = this.files[0];
            if (file) {
              let reader = new FileReader();
              reader.readAsText(file, "UTF-8");
              reader.onload = function (e) {
                try {
                  let json = JSON.parse(e.target.result);
                  window.appData = json;
                  window.alertify.success('Project loaded :' + json.project.name);
                  // go to verify
                  self.$router.push('/projectLoaded');
                } catch (e) {
                  window.alertify.error("Error to parse anb file");
                }

              }
              reader.onerror = function () {
                window.alertify.error("Error reading file");
              }
            }
          }
        };
      } else {
        window.api.send("open-file-dialog-project", {});
      }
    }
    ,
    newProject: function () {

      // prepare new empty project
      window.project = {
        folder: '',
        file: '',
        isSave: false,
      };
      window.appData = fnc.clone(window.sample);
      window.appData.pages.push(fnc.clone(window.defaults.page));
      window.appData.pages[0].name += '1';
      this.$router.push('/project');
    }
    ,
    saveAs: function () {
      // check can edit project
      if (this.cantEditPrj) {
        return false;
      }

      window.appData.version = window.ide.version();
      // prepare save dialog and appDate to save as
      var data = {
        dialog: {
          title: 'Save project as',
          filters: [{name: 'Anubias project', extensions: ['anb']},
            {name: 'All Files', extensions: ['*']}
          ],
          // properties: {showOverwriteConfirmation: true,}
        },
        data: window.appData
      };
      window.api.send("save-as-file-project", data);
    }
  }
  ,
  computed: {
    cantEditPrj: function () {
      return this.appData.project.name === '';
    }
    ,
    engineName: function () {
      switch (fnc.getOS()) {
        case "Linux":
          return 'anubias-engine';
        case "Windows":
          return 'anubias-engine.exe';
        case "Osx":
          return 'anubias-engine-osx';
        default:
          return 'anubias-engine';
      }
    }
  }
}
</script>

<style scoped>
/*-995px width*/
/*@media ( max-width: 995px ) {*/
/*  .top-nav {*/
/*    display: none;*/
/*  }*/
/*}*/

.fa-spin, .fa-download, .fa-smile {
  margin: 0 8px;
  display: inline-block;
}

#nav {
  top: 33px;
  left: 0;
  right: 0;
  position: fixed;
}

nav, nav .nav-wrapper i, nav > a.sidenav-trigger, nav > a.sidenav-trigger i {
  height: 40px;
  line-height: 40px;
}

.dropdown-content {
  min-width: 270px !important;
}

.nav-wrapper img {
  width: 25px;
  margin-top: 7px;
  margin-bottom: -7px;
}

nav .fa {
  margin-top: -10px;
  margin-bottom: 0;
  margin-right: 5px;
  font-size: 15px;
}

.nav-wrapper li {
  border-right: 1px rgba(0, 0, 0, 0.2) solid;
}

.shortcut {
  float: right;
  color: darkgray;
  font-size: 85%;
  padding-top: 2px;
}

</style>