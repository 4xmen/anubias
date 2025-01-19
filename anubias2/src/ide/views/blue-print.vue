<template>
  <div id="blue-print" @contextmenu="showBlueSearch">
      <blue-search v-if="blueSearchVisible" :x="blueSearchX" :y="blueSearchY"></blue-search>
  </div>
</template>

<script>
import blueSearch from "../components/blue-search.vue";
export default {
  name: "blue-print",
  components: {
    blueSearch,
  },
  data: () => {
    return {
      blueSearchVisible: false,
      blueSearchX: 0,
      blueSearchY: 0,
    }
  },
  props: {},
  mounted() {
  },
  computed: {},
  methods: {
    showBlueSearch(e) {
      e.preventDefault();
      this.blueSearchX = e.layerX;
      this.blueSearchY = e.layerY;
      this.blueSearchVisible = !this.blueSearchVisible;
    }
  }
}
</script>

<style scoped>
#blue-print {
  background-image: url("../assets/svg/background/grid.svg");
  height: 100%;
  grid-column: 1 / -1;
  position: relative;
}

#blue-print:after {
  content: "BLUE PRINT";
  position: absolute;
  inset-inline-end: 10px;
  bottom: 0;
  font-size: 35px;
  opacity: 0.3;
}
</style>