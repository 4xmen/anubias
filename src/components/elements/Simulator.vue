<!-- simulator is important element -->
<!--this help us generate web component like real widget -->
<template>
  <div :style="getStyle">
    <div v-if="type === 'preloader'">
      <preloader :properties="properties" :scale="scale"></preloader>
    </div>
    <div v-if="type === 'appbar'">
      <appbar :properties="properties" :scale="scale" :page="page"></appbar>
    </div>
  </div>
</template>

<script>
import preloader from '../flutter/Preloader';
import appbar from '../flutter/AppBar';
import {fnc} from '@/assets/js/functions';

export default {
  name: "Simulator",
  components: {
    preloader,
    appbar
  },
  props: {
    properties: {
      default: function () {
        return {}
      },
      type: Object
    },
    page: {
      default: function () {
        return {}
      },
      type: Object
    },
    type: {
      type: String,
      default: 'text',
    },
    scale:{
      type: Number,
      default: 0
    }
  },computed:{
    getStyle:function () {
      let style = '';
      if (this.properties.hide !== undefined){
        style += (this.properties.hide?'opacity:0.35;':'');
      }
      if (this.properties.align !== undefined && this.properties.align !== 'default'){
          style += 'text-align:' + this.properties.align+';';
      }
      if (this.properties.padding !== undefined) {
        style += 'padding:' + fnc.calcPadding(this.properties.padding, this.scale) + ';';
      }
      return style;
    }
  }
}
</script>

<style scoped>

</style>