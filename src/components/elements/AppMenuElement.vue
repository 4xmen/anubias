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
          <router-link to="/project" class="item"><i class="setting icon"></i> Project info</router-link>
          <a class="item" @click="save"><i class="save icon"></i> Save project</a>
          <a class="item" @click="saveAs"><i class="save icon outline"></i> Save project as</a>
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
  }, methods: {
    save: function () {
      if (window.project.file === '') {
        this.saveAs();
        return false;
      }
    },
    saveAs: function () {
      var data = {
        dialog: {
          title: 'Save project as',
          filters: [{name: 'Anubias project', extensions: ['anb']},
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