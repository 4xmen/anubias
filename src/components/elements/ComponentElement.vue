<!--component of component for choose in ide and drag and drop-->
<template>
  <div :class="'component'+(active?'active':'')" title="Double click to remove">
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
      'title',
      'active'
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
      opacity: .2;
    }
    .component.active{
      opacity: 1;
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