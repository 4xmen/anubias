<template>
  <div :draggable="isActive" @dragstart="draggingStart" @dragend="draggingEnd"
       class="draggable" :data-area="area" :data-name="detail" >
    <slot></slot>
  </div>
</template>

<script>
import {mapState} from 'vuex';

export default {
  name: "draggable",
  props: {
    isActive: {
      default: true,
      type: Boolean,
    },
    area: {
      required: true,
      type: String,
      default: 'drop',
    },
    detail: {
      required: true,
      type: String,
    },
  },
  computed: {
    ...mapState(['ide']),
  },
  methods: {
    draggingEnd(e) {
      e.preventDefault();
      this.setDragData({});
      this.setDropArea('');
    },
    draggingStart(e) {
      let data = {};
      for (let i = 0; i < e.target.attributes.length; i++) {
        const attr = e.target.attributes[i];
        if (attr.name.indexOf('v-') !== 0) {
          if (attr.name.indexOf('data') === 0) {
            data[attr.name.substr(5)] = attr.value;
          } else {
            data[attr.name] = attr.value;
          }
        }
      }
      this.setDropArea(data.area);
      e.dataTransfer.setData("text", JSON.stringify(data));
      // console.log(e.dataTransfer.getData('text'));
      this.setDragData(data);
    },
    setDragData(data) {
      this.$store.dispatch('ide/setDragData', data);
    },
    setDropArea(area) {
      this.$store.dispatch('ide/setDropArea', area);
    },
  }
}
</script>

<style scoped>
.draggable {

}
</style>