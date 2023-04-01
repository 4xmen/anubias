<template>
  <div>
    <classic v-if="properties.classic"></classic>
    <modern v-else></modern>
  </div>
</template>

<script>
import classic from './classic-properties.vue';
import modern from './modern-properties.vue';
import {mapState} from 'vuex';
export default {
  name: "properties-panel",
  components:{classic,modern},
  computed:{
    ...mapState('ide',{
      properties:'properties',
    })
  }
}
</script>

<style scoped>

</style>