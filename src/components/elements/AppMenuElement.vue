<template>
  <div>
    <ul id="dropdown1" class="dropdown-content grey darken-3">
      <li>
        <a @click="newProject">
          <i class="fa fa-plus"></i>
          New project
        </a>
      </li>
      <li>
        <a @click="openProject">
          <i class="fa fa-folder-open"></i>
          Open project
        </a>
      </li>
      <li>
        <a :class="'item'+(appData.project.name ===''?' disabled':'')" @click="save">
          <i class="fa fa-save"></i>
          Save project
        </a>
      </li>
      <li>
        <a :class="'item'+(appData.project.name ===''?' disabled':'')" @click="saveAs">
          <i class="fa fa-save"></i>
          Save project as
        </a>
      </li>
      <li class="divider"></li>
      <li>
        <router-link to="/project" :class="'item'+(appData.project.name ===''?' disabled':'')">
          <i class="fa fa-cog"></i>
          Project info
        </router-link>
      </li>
    </ul>
    <nav class="top-nav">
      <div class="nav-wrapper grey darken-4">
        <ul class="left hide-on-med-and-down">
          <li class="logo active"><a><img src="../../assets/img/logo.svg" alt=""></a></li>
          <li><a class="dropdown-trigger" href="#!" data-target="dropdown1">Project<i class="material-icons right">arrow_drop_down</i></a>
          <li><a>About</a></li>
          <!--          <li><a href="badges.html">Components</a></li>-->
          <!--          <li><a href="collapsible.html">JavaScript</a></li>-->
        </ul>
      </div>
    </nav>
  </div>
</template>

<script>
/*eslint-disable */
/*eslint-enable */
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
  }, methods: {
    save: function () {
      if (window.project.file === '') {
        this.saveAs();
        return false;
      }
    },
    openProject: function () {
      window.api.send("open-file-dialog-project", {});
    },
    newProject: function () {
      window.project = {
        'folder': '',
        'file': '',
        isSave: false,
      };
      window.appData = {
        project: {
          name: 'sample project',
          version: '1.0.0',
          isDark: false,
          isRTL: false,
          xColor: 'Colors.green',
          textColor: '#000000',
          bgColor: '#ffffff',
        },
        pages: []
      };
      this.$router.push('/project');
    },
    saveAs: function () {
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
      window.api.send("save-file-project", data);
    }
  }
}
</script>

<style scoped>
/*-995px width*/
@media ( max-width: 995px ) {
  .top-nav {
    display: none;
  }
}

nav, nav .nav-wrapper i, nav > a.sidenav-trigger, nav > a.sidenav-trigger i {
  height: 40px;
  line-height: 40px;
}

#dropdown1 {
  width: 200px !important;
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
.nav-wrapper li{
  border-right: 1px rgba(0,0,0,0.2) solid;
}
</style>