<template>
  <div class="ui container">
    <titlec>
      Project info
    </titlec>
    <div class="row">
      <div class="input-field col s6">
        <input type="text" id="name" v-model="data.name" name="name" placeholder="Project name">
        <label for="name" class="active">Project name</label>
      </div>
      <div class="input-field col s6">
        <input type="text" id="version" v-model="data.version" name="name" placeholder="Version">
        <label for="version" class="active">Version</label>
      </div>
      <div class="input-field col s6">
        <div class="switch">
          <label>
            Is Dark
            <input type="checkbox" id="isDark" v-model="data.isDark" name="dark">
            <span class="lever"></span>
          </label>
        </div>
      </div>
      <div class="input-field col s6">
        <div class="switch">
          <label>
            Is RTL
            <input type="checkbox" id="isRTL" v-model="data.isRTL" name="rtl">
            <span class="lever"></span>
          </label>
        </div>
      </div>
      <div class="input-field col s12">
        <label for="clr" class="active">Color</label>
        <select id="clr" @change="changeColor" v-model="data.xColor">
          <option  :data-icon="'data:image/svg+xml;base64,'+color2base64svg(cl.color)" :value="cl.value" v-for="(cl,n) in colors" class="circle left" v-bind:key="n"
                  :style="'background:'+cl.color + (cl.name === 'Black'?';color:white;':'')"> {{cl.name}} </option>
        </select>
      </div>
      <div class="input-field col s6">
        <div class="active">Text Color</div>
        <input type="color" id="txt" name="textColor"  v-model="data.textColor">
      </div>
      <div class="input-field col s6">
        <div class="active">Background Color</div>
        <input type="color" id="bg" name="textColor" v-model="data.bgColor">
      </div>
      <div class="input-field col s12">
        <div class="ui btn green primary btn-block" @click="save">
          Save
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import titlec from '../elements/TitleElement';

export default {
  name: "ProjectPage",
  data: function () {
    return {
      data: window.appData.project,
      colors: window.colors,
    }
  },
  components: {
    titlec
  },
  mounted() {
    var $ = window.jQuery;
    $("select").formSelect();
  }, methods: {
    save: function () {
      window.appData.project = this.data;
      console.log(window.appData.project);
      this.$router.back();
    },
    changeColor: function () {
      console.log(this.xColor);
    },
    color2base64svg:function (color) {
      var txt = `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
\t width="150" height="100" viewBox="0 0 126 126" enable-background="new 0 0 126 126" xml:space="preserve">
<g>
        <rect width="150" height="100" style="fill:${color};stroke:rgb(0,0,0)" />
</g>
</svg>`;
      return btoa(txt);
    }
  }
}
</script>

<style scoped>
#clr option{
  font-weight: bold;
  padding: 5px;
}
.fa-square {
  font-size: 20px;
  margin-right: 15px;
}
</style>