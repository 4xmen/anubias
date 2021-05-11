<template>
  <div class="ui container">
    <titlec>
      Project info
    </titlec>
    <div class="form ui">
      <!--      <div class="two fields">-->
      <div class="field">
        <label for="name">Name</label>
        <input type="text" id="name" v-model="data.name" name="name" placeholder="Name">
      </div>
      <div class="field">
        <label for="version">Version</label>
        <input type="text" id="version" v-model="data.version" name="name" placeholder="Version">
      </div>
      <!--      </div>-->
      <div class="two fields">
        <div class="field">
          <label for="isDark">Is dark</label>
          <input type="checkbox" id="isDark" :checked="data.isDark" name="dark">
        </div>
        <div class="field">
          <label for="isRTL">Is RTL (Right to left) </label>
          <input type="checkbox" id="isRTL" :checked="data.isRTL" name="rtl">
        </div>
      </div>
      <div class="field">
        <label>Color</label>
        <div class="ui fluid selection dropdown">
          <input type="hidden" name="color" v-model="data.color">
          <i class="dropdown icon"></i>
          <div class="default text">Select Color</div>
          <div class="menu">
            <div v-for="(cl,n) in colors" v-bind:key="n" class="item" :data-value="cl.value">
              <i class="fa fa-square"
                 :style="'color:'+cl.color + (cl.name == 'White'?';border: 1px solid black;':'')"></i>
              {{ cl.name }}
            </div>
          </div>
        </div>
      </div>
      <div class="two fields">
        <div class="field">
          <label for="txt">Text Color</label>
          <input type="color" id="txt" name="textColor" value="#000000" placeholder="Name">
        </div>
        <div class="field">
          <label for="bg">Background Color</label>
          <input type="color" id="bg" name="textColor" value="#ffffff" placeholder="Name">
        </div>
      </div>
      <div class="ui divider"></div>
      <div class="field">
        <div class="ui button primary fluid" @click="save">
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
    $('.ui.dropdown')
        .dropdown()
    ;
  }, methods: {
    save: function () {
      window.appData.project = this.data;
      this.$router.back();
    },
  }
}
</script>

<style scoped>
.fa-square {
  font-size: 20px;
  margin-right: 15px;
}
</style>