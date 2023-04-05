<template>
  <input type="text" :value="computedValue"
         @input="updateValue"
         @keydown.up="incUp"
         @keydown.down="decDown"
         @mousedown="startDragging"/>
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
  emits: ['update:modelValue','input-val'],
  data() {
    return {
      dragging: false,
    }
  },
  computed: {
    computedValue: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit('update:modelValue', value);
        this.$emit('input-val', value);
      }
    }
  },
  methods: {
    incUp(){
      let val = parseInt(this.modelValue) + this.increment <= this.maxValue ? parseInt(this.modelValue) + this.increment : this.maxValue;
      this.$emit('update:modelValue', val);
      this.$emit('input-val', this.modelValue);
    },
    decDown(){
      let val =  this.modelValue - this.increment >= this.minValue ? this.modelValue - this.increment : this.minValue;
      this.$emit('update:modelValue',val);
      this.$emit('input-val', this.modelValue);
    },
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
      if (this.dragging) {
        if (event.movementX > 0) {
          this.incUp();
        } else {
          this.decDown();
        }
        this.$emit('input-val', this.modelValue);
      }
    }
  }
}
</script>
