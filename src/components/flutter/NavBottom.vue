<template>
  <div :style="getStyle()" class="nav">
    <div class="nav-bar">

      <div class="flex-box" v-for="(item,i) in properties.items" :key="i" :style="getStyleItem(i)">
        <div class="material-icons">{{ item.icon }}</div>
        {{ item.label }}
      </div>
    </div>
  </div>
</template>

<script>
import {fnc} from '@/assets/js/functions';

export default {
  name: "NavBottom",
  props: ['properties', 'scale', 'page'],
  methods: {
    getStyle: function () {
      let style = '';
      if (this.properties.bgColor === 'null') {
        if (window.appData.project.isDark) {
          style += 'background: #2e2e2e;';
        } else {
          style += 'background: #fafafa;';
        }
      } else {
        style += 'background:' + fnc.color2web(this.properties.bgColor) + ';';
      }
      return style;
    },
    getStyleItem: function (i) {
      let style = '';
      if (this.properties.index === i.toString()) {
        style += 'color:' + fnc.color2web(this.properties.color, true) + ';';
      } else {
        if (this.properties.unselectedItemColor !== 'null') {
          style += 'color:' + fnc.color2web(this.properties.unselectedItemColor, true) + ';';
        }
      }
      return style;
    }
  }
}
</script>

<style scoped>
.nav {
  padding: 5px 0;
  color: gray;
  font-size: 80%;
}

.nav-bar {
  display: flex;
  flex-direction: row;
  flex: 1;
  overflow: hidden;
}

.flex-box {
  text-align: center;
  flex-grow: 1;
}

.material-icons {
  display: block;
}
</style>