<template>
  <div :style="getStyle()" class="fbtn waves-effect waves-light">
    <div class="content">
      <i class="material-icons" :style="'font-size:'+(properties.size * scale * 3)+
      'px;width:'+(properties.size * scale * 3)+'px;height:'+
      (properties.size * scale * 3)+'px;'">{{ properties.icon }}</i>
    </div>
  </div>
</template>

<script>
import {fnc} from "@/assets/js/functions";

export default {
  name: "CircleBtn",
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


      if (this.properties.padding != 'null' && this.properties.padding != '') {
        style += 'padding:' + this.calcPadding(this.properties.padding) + ';'
      }

      if (this.properties.bgColor == 'null'){
        style += 'background-color: transparent !important;';
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
  border-radius: 50%;
  padding: 10px;
}

.content {
  display: flex;
  align-items: center;
  width: 100%;
  text-align: center;
  justify-content: center;
}
.material-icons {
  margin: 0;
}
</style>