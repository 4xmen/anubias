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
    <div v-if="type === 'column'">
     <column :properties="properties" :scale="scale" :page="page"></column>
    </div>
    <div v-if="type === 'grid'">
     <grid :properties="properties" :scale="scale" :page="page"></grid>
    </div>
    <div v-if="type === 'input'">
      <input-text :properties="properties" :scale="scale" :page="page"></input-text>
    </div>
    <div v-if="type === 'dropdown'">
      <dropdown :properties="properties" :scale="scale" :page="page"></dropdown>
    </div>
    <div v-if="type === 'divider'">
      <divider :properties="properties" :scale="scale" :page="page"></divider>
    </div>
    <div v-if="type === 'toggle'">
      <toggle :properties="properties"  :scale="scale" :page="page"></toggle>
    </div>
    <div v-if="type === 'nav'" class="nav-bottom">
      <nav-bottom   :properties="properties"  :scale="scale" :page="page"></nav-bottom>
    </div>
  </div>
</template>

<script>
import preloader from '@/components/flutter/Preloader';
import appbar from '@/components/flutter/AppBar';
import txt from '@/components/flutter/Text';
import icon from '@/components/flutter/Icon';
import imag from '@/components/flutter/Image';
import btn from '@/components/flutter/Btn';
import circleBtn from '@/components/flutter/CircleBtn';
import container from '@/components/flutter/Container';
import row from '@/components/flutter/Row';
import column from '@/components/flutter/Column';
import grid from '@/components/flutter/Grid';
import InputText from '@/components/flutter/InputText';
import dropdown from "@/components/flutter/Dropdown";
import divider from '@/components/flutter/Divider';
import toggle from '@/components/flutter/Toggle';
import navBottom from '@/components/flutter/NavBottom';

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
    row,
    column,
    grid,
    dropdown,
    divider,
    InputText,
    navBottom,
    toggle,
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
      if (this.properties.type == 'toggle' && this.properties.bgColor != 'null'){
        style += 'background-color:' + fnc.color2web(this.properties.bgColor) + ';';
      }
      if (this.properties.align !== undefined && this.properties.align !== 'null') {
        let temp = this.properties.align.split('.');
        if (temp.length === 2) {
          style += 'text-align:' + temp[1] + ';';
        } else {
          style += 'text-align:' + this.properties.align + ';';
        }
      }else if (this.properties.align == 'null' || this.properties.align == undefined){
        style += 'text-align: center ;';
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
.nav-bottom {
  position: absolute;
  left: 0;
  right: 0;
  bottom: -170px;
  z-index: 9;
}
</style>