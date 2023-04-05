<template>
  <input type="text" :value="computedValue" @Input="updateValue" @mousedown="startDragging"/>
</template>

<script>
export default {
  name: "input-draggable",
  props: {
    modelValue: {
      required: true,
    },
    minValue: {
      type: Number,
      default: 0
    },
    maxValue: {
      type: Number,
      default: 100
    },
    increment: {
      type: Number,
      default: 1
    }
  },
  emits: ['update:modelValue'],
  data() {
    return {
      dragging: false,
      value: this.modelValue,
    }
  },
  computed: {
    computedValue: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    }
  },
  methods: {
    startDragging() {
      this.dragging = true
      window.addEventListener('mousemove', this.updateValue)
      window.addEventListener('mouseup', this.stopDragging)
    },
    stopDragging() {
      this.dragging = false
      window.removeEventListener('mousemove', this.updateValue)
      window.removeEventListener('mouseup', this.stopDragging)
    },
    updateValue(event) {
      this.value = this.modelValue;
      if (this.dragging) {
        if (event.movementX > 0) {
          let val = this.modelValue + this.increment <= this.maxValue ? this.modelValue + this.increment : this.maxValue;
          this.$emit('update:modelValue', val);
          // this.value = val;
        } else {
          let val =  this.modelValue - this.increment >= this.minValue ? this.modelValue - this.increment : this.minValue;
          this.$emit('update:modelValue',val);
          // this.value = val;
        }
      }
    }
  }
}
</script>
