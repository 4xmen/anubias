<template>
  {{properties}}
</template>

<script>
import {mapState} from 'vuex';
export default {
  name: "properties-panel",
  computed:{
    ...mapState('ide',{
      properties: 'onEditComponent',
    }),
  }
}
</script>

<style scoped>

</style>