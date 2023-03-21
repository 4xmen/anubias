<template>
  <div id="steps">
    <div class="step" v-for="(step,i) in steps" :key="i" :class="i <= modelValue?'done':''">
      <i :class="step.icon" @click="setIndex(i)"></i>
      <h3 @click="setIndex(i)">
        {{ step.title }}
      </h3>
    </div>
  </div>
</template>

<script>
export default {
  name: "steps",
  data: () => {
    return {};
  },
  props: {
    steps: {
      default: [],
      type: Array,
      required: true,
    },
    modelValue: {
      default: 0,
      type: Number,
    },
  },
  computed: {},
  methods: {
    setIndex(i) {
      this.$emit('update:modelValue', i);
    }
  }
}
</script>

<style scoped>
#steps {
  background: var(--def-bg);
  display: grid;
  grid-auto-columns: minmax(0, 1fr);
  grid-auto-flow: column;
  margin: 1em auto;
}

.step {
  text-align: center;
  position: relative;
}

.step:before {
  height: 2px;
  background: var(--lighter-bg);
  position: absolute;
  top: 48px;
  left: 0;
  right: 0;
  content: ' ';
  transition: 750ms;
}
.step:after {
  height: 2px;
  background: var(--lighter-bg);
  background: var(--text-hilight);
  position: absolute;
  top: 48px;
  left: 0;
  right: 100%;
  content: ' ';
  transition: var(--transition-duration);
  z-index: 1;
}

.step.done:after {
  right: 0;
}

.step i {
  font-size: 32px;
  display: flex;
  border: 2px solid var(--lighter-bg);
  width: 64px;
  height: 64px;
  border-radius: 50%;
  justify-content: center;
  align-items: center;
  margin: 1rem auto;
  background: var(--def-bg);
  position: relative;
  z-index: 2;
  cursor: pointer;
  transition: var(--transition-duration);
}

.step h3 {
  cursor: pointer;
  font-weight: 200;
}

.step.done {
  color: var(--text-hilight);
}

.step.done i {
  border: 2px solid var(--text-hilight);
}
</style>