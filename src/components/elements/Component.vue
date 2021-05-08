<template>
  <div class="component">
    <i :class="'ico '+icon"></i>
    <span class="title">{{title}}</span>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "Component",
  props:[
      'icon',
      'title'
  ]
}
</script>

<style scoped>
    .component{
      padding: 15px;
      padding-top: 0;
      text-align: center;
      display: inline-block;
      width: 30%;
      box-sizing: border-box;
      height: 70px;
      vertical-align: top;
    }
    .ico{
      font-size: 35px;
      width: 35px;
      display: block;
      margin:7px auto;
    }
    .title{
      font-weight: lighter;
      font-size: 14px;
      display: block;
    }

</style>