<script>
export default { name: 'SearchableCombobox', inheritAttrs: false }
</script>

<script setup>
import { cloneVNode, computed, nextTick, onBeforeUnmount, onMounted, ref, useSlots, watch } from 'vue'
import {
  flattenOptionVNodes, optionContent, textOf,
  normalizeText, defaultMatch,
  moveActive, firstEnabled,
  resolvePlacement, nextId,
} from './inc/combobox-internals.js'

const props = defineProps({
  modelValue: { default: undefined },
  placeholder: { type: String, default: 'Select…' },
  /** false ⇒ behaves like a native <select>: no text entry, but type-ahead. */
  searchable: { type: Boolean, default: true },
  disabled: { type: Boolean, default: false },
  clearable: { type: Boolean, default: false },
  /** Wrap around at the ends. Native <select> does not, so default false. */
  loop: { type: Boolean, default: false },
  maxHeight: { type: Number, default: 280 },
  /** 'bottom' | 'top' | 'auto' — all of them flip when there is no room. */
  placement: { type: String, default: 'bottom' },
  noResultsText: { type: String, default: 'No matches' },
  /** (query, option) => boolean. option = { value, label, search, disabled } */
  filter: { type: Function, default: null },
  teleportTo: { type: String, default: 'body' },
  ariaLabel: { type: String, default: undefined },
  id: { type: String, default: undefined },
})

const emit = defineEmits(['update:modelValue', 'change', 'open', 'close', 'search'])

const listId = nextId('sc') + '-list'

const slots = useSlots()
const rootEl = ref(null)
const inputEl = ref(null)
const popupEl = ref(null)
const listEl = ref(null)

const isOpen = ref(false)
const isFocused = ref(false)
const isMounted = ref(false)
const query = ref('')
const activeIndex = ref(-1)
const placementUsed = ref('bottom')
const positioned = ref(false)
const popupStyle = ref({})

/* ---------- options come from the slot vnodes, not from props ---------- */
const options = computed(() => {
  const nodes = slots.default ? slots.default() : []
  return flattenOptionVNodes(nodes).map((vnode, index) => {
    const p = vnode.props || {}
    const content = optionContent(vnode)
    const label = p.label != null ? String(p.label) : textOf(content)
    return {
      index,
      key: vnode.key != null ? vnode.key : index,
      value: p.value,
      label,
      disabled: p.disabled === '' || p.disabled === true || p.disabled === 'true',
      search: normalizeText(p.search != null ? `${label} ${p.search}` : label),
      nodes: content,
    }
  })
})

const selected = computed(() => {
  const mv = props.modelValue
  if (mv === undefined) return null
  return options.value.find((o) => o.value === mv) || null
})

const visible = computed(() => {
  const q = query.value
  if (!q) return options.value
  if (props.filter) return options.value.filter((o) => props.filter(q, o))
  const nq = normalizeText(q)
  if (!nq) return options.value
  return options.value.filter((o) => defaultMatch(o, nq))
})

const activeId = computed(() =>
    isOpen.value && activeIndex.value >= 0 ? `${listId}-o${activeIndex.value}` : undefined)

/* Renders an option's slot content inside the popup row. Cloned so the same
   vnode can be re-mounted after the popup is closed and reopened. */
const OptionContent = (p) => p.nodes.map((n) => (n && typeof n === 'object' ? cloneVNode(n) : n))
OptionContent.props = ['nodes']

/* ------------------------------ open / close ------------------------------ */
function openList() {
  if (isOpen.value || props.disabled) return
  query.value = ''
  isOpen.value = true
  positioned.value = false
  const list = visible.value
  const si = selected.value ? list.indexOf(selected.value) : -1
  activeIndex.value = si >= 0 && !list[si].disabled ? si : firstEnabled(list)
  emit('open')
  nextTick(() => { updatePosition(); scrollActiveIntoView(true) })
}

function closeList() {
  if (!isOpen.value) return
  isOpen.value = false
  positioned.value = false
  query.value = ''
  activeIndex.value = -1
  emit('close')
}

