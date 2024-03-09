<template>
  <input type="text" :value="computedValue"
         @input="updateValue"
         @keyup="updating"
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
      type: String,
      default: "0"
    },
    maxValue: {
      type: String,
      default: "100"
    },
    increment: {
      type: Number,
      default: 1
    },
    percentable:{
      type: Boolean,
      default: false,
    },
    onUpdate:{
      type:Function,
      default:()=>{},
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
        this.onUpdate();
      }
    }
  },
  methods: {
    updating(e){
      this.$emit('update:modelValue', e.target.value );
      this.$emit('input-val', this.modelValue);
      if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown'){
        this.onUpdate();
      }
    },
    incUp(){
      // check is can has percent or not
      let percent = false;
      if (this.percentable && this.modelValue.toString().substr(this.modelValue.toString().length-1,1) === '%'){
        percent = true;
      }
      let val = parseInt(this.modelValue) + this.increment <= this.maxValue ? parseInt(this.modelValue) + this.increment : this.maxValue;
      // added percent when active
      if (percent){
        this.$emit('update:modelValue', val+'%');
      }else{
        this.$emit('update:modelValue', val);
      }
      this.$emit('input-val', this.modelValue);
      this.onUpdate();
    },
    decDown(){
      let percent = false;
      // check is can has percent or not
      if (this.percentable && this.modelValue.toString().substr(this.modelValue.toString().length-1,1) === '%'){
        percent = true;
      }
      let val =  parseInt( this.modelValue ) - this.increment >= this.minValue ? parseInt( this.modelValue) - this.increment : this.minValue;
      // added percent when active
      if (percent){
        this.$emit('update:modelValue', val+'%');
      }else{
        this.$emit('update:modelValue', val);
      }
      this.$emit('input-val', this.modelValue);
      this.onUpdate();
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
