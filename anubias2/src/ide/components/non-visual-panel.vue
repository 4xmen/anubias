<template>
  <droppable area="non-visual" :dropping="dropping" class="drop-non-visual">
    Drop non-visual component here...
  </droppable>
</template>

<script>
import droppable from "./droppable.vue";
export default {
  name: "non-visual-panel",
  components:{droppable},
  computed:{

  },
  methods:{
    dropping(data){
      console.log(data);
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