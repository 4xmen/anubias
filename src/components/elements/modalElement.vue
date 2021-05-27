<template>
  <div id="modal" :style="'display:'+(active?'flex':'none')" >
    <div class="container no-blur" >
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "modalElement",
  data:function () {
    return{
      test: false,
    }
  },
  props:{
    active:{
      type: Boolean,
      default: false,
    }
  },
  methods: {
  },watch:{
    active:function (e) {
      var $ = window.jQuery;

      if(e){
        $('#wrapper').addClass('blur');
      }else {
        $('#wrapper').removeClass('blur');
      }
    }
  }
}
</script>

<style scoped>
#modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  justify-content: center;
  align-items: center;
  z-index: 999;
  background: rgba(0, 0, 0, 0.5);
}
</style>