<template>
  <div id="blue-search" :style="blueSearchStyle">
    <input type="search" v-model="q" placeholder="Search for a blueprint items...">
    <ul id="blue-search-list">
      <li v-for="i in 45">
        <i class="ri-clipboard-line"></i>
        item {{i}}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "blue-search",
  components: {},
  data: () => {
    return {
      q:'',
    }
  },
  props: {
    x:{
      type:Number,
      default:0,
    },
    y:{
      type:Number,
      default:0,
    }
  },
  mounted() {
  },
  computed: {
    blueSearchStyle(){
      return `left: ${this.x}px;top: ${this.y}px;`
    }
  },
  methods: {}
}
</script>

<style scoped>
#blue-search {
  position: absolute;
  top: 100px;
  left: 100px;
  background: #282c34;
  width: 300px;
  color: white;
}

#blue-search input {
  background: transparent;
  border: 1px solid #191d23;
  display: block;
  padding: 3px;
  width: 100%;
  color: white;
  font-size: 16px;
  text-align: center;
}

#blue-search-list{
  padding: .5rem;
  height: 15em;
  overflow-x: hidden;
  overflow-y: auto;
  list-style: none;
}
#blue-search-list li{

}
#blue-search-list li:hover{
  background: rgba(255, 255, 255, 0.11);
}
</style>