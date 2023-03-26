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
        if (this.ide.dropArea === this.area) {
          console.log('yes');
          style += 'background:rgba(0,255,0,.25)';
        }else{
          console.log('no');
          style += 'background:rgba(255,0,0,.25)';
        }
      }
      return style;
    },
  },
  methods: {
    droppingOver(e) {
      e.preventDefault();
      let data = this.ide.draggedData;
      console.log(data['area'] === this.area);
      // console.log(data['data-mode'] === this.area);
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