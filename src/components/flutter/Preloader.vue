<!--preloader component read to add to app-->
<template>
  <div>
    <svg class="spinner" :width="(properties.width * scale * 2.75)+'px'" color="#ff0000" :height="(properties.height * scale *  2.75)+'px'"  viewBox="0 0 66 66"
         xmlns="http://www.w3.org/2000/svg">
      <circle class="path" fill="none" stroke-width="6" :stroke="color2web(properties.color)" stroke-linecap="round" cx="33" cy="33"
              r="30"></circle>
    </svg>
    <!-- ***!*** padding need review-->
  </div>
</template>

<script>
import {fnc} from "@/assets/js/functions";
export default {
  name: "Preloader",
  props: ['properties','scale'],
  methods:{
    color2web:function (clr) {
      return fnc.color2web(clr);
    }
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