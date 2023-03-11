<template>
  <div id="app">
    <div id="tabs">
      tabs
    </div>
    <div id="content">
      content
    </div>
    <div id="components">
      components
    </div>
    <div id="properties">
      proprties
    </div>
    <div id="pages">
      pages
    </div>
  </div>
</template>

<script>
import {mapActions} from 'vuex'

export default {
  name: "Anubias",
  mounted() {
    this.setIdeTitle('Anubias');
  }, methods: {
    ...mapActions(['setIdeTitle']),
  }
}
</script>

<style scoped>

</style>