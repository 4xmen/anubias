<template>
  <div class="container">
    <h1>
      New project
    </h1>
    <steps :steps="projectSteps" v-model="stepIndex"></steps>
    <div id="basic" v-if="stepIndex === 0">
      <div class="row-equal">

        <div class="input-container">
          <label for="name">
            Project name
          </label>
          <input ref="name" type="text" id="name" @blur="updatePackage" v-model="newProject.name"
                 placeholder="Project name here..."/>
        </div>
        <div class="input-container">
          <label for="version">
            Project version
          </label>
          <input type="text" id="version" v-model="newProject.version" placeholder="Project version here..."/>
        </div>
        <div class="input-container">
          <label for="package">
            Project package name
          </label>
          <input type="text" id="package" v-model="newProject.packageName" placeholder="Project package name here..."/>
        </div>
      </div>
      <div class="input-container">
        <label for="description">
          Project description
        </label>
        <textarea id="description" v-model="newProject.description"
                  placeholder="Project description here..."></textarea>
      </div>
      <div class="row-equal">
        <div class="input-container">
          <label for="page-count">
            Initial page count
          </label>
          <input type="number" min="1" max="10" id="page-count" v-model="newProject.pageCount"
                 placeholder="Number of page you want to initial project..."/>
        </div>
        <div class="input-container">
          <label for="icon">
            Icon
          </label>
          <div class="material-button" id="select-icon" @click="selectIcon">
            <i class="ri-leaf-line"></i>
            Change Icon
          </div>
          <input type="file" id="change-icon" accept="image/png" @change="selectImage">
        </div>
        <div>
          <img :src="getIcon" id="app-logo" alt="[app icon]">
        </div>
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
      <p>
        This options just for start application, You can change them while app running:
      </p>
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
        <div>
          <div class="fix-top"></div>
          <toggle label="Is dark?" v-model="newProject.isDark" :size=".8"></toggle>
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
import {useToast} from "vue-toastification";

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
    ...mapState(['ide', 'project']),
    getIcon() {
      console.log(this.newProject.icon);
      if (this.newProject.icon == null) {
        return "./src/ide/assets/svg/logo/anubias-logo.svg";
      } else {
        return this.newProject.icon;
      }
    }
  },
  methods: {
    ...mapActions({
      'createProject': 'project/createProject'
    }),
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
        let page = defaultPage;
        for (let i = 0; i < this.newProject.pageCount; i++) {
          page.name = 'page' + (i + 1);
          this.newProject.pages.push({...page});
        }
        this.createProject(this.newProject);
        this.$router.push('/main');

      } else {
        this.stepIndex++;
      }
    },
    updatePackage() {
      let packageName = this.newProject.packageName.split(".");
      packageName[packageName.length - 1] = this.newProject.name.split(' ').join('');
      this.newProject.packageName = packageName.join('.');
      // this.$forceUpdate();
    },
    selectIcon() {
      document.querySelector('#change-icon').click();
    },
    selectImage(e) {
      const toast = useToast();
      if (!e.target.files) return;

      let files = e.target.files;
      for (let i = 0; i < files.length; i++) {

        let base64;
        let fileToLoad = e.target.files[i]
        let fileReader = new FileReader();
        fileReader.onload =  (fileLoadedEvent) => {
          let img = new Image();
          base64 = fileLoadedEvent.target.result;
          img.onload =  () => {
            if (base64.split(';')[0] !== "data:image/png") {
              toast.error("Image is not png!");
            } else if (img.width === 512 && img.height === 512) {
              this.newProject.icon = base64;
              toast.info("Icon changed");
            } else {
              toast.warning("You need select image (512x512), Your image is: (" + img.width + 'x' + img.height + ")");
            }
          };

          img.src = base64;
        };
        fileReader.readAsDataURL(fileToLoad);
      }
    },
  }
}
</script>

<style scoped>

p{
  padding: 1.45em 0 0;
}

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


#select-icon {
  margin-top: 4px;
  //width: 150px;
}

#app-logo {
  width: 110px;
  margin: auto;
  display: block;
}

#change-icon {
  display: none;
}

.fix-top{
  padding-top: 2.2em;
}
</style>