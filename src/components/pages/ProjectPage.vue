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
          <input type="checkbox" id="isDark" v-model="data.isDark" name="dark">
        </div>
        <div class="field">
          <label for="isRTL">Is RTL (Right to left) </label>
          <input type="checkbox" id="isRTL" v-model="data.isRTL" name="rtl">
        </div>
      </div>
      <div class="field">
        <label for="clr">Color</label>
        <select id="clr" @change="changeColor" v-model="data.xColor">
          <option :value="cl.value" v-for="(cl,n) in colors" class="ui dropdown" v-bind:key="n"
                  :style="'background:'+cl.color + (cl.name === 'Black'?';color:white;':'')"> {{cl.name}} </option>
        </select>
        <!--        <v-select :options="options" label="title"  v-model="data.xColor">-->
        <!--          <template slot="option" slot-scope="option" v-for="cl in colors">-->
        <!--            <div v-for="(cl,n) in colors" v-bind:key="n" class="item" :data-value="cl.value">-->
        <!--              <i class="fa fa-square"-->
        <!--                 :style="'color:'+cl.color + (cl.name === 'White'?';border: 1px solid black;':'')"></i>-->
        <!--              {{ cl.name }}-->
        <!--            </div>-->
        <!--          </template>-->
        <!--        </v-select>-->
        <!--        <div class="ui fluid selection dropdown">-->
        <!--          <input type="text" @change="ops" v-model="data.xColor">-->
        <!--          <i class="dropdown icon"></i>-->
        <!--          <div class="default text">Select Color</div>-->
        <!--          <div class="menu">-->

        <!--          </div>-->
        <!--        </div>-->
      </div>
      <div class="two fields">
        <div class="field">
          <label for="txt">Text Color</label>
          <input type="color" id="txt" name="textColor" placeholder="Name" v-model="data.color">
        </div>
        <div class="field">
          <label for="bg">Background Color</label>
          <input type="color" id="bg" name="textColor" placeholder="Name" v-model="data.bgColor">
        </div>
      </div>
      <div class="ui divider"></div>
      <div class="field">
        <div class="ui button positive primary fluid" @click="save">
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
  }, methods: {
    save: function () {
      window.appData.project = this.data;
      console.log(window.appData.project);
      this.$router.back();
    },
    changeColor: function () {
      console.log(this.xColor);
    },
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