<!--title element for pages-->
<template>
  <div>
    <h1>
      <a @click="$router.go(-1)" class="back"> <div class="fa fa-arrow-left"></div> </a>
      <slot></slot>
    </h1>
  </div>
</template>

<script>
export default {
  name: "TitleElement"
}
</script>

<style scoped>
  h1{
    padding-top: 1em;
    font-size: 25px;
  }
  .back{
    margin-right: 1em;
  }
</style>