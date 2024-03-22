<template>
  <div id="fast-project-properties">
    <toggle label="Is dark" v-model="project.isDark" :size=".6"></toggle>
    <material-color-picker label="Project color" v-model="project.appColor"></material-color-picker>
    <div class="input-container">
        <div class="grid-equal">
          <div>
            <label>
              Language
            </label>
          </div>
          <div>
            <input type="text" maxlength="4" @keyup="updateDetail" v-model="project.lang" >
          </div>
        </div>
    </div>
    <div class="input-container">
        <div class="grid-equal">
          <div>
            <label>
              Country
            </label>
          </div>
          <div>
            <input type="text" maxlength="4" v-model="project.country" >
          </div>
        </div>
    </div>
    <div class="input-container">
        <div class="grid-equal">
          <div>
            <label>
              EntryPoint
            </label>
          </div>
          <div>
            <select  v-model="project.entryPoint">
              <option v-for="(page,i) in project.pages" :key="i" :value="i"> {{page.name}} </option>
            </select>
          </div>
        </div>
    </div>
  </div>
</template>

<script>

import {mapState} from "vuex";
import toggle from "./switch.vue";
import MaterialColorPicker from "./anubias/material-color-picker.vue";
export default {
  name: "fast-project-properties",
  components: {MaterialColorPicker, toggle},
  data: () => {
    return {}
  },
  props: {},
  mounted() {
  },
  computed: {
    ...mapState('project',['project']),
  },
  methods: {
    updateDetail(){
     this.$store.commit("project/UPDATE_PROJECT_DETAIL",['lang',this.project.lang]);
     this.$store.commit("project/UPDATE_PROJECT_DETAIL",['country',this.project.country]);
     this.$store.commit("project/UPDATE_PROJECT_DETAIL",['country',this.project.country]);
    }
  }
}
</script>

<style scoped>
#fast-project-properties {

}
.grid-equal div{

}
.input-container{
  border-bottom: 1px solid var(--lighter-bg);
  padding: .5rem;
  margin-bottom: 0;
}
.input-container input,.input-container select{
  padding: 3px;
  text-align: center;
  display: block;
  width: 100%;
}
.input-container select option{
  padding: 4px;
}
</style>