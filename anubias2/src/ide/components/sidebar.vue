<template>
  <div class="side">
    <div class="icons">
      <div :class="getItemClass(0)" class="item" title="non-visual components" @click="setActiveIndex(0)">
        <i class="ri-eye-off-line"></i>
      </div>
      <div :class="getItemClass(1)" class="item" title="properties" @click="setActiveIndex(1)">
        <i class="ri-pen-nib-line"></i>
      </div>
      <div :class="getItemClass(2)" class="item" title="pages" @click="setActiveIndex(2)">
        <i class="ri-file-copy-line"></i>
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
      <div v-else-if="activeIndex === 1">
        <properties></properties>
      </div>
      <div v-else-if="activeIndex === 2" id="pages">
        <div id="page-container">

          <Sortable
              :list="project.project.pages"
              item-key="name"
              tag="div"
              @update="updatePageSort"
          >
            <template #item="{element, index}">
              <div :key="element.name" :class="`draggable page `+(ide.activePage === index?'active':'')"
                   @click="changePage(index)">
                <div :style="`background-image: url(${element.preview})`" class="img">

                </div>
                {{ element.name }}
              </div>
            </template>
          </Sortable>
          <!--          <div v-for="(page,i) in project.project.pages"-->
          <!--               :key="i"-->
          <!--               :class="`page `+(ide.activePage === i?'active':'')" @click="changePage(i)">-->
          <!--            <div :style="`background-image: url(${page.preview})`" class="img">-->

          <!--            </div>-->
          <!--            {{ page.name }}-->
          <!--          </div>-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import nonVisual from "../components/non-visual-panel.vue";
import properties from "../components/properties-panel.vue";
import {mapState, mapGetters} from "vuex";
import {arrayMove} from "../js/general-functions";

import {Sortable} from "sortablejs-vue3";


export default {
  name: "sidebar",
  components: {
    nonVisual,
    properties,
    Sortable
  },
  data() {
    return {
      activeIndex: 0,
      activePageName: '',
    }
  },
  mounted() {
  },
  computed: {
    ...mapState(['ide', 'project']),
    ...mapGetters(
        'project', ['pages']
    ),
  },
  methods: {
    changePage(i) {
      this.$store.dispatch('ide/setActivePage', i);
      this.$store.dispatch('setOnEditComponent', this.project.project.pages[i]);
    },
    setActiveIndex(i) {
      this.activeIndex = i;
    },
    getItemClass(i) {
      if (i === this.activeIndex) {
        return 'active';
      }
      return '';
    },
    fixActivePage() {
      let pages = this.project.project.pages;
      for (let i in pages) {
        if (pages[parseInt(i)].name === this.activePageName) {
          // console.log('e', this.activePageName);
          this.changePage(parseInt(i));
          break;
        }
      }
    },
    updatePageSort(e) {

      this.activePageName = this.project.project.pages[this.ide.activePage].name;
      // console.log('s', this.activePageName);
      arrayMove(this.project.project.pages, e.oldIndex, e.newIndex);
      setTimeout(this.fixActivePage, 100);

    }
  }
}
</script>

<style scoped>

#content {
  background: var(--darker-bg);
}

#non-visual-component {
  min-height: 5em;
  overflow-x: hidden;
}

.side {
  display: grid;
  grid-template-columns: 50px 1fr;
}

.icons {
  height: 100%;
  background: var(--def-bg);
}

.icons .item {
  text-align: center;
  font-size: 30px;
  padding: 0 5px;
  border-left: 3px solid var(--def-bg);
  transition: var(--transition-duration);
  display: flex;
  justify-content: center;
  align-items: center;
}

.icons .item.active {
  border-color: var(--text-hilight);
  background: var(--darker-bg);
}

.icons .item:hover {
  background: var(--darker-bg);
}


#pages #page-container {
  overflow: hidden;
  overflow-x: auto;
}

#pages #page-container .page {
  width: 7.81rem;
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
  background-size: 100% auto;
  background-repeat: no-repeat;
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
</style>