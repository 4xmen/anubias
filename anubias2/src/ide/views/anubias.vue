<template>
  <div id="app" :style="appStyle">
    <div id="tabs">
      <div class="tab active">
        Main
      </div>
      <div class="tab">
        <i class="ri-close-line close"></i>
        Other tab sample

      </div>
    </div>
    <div id="buttons">
      <div id="device-selector">
        <span>
          Device:
        </span>
        <select v-model="activeDevice" style="width: 60%">
          <option v-for="(device,i) in ide.devices" :value="i" :key="i">
            {{ device.name }}
          </option>
        </select>
      </div>
      <div>
        <icon-button id="orient" v-model="orient" :list="orients" :no-border-y="true"></icon-button>
      </div>
      <div>
        <buttons id="zooms" v-model="zoom" :list="deviceZoom" :no-border-y="true"></buttons>
      </div>
      <div>
        <i class="ri-play-line"></i>
        <i class="ri-bug-line"></i>
        <i class="ri-terminal-line"></i>
        <i class="ri-wifi-line"></i>
      </div>
    </div>
    <div id="main" :style="mainStyle">
      <div class="grid">
        <div class="side">
          <div id="non-visual-component">
            <router-link to="/settings">
              go setting test
            </router-link>

            <h1 id="test" @click="test">
              test
            </h1>
          </div>
        </div>
        <div id="device-container">
          <device></device>
        </div>
      </div>

    </div>
    <div id="components" :class="componentsClass" :style="componentsStyle">
      <h3 @click="expandComponents">
        <span>
          Components
        </span>
        <i class="ri-checkbox-indeterminate-line" @click="toggleComponentsCollapse"></i>
      </h3>
      <div id="components-available" :class="ide.components.mode+ ' sub-panel'">
        <div class="component" v-for="(component,i) in ide.components.list" :key="i">
          <i :class="component.icon"></i>
          {{ component.title }}
        </div>
      </div>
    </div>
    <div id="properties" :class="propertiesClass" :style="propertiesStyle">
      <h3 @click="expandProperties">
        <span>
          Properties
        </span>
        <i class="ri-checkbox-indeterminate-line" @click="togglePropertiesCollapse"></i>
      </h3>
    </div>
    <div id="pages" :class="pagesClass">
      <h3 @click="expandPages">
        pages
        <i class="ri-checkbox-indeterminate-line" @click="togglePagesCollapse"></i>
      </h3>
      <div id="page-container">
        <div v-for="(page,i) in project.project.pages"
             :class="`page `+(ide.activePage === i?'active':'')"
             @click="changePage(i)" :key="i">
          <div class="img" :style="`background-image: url(${page.preview})`">

          </div>
          {{ page.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex';
import {mapGetters} from 'vuex';
import buttons from "../components/buttons.vue";
import iconButton from "../components/iconButton.vue";
import device from "../components/device.vue";
import Store from 'electron-store';

const storage = new Store();

export default {
  name: "anubias",
  components: {buttons, iconButton, device},
  data: () => {
    return {
      deviceZoom: ['AUTO', '120%', '100%', '75%', '50%'],
      orients: ['<i class="ri-smartphone-line"></i>', '<i class="ri-smartphone-line r90deg"></i>'],
    };
  },
  mounted() {
    // this.setIdeTitle('AnubiasApp');
    this.$store.dispatch('setIdeTitle', 'AnubiasApp');
    this.initialLoadProject();

  }, computed: {
    ...mapState(['ide', 'project']),
    ...mapGetters(
        'project', ['getPage']
    ),
    ...mapGetters(
        'ide', ['currentPage']
    ),
    zoom: {
      get() {
        return this.$store.state.ide.device.zoom;
      },
      set(value) {
        this.$store.commit('ide/UPDATE_DEVICE_ZOOM', value)
      }
    },
    activeDevice: {
      get() {
        return this.$store.state.ide.device.active;
      },
      set(value) {
        this.$store.commit('ide/UPDATE_DEVICE_ACTIVE', value)
      }
    },
    orient: {
      get() {
        return this.$store.state.ide.device.orient;
      },
      set(value) {
        this.$store.commit('ide/UPDATE_DEVICE_ORIENT', value)
      }
    },
    componentsClass() {
      if (this.ide.components.collapsed) {
        return 'collapsed';
      }
      return '';
    },
    propertiesClass() {
      if (this.ide.properties.collapsed) {
        return 'collapsed';
      }
      return '';
    },
    pagesClass() {
      if (this.ide.pages.collapsed) {
        return 'collapsed';
      }
      return '';
    },
    appStyle() {
      let style = '';
      // full height others panel when page closed
      if (this.ide.pages.collapsed) {
        style += 'grid-template-rows: 2em 2em 5fr 5fr 30px;';
      }
      return style;
    },
    mainStyle() {
      let style = '';
      // if right panels collapsed
      if (this.ide.components.collapsed && this.ide.properties.collapsed) {
        style += 'grid-column: 1 / 19;';
      }
      return style;
    },
    propertiesStyle() {
      let style = '';
      // if one of them expanded
      if (this.ide.components.collapsed ^ this.ide.properties.collapsed) {
        style += 'grid-row: 3 / 5;';
      }
      // full height properties when component closed
      if (this.ide.components.collapsed && !this.ide.properties.collapsed) {
        style += 'grid-column: 16 / 19;';
      }
      return style;
    },
    componentsStyle() {
      let style = '';
      // if one of them expanded
      if (this.ide.components.collapsed ^ this.ide.properties.collapsed) {
        style += 'grid-row: 3 / 5;';
      }

      // full height component when properties closed
      if (this.ide.properties.collapsed && !this.ide.components.collapsed) {
        style += 'grid-column: 16 / 19;';
      }
      return style;
    }
  },
  methods: {
    expandComponents(e) {
      if (this.ide.components.collapsed && e.target.tagName !== 'I') {
        this.toggleComponentsCollapse();
      }
    },
    expandProperties(e) {
      if (this.ide.properties.collapsed && e.target.tagName !== 'I') {
        this.togglePropertiesCollapse();
      }
    },
    expandPages(e) {
      if (this.ide.pages.collapsed && e.target.tagName !== 'I') {
        this.togglePagesCollapse();
      }
    },
    initialLoadProject() {
      // check if project
      try {
        if (this.$store.state.project.pages.length === []) {
          this.$store.dispatch('project/loadProject', storage.get('lastCreatedProject'));

        } else {
          // set entry point  to active
          this.$store.dispatch('ide/setActivePage', this.$store.state.project.project.entryPoint);
        }
      } catch (e) {
        console.log(e.message);
        this.$store.dispatch('project/loadProject', storage.get('lastCreatedProject'));
      }
    },
    changePage(i) {
      this.$store.dispatch('ide/setActivePage', i);
    },
    test() {
      let page = this.currentPage;
      page.name = 'pageMain';
      this.$store.commit('ide/UPDATE_CURRENT_PAGE', page);
      console.log(this.getPage(0));
      console.log(this.currentPage);
    }
  },
}
</script>

<style scoped>
h3 {
  background: var(--def-bg);
  text-align: center;
  font-weight: 100;
  position: relative;
  overflow: hidden;
}

h3 i {
  position: absolute;
  padding: 0 4px;
  left: 0;
  font-weight: 100;
  transition: var(--transition-duration);
}

h3 i:hover {
  box-shadow: inset 0 0 0 20px var(--lighter-bg);
  color: var(--text-hilight);
}

#app {
  user-select: none;
}

#buttons {
  display: grid;
  grid-template-columns: 4fr 2fr 4fr 5fr;
}