function toggle() { isOpen.value ? closeList() : openList() }

function selectOption(o) {
  if (!o || o.disabled) return
  if (o.value !== props.modelValue) {
    emit('update:modelValue', o.value)
    emit('change', o.value)
  }
  closeList()
}

function commitActive() {
  const o = visible.value[activeIndex.value]
  if (o && !o.disabled) selectOption(o)
  else closeList()
}

function clear() {
  if (props.modelValue !== undefined && props.modelValue !== null) {
    emit('update:modelValue', null)
    emit('change', null)
  }
  query.value = ''
  inputEl.value && inputEl.value.focus()
}

/* -------------------------------- keyboard -------------------------------- */
let typeBuffer = ''
let typeTimer = null

function typeAhead(ch) {
  if (typeTimer) clearTimeout(typeTimer)
  typeBuffer += ch
  typeTimer = setTimeout(() => { typeBuffer = '' }, 700)
  const q = normalizeText(typeBuffer)
  const list = visible.value
  if (!q || !list.length) return
  const from = isOpen.value ? activeIndex.value : (selected.value ? list.indexOf(selected.value) : -1)
  for (let c = 1; c <= list.length; c++) {
    const i = (from + c + list.length) % list.length
    const o = list[i]
    if (!o.disabled && o.search.indexOf(q) === 0) {
      if (isOpen.value) setActive(i, true)
      else selectOption(o)
      return
    }
  }
}

function setActive(i, scroll) {
  activeIndex.value = i
  if (scroll) nextTick(() => scrollActiveIntoView())
}

function move(action) {
  setActive(moveActive(visible.value, activeIndex.value, action, { loop: props.loop }), true)
}

function onKeydown(e) {
  if (props.disabled) return
  const k = e.key

  if (e.altKey && k === 'ArrowDown') { e.preventDefault(); openList(); return }
  if (e.altKey && k === 'ArrowUp') { e.preventDefault(); if (isOpen.value) commitActive(); return }
  if (e.ctrlKey || e.metaKey) return

  switch (k) {
    case 'ArrowDown':
    case 'ArrowUp':
      e.preventDefault()
      if (!isOpen.value) openList()
      else move(k === 'ArrowDown' ? 'next' : 'prev')
      return

    case 'PageDown':
    case 'PageUp':
      if (!isOpen.value) return
      e.preventDefault()
      move(k === 'PageDown' ? 'pageDown' : 'pageUp')
      return

    case 'Home':
    case 'End':
      // While typing, Home/End belong to the caret.
      if (props.searchable && query.value) return
      if (!isOpen.value) return
      e.preventDefault()
      move(k === 'Home' ? 'first' : 'last')
      return

    case 'Enter':
      e.preventDefault()
      isOpen.value ? commitActive() : openList()
      return

    case 'Escape':
      if (isOpen.value) { e.preventDefault(); e.stopPropagation(); closeList() }
      else if (query.value) { e.stopPropagation(); query.value = '' }
      return

    case 'Tab':
      // Never preventDefault: the widget is one tab stop and focus must leave.
      if (isOpen.value) commitActive()
      return

    case ' ':
      if (!props.searchable) { e.preventDefault(); isOpen.value ? commitActive() : openList() }
      else if (!isOpen.value && !query.value) { e.preventDefault(); openList() }
      return

    case 'Backspace':
      if (!props.searchable) e.preventDefault()
      return

    default:
      if (k.length !== 1) return
      if (props.searchable) { if (!isOpen.value) openList() }
      else { e.preventDefault(); typeAhead(k) }
  }
}

function onInput(e) {
  if (!props.searchable) return
  query.value = e.target.value
  if (!isOpen.value) openList()
  emit('search', query.value)
}

/* --------------------------------- mouse --------------------------------- */
function onControlMouseDown(e) {
  if (props.disabled) return
  // Keep focus on the input no matter where inside the control you press.
  if (e.target !== inputEl.value) {
    e.preventDefault()
    inputEl.value && inputEl.value.focus()
  }
}

