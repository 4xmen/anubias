<template>
  <div class="color-picker">

    <div class="grid">
      <b>{{ label }}</b>
      <span v-if="modelValue !== 'null'">
        {{ modelValue }}
      </span>
      <span v-else>
        Default
      </span>
      <div id="squire" @click="modal = true;" :style="'background:'+computedColor+';'"></div>
    </div>
    <div id="color-picker" :style="colorPickerModalStyle" @click="closeModal">
      <div class="color-container">
        <h4>
          {{ colorName }}
        </h4>
        <ColorPicker
            label=""
            theme="dark"
            :color="color"
            :sucker-hide="false"
            :sucker-canvas="suckerCanvas"
            :sucker-area="suckerArea"
            @changeColor="changeColor"
            @openSucker="openSucker"
            :colors-default="fixedColor"
        />
        <div class="grid-equal">
          <div>
            <div class="circle-btn" @click="modal = false" title="ok">
              <i class="ri-check-line"></i>
            </div>
          </div>
          <div>
            <div class="circle-btn" @click="setDefault" title="default">
              <i class="ri-eraser-line"></i>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import {ColorPicker} from 'vue-color-kit';
import 'vue-color-kit/dist/vue-color-kit.css';
import {mapGetters} from "vuex";
import {getColor} from "../js/general-functions";

export default {
  name: "color-picker",
  components: {
    ColorPicker,
  },
  props: {
    modelValue: {
      // required: true,
    },
    label: {
      default: '',
      type: String,
      required: true,
    },
  },
  data() {
    return {
      color: '#59c7f9',
      suckerCanvas: null,
      suckerArea: [],
      isSucking: false,
      modal: false,
      colorName: '',
      // defaultColors:[],
    }
  },
  mounted() {

  },
  computed: {
    ...mapGetters(
        'ide', ['defaultColors', 'defaultColorsArray']
    ),
    ...mapGetters(
        'project', ['appColor']
    ),
    computedColor() {
      return getColor(this.modelValue);
    },
    fixedColor() {
      let n = this.defaultColorsArray;
      n.splice(0, 1);
      // n[0] = this.appColor;
      return n;
    },
    colorPickerModalStyle() {
      if (this.modal) {
        return 'display:flex;';
      } else {
        return 'display:none;';
      }
    }
  },
  methods: {
    getColor: getColor,
    setDefault() {
      this.$emit('update:modelValue', "null");
      this.modal = false;
    },
    closeModal(e) {
      if (e.target.getAttribute('id') === 'color-picker') {
        this.modal = false;
      }
    },
    changeColor(color) {
      this.color = color.hex;
      // console.log(this.defaultColors);

      // need review
      this.$emit('update:modelValue', this.fixColor(color));
    },
    // fix color for fultter find reserved color;

    fixColor(color) {
      let hex = color.hex;
      let result = '';

      if (color.rgba.a === 0) {
        return 'Colors.transparent';
      }
      if (color.rgba.a === 1) {
        let foundColor = Object.entries(this.defaultColors).find(([key, value]) => (value === hex.toLowerCase()));
        if (foundColor !== undefined) {
          // check is app default color
          if (foundColor[0] === this.appColor) {
            result = 'null';
          } else {
            result = foundColor[0];
          }
        } else {
          this.colorName = 'Color(0xFF' + color.hex.substr(1, 6) + ')';
          return 'Color(0xFF' + color.hex.substr(1, 6) + ')';
          // console.log(color.substr(7,2));
          // console.log(color.substr(1,6));
        }
      }
      this.colorName = result;
      return result;
    },
    openSucker(isOpen) {
      if (isOpen) {
        // ... canvas be created
        // this.suckerCanvas = canvas
        // this.suckerArea = [x1, y1, x2, y2]
      } else {
        // this.suckerCanvas && this.suckerCanvas.remove
      }
    },
  },
}
</script>

<style scoped>
h4 {
  text-align: center;
  padding-top: 5px;
}

#color-picker {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  display: none;
  align-items: center;
  justify-content: center;
  z-index: 99;
  background: #00000099;
}

#squire {
  width: 22px;
  height: 22px;
  border: 1px solid var(--invert-bg);
  border-radius: 50%;
}

.color-picker {
  border-bottom: 1px solid var(--lighter-bg);
}

.grid {
  display: grid;
  grid-template-columns: 4fr 5fr 1fr;
  cursor: pointer;
}

.grid span, .grid b {
  display: block;
  text-align: left;
  padding: 3px;
}

.hu-color-picker {
  width: 220px !important;
}

.color-container {
  background: #1d2024;
  border-radius: 4px;
}

.grid-equal {
  padding: 0 10px 10px;
  grid-gap: 10px;
  text-align: center;
  margin-bottom: -35px;
}

.grid-equal .circle-btn{
  margin: auto;
}
</style>