<template>
  <div>
    <div class="safe-area" v-if="currentPage.safeArea" :style="getStyleSafeArea">

    </div>
    <div id="appBar" :style="getAppStyle">
      <i :class="'fa '+(isRTL?'fa-arrow-right':'fa-arrow-left')" v-if="properties.back"></i>
      <i v-if="hasMenu" class="ri-menu-line" :style="getIconMenuStyle+';margin: 4px 10px 0 10px;'"></i>
      <b class="title">
        {{ properties.title }}
      </b>
      <template v-if="properties.actions.length > 0">
        <div v-for="(act,i) in properties.actions" :key="i" class="waves-effect waves-light" :style="getIconStyle">
          <i class="material-icons">{{ act.icon }}</i>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import {getSize, color2web, calcPaddingOrMargin} from "../../js/general-functions.js";
import {mapGetters} from "vuex";

export default {
  name: "anubiasAppbar",
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
        'project', ['appColor','isRTL','isDark']
    ),
    getIconStyle() {
      if (this.isRTL) {
        return 'float:left';
      } else {
        return 'float:right';
      }
    },
    getIconMenuStyle() {
      if (this.isRTL) {
        return 'float:right';
      } else {
        return 'float:left';
      }
    },
    getAppStyle() {
      let style = '';
      style += 'text-align: start;';
      style += 'background-color:' + this.color2web(this.properties.color, false) + ';';
      if (this.properties.textColor === 'null') {
        style += 'color: white;';
      } else {
        style += 'color:' + this.color2web(this.properties.textColor) + ';';
      }
      // style += 'margin:' + this.calcPadding(this.page.padding, this.scale, true) + ';';
      // style += 'font-size:' + 60 * this.scale+'px;';
      // style += 'padding:' + 30 * this.scale+'px;';
      return style;
    },
    getStyleSafeArea() {
      let style = '';
      try {
        // check has color appbar
          if (this.properties.color !== 'null') {
            style += 'background-color: ' + this.color2web(this.properties.color) + ';';
          } else {
            // check is dark or not
            if (this.isDark) {
              style += 'background-color: gray;';
            } else {
              style += 'background-color: ' + this.color2web(this.appColor) + ';';
            }
          }
      } catch (e) {
        console.log(e.message);
      }

      return style;
    },
    hasMenu() {
      // check has menu for this page
      if (this.currentPage.children.nonVisual.length === 0) {
        return false;
      }
      let menu = this.currentPage.children.nonvisual[0];
      if (menu === undefined) {
        return false
      } else if (menu.type === 'menu') {
        return true;
      }
      return false;
    }
  },
  methods: {
    color2web: color2web,
    getSize: getSize,
    calcPadding: calcPaddingOrMargin,
  }
}
</script>

<style scoped>
.safe-area{
  height: 75px;
  opacity: .5;
}
#appBar {
  margin-bottom: 5px !important;
  height: 170px;
}

.title {
  display: block;
  font-size: 75px;
  font-weight: normal;
  padding: 35px;
}

.waves-light .material-icons {
  margin: 0 4px;
}
</style>