function onControlClick(e) {
  if (props.disabled) return
  // Clicking into the text you are typing must not close the list.
  if (isOpen.value && props.searchable && e.target === inputEl.value && query.value) return
  toggle()
}

function onOptionHover(i) {
  if (visible.value[i] && !visible.value[i].disabled) activeIndex.value = i
}

function onDocumentPointerDown(e) {
  const t = e.target
  if ((rootEl.value && rootEl.value.contains(t)) || (popupEl.value && popupEl.value.contains(t))) return
  closeList()
}

function onFocusOut(e) {
  const next = e.relatedTarget
  if (next && ((rootEl.value && rootEl.value.contains(next)) || (popupEl.value && popupEl.value.contains(next)))) return
  isFocused.value = false
  closeList()
}

/* ------------------------------- positioning ------------------------------- */
let raf = null
function schedulePosition() {
  if (raf) return
  const run = () => { raf = null; updatePosition() }
  raf = typeof requestAnimationFrame === 'function' ? requestAnimationFrame(run) : setTimeout(run, 16)
}

function updatePosition() {
  if (!isOpen.value || !rootEl.value) return
  const rect = rootEl.value.getBoundingClientRect()
  const list = listEl.value
  const contentHeight = list ? list.scrollHeight + 2 : 0
  const r = resolvePlacement({
    rect,
    viewportHeight: window.innerHeight || 0,
    viewportWidth: window.innerWidth || 0,
    contentHeight,
    maxHeight: props.maxHeight,
    preferred: props.placement,
  })
  placementUsed.value = r.placement
  popupStyle.value = r.style
  positioned.value = true
}

function scrollActiveIntoView(center) {
  const list = listEl.value
  if (!list) return
  const el = list.querySelector('[data-active="true"]')
  if (!el) return
  const top = el.offsetTop
  const bottom = top + el.offsetHeight
  if (center && bottom - list.clientHeight / 2 > 0) {
    list.scrollTop = Math.max(0, top - (list.clientHeight - el.offsetHeight) / 2)
  } else if (top < list.scrollTop) {
    list.scrollTop = top
  } else if (bottom > list.scrollTop + list.clientHeight) {
    list.scrollTop = bottom - list.clientHeight
  }
}

/* -------------------------------- reactions -------------------------------- */
watch(query, () => {
  if (!isOpen.value) return
  setActive(firstEnabled(visible.value), false)
  nextTick(() => { updatePosition(); if (listEl.value) listEl.value.scrollTop = 0 })
})

watch(() => (isOpen.value ? visible.value.length : -1), (n) => {
  if (!isOpen.value) return
  if (activeIndex.value >= n) setActive(n ? firstEnabled(visible.value) : -1, false)
  nextTick(updatePosition)
})

watch(() => props.disabled, (d) => { if (d) closeList() })

watch(isOpen, (open) => {
  if (typeof window === 'undefined') return
  if (open) {
    window.addEventListener('resize', schedulePosition, { passive: true })
    window.addEventListener('scroll', schedulePosition, true)
    document.addEventListener('mousedown', onDocumentPointerDown, true)
    document.addEventListener('touchstart', onDocumentPointerDown, true)
  } else {
    window.removeEventListener('resize', schedulePosition)
    window.removeEventListener('scroll', schedulePosition, true)
    document.removeEventListener('mousedown', onDocumentPointerDown, true)
    document.removeEventListener('touchstart', onDocumentPointerDown, true)
  }
})

onMounted(() => { isMounted.value = true })
onBeforeUnmount(() => {
  if (typeTimer) clearTimeout(typeTimer)
  isOpen.value = false
  window.removeEventListener('resize', schedulePosition)
  window.removeEventListener('scroll', schedulePosition, true)
  document.removeEventListener('mousedown', onDocumentPointerDown, true)
  document.removeEventListener('touchstart', onDocumentPointerDown, true)
})

defineExpose({
  focus: () => inputEl.value && inputEl.value.focus(),
  blur: () => inputEl.value && inputEl.value.blur(),
  open: openList,
  close: closeList,
  isOpen,
  options,
})
</script>

