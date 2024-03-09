<template>
  <div class="buttons">
    <div class="button" v-for="(title,i) in list" :class="btnClass(i)" :key="i" @click="setIndex(i)" >
      <div v-html="title"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "buttons",
  data: () => {
    return {

    };
  },
  props: {
    list: {
      default: [],
      type: Array,
      required: true,
    },
    modelValue: {
      default: 0,
      type: Number,
    },
    noBorderY: {
      default: false,
      type: Boolean,
    },
  },
  methods: {
    btnClass(i) {
      let objClass = '';
      if (i === this.modelValue) {
        objClass += ' active';
      }
      if (this.noBorderY) {
        objClass += ' no-border-y';
      }
      return objClass;
    },
    setIndex(i) {
      this.$emit('update:modelValue', i);
    }
  },
}
</script>

<style scoped>
.buttons {
  display: grid;
  width: 100%;
  grid-auto-columns: minmax(0, 1fr);
  grid-auto-flow: column;
}

.button {
  font-weight: 200;
  padding: 8px;
  border: 1px solid var(--lighter-bg);
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 1em;
  transition: var(--transition-duration);
}

.button:not(:last-child) {
  border-right: 0;
}
.button:not(.active){
  cursor: pointer;
}

.button > div{
  position: relative;
  top: 3px;
}
</style>