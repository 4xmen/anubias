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
        <input ref="name" type="text" id="name" v-model="newProject.name" placeholder="Project name here..."/>
      </div>
      <div class="input-container">
        <label for="version">
          Project version
        </label>
        <input type="text" id="version" v-model="newProject.version" placeholder="Project version here..."/>
      </div>
      <div class="input-container">
        <label for="package">
          Project version
        </label>
        <input type="text" id="package" v-model="newProject.packageName" placeholder="Project package name here..."/>
      </div>
      <div class="input-container">
        <label for="page-count">
          Initial page count
        </label>
        <input type="number" min="1" max="10" id="page-count" v-model="newProject.pageCount"
               placeholder="Number of page you want to initial project..."/>
      </div>
    </div>
    <div id="theme" v-if="stepIndex === 1">
      Project color
      <div id="colors">
        <template v-for="(color,key) in ide.colors" :key="key">
          <div :class="'color' + (color.value === newProject.appColor?' active':'')"
               v-if="key > 1" :style="`background: ${color.color}`"
               @click="newProject.appColor = color.value">
            <span>
              {{ color.name }}
            </span>
          </div>
        </template>
      </div>
      <div class="row-equal">
        <div>
          <toggle label="Is RTL?" v-model="newProject.isRTL" :size=".8"></toggle>
        </div>
        <div>
          <toggle label="Is dark?" v-model="newProject.isDark" :size=".8"></toggle>
        </div>
      </div>
      <div class="row-equal">
        <div class="input-container">
          <label for="lang">
            Project language
          </label>
          <input type="text" id="lang" v-model="newProject.lang" placeholder="Project language..."/>
        </div>
        <div class="input-container">
          <label for="country">
            Project country
          </label>
          <input type="text" id="country" v-model="newProject.country" placeholder="Project county..."/>
        </div>
      </div>

      <!--     WIP: template here must be add here    -->
    </div>
    <div id="permission" v-if="stepIndex === 2">
      <div class="row-equal">
        <div>
          <toggle icon="ri-wifi-line" label="Internet permission" v-model="newProject.permissions.internet"
                  :size=".8"></toggle>
        </div>
        <div>
          <toggle icon="ri-database-2-line" label="Storage  permission" v-model="newProject.permissions.storage"
                  :size=".8"></toggle>
        </div>
      </div>
      <div class="row-equal">
        <div>
          <toggle icon="ri-camera-line" label="Camera permission" v-model="newProject.permissions.camera"
                  :size=".8"></toggle>
        </div>
        <div>
          <toggle icon="ri-mic-line" label="Microphone permission" v-model="newProject.permissions.microphone"
                  :size=".8"></toggle>
        </div>
      </div>
      <div class="row-equal">
        <div>
          <toggle icon="ri-contacts-book-2-line" label="Contact permission" v-model="newProject.permissions.contact"
                  :size=".8"></toggle>
        </div>
        <div>
          <toggle icon="ri-phone-line" label="Call logs permission" v-model="newProject.permissions.callLog"
                  :size=".8"></toggle>
        </div>
      </div>
      <div class="row-equal">
        <div>
          <toggle icon="ri-message-2-line" label="SMS permission" v-model="newProject.permissions.sms"
                  :size=".8"></toggle>
        </div>
        <div>
          <toggle icon="ri-map-pin-line" label="Location permission" v-model="newProject.permissions.location"
                  :size=".8"></toggle>
        </div>
      </div>
    </div>
    <div id="compile" v-if="stepIndex === 3">
      <div class="row-equal">
        <div>
          <toggle icon="ri-android-line" label="Andriod" v-model="newProject.platforms.andriod" :size=".8"></toggle>
        </div>
        <div>
          <toggle icon="ri-apple-line" label="iOS" v-model="newProject.platforms.ios" :size=".8"></toggle>
        </div>
      </div>
      <div class="row-equal">
        <div>
          <toggle icon="ri-global-line" label="Web" v-model="newProject.platforms.web" :size=".8"></toggle>
        </div>
        <div>
          <toggle icon="ri-ubuntu-line" label="Linux" v-model="newProject.platforms.linux" :size=".8"></toggle>
        </div>
      </div>
      <div class="row-equal">
        <div>
          <toggle icon="ri-finder-line" label="MacOS" v-model="newProject.platforms.macOS" :size=".8"></toggle>
        </div>
        <div>
          <toggle icon="ri-windows-line" label="Windows" v-model="newProject.platforms.windows" :size=".8"></toggle>
        </div>
      </div>
      <div class="input-container">
        <label for="def">
          Default platform
        </label>
        <select v-model="newProject.defaultPlatform" id="def" disabled>
          <template v-for="(hasPlatform,i) in newProject.platforms" :key="i">
            <option :value="i" v-if="hasPlatform">
              {{ i }}
            </option>
          </template>
        </select>
        <p class="note">
          The predefined platform in this version is Android.
        </p>
      </div>
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
import {mapActions} from 'vuex';
import prjTemplate from '../../stores/assets/projectTemplate.json';
import defaultPage from '../../stores/components/defaultPage.json';

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
      newProject: prjTemplate,
    }
  },
  mounted() {
    this.$refs.name.focus();
    btnWave();
  },
  computed: {
    ...mapState(['ide', 'project'])
  },
  methods: {
    ...mapActions(['createProject']),
    prv() {
      if (this.stepIndex === 0) {
        this.$router.back();
      } else {
        this.stepIndex--;
      }
    },
    nxt() {
      if (this.stepIndex === this.projectSteps.length - 1) {

        // create project and go to main page
        this.newProject.pages = [];

        // WIP add page by template
        // if add template we must edit this loop
        for (let i = 0; i < this.newProject.pageCount; i++) {
          this.newProject.pages.push(defaultPage);
        }
        this.createProject(this.newProject);
        this.$router.push('/main');
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

.row-equal {
  padding-top: 1em;
}

.row-equal > div {
  padding: .5rem;
}
</style>