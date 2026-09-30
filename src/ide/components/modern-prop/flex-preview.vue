<script setup>
import { computed } from 'vue'

const props = defineProps({
  kind: {
    type: String,
    default: 'row',
  },

  main: {
    type: String,
    default: 'start',
  },

  cross: {
    type: String,
    default: 'flex-start',
  },
})

const isColumn = computed(() => props.kind === 'column')

/*
 * Flutter's baseline alignment is only meaningful
 * when the main axis is horizontal.
 */
const actualCross = computed(() => {
  if (props.cross === 'baseline' && isColumn.value) {
    return 'flex-start'
  }

  return props.cross
})

const containerStyle = computed(() => ({
  flexDirection: props.kind,
  justifyContent: props.main,
  alignItems: actualCross.value,
}))
</script>

<template>
  <div id="flex-preview-container">
    <div
        id="flex-preview"
        :style="containerStyle"
        :class="{
        'stretch-preview': cross === 'stretch',
        'baseline-preview': cross === 'baseline' && kind === 'row',
      }"
    >
      <!-- Normal items -->
      <template v-if="cross !== 'baseline'">
        <div
            class="item square-item"
            :class="{ stretch: cross === 'stretch' }"
        />

        <div
            class="item tall-item"
            :class="{ stretch: cross === 'stretch' }"
        />

        <div
            class="item fat-item"
            :class="{ stretch: cross === 'stretch' }"
        />
      </template>

      <!-- Text items are used because baseline alignment
           is defined around text baselines. -->
      <template v-else-if="kind === 'row'">
        <div class="baseline-item small-text">
          A
        </div>

        <div class="baseline-item large-text">
          Text
        </div>

        <div class="baseline-item medium-text">
          A
        </div>
      </template>

      <!-- Column + baseline behaves like start -->
      <template v-else>
        <div class="item square-item" />
        <div class="item tall-item" />
        <div class="item fat-item" />
      </template>
    </div>
  </div>
</template>

<style scoped>
#flex-preview-container {
  width: 100%;
  padding: 5px;
  box-sizing: border-box;
}

#flex-preview {
  width: 100%;
  height: 200px;

  display: flex;

  padding: 7px;
  gap: 7px;

  border: 2px solid var(--text-muted);
  border-radius: 7px;

  box-sizing: border-box;
}

/* Default items */

.item {
  flex: 0 0 auto;
  background: var(--text-muted);
}

.square-item {
  width: 35px;
  height: 35px;
}

.tall-item {
  width: 20px;
  height: 55px;
}

.fat-item {
  width: 55px;
  height: 20px;
}

/*
 * Stretch
 *
 * The fixed cross-axis dimension must be removed.
 * Flexbox can then stretch the item to the container's
 * cross-axis size.
 */

.stretch-preview .item {
  flex-shrink: 1;
}

.stretch-preview .square-item,
.stretch-preview .tall-item,
.stretch-preview .fat-item {
  align-self: stretch;
}

#flex-preview[style*='flex-direction: row'].stretch-preview .item {
  height: auto;
}

#flex-preview[style*='flex-direction: column'].stretch-preview .item {
  width: auto;
}

/*
 * Baseline
 *
 * Baseline alignment needs actual text with different
 * font sizes so that the browser has real text baselines
 * to align.
 */

.baseline-preview {
  align-items: baseline;
}

.baseline-item {
  flex: 0 0 auto;

  color: var(--text-muted);

  font-family: sans-serif;
  font-weight: 600;

  line-height: 1;
}

.small-text {
  font-size: 18px;
}

.medium-text {
  font-size: 28px;
}

.large-text {
  font-size: 48px;
}
</style>
