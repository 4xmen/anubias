<template>
  <div
      class="option-ex"
      :class="{ highlighted: isHighlighted }"
      @click="selectOption"
      @mouseenter="highlightThis"
  >
    <slot />
  </div>
</template>

<script>
export default {
  name: "OptionEx",
  props: {
    value: {
      type: [String, Number, Object],
      required: true
    }
  },
  inject: ["combobox"],
  computed: {
    isHighlighted() {
      return this.combobox.highlightedValue === this.value
    }
  },
  methods: {
    selectOption() {
      this.combobox.select(this.value)
    },
    highlightThis() {
      this.combobox.highlight(this.value)
    }
  }
}
</script>

<style scoped>
.option-ex {
  padding: 8px 12px;
  cursor: pointer;
  user-select: none;
}

.option-ex.highlighted {
  background-color:  var(--text-hilight);
  color: white;
}
</style>