<template>
  <div>
    <div class="state">
      <div :class="(count === 1?'active':'')">
        <i class="ri-number-1"></i>
      </div>
      <div :class="(count === 2?'active':'')">
        <i class="ri-number-2"></i>
      </div>
      <div :class="(count === 3?'active':'')">
        <i class="ri-number-3"></i>
      </div>
      <div :class="(count === 4?'active':'')">
        <i class="ri-number-4"></i>
      </div>
    </div>
    <div class="square">
      <div class="top" >
        {{ top }}
      </div>
      <div class="bottom">
        {{ bottom }}
      </div>
      <div class="left">
        {{ left }}
      </div>
      <div class="right">
        {{ right }}
      </div>
      <i class="ri-shape-line"></i>
    </div>
    <div class="input-container">
      <label for="model">
        <input type="text" id="model"
               @input="updateModel"
               @keyup="updateModel"
               v-model="model">
      </label>
    </div>
  </div>
</template>

<script>
export default {
  name: "around-viewer",
  props: {
    modelValue: {
      type: String,
      default: 0,
      required: true,
    }
  },
  data() {
    return {
      count: 1,
      model:'',
    }
  },
  mounted() {
    this.count = this.modelValue.split(',').length;
    this.model = this.modelValue;
  },
  computed: {
    left() {
      let ar = this.modelValue.split(',');
      if (ar.length === 1) {
        return ar[0];
      }
      if (ar.length === 2 || ar.length === 3) {
        return ar[1];
      } else {
        return ar[3];
      }
    },
    right() {
      let ar = this.modelValue.split(',');
      if (ar.length === 1) {
        return ar[0];
      } else {
        return ar[1];
      }
    },
    bottom() {
      let ar = this.modelValue.split(',');
      if (ar.length === 1 || ar.length === 2) {
        return ar[0];
      } else {
        return ar[2];
      }
    },
    top() {
      return this.modelValue.split(',')[0];
    },
  },
  methods: {
    updateModel(){
      this.$emit('update:modelValue', this.model);
      this.count = this.modelValue.split(',').length;
    }
  }
}
</script>

<style scoped>

.state {
  display: grid;
  grid-auto-columns: minmax(0, 1fr);
  grid-auto-flow: column;
  padding: 5px;
  overflow: hidden;
  text-align: center;
}

.state i {
  padding: 5px;
  border: 1px solid var(--lighter-bg);
  border-radius: 50%;
  font-size: 20px;
}

.state .active i {
  background: var(--text-hilight);
  border-color:transparent;
  color: var(--darker-bg);
}

.square {
  border: 1px dashed gray;
  height: 5rem;
  width: 75%;
  margin: 1em auto;
  position: relative;
}

.top, .bottom, .left, .right {
  position: absolute;
  background: var(--darker-bg);
  padding: 5px 1em;
}

.top {
  top: -1em;
  left: 50%;
  transform: translateX(-50%);
}

.bottom {
  bottom: -1em;
  left: 50%;
  transform: translateX(-50%);
}

.left {
  top: 50%;
  left: -1.5em;
  transform: translateY(-50%);
}

.right {
  top: 50%;
  right: -1.5em;
  transform: translateY(-50%);
}

.square i {
  font-size: 30px;
  left: 50%;
  top: 50%;
  transform: translateY(-50%) translateX(-50%);
  position: absolute;
}


</style>