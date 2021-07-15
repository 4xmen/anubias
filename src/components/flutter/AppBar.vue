<template>
  <div id="appBar" :style="getStyle()">
    <i :class="'fa '+(isRTL?'fa-arrow-right':'fa-arrow-left')" v-if="properties.back"></i>
    <b>
      {{ properties.title }}
    </b>
    <span v-if="properties.actions.length > 0">
    <div v-for="(act,i) in properties.actions" :key="i" class="waves-effect waves-light" :style="getIconStyle()">
      <i class="material-icons" >{{act.icon}}</i>
    </div>
    </span>
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
    getIconStyle:function () {
      if (this.isRTL){
        return 'float:left';
      }else{
        return 'float:right';
      }
    },
    getStyle: function () {
      let style = '';
      if (this.isRTL){
        style += 'text-align: right;';
      }else {
        style += 'text-align: left;';
      }
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
.waves-light .material-icons{
  margin: 0 4px;
}
</style>