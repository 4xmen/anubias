<template>
  <div id="modal" :style="'display:'+(active?'flex':'none')" >
    <div class="container no-blur" >
      <h4>
        {{title}}
      </h4>
      <i class="fa fa-times" @click="active=false"></i>
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
    },
    title:{
      type: String,
      default: "Code editor"
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
#modal h4{
  font-size: 22px;
  margin-bottom: .5em;
  padding-bottom: 4px;
  border-bottom: 1px solid black;
  color: orangered;
}
#modal .container{
  padding: 25px;
  background: #272c34;
  position: relative;
}
.fa-times{
  color: red;
  position: absolute;
  left: -7px;
  top: -12px;
  font-size: 25px;
}
</style>