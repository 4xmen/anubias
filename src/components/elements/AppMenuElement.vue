<template>
  <div>
    <div class="ui menu inverted">
      <div class="header item">
        <img src="../../assets/img/logo.svg" alt="">
      </div>
      <div class="ui dropdown item">
        Project
        <i class="dropdown icon"></i>
        <div class="menu">
          <a class="item" @click="newProject"><i class="add icon"></i> New project</a>
          <a class="item" @click="openProject"><i class="file icon"></i> Open project</a>
          <a :class="'item'+(appData.project.name ===''?' disabled':'')" @click="save"><i class="save icon"></i> Save project</a>
          <a :class="'item'+(appData.project.name ===''?' disabled':'')" @click="saveAs"><i class="save icon outline"></i> Save project as</a>
          <div class="divider"></div>
          <router-link to="/project" :class="'item'+(appData.project.name ===''?' disabled':'')"><i class="setting icon"></i> Project info</router-link>
        </div>
      </div>
      <!--      <a class="item"> -->
      <!--        Jobs-->
      <!--      </a>-->
      <!--      <a class="item">-->
      <!--        Locations-->
      <!--      </a>-->
    </div>
  </div>
</template>

<script>
/*eslint-disable */
/*eslint-enable */
export default {
  name: "AppMenuElement",
  data:function () {
    return{
      appData: window.appData
    }
  },
  mounted() {
    var $ = window.jQuery;
    $('.ui.dropdown').dropdown();
    window.api.receive('selected-file', (data) => {
      window.project.file = data.file;
      window.project.folder = data.project;
      window.project.isSave = true;
      window.appData = data.data;
      window.alertify.success('Project loaded :' + data.basename);
    });
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
    newProject:function () {
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
          color: 'Colors.blue',
          textColor: '',
          bgColor: '',
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

</style>