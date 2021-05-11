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
          <router-link to="/project" class="item"><i class="setting icon"></i> Project info</router-link>
          <a class="item"><i class="globe icon"></i> Choose Language</a>
          <a class="item"><i class="settings icon"></i> Account Settings</a>
        </div>
      </div>
      <a class="item">
        Jobs
      </a>
      <a class="item">
        Locations
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: "AppMenuElement",
  mounted() {
    var $ = window.jQuery;
    $('.ui.dropdown').dropdown();
  }
}
</script>

<style scoped>

</style>