<template>
  <div id="appBar" :style="getStyle()">
    <i :class="'fa '+(isRTL?'fa-arrow-right':'fa-arrow-left')" v-if="properties.back"></i>
    <i v-if="isMenu" :class="'fa '+('fa-bars')"  :style="getIconMenuStyle()+';margin: 4px 10px 0 10px;'"></i>
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
    getIconMenuStyle:function () {
      if (this.isRTL){
        return 'float:right';
      }else{
        return 'float:left';
      }
    },
    getStyle: function () {
      let style = '';
      style += 'text-align: start;';
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
  },
  computed:{
    isMenu: function () {
      let menu = window.appData.pages[this.$parent.$parent.currentPage].children.nonvisual[0];
      if (menu === undefined){
        return  false
      }else if(menu.type === 'menu'){
        return true;
      }
      return false;
    }
  }
}
</script>

<style scoped>
#appBar {
  margin-bottom: 5px !important;
  position: relative;
  z-index: 5;
}
.waves-light .material-icons{
  margin: 0 4px;
}
</style>