<template>
  <div :class="this.properties.overflow" :style="getStyle" class="txt">
    {{ properties.text }}
    <i class="ri-text"></i>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import {color2web} from "../../js/general-functions";

export default {
  name: "anubiasText",
  props: {
    properties: {
      type: Object,
      required: true,
    }
  },
  computed: {
    ...mapGetters(
        'ide', ['currentPage']
    ),
    ...mapGetters(
        'project', ['appColor', 'isRTL', 'isDark']
    ),
    getStyle: function () {
      let style = '';
      // style += 'background-color:' + this.color2web(this.properties.color, false) + ';';
      if (this.properties.color === 'null') {
        if (this.isDark) {
          style += 'color: white;';
        } else {
          style += 'color: black;';
        }
      } else {
        style += 'color:' + color2web(this.properties.color) + ';';
      }
      if (this.properties.maxLine != 0) {
        style += 'max-height:' + this.properties.maxLine * parseFloat(this.properties.height) + 'em;';
      }
      style += 'line-height:' + this.properties.height + 'em;';
      if (this.properties.overflow != 'null') {
        style += 'text-overflow:' + this.properties.overflow + ';';
      }
      if (this.properties.softWrap) {
        style += 'white-space: pre-line;';
      } else {
        style += 'white-space: nowrap;';
      }
      if (this.properties.weight !== 'normal') {
        if (this.properties.weight === 'bold') {
          style += 'font-weight: 400;';
        } else {
          style += 'font-weight:' + this.properties.weight.substr(1) + ';';
        }
      }

      if (this.properties.align !== undefined && this.properties.align !== 'null') {
        let temp = this.properties.align.split('.');
        if (temp.length === 2) {
          style += 'text-align:' + temp[1] + ';';
        } else {
          style += 'text-align:' + this.properties.align + ';';
        }
      } else if (this.properties.align === 'null') {
        style += 'text-align: start;';
      }
      // style += 'margin:' + fnc.calcPadding(this.page.padding, this.scale, true) + ';';
      style += 'font-size:' + (3 * parseFloat(this.properties.fontSize)) + 'px;';
      return style;
    },
  }
}
</script>

<style scoped>
.txt {
  overflow: hidden;
  position: relative;
  font-size: 35px;
}

.ri-text {
  opacity: 0;
  -o-transition: .3s;
  -ms-transition: .3s;
  -moz-transition: .3s;
  -webkit-transition: .3s;
  transition: .3s;
  font-size: 35px;
}

.txt:hover .ri-text {
  opacity: 0.7;
}
</style>