<template>
  <div
      ref="rootEl"
      class="sc"
      :class="{
      'sc--open': isOpen,
      'sc--focused': isFocused,
      'sc--disabled': disabled,
      'sc--searchable': searchable,
      'sc--typing': !!query,
    }"
      v-bind="$attrs"
      @focusout="onFocusOut"
  >
    <div class="sc__control" @mousedown="onControlMouseDown" @click="onControlClick">
      <div class="sc__field">
        <span v-show="!query" class="sc__value" :class="{ 'sc__value--empty': !selected }">
          <OptionContent v-if="selected" :nodes="selected.nodes" />
          <template v-else>{{ placeholder }}</template>
        </span>
        <input
            :id="id"
            ref="inputEl"
            class="sc__input"
            type="text"
            role="combobox"
            autocomplete="off"
            autocorrect="off"
            autocapitalize="none"
            spellcheck="false"
            :value="query"
            :disabled="disabled"
            :readonly="!searchable"
            :aria-label="ariaLabel"
            :aria-expanded="isOpen ? 'true' : 'false'"
            aria-haspopup="listbox"
            aria-autocomplete="list"
            :aria-controls="isOpen ? listId : undefined"
            :aria-activedescendant="activeId"
            @input="onInput"
            @keydown="onKeydown"
            @focus="isFocused = true"
        />
      </div>

      <button
          v-if="clearable && selected && !disabled"
          class="sc__clear"
          type="button"
          tabindex="-1"
          aria-label="Clear selection"
          @mousedown.prevent
          @click.stop="clear"
      >
        <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
          <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round" />
        </svg>
      </button>

      <span class="sc__arrow" aria-hidden="true">
        <svg viewBox="0 0 16 16" width="10" height="10">
          <path d="M3 6l5 5 5-5" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </span>
    </div>
  </div>

  <Teleport v-if="isMounted" :to="teleportTo">
    <div
        v-if="isOpen"
        ref="popupEl"
        class="sc-popup"
        :class="[`sc-popup--${placementUsed}`, { 'sc-popup--measuring': !positioned }]"
        :style="popupStyle"
        @mousedown.prevent
    >
      <ul :id="listId" ref="listEl" class="sc-popup__list" role="listbox" :aria-label="ariaLabel">
        <li
            v-for="(o, i) in visible"
            :id="`${listId}-o${i}`"
            :key="o.key"
            class="sc-opt"
            role="option"
            :class="{
            'sc-opt--active': i === activeIndex,
            'sc-opt--selected': o === selected,
            'sc-opt--disabled': o.disabled,
          }"
            :data-active="i === activeIndex ? 'true' : 'false'"
            :aria-selected="o === selected ? 'true' : 'false'"
            :aria-disabled="o.disabled ? 'true' : undefined"
            @mousemove="onOptionHover(i)"
            @click="selectOption(o)"
        >
          <span class="sc-opt__content"><OptionContent :nodes="o.nodes" /></span>
          <svg v-if="o === selected" class="sc-opt__check" viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
            <path d="M3 8.5l3.2 3.2L13 5" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </li>
        <li v-if="!visible.length" class="sc-popup__empty">{{ noResultsText }}</li>
      </ul>
    </div>
  </Teleport>
</template>

<style>
/* Unscoped on purpose: the popup is teleported and the whole point is that you
   can restyle it. Everything is namespaced `sc-` and driven by these vars. */
.sc,
.sc-popup {
  --sc-bg: #15181d;
  --sc-bg-hover: #1a1e25;
  --sc-border: #2a303b;
  --sc-border-hover: #39414f;
  --sc-accent: #5b9dff;
  --sc-text: #dbe1ea;
  --sc-muted: #6f7889;
  --sc-popup-bg: #12151a;
  --sc-row-active: #222937;
  --sc-radius: 4px;
  --sc-height: 34px;
  --sc-row-height: 30px;
  --sc-pad: 9px;
  --sc-font: 13px/1.45 system-ui, -apple-system, "Segoe UI", Roboto, Vazirmatn, Tahoma, sans-serif;
}

