<template>
  <div>
    classic
  </div>
</template>

<script>
import {mapState} from 'vuex';
export default {
  name: "classic-properties",
  components:{},
  data(){
    return{

    }
  },
  mounted() {
  },
  computed:{
    ...mapState('ide',{
      properties:'onEditComponent',
    })
  },
  methods:{

  }
}
</script>

<style scoped>

</style>