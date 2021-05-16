<template>
  <div class="container text-center">
    <div class="progress">
      <div class="determinate" :style="'width: '+prc+'%'"></div>
    </div>

    <div v-if="prc === 100">
      <i class="fa fa-check"></i>
      <h3>
        Project "{{data.project.name}}" loaded successfully
      </h3>
    </div>


  </div>
</template>

<script>
export default {
  name: "ProjectLoadedPage",
  mounted() {
    var self = this;
    var int = setInterval(function () {
        self.prc += 10;
        if (self.prc === 100){
          clearInterval(int);
          setTimeout(function () {
            self.$router.back();
          },300)
        }
    },95);
  },
  data: function () {
    return{
      data: window.appData,
      prc: 0,
    }
  }
}
</script>

<style scoped>
  .fa{
    font-size: 200px;
    color: lawngreen;
  }
  .container{
    padding-top: 10vh;
  }
</style>