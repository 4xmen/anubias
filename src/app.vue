<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script>
import {useToast} from "vue-toastification";
import { listen } from "@tauri-apps/api/event";
import {mapActions} from "vuex";

export default {
  name: "app",
  methods: {
    ...mapActions(
        'ide',['addLog','setActivePage']
    ),
  },
  async mounted() {
    // console.log(this.addLog);
    const toast = useToast();
    // ipcRenderer.send('app-started');
    await listen("toast", (event) => {
      const { message_type, message_text } = event.payload;

      switch (message_type) {
        case "Info":
          toast.info(message_text);
          break;
        case "Error":
          toast.error(message_text);
          break;
        case "Warning":
          toast.warning(message_text);
          break;
        case "Success":
          toast.success(message_text);
          break;
        default:
          toast(message_text);
      }
    });

    await listen("log", (event) => {
      this.addLog(event.payload);
    });
  }
}
</script>

<style scoped>

</style>