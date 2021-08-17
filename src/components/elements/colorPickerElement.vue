<template>
  <div id="color-picker">
    <div class="terminal">
      <i class="fa fa-circle red-text" @click="closeModal"></i>
      <!--    <i class="fa fa-circle yellow-text text-darken-2"></i>-->
      <!--    <i class="fa fa-circle green-text text-lighten-2"></i>-->
      <div class="content">
        <h2 :style="'border-bottom: 1px solid '+nowColor">
          Value: <b>{{ coloring }}</b>
        </h2>
        <colorpk
            @input="updateColor"
            :value="currentColor"
            :preset-colors="palette"
        >

        </colorpk>
        <br>
        <div class="row">
          <div class="col s6" @click="closeModal">
            <div class="btn btn-flat waves-effect white-text" @click="closeModal">
              Cancel
            </div>
          </div>
          <div class="col s6">
            <div class="btn waves-effect" @click="okAndClose" >
              Ok
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import colorPicker from '@caohenghu/vue-colorpicker';
import colorpk from 'vue-color/src/components/Sketch';
import {fnc} from '@/assets/js/functions';

export default {
  name: "colorPickerElement",
  props:['color'],
  components: {
    colorpk
  },
  data: function () {
    return {
      nowColor: '#000000',
      currentColor: '#000000',
      coloring: 'Color(0xff000000)',
      palette: [
        '#e91e63',
        '#f44336',
        '#ff5722',
        '#ff9800',
        '#ffc107',
        '#ffeb3b',
        '#cddc39',
        '#8bc34a',
        '#4caf50',
        '#009688',
        '#00bcd4',
        '#03a9f4',
        '#2196f3',
        '#3f51b5',
        '#9c27b0',
        '#673ab7',
        '#607d8b',
        '#795548',
        '#ffffff',
        '#dedede',
        '#9e9e9e',
        '#808080',
        '#404040',
        '#222222',
        '#000000',
      ]
    }
  },
  watch:{
     color: function (value) {
       this.currentColor = fnc.color2web(value);
       this.coloring = value;
     }
  },
  methods: {
    okAndClose:function () {
      let n = this;
      do {
        n = n.$parent;
      } while (n.changeColor === undefined);
      n.changeColor(this.coloring);
      this.closeModal();
    },
    updateColor: function (e) {
      this.nowColor = e.hex8;
      this.coloring = e.hex8;
      let mColor = e.hex8.substr(0,7);
      this.coloring = 'Color(0x' + e.hex8.substr(7,2) + mColor.substr(1) +')';
      if (e.hex8.substr(7,2) === 'FF'){
        for( const clr of window.colors) {
          if (clr.color === mColor.toLowerCase() ){
            this.coloring = clr.value;
          }
        }

      }
    },
    closeModal: function () {
      let n = this;
      do {
        n = n.$parent;
      } while (n.closeAllModal === undefined);
      n.closeAllModal();
    },
  }

}
</script>

<style scoped>

h2 {
  font-size: 17px;
  text-align: center;
  padding: 5px;
}

h2 b {
  font-weight: 900;
}

.terminal {
  margin: 10vh auto 0 auto;
  border-radius: 7px;
  background: #272c3490;
  padding: 15px;
  line-height: 1.2em;
  width: 500px;
}

.content {
  padding: 0 20px;
  color: #eee;
  overflow: hidden;
  scroll-behavior: smooth;
  position: relative;
}

#color-picker {
}

.btn {
  display: block;
}
</style>