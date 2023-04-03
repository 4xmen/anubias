<template>
  <div class="side">
    <div class="icons">
      <div class="item" :class="getItemClass(0)" @click="setActiveIndex(0)">
        <i class="ri-eye-off-line"></i>
      </div>
      <div class="item" :class="getItemClass(1)" @click="setActiveIndex(1)">
        <i class="ri-pen-nib-line"></i>
      </div>
    </div>
    <div id="content">
      <div id="non-visual-component" v-if="activeIndex === 0">
        <non-visual></non-visual>
        <router-link to="/settings">
          go setting test
        </router-link>

        <h1 id="test">
        </h1>
      </div>
      <div v-else-if="activeIndex === 1" >
        <properties ></properties>
      </div>
    </div>
  </div>
</template>

<script>
import nonVisual from "../components/non-visual-panel.vue";
import properties from "../components/properties-panel.vue";

export default {
  name: "sidebar",
  components:{nonVisual,properties},
  data(){
    return {
      activeIndex: 0,
    }
  },
  computed:{

  },
  methods:{
    setActiveIndex(i){
      this.activeIndex = i;
    },
    getItemClass(i){
      if (i === this.activeIndex){
        return 'active';
      }
      return '';
    }
  }
}
</script>

<style scoped>

#content{
  background: var(--darker-bg);
}

#non-visual-component {
  min-height: 5em;
  overflow-x: hidden;
}

.side{
  display: grid;
  grid-template-columns: 50px 1fr;
}

.icons{
  height: 100%;
  background: var(--def-bg);
}
.icons .item{
  text-align: center;
  font-size: 30px;
  padding: 0 5px;
  border-left: 3px solid var(--def-bg);
  transition: var(--transition-duration);
  display: flex;
  justify-content: center;
  align-items: center;
}
.icons .item.active{
  border-color: var(--text-hilight);
  background: var(--darker-bg);
}
.icons .item:hover{
  background: var(--darker-bg);
}
</style>