#buttons i {
  padding: 5px 15px;
  font-size: 22px;
  border-left: 1px solid var(--lighter-bg);
  transition: var(--transition-duration);
}

#buttons i:last-child {
  border-right: 1px solid var(--lighter-bg);
}

#buttons i:hover {
  box-shadow: inset 0 0 0 20px var(--lighter-bg);
  color: var(--text-hilight);
}

#buttons div:last-child {
  text-align: end;
}

#device-selector span {
  display: inline-block;
  padding: 5px;
  margin-right: 1em;
}

#device-selector select {
  min-width: 50%;
}

#zooms {
  text-align: end;
  max-width: 20em;
}

#orient {
  width: 6em;
}

#main .grid {
  display: grid;
  grid-template-columns: 300px 9fr;
  height: 100%;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}

#main .side {
  padding: 5px;
}

#non-visual-component {
  min-height: 5em;
  background: var(--darker-bg);
  margin-top: 0;

}

#components-available {
  height: calc(100% - 1em);
  overflow-y: auto;
  padding-bottom: 2em;
}

#components-available.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  text-align: center;
  font-size: 90%;
  height: 95%;
}

#components-available .component {
  font-weight: 100;
  cursor: pointer;
  padding: 3px;
}

#components-available .component:hover {
  background: #00000033;
}


#components-available.grid .component i {
  display: block;
  font-size: 35px;
  margin: auto;
  width: 35px;
}

#components-available.list .component i {
  position: relative;
  top: 2px;
}

#components-available.list .component:last-child {
  margin-bottom: 1em;
}

#tabs {
}

#tabs .tab {
  position: relative;
  padding: 5px 25px 3px 7px;
  text-align: center;
  border-right: 1px solid var(--lighter-bg);
  display: inline-block;
}

#tabs .tab:first-child {
  padding: 4px 7px 3px;
  width: 7%;
}

#tabs .tab .close {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  padding: 4px;
  color: var(--lighter-bg);
}

#tabs .tab:hover .close {
  color: darkred;
}

#tabs .tab.active {
  color: var(--text-hilight);
}

#pages #page-container {
  overflow: hidden;
  overflow-x: auto;
}

#pages #page-container .page {
  width: 7rem;
  display: inline-block;
  text-align: center;
  margin-top: .5rem;
  font-weight: 100;
  transition: var(--transition-duration);
}

#pages.collapsed #page-container {
  display: none;
}

#pages #page-container .page.active {
  color: var(--text-hilight);
  font-weight: 400;
}

#pages #page-container .page .img {
  display: block;
  height: 110px;
  width: 75%;
  border: 1px solid var(--darker-bg);
  background-color: #fff;
  margin: .5rem auto;
  background-size: contain;
  background-position: top center;
  border-radius: 5px;
  transition: var(--transition-duration);
}

#pages #page-container .page.active .img {
  box-shadow: 0 0 5px var(--text-hilight);
  border: 1px solid var(--text-hilight);
  border-radius: 0;
  animation: linear .5s;
  animation-name: choosePage;
}

@keyframes choosePage {
  0% {
    transform: scale(1);
  }
  35% {
    transform: scale(.85);
  }
  65% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
</style>