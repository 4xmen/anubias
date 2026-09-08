<template>
  <div id="cube-preloader">

    <div class="device" :style="scaling">
      <div class="device__a">
        <div class="device__a-1"></div>
        <div class="device__a-2"></div>
      </div>
      <div class="device__b"></div>
      <div class="device__c"></div>
      <div class="device__d"></div>
      <div class="device__e"></div>
      <div class="device__f"></div>
      <div class="device__g"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "cube-preloader",
  components: {},
  data: () => {
    return {}
  },
  props: {
    scaling:{
      type: Number,
      default: 1
    }
  },
  mounted() {
  },
  computed: {},
  methods: {}
}
</script>

<style scoped>
#cube-preloader {
  transform: scale(2);
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #141e30, #243b55);
  overflow: hidden;
  width: 100%;
  height: 100%;
}

:root {
  --hue: 223;
  --bg: hsl(var(--hue),10%,90%);
  --fg: hsl(var(--hue),10%,10%);
  --trans-dur: 0.3s;
  font-size: calc(28px + (60 - 28) * (100vw - 280px) / (3840 - 280));
}

.device {
  color: var(---active-hover-bg);
  position: relative;
  width: 4em;
  height: 4em;

}
.device__a, .device__a-1, .device__a-2, .device__b, .device__c, .device__d, .device__e, .device__f, .device__g {
  animation: device-a 3s cubic-bezier(0.65, 0, 0.35, 1) infinite;
  position: absolute;
  transition: background-color var(--trans-dur), box-shadow var(--trans-dur);
}
.device__a, .device__d, .device__e {
  background-color: hsl(var(--hue), 10%, 70%);
  box-shadow: 0 0 0 0.25em inset;
}
.device__a {
  border-radius: 0.375em;
  top: 0;
  width: 4em;
  height: 2.5em;
  z-index: 1;
}
.device__a-1, .device__a-2 {
  visibility: hidden;
}
.device__a-1 {
  animation-name: device-a-1;
  top: 2.25em;
  left: 1.5em;
  width: 1em;
  height: 0.25em;
}
.device__a-2 {
  animation-name: device-a-2;
  top: 0.625em;
  right: 0;
  width: 0.25em;
  height: 0.75em;
}
.device__a-1, .device__a-2, .device__b, .device__c, .device__f, .device__g {
  background-color: var(--fg);
  border-radius: 0.125em;
}
.device__b {
  animation-name: device-b;
  top: 2.25em;
  left: 1.875em;
  width: 0.25em;
  height: 1em;
}
.device__c {
  animation-name: device-c;
  top: 3em;
  left: 1em;
  width: 2em;
  height: 0.25em;
}
.device__d, .device__e {
  left: 1.25em;
  width: 1.5em;
  height: 0.875em;
  visibility: hidden;
}
.device__d {
  animation-name: device-d;
  border-radius: 0.375em 0.375em 0 0;
  top: 0.75em;
}
.device__e {
  animation-name: device-e;
  border-radius: 0 0 0.375em 0.375em;
  top: 1.625em;
}
.device__f, .device__g {
  filter: blur(0.375em);
  bottom: 0;
  height: 0.25em;
}
.device__f {
  animation-name: device-f;
  opacity: 0.5;
  left: 1em;
  width: 2em;
}
.device__g {
  animation-name: device-g;
  opacity: 0;
  left: 0;
  width: 4em;
}

