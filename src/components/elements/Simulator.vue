<!-- simulator is important element -->
<!--this help us generate web component like real widget -->
<template>
  <div :style="getStyle">
    <div v-if="type === 'preloader'">
      <preloader :properties="properties" :scale="scale"></preloader>
    </div>
  </div>
</template>

<script>
import preloader from '../flutter/Preloader';
import {fnc} from '@/assets/js/functions';

export default {
  name: "Simulator",
  components: {
    preloader
  },
  props: {
    properties: {
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
      style += (this.properties.hide?'opacity:0.35;':'');
      if (this.properties.align !== 'default'){
          style += 'text-align:' + this.properties.align+';';
      }

      style +='padding:'+fnc.calcPadding(this.properties.padding,this.scale)+';';
      return style;
    }
  }
}
</script>

<style scoped>

</style>