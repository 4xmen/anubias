<template>
  <div id="components-available" :class="ide.components.mode+ ' sub-panel'">
    <draggable class="component"
               v-for="(component,i) in ide.components.list" :key="i" :isActive="component.active"
               :detail="component.name" :area="(component.visual?'visual':'non-visual')">
      <i :class="component.icon"></i>
      {{ component.title }}
    </draggable>
  </div>
</template>

<script>
import {mapState} from 'vuex';
import draggable from "./draggable.vue";
export default {
  name: "components",
  components:{draggable},
  computed:{
    ...mapState(['ide']),
  }
}
</script>

<style scoped>
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
</style>