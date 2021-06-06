<template>
  <div class="image">
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
      }else if (this.properties.fit == 'cover') {
        style += 'background-size: cover;'
      }else{
        style += 'background-size: contain;'
      }

      // style += 'background-color:' + this.color2web(this.properties.color, false) + ';';

      // style += 'margin:' + fnc.calcPadding(this.page.padding, this.scale, true) + ';';
      if (this.properties.width != 'null') {
        style += 'width:' + (2.5 * this.scale * parseFloat(this.properties.width)) + 'px;';
      }
      if (this.properties.height != 'null') {
        style += 'height:' + (2.5 * this.scale * parseFloat(this.properties.height)) + 'px;';
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
.image, .image div {
  overflow: hidden;
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