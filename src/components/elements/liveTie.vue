<template>
  <div id="tie">
    <h5>
      {{ data.title }}
    </h5>
        <div v-for="(component,e) in data.components" :key="e"
             class="live" :style="'left:'+left+150">
            {{component.name}}
        </div>
  </div>
</template>

<script>
export default {
  name: "liveTie",
  mounted() {
    // console.log(this.data);
  },
  data: function () {
    return {
      left: 15,
    }
  },
  props: ['data']
}
</script>

<style scoped>
#tie {
  padding: 85px 25px;
  min-height: 100vh;
  position: relative;
  background: rgba(0, 0, 0, .3);
}
.live{
  border: 1px dashed white;
  position: absolute;
  width: 200px;
  border-left: 3px solid yellowgreen;
  background: #202539;
}
</style>