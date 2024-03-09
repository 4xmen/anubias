<template>
  <droppable area="non-visual" :dropping="dropping" class="drop-non-visual">
    Drop non-visual component here...
  </droppable>
</template>

<script>
import droppable from "./droppable.vue";
import {mapGetters, mapState} from "vuex";
export default {
  name: "non-visual-panel",
  components:{droppable},
  computed:{
    ...mapState('ide', ['defaultComponents']),
    ...mapGetters(
        'ide', ['currentPage', 'activePageIndex']
    ),
  },
  methods:{
    dropping(data){
      // check is valid area or not
      if ('non-visual' === data.area) {
        // add component to active page
        this.$store.dispatch('project/addComponentToPage', {
          pageIndex: this.activePageIndex,
          isVisual: false,
          component: this.defaultComponents[data.name]
        });
      } else {
        console.log('invalid area');
      }
    }
  }
}
</script>

<style scoped>
.drop-non-visual{
  min-height: 5rem;
  border: 1px dashed gray;
  display: flex;
  color: var(--text-color);
  align-items: center;
  justify-content: center;
  border-radius: 3px;
  font-weight: 200;
  margin: .5em;
}
</style>