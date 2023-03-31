<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script>
import {ipcRenderer} from 'electron';
export default {
  name: "app",
  mounted() {
    ipcRenderer.send('app-started')
  }
}
</script>

<style scoped>

</style>