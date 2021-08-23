<template>
  <div :style="cssProps">

    <div class="txt" :style="getStyle()">
      {{ properties.text }}
      <div class="switch" :style="'float:'+(isRTL?'left':'right')">
        <label>
          <input type="checkbox" v-model="properties.state">
          <span class="lever"></span>
        </label>
      </div>
    </div>
  </div>
</template>

<script>
import {fnc} from "@/assets/js/functions";

export default {
  name: "toggle",
  data: function () {
    return {
      isRTL: window.appData.project.isRTL,
      isDark: window.appData.project.isDark,
    }
  },
  mounted() {

  },
  computed: {
    cssProps() {
      if (this.isDark && this.properties.activeColor == 'null'){
        return {
          '--bg-color2': fnc.color2web("Colors.teal")+'99',
          '--bg-color': fnc.color2web("Colors.teal"),
        }
      }
      if (!this.isDark && this.properties.activeColor == 'null') {
        return {
          '--bg-color2': fnc.color2web(this.properties.activeColor,true) + '99',
          '--bg-color': fnc.color2web(this.properties.activeColor,true),
        }
      }
      return {
        '--bg-color2': fnc.color2web(this.properties.activeColor) + '99',
        '--bg-color': fnc.color2web(this.properties.activeColor),
      }

    }
  },
  props: ['properties', 'scale', 'page'],
  methods: {
    getStyle: function () {
      let style = '';
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
      style += 'text-align: start;';
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
  padding: 5px;
  margin: 0;
  display: block;
  width: 100%;
}

.switch {
  margin-right: -10px;
}

input[type=checkbox]:checked+.lever {
  background: var(--bg-color2) !important;
}
input[type=checkbox]:checked+.lever:after {
  background: var(--bg-color) !important;
}

.txt:hover .fa-font {
  opacity: 0.7;
}


</style>