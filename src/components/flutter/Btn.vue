<template>
  <div :style="getStyle()" class="fbtn waves-effect wave">
    <div class="content" :style="'padding:'+(15 * scale)+'px'">
      <span v-if="!properties.noIcon">
        <i class="material-icons" :style="'font-size:'+(properties.size * scale * 4.2)+'px'">{{ properties.icon }}</i>
      </span>
      <b v-if="!properties.noText" style="white-space: pre">{{ properties.text }}</b>
    </div>
  </div>
</template>

<script>
import {fnc} from "@/assets/js/functions";

export default {
  name: "Btn",
  props: ['properties', 'scale', 'page'],
  methods: {
    getStyle: function () {
      let style = '';
      // style += 'background-color:' + this.color2web(this.properties.color, false) + ';';

      if (this.properties.color == 'null') {
        style += 'color:white;';
      } else {
        style += 'color:' + this.color2web(this.properties.color) + ';';
      }

      if (this.properties.width != 'null') {
        style += 'width:' + fnc.getSize(this.properties.width ,this.scale, 3) + ';'
      }
      if (this.properties.height != 'null') {
        style += 'height:' + fnc.getSize(this.properties.height ,this.scale, 3,true) + ';'
      }
      if (this.properties.size != 'null') {
        style += 'font-size:' + (this.properties.size * this.scale * 2.5) + 'px;';
      }
      if (this.properties.padding != 'null' && this.properties.padding != '') {
        style += 'padding:' + this.calcPadding(this.properties.padding) + ';'
      }
      if (this.properties.borderRadius != 'null' && this.properties.borderRadius != '') {
        style += 'border-radius:' + this.calcPadding(this.properties.borderRadius) + ';'
      }

      if (this.properties.bgColor == 'null' && window.appData.project.isDark){
        style += 'background-color:' + this.color2web("Colors.blue", true) + ';';
      }else{
        style += 'background-color:' + this.color2web(this.properties.bgColor, true) + ';';
      }

      return style;
    },
    color2web: function (clr, b = false) {
      return fnc.color2web(clr, b);
    }, calcPadding: function (pad) {
      return fnc.calcPadding(pad);
    }
  }
}
</script>

<style scoped>
.fbtn {
  display: inline-block;
}

.content {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  text-align: center;
  justify-content: center;
}

.material-icons {
  margin: 0;
}
</style>