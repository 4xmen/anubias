<template>
  <div class="image" :style="getStyleParent()">
    <div :style="getStyle()">
      <div v-if="properties.image == ''">
        <img src="@/assets/img/sample.jpg" alt="">
      </div>
      <div v-else>
        <img :src="properties.image" alt="">
      </div>
    </div>
  </div>
</template>

<script>
import {fnc} from "@/assets/js/functions";

export default {
  name: "Imag",
  props: ['properties', 'scale'],
  methods: {
    getStyleParent:function () {
      let style = '';
      if (this.properties.align !== undefined && this.properties.align !== 'null') {
        let temp = this.properties.align.split('.');
        if (temp.length === 2) {
          style += 'text-align:' + temp[1] + ';';
        } else {
          style += 'text-align:' + this.properties.align + ';';
        }
      }else if (this.properties.align == 'null'){
        style += 'text-align: center ;';
      }
      style += 'margin-top: ' + (this.scale * 10)+'px;';
      style += 'margin-bottom: ' + (this.scale * -45)+'px;';
      return style;
    },
    getStyle: function () {
      let style = '';
      style += 'background-image: url("' + this.getImage() + '");'

      if (this.properties.fit == 'contain') {
        style += 'background-size: contain;'
      } else if (this.properties.fit == 'fill') {
        style += 'background-size: 100% 100%;'
      } else if (this.properties.fit == 'fitWidth') {
        style += 'background-size: 100% auto;'
      } else if (this.properties.fit == 'fitHeight') {
        style += 'background-size: auto 100%;'
      } else if (this.properties.fit == 'cover') {
        style += 'background-size: cover;'
      } else {
        style += 'background-size: contain;'
      }



      // style += 'background-color:' + this.color2web(this.properties.color, false) + ';';

      // style += 'margin:' + fnc.calcPadding(this.page.padding, this.scale, true) + ';';
      if (this.properties.width != 'null') {
        style += 'width:' + fnc.getSize(this.properties.width, this.scale, 2.5) + ';';
      }
      if (this.properties.height != 'null') {
        style += 'height:' + fnc.getSize(this.properties.height, this.scale, 2.5, true) + ';';
      }
      return style;
    },
    color2web: fnc.color2web,
    getImage: function () {
      if (this.properties.image == '') {
        return require('@/assets/img/sample.jpg');
      } else {
        return this.properties.image;
      }
    }
  },
}
</script>

<style scoped>

.image{
  margin-top: 0 !important;
}

.image, .image div {
  overflow: hidden;
  display: inline-block;
}

.image div {
  background-position: center;
  background-repeat: no-repeat;
}

.image img {
  max-width: 100%;
  opacity: 0;
}
</style>