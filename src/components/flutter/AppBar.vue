<template>
  <div id="appBar" :style="getStyle()">
    <i :class="'fa '+(isRTL?'fa-arrow-right':'fa-arrow-left')" v-if="properties.back"></i>
    <b>
      {{ properties.title }}
    </b>
  </div>
</template>

<script>
import {fnc} from "@/assets/js/functions";

export default {
  name: "AppBar",
  data:function () {
    return{
      isRTL: window.appData.project.isRTL,
    }
  },
  props: ['properties', 'scale', 'page'],
  methods: {
    getStyle: function () {
      let style = '';
      style += 'background-color:' + this.color2web(this.properties.color,false) + ';';
      if (this.properties.textColor === 'null'){
        style += 'color: white;';
      }else{
        style += 'color:' + this.color2web(this.properties.textColor) + ';';
      }
      style += 'margin:' + fnc.calcPadding(this.page.padding, this.scale, true) + ';';
      style += 'font-size:' + 60 * this.scale+'px;';
      style += 'padding:' + 30 * this.scale+'px;';
      return style;
    },
    color2web: fnc.color2web
  }
}
</script>

<style scoped>
#appBar {
  margin-bottom: 5px !important;
}
</style>