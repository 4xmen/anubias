<template>
  <div>
    <div class="ui menu inverted">
      <div class="header item">
        Anbuias
      </div>
      <div class="ui dropdown item">
        Project
        <i class="dropdown icon"></i>
        <div class="menu">
          <a class="item"><i class="add icon"></i> New project</a>
          <a class="item" @click="openProject"><i class="file icon"></i> Open project</a>
          <a class="item" @click="save"><i class="save icon"></i> Save project</a>
          <a class="item" @click="saveAs"><i class="save icon outline"></i> Save project as</a>
          <div class="divider"></div>
          <router-link to="/project" class="item"><i class="setting icon"></i> Project info</router-link>
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