<template>
  <div id="appBar">
      {{title}}
  </div>
</template>

<script>
export default {
  name: "AppBar",
  props: [
    'title',
    'backgroundColor',
    'textColor',
  ],
}
</script>

<style scoped>
#appBar {

}
</style>