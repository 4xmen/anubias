<template>
  <div :style="getStyle()">
    <i class="material-icons" :style="getStyle2()">{{properties.icon}}</i>
  </div>
</template>

<script>
import {fnc} from '@/assets/js/functions';
export default {
  name: "Icon",
  props: ['properties', 'scale'],
  methods: {
    getStyle: function () {
      let style = '';
      // style += 'background-color:' + this.color2web(this.properties.color, false) + ';';
      if (this.properties.color === 'null') {
        if (window.appData.project.isDark) {
          style += 'color: white;';
        } else {
          style += 'color: black;';
        }
      } else {
        style += 'color:' + this.color2web(this.properties.color) + ';';
      }

      return style;
    },
    getStyle2:function () {
      let style = '';
      style += 'font-size:' + (2.5 * this.scale * parseFloat(this.properties.size)) + 'px;';
      return style;
    },
    color2web: function (clr) {
      return fnc.color2web(clr);
    }
  }
}
</script>

<style scoped>

</style>