<template>
  <div class="terminal">
    <i class="fa fa-circle red-text" @click="closeModal"></i>
    <i class="fa fa-circle yellow-text text-darken-2"></i>
    <i class="fa fa-circle green-text text-lighten-2"></i>
    <span class="clear">
      <span class="material-icons">clear_all</span>
    </span>


    <div class="content">
      <ul>
        <li>item text 1</li>
        <li>item text 2</li>
        <li>item text 3</li>
        <li>item text 4</li>
        <li>item text 5</li>
        <li>item text 6</li>
        <li>item text 7</li>
        <li>item text 8</li>
        <li>item text 9</li>
        <li>item text 10</li>
        <li>item text 11</li>
        <li>item text 12</li>
        <li>item text 13</li>
        <li>item text 14</li>
        <li>item text 15</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "TerminalElement",
  methods:{
    closeModal:function () {
      this.$parent.$parent.closeAllModal();
    }
  }
}
</script>

<style scoped>

.terminal {
  width: 80%;
  margin: 50px auto 0 auto;
  max-width: 1000px;
  height: 600px;
  border-radius: 7px;
  background: #272c34;
  padding: 15px;
  line-height: 2em;
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
}
.fa-circle {
  margin-right: 10px;
}
</style>