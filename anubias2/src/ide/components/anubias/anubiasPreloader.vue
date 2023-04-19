<!--preloader component read to add to app-->
<template>
  <div :style="preloaderStyle">
    <svg class="spinner" :width="getSize(properties.width)"
         color="#ff0000" :height="getSize(properties.height)" viewBox="0 0 66 66"
         xmlns="http://www.w3.org/2000/svg">
      <circle class="path" fill="none" stroke-width="6" :stroke="color2web(properties.color)" stroke-linecap="round"
              cx="33" cy="33"
              r="30"></circle>
    </svg>
  </div>
</template>

<script>
import {getSize,color2web,calcPaddingOrMargin} from "../../js/general-functions.js";

export default {
  name: "anubiasPreloader",
  props: {
    properties:{
      type: Object,
      required: true,
    }
  },
  computed:{
    preloaderStyle(){
      let style = '';
      style += 'padding:'+this.calcPadding(this.properties.padding)+';';
      if (this.properties.align !== undefined){
        style += 'text-align:'+(this.properties.align)+';';
      }
      return style;
    }
  },
  methods: {
    color2web(clr) {
      return color2web(clr);
    },
    getSize: getSize,
    calcPadding: calcPaddingOrMargin,
  }
}
</script>

<style scoped>


.spinner {
  -webkit-animation: rotator 1.4s linear infinite;
  animation: rotator 1.4s linear infinite;
}

@-webkit-keyframes rotator {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(270deg);
  }
}

@keyframes rotator {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(270deg);
  }
}

.path {
  stroke-dasharray: 187;
  stroke-dashoffset: 0;
  transform-origin: center;
  -webkit-animation: dash 1.4s ease-in-out infinite;
  animation: dash 1.4s ease-in-out infinite;
}

@-webkit-keyframes colors {
  0% {
    stroke: #4285f4;
  }
  25% {
    stroke: #de3e35;
  }
  50% {
    stroke: #f7c223;
  }
  75% {
    stroke: #1b9a59;
  }
  100% {
    stroke: #4285f4;
  }
}

@keyframes colors {
  0% {
    stroke: #4285f4;
  }
  25% {
    stroke: #de3e35;
  }
  50% {
    stroke: #f7c223;
  }
  75% {
    stroke: #1b9a59;
  }
  100% {
    stroke: #4285f4;
  }
}

@-webkit-keyframes dash {
  0% {
    stroke-dashoffset: 187;
  }
  50% {
    stroke-dashoffset: 46.75;
    transform: rotate(135deg);
  }
  100% {
    stroke-dashoffset: 187;
    transform: rotate(450deg);
  }
}

@keyframes dash {
  0% {
    stroke-dashoffset: 187;
  }
  50% {
    stroke-dashoffset: 46.75;
    transform: rotate(135deg);
  }
  100% {
    stroke-dashoffset: 187;
    transform: rotate(450deg);
  }
}
</style>