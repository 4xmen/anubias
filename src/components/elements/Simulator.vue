<template>
  <div>
    <div v-if="type === 'preloader'">
      <preloader :properties="properties" :scale="scale"></preloader>
    </div>
  </div>
</template>

<script>
import preloader from '../flutter/Preloader';
export default {
  name: "Simulator",
  components: {
    preloader
  },
  props: {
    properties: {
      default: function () {
        return {}
      },
      type: Object
    },
    type: {
      type: String,
      default: 'text',
    },
    scale:{
      type: Number,
      default: 0
    }
  }
}
</script>

<style scoped>

</style>