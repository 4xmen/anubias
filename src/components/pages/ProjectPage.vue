<!--edit project information-->
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
            <input type="checkbox" @change="fixLang" id="isRTL" v-model="data.isRTL" name="rtl">
            <span class="lever"></span>
          </label>
        </div>
      </div>
      <div class="input-field col s12">
        <label for="clr" class="active">Color</label>
        <select id="clr" @change="changeColor" v-model="data.xColor">
          <option :data-icon="'data:image/svg+xml;base64,'+color2base64svg(cl.color)" :value="cl.value"
                  v-for="(cl,n) in colors" class="circle left" v-bind:key="n"
                  :style="'background:'+cl.color + (cl.name === 'Black'?';color:white;':'')"
                  :disabled="(['transparent','default'].indexOf(cl.name) > -1)"> {{ cl.name }}
          </option>
        </select>
      </div>
      <div class="input-field col s12">
        <label for="mainPage" class="active">Main page (entry point)</label>
        <select id="mainPage" v-model="data.mainPage">
          <option v-for="(page,k) in app.pages" :value="k" :key="k"> {{ page.name }}</option>
        </select>
      </div>
      <div class="input-field col s6">
        <div class="active">Text Color</div>
        <input type="color" id="txt" name="textColor" v-model="data.textColor">
      </div>
      <div class="input-field col s6">
        <div class="active">Background Color</div>
        <input type="color" id="bg" name="textColor" v-model="data.bgColor">
      </div>
      <div class="input-field col s6">
        <div class="active">Language</div>
        <input type="text" maxlength="2" id="lang" name="lang" v-lower v-model="data.lang">
      </div>
      <div class="input-field col s6">
        <div class="active">Country</div>
        <input type="text" id="country" maxlength="2" name="country" v-upper v-model="data.country">
      </div>
      <div class="input-field col s9">
        <label class="active">Icon (png / 1024x1024)</label>
        <div class="file-field input-field">
          <div class="btn">
            <span>Icon</span>
            <input type="file" @change="chooseIcon" accept="image/png">
          </div>
          <div class="file-path-wrapper">
            <input class="file-path validate" type="text">
          </div>
        </div>
      </div>
      <div class="input-field col s3 center-align">
        <div v-if="data.icon == null">
          <img src="@/assets/img/logo.svg" class="applogo" alt="logo">
        </div>
        <div v-else>
          <img :src="data.icon" class="applogo" alt="logo">
        </div>
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
// import {fnc} from '@/assets/js/functions';
export default {
  name: "ProjectPage",
  data: function () {
    return {
      data: window.appData.project,
      colors: window.colors,
      app: window.appData,
    }
  },
  components: {
    titlec
  },
  directives: {
    upper: {
      update(el) {
        el.value = el.value.toUpperCase();
      },
    },
    lower: {
      update(el) {
        el.value = el.value.toLowerCase();
      },
    }
  },
  mounted() {
    var $ = window.jQuery;
    $("select").formSelect();
  }, methods: {
    fixLang:function () {
          if (this.data.isRTL && this.data.lang == 'en' && this.data.country == 'US' ){
            this.data.lang = 'fa';
            this.data.country = 'IR';
          }
          if (!this.data.isRTL && this.data.lang == 'fa' && this.data.country == 'IR' ){
            this.data.lang = 'en';
            this.data.country = 'US';
          }
    },
    chooseIcon: function (e) {
      if (e.target.files[0] != undefined) {
        // this.getBase64(e.target[0],function (e) {
        //   console.log(e);
        // })
        let self = this;
        let file = e.target.files[0];
        let reader = new FileReader();
        reader.onload = (e) => {
          self.data.icon = e.target.result;
          self.$forceUpdate();
        };
        reader.readAsDataURL(file);
      } else {
        this.data.icon = null;
      }
    },
    save: function () {
      window.appData.project = this.data;
      this.$router.back();
    },
    changeColor: function () {
      console.log(this.xColor);
    },
    // make svg form file
    color2base64svg: function (color) {
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
  },
}
</script>

<style scoped>
#clr option {
  font-weight: bold;
  padding: 5px;
}

.fa-square {
  font-size: 20px;
  margin-right: 15px;
}

.applogo {
  height: 64px;
  margin-top: 15px;
}
</style>