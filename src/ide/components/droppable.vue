<!-- Droppable.vue -->
<template>
  <div
      ref="rootEl"
      class="droppable"
      :style="droppableStyle"
  >
    <slot></slot>
  </div>
</template>

<script setup>
/**
 * Custom Droppable component (Composition API)
 * Works together with the custom Draggable component.
 * Drop detection is performed purely by comparing the mouse coordinates
 * at mouseup against this element's getBoundingClientRect().
 * This approach remains reliable even when the droppable (or any ancestor)
 * has pointer-events: none.
 */
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useStore } from 'vuex'

const props = defineProps({
  /**
   * Logical area identifier. A drop is only accepted when the dragged
   * item's area matches this value.
   */
  area: {
    type: String,
    default: 'drop'
  },
  /**
   * Callback invoked when a valid drop occurs.
   * Receives the drag data object that was stored in Vuex.
   */
  dropping: {
    type: Function,
    default: () => {}
  }
})

const store = useStore()
const rootEl = ref(null)

/**
 * Visual feedback while a drag is in progress.
 * Green = valid target, red = invalid target.
 */
const droppableStyle = computed(() => {
  const currentArea = store.state.ide.dropArea
  if (!currentArea) return ''

  if (currentArea === props.area) {
    return 'background: rgba(0, 255, 0, 0.25); cursor: copy;'
  }
  return 'background: rgba(255, 0, 0, 0.25); cursor: not-allowed;'
})

/**
 * Check whether a point (x, y) lies inside this droppable's bounding box.
 * Uses getBoundingClientRect so it works regardless of pointer-events.
 */
function isPointInside(x, y) {
  if (!rootEl.value) return false
  const rect = rootEl.value.getBoundingClientRect()
  return (
      x >= rect.left &&
      x <= rect.right &&
      y >= rect.top &&
      y <= rect.bottom
  )
}

/**
 * Global custom-drop event handler.
 * The Draggable component dispatches this event on every mouseup.
 * We decide locally whether the drop coordinates fall inside us
 * and whether the area matches.
 */
function onCustomDrop(e) {
  const { x, y, data } = e.detail

  // First geometric test
  if (!isPointInside(x, y)) return

  // Second logical test – areas must match
  if (data.area !== props.area) return

  // Valid drop – invoke the user-provided callback
  props.dropping(data)
}

onMounted(() => {
  document.addEventListener('custom-drop', onCustomDrop)
})

onBeforeUnmount(() => {
  document.removeEventListener('custom-drop', onCustomDrop)
})
</script>

<style scoped>
.droppable {
  /* Optional visual baseline – can be overridden by the parent */
  min-height: 40px;
}
</style>