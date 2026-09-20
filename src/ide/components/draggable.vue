<!-- Draggable.vue -->
<template>
  <div
      ref="rootEl"
      class="draggable"
      :data-area="area"
      :data-name="detail"
      @mousedown="onMouseDown"
  >
    <slot></slot>
  </div>
</template>

<script setup>
/**
 * Custom Draggable component (Composition API)
 * Fully manual drag & drop without the native HTML5 Drag API.
 *
 * Important iframe handling:
 * - When the mouse is over a same-origin iframe, native events never reach the
 *   parent document. Therefore we also attach mousemove/mouseup listeners to
 *   every accessible iframe contentDocument.
 * - Coordinates coming from an iframe are relative to that iframe. We translate
 *   them into main-window coordinates by adding the iframe's getBoundingClientRect
 *   so that Droppable's geometric hit-test continues to work correctly.
 */
import { ref, onBeforeUnmount } from 'vue'
import { useStore } from 'vuex'

const props = defineProps({
  isActive: {
    type: Boolean,
    default: true
  },
  area: {
    type: String,
    required: true,
    default: 'drop'
  },
  detail: {
    type: String,
    required: true
  }
})

const store = useStore()
const rootEl = ref(null)

// Runtime drag state
let isDragging = false
let ghostEl = null
let offsetX = 0
let offsetY = 0

// Keep references so we can remove the extra iframe listeners later
const attachedIframeListeners = []

/**
 * Collect data attributes from the source element (same logic as before).
 */
function collectDragData(el) {
  const data = {}
  for (let i = 0; i < el.attributes.length; i++) {
    const attr = el.attributes[i]
    if (attr.name.indexOf('v-') === 0) continue

    if (attr.name.indexOf('data-') === 0) {
      data[attr.name.slice(5)] = attr.value
    } else {
      data[attr.name] = attr.value
    }
  }
  return data
}

/**
 * Create the floating ghost element that follows the cursor.
 */
function createGhost(el, clientX, clientY) {
  const rect = el.getBoundingClientRect()

  ghostEl = el.cloneNode(true)
  ghostEl.style.position = 'fixed'
  ghostEl.style.left = `${rect.left}px`
  ghostEl.style.top = `${rect.top}px`
  ghostEl.style.width = `${rect.width}px`
  ghostEl.style.height = `${rect.height}px`
  ghostEl.style.margin = '0'
  ghostEl.style.pointerEvents = 'none'
  ghostEl.style.zIndex = '99999'
  ghostEl.style.opacity = '0.85'
  ghostEl.style.boxShadow = '0 8px 24px rgba(0,0,0,0.25)'
  ghostEl.style.transition = 'none'
  ghostEl.classList.add('dragging-ghost')

  offsetX = clientX - rect.left
  offsetY = clientY - rect.top

  document.body.appendChild(ghostEl)
}

/**
 * Move the ghost under the cursor using already-normalized coordinates.
 */
function moveGhost(x, y) {
  if (!ghostEl) return
  ghostEl.style.left = `${x - offsetX}px`
  ghostEl.style.top = `${y - offsetY}px`
}

/**
 * Completely remove the ghost and reset temporary state.
 */
function destroyGhost() {
  if (ghostEl && ghostEl.parentNode) {
    ghostEl.parentNode.removeChild(ghostEl)
  }
  ghostEl = null
  isDragging = false
}

/**
 * Translate client coordinates that may originate from an iframe
 * into coordinates relative to the main window.
 */
function normalizeCoordinates(e, iframe = null) {
  if (!iframe) {
    return { x: e.clientX, y: e.clientY }
  }
  const rect = iframe.getBoundingClientRect()
  return {
    x: e.clientX + rect.left - 35,
    y: e.clientY + rect.top - 40
  }
}

/**
 * Find every same-origin iframe and return both the iframe element
 * and its contentDocument so we can attach listeners.
 */
function getAccessibleIframes() {
  const result = []
  document.querySelectorAll('iframe').forEach(iframe => {
    try {
      // Accessing contentDocument throws on cross-origin iframes
      if (iframe.contentDocument) {
        // console.log(iframe.contentDocument);
        result.push({ iframe, doc: iframe.contentDocument })
      }
    } catch (err) {
      // Intentionally ignore cross-origin iframes
    }
  })
  return result
}

/**
 * Attach mousemove + mouseup listeners to the main document
 * and to every accessible iframe. Store the handlers so they
 * can be removed cleanly later.
 */
function attachGlobalListeners() {
  // Main document
  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)

  // All same-origin iframes
  getAccessibleIframes().forEach(({ iframe, doc }) => {
    const moveHandler = (e) => onMouseMove(e, iframe)
    const upHandler = (e) => onMouseUp(e, iframe)

    doc.addEventListener('mousemove', moveHandler)
    doc.addEventListener('mouseup', upHandler)

    attachedIframeListeners.push({
      doc,
      moveHandler,
      upHandler
    })
  })
}

/**
 * Remove every listener we previously attached (main + iframes).
 */
function detachGlobalListeners() {
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', onMouseUp)

  attachedIframeListeners.forEach(({ doc, moveHandler, upHandler }) => {
    doc.removeEventListener('mousemove', moveHandler)
    doc.removeEventListener('mouseup', upHandler)
  })
  attachedIframeListeners.length = 0
}

/**
 * Entry point of a drag operation.
 */
function onMouseDown(e) {
  if (!props.isActive || e.button !== 0) return

  e.preventDefault()
  e.stopPropagation()

  isDragging = true

  const data = collectDragData(rootEl.value)
  store.dispatch('ide/setDragData', data)
  store.dispatch('ide/setDropArea', data.area || props.area)

  createGhost(rootEl.value, e.clientX, e.clientY)
  attachGlobalListeners()
}

/**
 * Keep the ghost under the cursor.
 * The optional iframe argument is used for coordinate translation.
 */
function onMouseMove(e, iframe = null) {
  if (!isDragging) return
  e.preventDefault()

  const { x, y } = normalizeCoordinates(e, iframe)
  moveGhost(x, y)
}

/**
 * Finish the drag. Coordinates are normalized so Droppable's
 * getBoundingClientRect test works even when the mouse is inside an iframe.
 */
function onMouseUp(e, iframe = null) {
  if (!isDragging) return

  // Always detach first to avoid double-firing
  detachGlobalListeners()

  const { x, y } = normalizeCoordinates(e, iframe)

  // Broadcast the drop with correct page coordinates
  const dropEvent = new CustomEvent('custom-drop', {
    detail: {
      x,
      y,
      data: store.state.ide.draggedData
    }
  })
  document.dispatchEvent(dropEvent)

  // Reset Vuex state
  store.dispatch('ide/setDragData', {})
  store.dispatch('ide/setDropArea', '')

  destroyGhost()
}

// Safety cleanup if the component is destroyed mid-drag
onBeforeUnmount(() => {
  detachGlobalListeners()
  destroyGhost()
})
</script>

<style scoped>
.draggable {
  user-select: none;
  cursor: grab;
}
.draggable:active {
  cursor: grabbing;
}
</style>