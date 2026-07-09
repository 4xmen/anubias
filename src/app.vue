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
    ...mapActions({
      addLog: 'ide/addLog',
      saveRequest: 'project/projectSaveRequest',
      logToggle: 'ide/toggleLogsCollapse',
      componentsToggle: 'ide/toggleComponentsCollapse',
      propertiesToggle: 'ide/togglePropertiesCollapse',
    }),
  },
  async mounted() {
    // console.log(this.addLog);
    const toast = useToast();
    // handle toast messages
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

    // handle log events
    await listen("log", (event) => {
      this.addLog(event.payload);
    });
    // handle menu events
    await listen("menu-event", (event) => {
      switch (event.payload) {

        case "request-save":
          this.saveRequest();
          break;
        case "logs-panel-toggle":
          this.logToggle();
          break;
        case "components-panel-toggle":
          this.componentsToggle();
          break;
        case "properties-panel-toggle":
          this.propertiesToggle();
          break;
        default:
          this.addLog( "Invalid menu event: " +event.payload );
      }

    });
  }
}
</script>

<style scoped>

</style>