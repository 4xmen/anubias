<template>
  <div class="dropd">
     <span v-if="properties.icon != 'null'">
          <i class="material-icons" :style="getStyleIcon()">{{ properties.icon }}</i>
     </span>
    <span class="title" :style="getStyle()">
       {{ properties.title }}
    </span>
    <span style="float: right">
      <span v-if="properties.trailing == 'arrow_forward_ios'">
         <i v-if="!isRTL" class="material-icons">arrow_forward_ios</i>
         <i v-if="isRTL" class="material-icons">arrow_back_ios</i>
      </span>
      <span v-else>
         <i class="material-icons">{{ properties.trailing }}</i>

      </span>
    </span>
    <span class="placeholder" :style="getStylePlaceholder()">
          <span v-if="properties.isLoading" style="display: inline-block ;margin-top: -5px;">
            <i class="fas fa-circle-notch fa-spin fa-2x"></i>
          </span>
          <span v-else >
            {{ properties.placeholder }}
          </span>
    </span>
    <div v-if="properties.hint.trim() != ''">
      {{ properties.hint }}
    </div>
  </div>
</template>

<script>
import {fnc} from "@/assets/js/functions";

export default {
  name: "Dropdown",
  props: ['properties', 'scale', 'page'],
  data: function () {
    return {
      isRTL: window.appData.project.isRTL,
    }
  },
  methods: {
    getStyle: function () {
      let style = '';
      if (this.properties.color != 'null') {
        style += 'color:' + this.color2web(this.properties.color) + ';';
      }
      return style;
    },
    getStyleIcon: function () {
      let style = '';
      style += 'font-size:' + this.properties.iconSize + 'px;'
      if (this.properties.iconColor != 'null') {
        style += 'color:' + this.color2web(this.properties.iconColor) + ';';
      }
      return style;
    },
    getStylePlaceholder: function () {
      let style = '';
      if (this.properties.isTwoLine) {
        style += 'display: block;';
      } else {
        if (this.isRTL) {
          style += 'float: left;';
        } else {
          style += 'float: right;';
        }
      }
      return style;
    },
    color2web: function (clr, b = false) {
      return fnc.color2web(clr, b);
    },
    calcPadding: function (pad) {
      try {
        return fnc.calcPadding(pad);
      } catch {
        return '0';
      }

    }
  }
}
</script>

<style scoped>
.dropd {
  margin-top: 5px;
}

.placeholder {
  padding: 7px;
}

.material-icons {
  position: relative;
  top: 5px;
}
</style>