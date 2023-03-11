<template>
  <div id="app" :style="appStyle">
    <div id="tabs">
      tabs
    </div>
    <div id="buttons">
      <div id="device-selector">
        <span>
          Device:
        </span>
        <select>
          <option value=""> Device</option>
        </select>
      </div>
      <div></div>
      <div>
        <i class="ri-play-line"></i>
        <i class="ri-bug-line"></i>
        <i class="ri-terminal-line"></i>
      </div>
      <div>
        <i class="ri-wifi-line"></i>
      </div>
    </div>
    <div id="content">
      content
    </div>
    <div id="components" :class="componentsClass" :style="componentsStyle">
      <h3 @click="expandComponents">
        <span>
          Components
        </span>
        <i class="ri-checkbox-indeterminate-line" @click="toggleComponentsCollapse"></i>
      </h3>
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
    </div>
  </div>
</template>

<script>
import {mapActions} from 'vuex';
import {mapState} from 'vuex';

export default {
  name: "Anubias",
  mounted() {
    this.setIdeTitle('AnubiasApp');
  }, methods: {
    ...mapActions(['setIdeTitle', 'toggleComponentsCollapse', 'togglePropertiesCollapse', 'togglePagesCollapse']),
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
  }, computed: {
    ...mapState(['ide']),
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
      if (this.ide.pages.collapsed) {
        style += 'grid-template-rows: 2em 2em 5fr 5fr 30px;';
      }
      return style;
    },
    propertiesStyle() {
      let style = '';
      // if one of them expanded
      if (this.ide.components.collapsed ^ this.ide.properties.collapsed) {
        style += 'grid-row: 3 / 5;';
      }
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
      if (this.ide.properties.collapsed && !this.ide.components.collapsed) {
        style += 'grid-column: 16 / 19;';
      }
      return style;
    }
  }
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


#buttons {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
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

#device-selector select{
  min-width: 50%;
}
</style>