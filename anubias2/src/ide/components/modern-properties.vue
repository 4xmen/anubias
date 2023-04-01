<template>
  {{properties}}
</template>

<script>
import {mapState} from 'vuex';
export default {
  name: "modern-properties",
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