.sc {
  display: block;
  position: relative;
  font: var(--sc-font);
  color: var(--sc-text);
  -webkit-user-select: none;
  user-select: none;
}

.sc__control {
  display: flex;
  align-items: center;
  gap: 6px;
  height: var(--sc-height);
  padding: 0 var(--sc-pad);
  background: var(--sc-bg);
  border: 1px solid var(--sc-border);
  border-radius: var(--sc-radius);
  cursor: pointer;
  transition: border-color .12s linear, background-color .12s linear;
}
.sc:hover .sc__control { border-color: var(--sc-border-hover); }
.sc--focused .sc__control,
.sc--open .sc__control { border-color: var(--sc-accent); background: var(--sc-bg-hover); }
.sc--disabled .sc__control { opacity: .5; cursor: not-allowed; }
.sc--searchable.sc--open .sc__control { cursor: text; }

.sc__field { position: relative; flex: 1 1 auto; min-width: 0; height: 100%; }

.sc__value {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  display: flex;
  align-items: center;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  pointer-events: none;
}
.sc__value > * { overflow: hidden; text-overflow: ellipsis; }
.sc__value--empty { color: var(--sc-muted); }

.sc__input {
  position: absolute;
  top: 0; left: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--sc-text);
  font: inherit;
  text-align: inherit;
  outline: none;
  border-radius: 0;
  -webkit-appearance: none;
  appearance: none;
}
.sc:not(.sc--searchable) .sc__input,
.sc--searchable:not(.sc--open) .sc__input { caret-color: transparent; cursor: pointer; }
.sc--searchable.sc--open .sc__input { caret-color: var(--sc-accent); }
.sc__input::-ms-clear { display: none; }

.sc__clear,
.sc__arrow {
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--sc-muted);
}
.sc__clear {
  width: 16px; height: 16px;
  padding: 0;
  border: 0;
  border-radius: 2px;
  background: transparent;
  cursor: pointer;
}
.sc__clear:hover { color: var(--sc-text); background: var(--sc-row-active); }
.sc__arrow { transition: transform .12s ease-out, color .12s linear; }
.sc--open .sc__arrow { transform: rotate(180deg); color: var(--sc-accent); }

/* ---------------------------------- popup ---------------------------------- */
.sc-popup {
  z-index: 2147483000;
  display: flex;
  box-sizing: border-box;
  background: var(--sc-popup-bg);
  border: 1px solid var(--sc-border);
  border-radius: var(--sc-radius);
  overflow: hidden;
  font: var(--sc-font);
  color: var(--sc-text);
  box-shadow: 0 8px 24px rgba(0, 0, 0, .55);
}
.sc-popup--measuring { visibility: hidden; }

.sc-popup__list {
  width: 100%;
  max-height: 100%;
  margin: 0;
  padding: 3px;
  list-style: none;
  overflow-x: hidden;
  overflow-y: auto;
  position: relative;
  -webkit-overflow-scrolling: touch;
}
.sc-popup__list::-webkit-scrollbar { width: 8px; }
.sc-popup__list::-webkit-scrollbar-track { background: transparent; }
.sc-popup__list::-webkit-scrollbar-thumb { background: #2c3340; border-radius: 4px; }
.sc-popup__list::-webkit-scrollbar-thumb:hover { background: #3a4351; }

.sc-opt {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: var(--sc-row-height);
  padding: 0 8px;
  border-radius: 3px;
  cursor: pointer;
  white-space: nowrap;
}
.sc-opt__content { flex: 1 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; }
.sc-opt__check { flex: none; color: var(--sc-accent); }
.sc-opt--active { background: var(--sc-row-active); }
.sc-opt--selected { color: var(--sc-accent); }
.sc-opt--disabled { color: var(--sc-muted); opacity: .55; cursor: default; }
.sc-opt--disabled.sc-opt--active { background: transparent; }

.sc-popup__empty {
  padding: 10px 8px;
  color: var(--sc-muted);
  text-align: center;
}

@media (prefers-reduced-motion: reduce) {
  .sc__control, .sc__arrow { transition: none; }
}
</style>