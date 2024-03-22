<template>
  <div>
    <div id="material-color-picker" @click="showModal = true">
      <div id="active-color" :style="'background:'+activeColor"></div>
      <label>
        {{ this.label }}
      </label>
    </div>
    <div id="colorz-modal" v-if="showModal">
      <div id="colors">
        <template v-for="(color,key) in colors" :key="key">
          <div :class="'color' + (color.value === val?' active':'')"
               v-if="key > 1" :style="`background: ${color.color}`"
               @click="update(color.value)">
            <span>
              {{ color.name }}
            </span>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from "vuex";

export default {
  name: "material-color-picker",
  components: {},
  data: () => {
    return {
      val: null,
      showModal: false,
    }
  },
  props: {
    label: {
      default: '',
      type: String,
    },
    modelValue: {
      default: false,
      type: String,
    },
  },
  mounted() {
    this.val = this.modelValue;
  },
  computed: {
    ...mapState('ide', ['colors']),
    activeColor() {
      for (const color of this.colors) {
        if (this.val === color.value) {
          return color.color;
        }
      }

      return "transparent";

    }
  },
  methods: {
    update(value) {
      this.val = value;
      this.$emit('update:modelValue', this.val);
      this.showModal = false;
    }
  }
}
</script>

<style scoped>
#material-color-picker {
  padding: .5rem;
  cursor: pointer;
  border-bottom: 1px solid var(--lighter-bg);
}

#active-color {
  height: 20px;
  width: 20px;
  display: inline-block;
  float: right;
}


#colorz-modal {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  background: #00000022;
  backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99;
}

#colors {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-gap: .4rem;
  min-width: 900px;
  max-width: 100%;
}

.color {
  display: flex;
  height: 3rem;
  border: 2px solid var(--darker-bg);
  justify-content: center;
  align-items: center;

}

.color.active {
  border: 2px solid var(--text-color);
}

.color span {
  color: var(--def-bg);
  font-weight: 500;
}
</style>