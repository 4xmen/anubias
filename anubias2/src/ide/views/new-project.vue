<template>
  <div class="container">
    <h1>
      New project
    </h1>
    <steps :steps="projectSteps" v-model="stepIndex"></steps>
    <div id="basic" v-if="stepIndex === 0">
      <div class="input-container">
        <label for="name">
          Project name
        </label>
        <input ref="name" type="text" id="name" v-model="project.name" placeholder="Project name here..."/>
      </div>
      <div class="input-container">
        <label for="version">
          Project version
        </label>
        <input type="text" id="version" v-model="project.version" placeholder="Project version here..."/>
      </div>
      <div class="input-container">
        <label for="package">
          Project version
        </label>
        <input type="text" id="package" v-model="project.packageName" placeholder="Project package name here..."/>
      </div>
      <div class="input-container">
        <label for="page-count">
          Initial page count
        </label>
        <input type="number" min="1" max="10" id="page-count" v-model="project.pageCount"
               placeholder="Number of page you want to initial project..."/>
      </div>
    </div>
    <div id="theme" v-if="stepIndex === 1">
      Project color
      <div id="colors">
        <template v-for="(color,key) in ide.colors" :key="key">
          <div :class="'color' + (color.value === project.appColor?' active':'')"
               v-if="key > 1" :style="`background: ${color.color}`"
               @click="project.appColor = color.value">
            <span>
              {{ color.name }}
            </span>
          </div>
        </template>
      </div>
      <div class="row-equal">
        <div>
          <toggle label="Is RTL?" v-model="project.isRTL"></toggle>
        </div>
        <div>
          <toggle label="Is dark?" v-model="project.isDark"></toggle>
        </div>
      </div>
      <div class="row-equal">
        <div class="input-container">
          <label for="lang">
            Project language
          </label>
          <input type="text" id="lang" v-model="project.lang" placeholder="Project language..."/>
        </div>
        <div class="input-container">
          <label for="country">
            Project country
          </label>
          <input type="text" id="country" v-model="project.country" placeholder="Project county..."/>
        </div>
      </div>
    </div>
    <div id="permission" v-if="stepIndex === 2">
    </div>
    <div id="compile" v-if="stepIndex === 3">
    </div>

    <div id="next" title="Next" class="circle-btn" @click="nxt">
      <i class="ri-arrow-right-line"></i>
    </div>
    <div id="previous" title="Previous" class="circle-btn" @click="prv">
      <i class="ri-arrow-left-line"></i>
    </div>
  </div>
</template>

<script>
import steps from "../components/steps.vue";
import toggle from "../components/switch.vue";
import {btnWave} from '../js/ui-effects';
import {mapState} from 'vuex';

export default {
  name: "new-project",
  components: {steps, toggle},
  data: () => {
    return {
      stepIndex: 0,
      projectSteps: [
        {
          icon: 'ri-quill-pen-line',
          title: 'Basic information',
        },
        {
          icon: 'ri-palette-line',
          title: 'Theme and layouts',
        },
        {
          icon: 'ri-shield-check-line',
          title: 'Permissions',
        },
        {
          icon: 'ri-hammer-line',
          title: 'Compile options',
        },
      ],
      project: {
        name: 'new project',
        version: '1.0.0',
        packageName: 'com.example.mynewproject',
        pageCount: 1,
        appColor: 'Colors.green',
        lang: "en",
        country: "US",
        isDark: false,
        isRTL: false,
      }
    }
  },
  mounted() {
    this.$refs.name.focus();
    btnWave();
  },
  computed: {
    ...mapState(['ide'])
  },
  methods: {
    prv() {
      if (this.stepIndex === 0) {
        this.$router.back();
      } else {
        this.stepIndex--;
      }
    },
    nxt() {
      if (this.stepIndex === this.projectSteps.length - 1) {
        console.log('done!');
      } else {
        this.stepIndex++;
      }
    }
  }
}
</script>

<style scoped>

#colors {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-gap: .4rem;
}

#next {
  position: fixed;
  right: 2rem;
  bottom: 2rem;
}

#previous {
  position: fixed;
  left: 2rem;
  bottom: 2rem;
}

.container {
  user-select: none;
  padding-bottom: 50px;
}

.color {
  display: flex;
  height: 3rem;
  border: 2px solid var(--darker-bg);
  justify-content: center;
  align-items: center;

}

.color.active {
  border: 2px solid var(--text-color);
}

.color span {
  color: var(--def-bg);
  font-weight: 500;
}
.row-equal{
  padding-top: 1em;
}
.row-equal > div{
  padding: .5rem;
}
</style>