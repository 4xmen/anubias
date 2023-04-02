<template>
  <div>
    <div class="idle" v-if="onEdit.type === undefined">
      <div>
        <i class="ri-compasses-2-line"></i>
        Click on any page or component to edit...
      </div>
    </div>
    <classic v-else-if="properties.classic"></classic>
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
      onEdit: 'onEditComponent',
    })
  }
}
</script>

<style scoped>
.idle{
  min-height: 15rem;
  padding: .7rem;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-weight: 200;
}
.idle i{
  display: block;
  font-size: 50px;
  animation: infinite 5s ;
  animation-name: rotateNow ;
}

@keyframes rotateNow {
  0%{
    transform: rotateY(0deg);
  }
  45%{
    transform: rotateY(0deg);
  }
  50%{
    transform: rotateY(90deg);
  }
  55%{
    transform: rotateY(0deg);
  }
  100%{
    transform: rotateY(0deg);
  }
}
</style>