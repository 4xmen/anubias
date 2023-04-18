<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script>
import {ipcRenderer} from 'electron';
import {useToast} from "vue-toastification";

export default {
  name: "app",
  mounted() {
    const toast = useToast();
    ipcRenderer.send('app-started');
    ipcRenderer.on('toast',(_event, ...args) => {

      switch (args[0]){
        case 'info':
          toast.info(args[1]);
          break;
        case 'error':
          toast.error(args[1]);
          break;
        case 'warning':
          toast.warning(args[1]);
          break;
        case 'success':
          toast.success(args[1]);
          break;
        default:
          toast(args[0]);
      }
    });
  }
}
</script>

<style scoped>

</style>