<template>
  <div class="component" title="Double click to remove">
    <i :class="'ico '+icon"></i>
    <span class="title">{{title}}</span>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "ComponentElement",
  props:[
      'icon',
      'title'
  ]
}
</script>

<style scoped>
    .component{
      text-align: center;
      box-sizing: border-box;
      width: 100%;
      display: block;
      vertical-align: top;
    }
    .component:hover{
      background: rgba(0, 0, 0, 0.2);
      cursor: pointer;
      color: #1b9a59;
    }
    .ico{
      font-size:  30px;
      width: 30px;
      display: block;
      margin:7px auto;
    }
    .title{
      font-weight: lighter;
      font-size: 14px;
      display: block;
    }

</style>