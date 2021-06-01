<template>
  <div class="txt" :class="this.properties.overflow" :style="getStyle()">
    {{ properties.text }}
    <div class="fa fa-font"></div>
  </div>
</template>

<script>
import {fnc} from "@/assets/js/functions";

export default {
  name: "txt",
  data: function () {
    return {
      isRTL: window.appData.project.isRTL,
    }
  },
  mounted() {

  },
  props: ['properties', 'scale', 'page'],
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
      if (this.properties.maxLine != 0) {
        style += 'max-height:' + this.properties.maxLine * parseFloat(this.properties.height) + 'em;';
      }
      style += 'line-height:' + this.properties.height+'em;';
      if (this.properties.overflow != 'null'){
        style += 'text-overflow:' + this.properties.overflow+';';
      }
      if (this.properties.softWrap){
        style += 'white-space: nowrap;';
      }
      if (this.properties.weight != 'normal'){
        if (this.properties.weight =='bold'){
          style +='font-weight: 400;';
        }else{
          style +='font-weight:'+this.properties.weight.substr(1)+';';
        }
      }
      // style += 'margin:' + fnc.calcPadding(this.page.padding, this.scale, true) + ';';
      style += 'font-size:' + (2.5 * this.scale * parseFloat(this.properties.size)) + 'px;';
      return style;
    },
    color2web: fnc.color2web
  }
}
</script>

<style scoped>
.txt {
  overflow: hidden;
  position: relative;
}

.fa-font {
  opacity: 0;
}

.txt:hover .fa-font {
  opacity: 0.7;
}

</style>