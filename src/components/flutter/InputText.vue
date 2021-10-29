<template>
  <div :style="getStyle()" ref="main" :class="'input input-field'+(properties.outlined?' input-outlined':'')"
  >
      <span v-if="properties.prefix.length !== 0" class="abs" :style="getStylePrefix()">
        {{ properties.prefix }}
      </span>
    <i v-if="properties.icon != 'null'" class="material-icons"
       :style="getStyleIcon()">
      {{ properties.icon }}
    </i>
    <input :type="properties.password ? 'password':'text'" :value="properties.text" :readonly="properties.readOnly"
           :id="properties.name"
           ref="inp"
           @focus="focusing" @blur="bluring"
           :maxlength="properties.maxLength"
           :disabled="!properties.enabled"
           :style="getStyleInput()">
    <label :for="properties.name" ref="lbl" :class="properties.text != ''?'active':''"
           :style="getStyleLabel()">
      {{ properties.labelText }}
    </label>
    <span v-if="properties.suffix.length !== 0" class="abs" :style="getStyleSuffix()">
        {{ properties.suffix }}
      </span>
  </div>
</template>

<script>
import {fnc} from "@/assets/js/functions";

export default {
  name: "InputText",
  data: function () {
    return {
      isRTL: window.appData.project.isRTL,
      isDark: window.appData.project.isDark,
    }
  },
  watch: {},
  computed: {
    pad: function () {
      if (this.isRTL) {
        return 'padding-right';
      }
      return 'padding-left';
    }
  },
  mounted() {
    try {

      if (this.isRTL) {
        document.querySelector('.input .material-icons ').style.right = '0';
      } else {
        document.querySelector('.input .material-icons ').style.left = '0';
      }
    } catch {
      //
    }


  },
  props: ['properties', 'scale', 'page'],
  methods: {
    getStyleIcon: function () {
      let style = (this.properties.iconSize != 'null' ? 'font-size:' +this.properties.iconSize * this.scale * 2.5 + 'px' : '');

      if (this.properties.iconColor != 'null') {
        style += 'color:' + fnc.color2web(this.properties.iconColor) + ';';
      }
      return style;
    },
    getStylePrefix: function () {
      let style = '';
      if (this.properties.icon != 'null') {
        let pad = this.properties.iconSize != 'null' ? this.properties.iconSize : 30;
        if (this.isRTL) {
          style += 'right:' + pad + 'px;';
        } else {
          style += 'left:' + pad + 'px;';
        }
      }
      if (this.properties.prefixColor != 'null') {
        style += 'color:' + this.color2web(this.properties.prefixColor) + ';';
      }
      if (this.properties.prefixSize != 'null') {
        style += 'font-size:' + (2.5 * this.scale * parseFloat(this.properties.prefixSize)) + 'px;';
      }
      return style;
    },
    getStyleSuffix: function () {
      let style = '';
      if (!this.isRTL) {
        style += 'right:7px;';
      } else {
        style += 'left:7px;';
      }
      if (this.properties.suffixColor != 'null') {
        style += 'color:' + this.color2web(this.properties.suffixColor) + ';';
      }
      if (this.properties.suffix != 'null') {
        style += 'font-size:' + (2.5 * this.scale * parseFloat(this.properties.suffixSize)) + 'px;';
      }
      return style;
    },
    getStyle: function () {
      let style = '';
      // style += 'background-color:' + this.color2web(this.properties.color, false) + ';';
      if (this.properties.borderColor != 'null') {
        style += 'border-color:' + this.color2web(this.properties.borderColor) + ';';
      }
      if (this.properties.margin != '0') {
        style += 'margin:' + this.calcPadding(this.properties.margin, this.scale * 2) + ';';
      }
      try {
        if (this.properties.bgColor === 'null') {
          style += 'background:' + document.querySelector('#preview > div').style.backgroundColor + ';';
        }
      } catch {
        //
      }

      if (this.properties.color === 'null') {
        if (window.appData.project.isDark) {
          style += 'color: white;';
        } else {
          style += 'color: black;';
        }
      } else {
        style += 'color:' + this.color2web(this.properties.color) + ';';
      }
      if (this.properties.align !== 'null') {
        style += 'text-align:' + this.properties.align + ';';
      }
      // style += 'margin:' + fnc.calcPadding(this.page.padding, this.scale, true) + ';';

      return style;
    },
    getStyleLabel: function () {
      let style = '';
      if (this.properties.labelSize != 'null') {
        style += 'font-size:' + (2.5 * this.scale * parseFloat(this.properties.labelSize)) + 'px;';
      }
      if (this.properties.icon != 'null') {
        if (this.isRTL) {
          style += 'right:';
        } else {
          style += 'left:';
        }
        style += this.properties.iconSize != 'null' ? this.properties.iconSize : 30 + 'px;';
      }

      if (this.properties.labelColor != 'null') {
        style += 'color:' + this.color2web(this.properties.labelColor) + ' !important ;';
      }else{
        if (this.isDark){
        style += 'color: white !important ;';
        }
        style += 'color: black !important ;';
      }

      return style;
    },
    getStyleInput: function () {
      let style = '';
      let pad = 0;
      if (this.properties.align !== 'null') {
        style += 'text-align:' + this.properties.align + ';';
      }
      if (this.properties.icon != 'null') {
        pad += this.properties.iconSize != 'null' ? this.properties.iconSize : 30;
      }
      if (this.properties.prefix != 'null') {
        pad += this.properties.prefix.length * (this.properties.prefixSize == 'null' ? 17 : this.properties.prefixSize) * this.scale * 1.7;
      }
      if (this.properties.borderColor != 'null') {
        style += 'border-color:' + this.color2web(this.properties.borderColor) + ';';
      } else {
        style += 'border-color:' + this.color2web(window.appData.project.appColor) + ';';
      }
      if (this.properties.cursorColor != 'null') {
        style += 'caret-color:' + this.color2web(this.properties.cursorColor) + ';';
      }
      if (this.properties.size != 'null') {
        style += 'font-size:' + (2.5 * this.scale * parseFloat(this.properties.size)) + 'px;';
      }
      if (this.properties.color != 'null') {
        style += 'color:' + this.color2web(this.properties.color) + ' !important ;';
      }else{
        if (this.isDark){
          style += 'color: white !important ;';
        }
        style += 'color: black !important ;';
      }
      if (this.properties.weight != 'normal') {
        if (this.properties.weight == 'bold') {
          style += 'font-weight: 400;';
        } else {
          style += 'font-weight:' + this.properties.weight.substr(1) + ';';
        }
      }
      style += this.pad + ':' + pad + 'px;';
      return style;
    },
    focusing: function (e) {
      this.$refs.main.classList.add('acv');
      if (this.properties.hintText != 'null' && this.properties.hintText != '') {
        e.target.setAttribute('placeholder', this.properties.hintText);
      }
      if (this.properties.borderFocusedColor != 'null') {
        this.$refs.inp.style.borderColor = fnc.color2web(this.properties.borderFocusedColor);
      }
    },
    bluring: function (e) {
      e.target.removeAttribute('placeholder');
      if (this.properties.text == '') {
        this.$refs.lbl.classList.remove('active');
        this.$refs.main.classList.remove('acv');

      }
      if (this.properties.borderColor != 'null') {
        this.$refs.inp.style.borderColor = this.color2web(this.properties.borderColor);
      } else {
        this.$refs.inp.style.borderColor = this.color2web(window.appData.project.appColor);
      }
    },
    color2web: fnc.color2web,
    calcPadding: fnc.calcPadding,
  }
}
</script>

<style scoped>
.input {
  position: relative;
  box-sizing: border-box;
  box-shadow: none !important;
}

.input .material-icons {
  position: absolute;
  top: 10px;
}

.input input {
  box-shadow: none !important;
  box-sizing: border-box;
}

.abs {
  display: none;
  position: absolute;
  top: 15px;
  font-family: 'VazirCodeX';
}


</style>