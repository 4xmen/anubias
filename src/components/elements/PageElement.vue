<template>
  <div id="page">
    <div id="page-content">
      <slot></slot>
    </div>
    <h3 id="page-title">
      {{title}}
    </h3>
  </div>
</template>

<script>
export default {
  name: "PageElement",
  props:[
      'title'
  ]
}
</script>

<style scoped>
  #page{
    display: inline-block;
    text-align: center;
    padding: 10px;
  }
  #page-content{
    width: 50px;
    height: 80px;
    background: #ffffff;
    color: #000000;
    border: 1px solid rgba(0,0,0,0.15);
    margin: auto;
    margin-bottom: 5px;
    cursor: pointer;
  }
  #page-title{
    font-size: 15px;
  }
</style>