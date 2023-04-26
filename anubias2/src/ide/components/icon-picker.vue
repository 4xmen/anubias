<template>
  <div>
    <div class="grid">
      <div class="title">{{ label }}</div>
      <span class="material-icons" id="icon" @click="openModal">{{modelValue}}</span>
    </div>
    <div class="modal" :style="modal?'display:flex;':''" @click="closeModal">
      <div id="icon-picker">
        <div class="header">
           <span id="preview" class="material-icons">{{modelValue}}</span>
          <h2>
            Icons Picker
          </h2>
          <div class="input-container">
            <input type="text" v-model="search" class="text-center" placeholder="Search in icons">
          </div>
        </div>
        <div id="icon-container">
          <template v-for="(icon,i) in icons" :key="i">
            <div v-if="icon.indexOf(search) !== -1" @click="setModel(icon)">
              <span class="material-icons">{{ icon }}</span>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import icons from '../../stores/assets/icons.json'

export default {
  name: "icon-picker",
  props: {
    modelValue: {
      // required: true,
    },
    label: {
      default: '',
      type: String,
      required: true,
    },
  },
  data() {
    return {
      search: '',
      modal: false,
      icons: icons,
    }
  },
  methods:{
    openModal(){
      this.modal = true;
    },
    closeModal(e) {
      if (e.target.getAttribute('class').indexOf('modal') !== -1) {
        this.modal = false;
      }
    },
    setModel(icon) {
      this.$emit('update:modelValue', icon);
      this.modal = false;
    },
  }
}
</script>

<style scoped>

h2{
 text-align: center;
}

#icon-picker {
  background: var(--darker-bg);
  width: 85%;
}

#icon-container {
  margin: 1rem;
  padding: 1rem;
  background: var(--def-bg);
  height: 65vh;
  overflow-y: auto;
  overflow-x: hidden;
  /*display: grid;*/
  /*grid-template-columns: repeat(15,1fr);*/
  width: calc(100% - 2rem);
}

#icon-container div {
  display: inline-block;
  padding: 4px;
  cursor: pointer;
  width: 40px;
  text-align: center;
  transition: var(--transition-duration);
}

#icon-container div:hover {
  background: var(--text-hilight);
  transform: scale(1.5);
}

#icon-container div span {
  font-size: 30px;
  /*width: 30px;*/
  float: left;
}
#preview{
  font-size: 65px;
  right: 35px;
  top: 1rem;
  position: absolute;
}
#icon{
  font-size: 20px;
  background: #00000022;
  float: right;
  display: block;
  padding: 5px;
  text-align: center;
}

.grid {
  display: grid;
  grid-template-columns: 3fr 1fr;
  cursor: pointer;
}

.header{
  padding: 1rem 1rem 0 1rem;
  position: relative;
}

.title{
  margin-top: 5px;
}

</style>