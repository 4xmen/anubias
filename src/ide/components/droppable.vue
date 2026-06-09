<template>
  <div @drop="droppingNow" @dragover="droppingOver" :style="getDroppableStyle">
    <slot>

    </slot>
  </div>
</template>

<script>
import {mapState} from 'vuex';

export default {
  name: "droppable",
  props: {
    area: {
      default: 'drop',
      type: String,
    },
    dropping:{
      type: Function,
      default:() =>{},
    }
  },
  computed: {
    ...mapState(['ide']),
    getDroppableStyle() {
      let style = '';
      if (this.ide.dropArea.length > 0) {
        // show valid or invalid to drop
        if (this.ide.dropArea === this.area) {
          style += 'background:rgba(0,255,0,.25);cursor: copy;';
        }else{
          style += 'background:rgba(255,0,0,.25); cursor:  not-allowed';
        }
      }
      return style;
    },
  },
  methods: {
    droppingOver(e) {
      e.preventDefault();
      // change cursor
      if (this.ide.dropArea !== this.area) {
        e.dataTransfer.dropEffect = 'move';
      }
    },
    droppingNow(e) {
      e.preventDefault();
      this.dropping(this.ide.draggedData);
      // e.target.appendChild(document.getElementById(data));
      // console.log(e.dataTransfer.getData('text'));
    }
  }
}
</script>

<style scoped>

</style>