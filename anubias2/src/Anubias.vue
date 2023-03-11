<template>
  <div id="app" :style="appStyle">
    <div id="tabs">
      tabs
    </div>
    <div id="buttons">
      buttons
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
        <i class="ri-checkbox-indeterminate-line" @click="togglePropertiesCollapse" ></i>
      </h3>
    </div>
    <div id="pages" :class="pagesClass">
      <h3 @click="expandPages">
        pages
        <i class="ri-checkbox-indeterminate-line" @click="togglePagesCollapse"></i>
      </h3>
    </div>
    <div id="terminal-btn">
      <i class="ri-terminal-line"></i>
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
    ...mapActions(['setIdeTitle','toggleComponentsCollapse','togglePropertiesCollapse','togglePagesCollapse']),
    expandComponents(e){
      if (this.ide.components.collapsed && e.target.tagName !== 'I'){
        this.toggleComponentsCollapse();
      }
    },
    expandProperties(e){
      if (this.ide.properties.collapsed && e.target.tagName !== 'I'){
        this.togglePropertiesCollapse();
      }
    },
    expandPages(e){
      if (this.ide.pages.collapsed && e.target.tagName !== 'I'){
        this.togglePagesCollapse();
      }
    },
  },computed:{
    ...mapState(['ide']),
    componentsClass(){
      if (this.ide.components.collapsed){
        return 'collapsed';
      }
      return '';
    },
    propertiesClass(){
      if (this.ide.properties.collapsed){
        return 'collapsed';
      }
      return '';
    },
    pagesClass(){
      if (this.ide.pages.collapsed){
        return 'collapsed';
      }
      return '';
    },
    appStyle(){
      let style = '';
      if (this.ide.pages.collapsed){
        style += 'grid-template-rows: 2em 2em 5fr 5fr 30px;';
      }
      return style;
    },
    propertiesStyle(){
      let style = '';
      // if one of them expanded
      if (this.ide.components.collapsed ^ this.ide.properties.collapsed){
          style += 'grid-row: 3 / 5;';
      }
      if (this.ide.components.collapsed && !this.ide.properties.collapsed){
        style += 'grid-column: 16 / 19;';
      }
      return style;
    },
    componentsStyle(){
      let style = '';
      // if one of them expanded
      if (this.ide.components.collapsed ^ this.ide.properties.collapsed){
          style += 'grid-row: 3 / 5;';
      }
      if (this.ide.properties.collapsed && !this.ide.components.collapsed){
        style += 'grid-column: 16 / 19;';
      }
      return style;
    }
  }
}
</script>

<style scoped>
 h3{
   background: var(--def-bg);
   text-align: center;
   font-weight: 100;
   position: relative;
   overflow: hidden;
 }
 h3 i{
   position: absolute;
   padding: 0 4px;
   left: 0;
   font-weight: 100;
 }
 h3 i:hover{
   background: var(--lighter-bg);
 }

 #terminal-btn{
   position: fixed;
   left: 0;
   bottom: 0;
   background: var(--def-bg);
   border: 1px solid var(--darker-bg);
   width: 30px;
   height: 30px;
   display: flex;
   justify-content: center;
   align-items: center;
   transition: var(--transition-duration);
 }

 #terminal-btn:hover{
   background: var(--lighter-bg);
 }
</style>