/* Dark theme */
@media (prefers-color-scheme: dark) {
  :root {
    --bg: hsl(var(--hue),10%,10%);
    --fg: hsl(var(--hue),10%,90%);
  }

  .device__a, .device__d, .device__e {
    background-color: hsl(var(--hue), 10%, 30%);
  }
}
/* Animations */
@keyframes device-a {
  from, to {
    animation-timing-function: cubic-bezier(0.33, 0, 0.67, 0);
    left: 0;
    width: 4em;
    height: 2.5em;
    transform: translateY(0);
  }
  12.5% {
    animation-timing-function: cubic-bezier(0.33, 1, 0.67, 1);
    left: 0;
    width: 4em;
    height: 2.5em;
    transform: translateY(1.5em);
  }
  25% {
    animation-timing-function: cubic-bezier(0.33, 0, 0.67, 0);
    left: 0;
    width: 4em;
    height: 2.5em;
    transform: translateY(0.375em);
  }
  37.5% {
    animation-timing-function: cubic-bezier(0.33, 1, 0.67, 1);
    left: 0;
    width: 4em;
    height: 2.5em;
    transform: translateY(1.5em);
  }
  50% {
    animation-timing-function: cubic-bezier(0.33, 0, 0.67, 0);
    left: 1em;
    width: 2em;
    height: 3em;
    transform: translateY(0.125em);
  }
  62.5% {
    animation-timing-function: cubic-bezier(0.33, 1, 0.67, 1);
    left: 1em;
    width: 2em;
    height: 3em;
    transform: translateY(1em);
  }
  75% {
    animation-timing-function: cubic-bezier(0.33, 0, 0.67, 0);
    left: 1em;
    width: 2em;
    height: 2em;
    transform: translateY(0.625em);
  }
  87.5% {
    animation-timing-function: cubic-bezier(0.33, 1, 0.67, 1);
    left: 1em;
    width: 2em;
    height: 2em;
    transform: translateY(1.375em);
  }
}
@keyframes device-a-1 {
  from {
    animation-timing-function: steps(1, end);
    left: 1.5em;
    width: 1em;
    transform: translateY(0);
    visibility: hidden;
  }
  12.5% {
    animation-timing-function: cubic-bezier(0.33, 1, 0.67, 1);
    left: 1.5em;
    width: 1em;
    transform: translateY(0);
    visibility: visible;
  }
  25%, 37.5% {
    animation-timing-function: cubic-bezier(0.33, 1, 0.67, 1);
    left: 1.5em;
    width: 1em;
    transform: translateY(-0.5em);
    visibility: visible;
  }
  50%, 62.5% {
    animation-timing-function: cubic-bezier(0.33, 1, 0.67, 1);
    left: 0.875em;
    width: 0.25em;
    transform: translateY(0);
    visibility: visible;
  }
  75%, to {
    animation-timing-function: cubic-bezier(0.33, 1, 0.67, 1);
    left: 0.875em;
    width: 0.25em;
    transform: translateY(-0.5em);
    visibility: hidden;
  }
}
@keyframes device-a-2 {
  from {
    animation-timing-function: steps(1, end);
    transform: translate(0, 0.375em);
    visibility: hidden;
  }
  62.5% {
    animation-timing-function: cubic-bezier(0.33, 1, 0.67, 1);
    transform: translate(0, 0.375em);
    visibility: visible;
  }
  75%, 87.5% {
    animation-timing-function: cubic-bezier(0.33, 1, 0.67, 1);
    transform: translate(0.375em, 0);
    visibility: visible;
  }
  to {
    transform: translate(0, 0.25em);
    visibility: visible;
  }
}
@keyframes device-b {
  from, to {
    animation-timing-function: cubic-bezier(0.33, 0, 0.67, 0);
    transform: translateY(0);
    visibility: visible;
  }
  10%, 12.5% {
    animation-timing-function: steps(1, start);
    transform: translateY(0.75em);
    visibility: visible;
  }
  25% {
    animation-timing-function: steps(1, start);
    top: 2.25em;
    left: 1.875em;
    transform: translateY(0.75em);
    visibility: hidden;
  }
  87.5% {
    animation-timing-function: cubic-bezier(0.33, 1, 0.67, 1);
    transform: translateY(0.75em);
    visibility: hidden;
  }
}
@keyframes device-c {
  from, to {
    animation-timing-function: cubic-bezier(0.33, 0, 0.67, 0);
    transform: translateY(0);
    visibility: visible;
    width: 2em;
  }
  10%, 12.5% {
    animation-timing-function: steps(1, start);
    transform: translateY(0.75em);
    visibility: visible;
    width: 2em;
  }
  25% {
    animation-timing-function: steps(1, start);
    top: 3em;
    left: 1em;
    width: 2em;
    transform: translateY(0.75em);
    visibility: hidden;
    width: 2em;
  }
  87.5% {
    animation-timing-function: cubic-bezier(0.33, 1, 0.67, 1);
    left: 1.5em;
    transform: translateY(0.75em);
    visibility: hidden;
    width: 1em;
  }
}
@keyframes device-d {
  from {
    animation-timing-function: steps(1, end);
    transform: translateY(0.25em);
    visibility: hidden;
  }
  62.5% {
    animation-timing-function: cubic-bezier(0.33, 1, 0.67, 1);
    transform: translateY(0.25em);
    visibility: visible;
  }
  75% {
    animation-timing-function: cubic-bezier(0.33, 0, 0.67, 0);
    transform: translateY(-0.75em);
  }
  87.5% {
    animation-timing-function: cubic-bezier(0.33, 1, 0.67, 1);
    transform: translateY(0);
  }
  to {
    transform: translateY(-0.75em);
  }
}
@keyframes device-e {
  from {
    animation-timing-function: steps(1, end);
    transform: translateY(1.5em);
    visibility: hidden;
  }
  62.5% {
    animation-timing-function: cubic-bezier(0.33, 1, 0.67, 1);
    transform: translateY(1.5em);
    visibility: visible;
  }
  75% {
    animation-timing-function: cubic-bezier(0.33, 0, 0.67, 0);
    transform: translateY(0.75em);
  }
  87.5% {
    animation-timing-function: cubic-bezier(0.33, 1, 0.67, 1);
    transform: translateY(1.5em);
  }
  to {
    transform: translateY(0);
  }
}
@keyframes device-f {
  from {
    animation-timing-function: cubic-bezier(0.33, 0, 0.67, 0);
    filter: blur(0.375em);
  }
  12.5% {
    animation-timing-function: cubic-bezier(0.33, 1, 0.67, 1);
    filter: blur(0.1875em);
    opacity: 0.5;
  }
  25%, to {
    filter: blur(0.375em);
    opacity: 0;
  }
}
@keyframes device-g {
  from, 12.5% {
    animation-timing-function: cubic-bezier(0.33, 1, 0.67, 1);
    background-color: var(--fg);
    filter: blur(0.1875em);
    opacity: 0;
  }
  25% {
    animation-timing-function: cubic-bezier(0.33, 0, 0.67, 0);
    background-color: var(--fg);
    filter: blur(0.375em);
    opacity: 0.5;
  }
  37.5% {
    animation-timing-function: cubic-bezier(0.33, 1, 0.67, 1);
    filter: blur(0.1875em);
    opacity: 0.5;
    left: 0;
    width: 4em;
  }
  50%, 75%, to {
    animation-timing-function: cubic-bezier(0.33, 0, 0.67, 0);
    filter: blur(0.375em);
    opacity: 0.5;
    left: 1em;
    width: 2em;
  }
  62.5%, 87.5% {
    animation-timing-function: cubic-bezier(0.33, 1, 0.67, 1);
    filter: blur(0.1875em);
    opacity: 0.5;
    left: 1em;
    width: 2em;
  }
}

</style>