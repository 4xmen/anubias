<template>
  <div class="terminal">
    <i class="fa fa-circle red-text" @click="closeModal"></i>
    <i class="fa fa-circle yellow-text text-darken-2"></i>
    <i class="fa fa-circle green-text text-lighten-2"></i>
    <span class="clear" @click="clear">
      <span class="material-icons">clear_all</span>
    </span>


    <div class="content" id="container">
      <slot></slot>
    </div>
  </div>
</template>

<script>
var $;
export default {
  name: "TerminalElement",
  mounted() {
     $ = window.jQuery;
  },
  methods:{
    closeModal:function () {
      this.$parent.$parent.closeAllModal();
    },
    clear:function () {
      let self = this;
      $("#container").fadeOut(500,function () {
        self.$parent.$parent.terminalContent = [];
        $("#container").show();
      })
    },
    scroll:function () {
      let container = this.$el.querySelector("#container");
      container.scrollTop = container.scrollHeight;
    }
  }
}
</script>

<style scoped>

.terminal {
  width: 80%;
  margin: 50px auto 0 auto;
  max-width: 1000px;
  border-radius: 7px;
  background: #272c34;
  padding: 15px;
  line-height: 1.2em;

}
.clear{
  margin-top: -10px;
  display: inline-block;
  padding: 5px;
  float: right;
  cursor: pointer;
  padding-bottom: 0;
}
.clear:hover{
  background: rgba(0,0,0,.5);
}
.content{
  padding: 0 20px;
  color: #eee;
  font-family: VazirCodeX;
  white-space: pre-wrap;
  height: 600px;
  width: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
  scroll-behavior: smooth;
  -webkit-user-select: text; /* Chrome 49+ */
  -moz-user-select: text; /* Firefox 43+ */
  -ms-user-select: text; /* No support yet */
  user-select: text; /* Likely future */
}
.content ul li{
  white-space: pre;
}
.content ul li:last-child:after{
  content: "_";
  background: #eeeeee;
  animation: infinite;
  animation-name: cursor;
  animation-duration: 1.5s;
  animation-timing-function: linear;
  position: relative;
  top: 10px;
}

.fa-circle {
  margin-right: 10px;
}
</style>