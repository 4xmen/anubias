<template>
  <input type="text" :value="computedValue"
         @focus="focusing"
         @input="updateValue"
         @keyup="updating"
         @keydown="keydowning"
         @keydown.up="incUp"
         @keydown.down="decDown"
         @blur="bluring"
         @mousedown="startDragging"/>
</template>

<script>
import {mapActions, mapState} from "vuex";

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
    percentable: {
      type: Boolean,
      default: false,
    },
    onUpdate: {
      type: Function,
      default: () => {
      },
    }
  },
  emits: ['update:modelValue', 'input-val'],
  data() {
    return {
      dragging: false,
      // last known mouse X position, used to measure drag speed
      lastMouseX: 0,
      // timestamp of the last mousemove event, used to measure drag speed
      lastMoveTime: 0,
      // has focus
      hasFocus: false,
      // value end of drag
      endDraggingValue: null,
      // shift
      isPressedShift: false,
    }
  },
  computed: {
    ...mapState({
      isFastChange: state => state.ide.fastChange.isFastChange,
      startPadding: state => state.ide.fastChange.startPadding
    }),
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

    ...mapActions({
      lazyChangeStart: "ide/lazyChangeStart",
      lazyChangeDone: "ide/lazyChangeDone",
      lazyChangeUpdate: "ide/lazyChangeCurrentValue",
    }),
    focusing() {
      this.lazyChangeStart(this.modelValue);
      this.hasFocus = true;
    },
    bluring() {
      this.lazyChangeDone();
      this.hasFocus = false;
    },
    keydowning(e) {
      if (e.key === "Shift") {
        this.isPressedShift = true;
      }
      this.lazyChangeStart(this.endDraggingValue);
    },
    updating(e) {
      this.$emit('update:modelValue', e.target.value);
      this.$emit('input-val', this.modelValue);
      if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') {
        this.onUpdate();
      }
      if (e.key === "Shift") {
        this.isPressedShift = false;
      }
    },
    // step is optional so keyboard arrows keep using the fixed "increment" prop
    incUp(step) {
      let amount = typeof step === 'number' ? step : this.increment;

      // check if percent suffix should be preserved
      let percent = false;
      if (this.percentable && this.modelValue.toString().slice(-1) === '%') {
        percent = true;
      }

      if (this.isPressedShift){
        amount *= 10;
      }
      const current = parseInt(this.modelValue);
      const max = parseInt(this.maxValue);
      const val = current + amount <= max ? current + amount : max;

      this.$emit('update:modelValue', percent ? val + '%' : val);
      this.$emit('input-val', this.modelValue);
      this.onUpdate();
    },
    decDown(step) {
      let amount = typeof step === 'number' ? step : this.increment;

      let percent = false;
      if (this.percentable && this.modelValue.toString().slice(-1) === '%') {
        percent = true;
      }

      if (this.isPressedShift){
        amount *= 10;
      }
      const current = parseInt(this.modelValue);
      const min = parseInt(this.minValue);
      const val = current - amount >= min ? current - amount : min;

      this.$emit('update:modelValue', percent ? val + '%' : val);
      this.$emit('input-val', this.modelValue);
      this.onUpdate();
    },
    startDragging(event) {
      let current = this.modelValue;
      this.lazyChangeStart(current);
      this.dragging = true;
      // initialize speed-tracking reference point
      this.lastMouseX = event.clientX;
      this.lastMoveTime = performance.now();

      window.addEventListener('mousemove', this.updateValue);
      window.addEventListener('mouseup', this.stopDragging);
    },
    stopDragging() {
      this.dragging = false;
      window.removeEventListener('mousemove', this.updateValue);
      window.removeEventListener('mouseup', this.stopDragging);
      this.$emit('update:modelValue', this.modelValue);
      this.endDraggingValue = this.modelValue;
      this.lazyChangeDone();
    },
    // Converts mouse speed (px/ms) into an exponential step size,
    // so fast drags jump by large amounts and slow drags stay precise,
    // similar to Photoshop's draggable numeric fields.
    getDynamicStep(speedPxPerMs) {
      const absSpeed = Math.abs(speedPxPerMs);

      // exponential curve: small movements barely change the multiplier,
      // fast movements grow the multiplier quickly
      const multiplier = Math.min(60, Math.pow(absSpeed * 4, 1.7));

      return Math.max(1, Math.round(this.increment * multiplier));
    },
    updateValue(event) {
      if (!this.dragging) return;

      const now = performance.now();
      const deltaTime = Math.max(now - this.lastMoveTime, 1); // avoid divide-by-zero
      const deltaX = event.clientX - this.lastMouseX;

      // speed in pixels per millisecond
      const speed = deltaX / deltaTime;
      const step = this.getDynamicStep(speed);

      if (deltaX > 0) {
        this.incUp(step);
      } else if (deltaX < 0) {
        this.decDown(step);
      }

      this.lastMouseX = event.clientX;
      this.lastMoveTime = now;

      this.$emit('input-val', this.modelValue);
      this.lazyChangeUpdate(this.modelValue);
    }
  }
}
</script>