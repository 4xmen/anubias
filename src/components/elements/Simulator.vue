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
    <div v-if="type === 'text'" :style="properties.align == 'null'? 'text-align:'+page.align:''">
      <txt :properties="properties" :scale="scale" :page="page"></txt>
    </div>
    <div v-if="type === 'icon'">
      <icon :properties="properties" :scale="scale" :page="page"></icon>
    </div>
    <div v-if="type === 'image'">
      <imag :properties="properties" :scale="scale" :page="page"></imag>
    </div>
    <div v-if="type === 'button'" :style="'text-align:'+page.align">
      <btn :properties="properties" :scale="scale" :page="page"></btn>
    </div>
    <div v-if="type === 'circle_button'" :style="'text-align:'+page.align">
      <circle-btn :properties="properties" :scale="scale" :page="page"></circle-btn>
    </div>
    <div v-if="type === 'container'">
      <container :properties="properties" :scale="scale" :page="page"></container>
    </div>
    <div v-if="type === 'row'">
     <row :properties="properties" :scale="scale" :page="page"></row>
    </div>
  </div>
</template>

<script>
import preloader from '../flutter/Preloader';
import appbar from '../flutter/AppBar';
import txt from '../flutter/Text';
import icon from '../flutter/Icon';
import imag from '../flutter/Image';
import btn from '../flutter/Btn';
import circleBtn from '../flutter/CircleBtn';
import container from '../flutter/Container';
import row from '../flutter/Row';
import {fnc} from '@/assets/js/functions';

export default {
  name: "Simulator",
  components: {
    preloader,
    appbar,
    txt,
    icon,
    imag,
    btn,
    circleBtn,
    container,
    row
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
    scale: {
      type: Number,
      default: 0
    }
  }, computed: {
    getStyle: function () {
      let style = '';
      if (this.properties.align !== undefined && this.properties.align !== 'default') {
        let temp = this.properties.align.split('.');
        if (temp.length === 2) {
          style += 'text-align:' + temp[1] + ';';
        } else {
          style += 'text-align:' + this.properties.align + ';';
        }
      }
      if (this.properties.hide) {
        if (this.properties.type === "appbar") {
           style += "display:none;"
        } else {
           style += "opacity: .25;";
        }
      }
      if (this.properties.padding !== undefined && this.properties.type !== 'button') {
        style += 'padding:' + fnc.calcPadding(this.properties.padding, this.scale) + ';';
      }
      return style;
    }
  }
}
</script>

<style scoped>

</style>