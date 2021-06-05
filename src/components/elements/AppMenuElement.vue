<!--the main menu of ide-->
<template>
  <div>
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
          <i class="fa fa-folder-open"></i>
          Open project
          <span class="shortcut">
            Ctrl+O
          </span>
        </a>
      </li>
      <li :class="(cantEditPrj?' disabled':'')">
        <a @click="save">
          <i class="fa fa-save"></i>
          Save project
          <span class="shortcut">
            Ctrl+S
          </span>
        </a>
      </li>
      <li :class="(cantEditPrj?' disabled':'')">
        <a @click="saveAs">
          <i class="fa fa-save"></i>
          Save project as
        </a>
      </li>
      <li class="divider"></li>
      <li :class="(cantEditPrj?' disabled':'')">
        <router-link :to="cantEditPrj?'':'/project'">
          <i class="fa fa-cog"></i>
          Project info
        </router-link>
      </li>
      <li>
        <a>
          <i class="fa fa-bug"></i>
          Debug
          <span class="shortcut">
            F9
          </span>
        </a>
      </li>
      <li>
        <a>
          <i class="fa fa-hammer"></i>
          Build
          <span class="shortcut">
            Ctrl+F9
          </span>
        </a>
      </li>
    </ul>
    <ul  id="dropdown2" class="dropdown-content grey darken-3">
<!--      <li>-->
<!--        <a>-->
<!--          <i class="fa fa-bug"></i>-->
<!--          Debug-->
<!--        </a>-->
<!--      </li>-->
<!--      <li>-->
<!--        <a>-->
<!--          <i class="fa fa-hammer"></i>-->
<!--          Build-->
<!--        </a>-->
<!--      </li>-->
    </ul>
    <nav class="top-nav">
      <div class="nav-wrapper grey darken-4">
        <ul class="left">
          <li class="logo active">
            <a><img src="../../assets/img/logo.svg" alt=""></a>
          </li>
          <li>
            <a class="dropdown-trigger" href="#!" data-target="dropdown1">
              Project <i class="material-icons right">arrow_drop_down</i>
            </a>
          </li>
          <li>
            <a class="dropdown-trigger" href="#!" data-target="dropdown2">
              Application <i class="material-icons right">arrow_drop_down</i>
            </a>
          </li>
          <!--          <li><a href="badges.html">Components</a></li>-->
          <!--          <li><a href="collapsible.html">JavaScript</a></li>-->
        </ul>
        <ul id="nav-mobile" class="right">
          <li><router-link to="/about">About</router-link></li>
        </ul>
      </div>
    </nav>
  </div>
</template>

<script>
/*eslint-disable */
/*eslint-enable */
import {fnc} from '@/assets/js/functions';

export default {
  name: "AppMenuElement",
  data: function () {
    return {
      appData: window.appData
    }
  },
  mounted() {
    var $ = window.jQuery;
    $(".dropdown-trigger").dropdown();
    var self = this;

    $(document).on('keyup', function (e) {
      if (e.ctrlKey && e.key === 's'){
        self.save();
      }
      if (e.ctrlKey && e.key === 'n'){
        self.newProject();
      }
      if (e.ctrlKey && e.key === 'o'){
        self.openProject();
      }

    });

  }, methods: {
    save: function () {
      // check can edit project
      if (this.cantEditPrj) {
        return false;
      }
      // if not saved yet run save as auto
      if (window.project.file === '') {
        this.saveAs();
        return false;
      }
      // otherwise try to save
      window.appData.version =  window.ide.version();
      var data = {
        project: window.project,
        data: window.appData
      };
      window.api.send("save-project", data);
    },
    openProject: function () {
      window.api.send("open-file-dialog-project", {});
    },
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
    },
    saveAs: function () {
      // check can edit project
      if (this.cantEditPrj) {
        return false;
      }

      window.appData.version =  window.ide.version();
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
  }, computed: {
    cantEditPrj: function () {
      return this.appData.project.name === '';
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

nav, nav .nav-wrapper i, nav > a.sidenav-trigger, nav > a.sidenav-trigger i {
  height: 40px;
  line-height: 40px;
}

.dropdown-content {
  min-width: 230px !important;
}

.nav-wrapper img {
  width: 45px;
  margin-bottom: -15px;
  margin-top: -5px;
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