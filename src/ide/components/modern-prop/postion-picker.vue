<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: null
  },
  options: {
    type: [String, Array],
    default: 'null|topLeft|topRight|topCenter|centerLeft|centerRight|center|bottomLeft|bottomRight|bottomCenter'
  }
})

const emit = defineEmits(['update:modelValue'])

const allPositions = [
  'topLeft',
  'topCenter',
  'topRight',
  'centerLeft',
  'center',
  'centerRight',
  'bottomLeft',
  'bottomCenter',
  'bottomRight'
]

const positionMap = {
  topLeft: [0, 0],
  topCenter: [1, 0],
  topRight: [2, 0],

  centerLeft: [0, 1],
  center: [1, 1],
  centerRight: [2, 1],

  bottomLeft: [0, 2],
  bottomCenter: [1, 2],
  bottomRight: [2, 2]
}

const normalizedOptions = computed(() => {
  if (Array.isArray(props.options)) {
    return props.options
  }

  return props.options
      .split('|')
      .map(x => x.trim())
      .filter(Boolean)
})

const hasDefault = computed(() => normalizedOptions.value.includes('null'))

const availablePositions = computed(() => {
  return allPositions.filter(position =>
      normalizedOptions.value.includes(position)
  )
})

function select(position) {
  emit(
      'update:modelValue',
      position === 'null' ? null : position
  )
}

function isSelected(position) {
  if (position === 'null') {
    return props.modelValue == null
  }

  return props.modelValue === position
}
</script>

<template>
  <div class="position-picker">

    <!-- Default -->
    <button
        v-if="hasDefault"
        type="button"
        class="position-default"
        :class="{ selected: isSelected('null') }"
        title="Default"
        @click="select('null')"
    >
      <svg viewBox="0 0 24 24">
        <path
            d="M6 6h12v12H6z"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            rx="2"
        />
        <circle
            cx="12"
            cy="12"
            r="2"
            fill="currentColor"
        />
      </svg>
    </button>

    <!-- 3 x 3 -->
    <div class="position-grid">
      <template
          v-for="position in availablePositions"
          :key="position"
      >
        <button
            type="button"
            class="position-button"
            :class="{ selected: isSelected(position) }"
            :title="position"
            @click="select(position)"
        >
          <svg viewBox="0 0 32 32">
            <!-- outer frame -->
            <rect
                x="5"
                y="5"
                width="22"
                height="22"
                rx="3"
                fill="none"
                class="frame"
            />

            <!-- center guide -->
            <line
                x1="16"
                y1="8"
                x2="16"
                y2="24"
                class="guide"
            />

            <line
                x1="8"
                y1="16"
                x2="24"
                y2="16"
                class="guide"
            />

            <!-- selected position -->
            <circle
                :cx="8 + positionMap[position][0] * 8"
                :cy="8 + positionMap[position][1] * 8"
                r="3"
                class="point"
            />
          </svg>
        </button>
      </template>
    </div>
  </div>
</template>

<style scoped>
.position-picker {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  gap: 8px;

  border: 1px solid #353a42;
  border-radius: 6px;
}

/* Default button */
.position-default {
  width: 100%;
  height: 45px;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 0;
  border: 1px solid transparent;
  border-radius: 4px;

  background: #292d33;
  color: var(--text-muted);

  cursor: pointer;
  transition: 0.15s ease;
}

.position-default svg {
  width: 45px;
  height: 45px;
}

.position-default:hover {
  background: #30353d;
  color: var(--text-color);
}

.position-default.selected {
  color: var(--text-hilight);
  border-color: var(--text-hilight-darker);
  background: #252e3a;
}

/* Grid */
.position-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
}

/* Buttons */
.position-button {
  width: 100%;
  aspect-ratio: 1;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 4px;

  border: 1px solid transparent;
  border-radius: 4px;

  background: #292d33;
  color: var(--text-muted);

  cursor: pointer;
  transition:
      background 0.15s ease,
      border-color 0.15s ease,
      color 0.15s ease;
}

.position-button:hover {
  background: #30353d;
  color: var(--text-color);
}

.position-button.selected {
  color:var(--text-hilight-darker)f;
  background: #252e3a;
  border-color: var(--text-hilight-darker);
}

.position-button svg {
  width: 100%;
  height: 100%;
}

/* SVG */
.frame {
  stroke: currentColor;
  stroke-width: 1;
  opacity: 0.45;
}

.guide {
  stroke: currentColor;
  stroke-width: 0.6;
  opacity: 0.18;
}

.point {
  fill: currentColor;
}
</style>
