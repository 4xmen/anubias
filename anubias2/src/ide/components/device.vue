<template>
  <div id="device-container">
    <div id="device" :style="deviceStyle">
      123
    </div>
  </div>
</template>

<script>
import {mapState} from "vuex";

export default {
  name: "device",
  data: () => {
    return {
      zooms: ['auto', .6, .5, .37, .25]
    };
  },
  computed: {
    ...mapState(['ide']),

    deviceStyle() {

      let ratio = this.zooms[this.zoom];
      let style = '';
      style += 'height:' + (this.device.height * ratio) +'px;';
      style += 'width:' + (this.device.width * ratio)+'px;';

      return style;
    },
    zoom() {
      return this.ide.device.zoom;
    },
    orient() {
      return this.ide.device.orient;
    },
    device() {
      return this.ide.devices[this.ide.device.active];
    }
  }
}
</script>

<style scoped>

#device-container{
  width: 100%;
  height: 100%;
  overflow: auto;
  display: flex;
  justify-content: center;
  align-items: center;
}
#device {
  background: #fff;
  border: 5px solid #111;
  border-radius: 5px;
}
</style>