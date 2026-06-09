<template>
  <div>
    <div class="state">
      <div :class="(count === 1?'active':'')" @click="changeCount(1)">
        <i class="ri-number-1"></i>
      </div>
      <div :class="(count === 2?'active':'')" @click="changeCount(2)">
        <i class="ri-number-2"></i>
      </div>
      <div :class="(count === 3?'active':'')" @click="changeCount(3)">
        <i class="ri-number-3"></i>
      </div>
      <div :class="(count === 4?'active':'')" @click="changeCount(4)">
        <i class="ri-number-4"></i>
      </div>
    </div>
    <div class="square">
      <div class="top" >
        {{ top }}
      </div>
      <div class="bottom">
        {{ bottom }}
      </div>
      <div class="left">
        {{ left }}
      </div>
      <div class="right">
        {{ right }}
      </div>
      <i class="ri-shape-line"></i>
    </div>
    <div class="grid">
      <div class="input-container" v-for="i in count" :key="i">
        <dinput v-model="editable[i-1]" @input="updateData" @input-val="updateData" ></dinput>
<!--        <input type="text" v-model="editable[i-1]" @input="updateData">-->
      </div>
    </div>
<!--    <div class="input-container">-->
<!--      <label for="model">-->
<!--        <input type="text" id="model"-->
<!--               @input="updateModel"-->
<!--               @keyup="updateModel"-->
<!--               v-model="model">-->
<!--      </label>-->
<!--    </div>-->
  </div>
</template>

<script>
import dinput from './input-draggable.vue';
export default {
  name: "around-viewer",
  components:{dinput},
  props: {
    modelValue: {
      type: String,
      default: 0,
      required: true,
    }
  },
  data() {
    return {
      count: 1,
      editable: [],
    }
  },
  mounted() {
    this.count = this.modelValue.split(',').length;
    this.model = this.modelValue;
  },
  computed: {
    data: {
      get() {
        this.count = this.modelValue.split(',').length;
        this.editable = this.modelValue.split(',');
        return this.modelValue.split(',');
      },
      set(value) {
        this.$emit('update:modelValue', value.join(','));
      }
    },
    left() {
      if (this.data.length === 1) {
        return this.data[0];
      }
      if (this.data.length === 2 || this.data.length === 3) {
        return this.data[1];
      } else {
        return this.data[3];
      }
    },
    right() {
      if (this.data.length === 1) {
        return this.data[0];
      } else {
        return this.data[1];
      }
    },
    bottom() {
      if (this.data.length === 1 || this.data.length === 2) {
        return this.data[0];
      } else {
        return this.data[2];
      }
    },
    top() {
      return this.data[0];
    },
  },
  methods: {
    updateData(){
      this.data = this.editable;
    },
    changeCount(i){

      if (i === this.count){
        return null;
      }
      let x = this.modelValue.split(',');
      // add some new values
      if (this.count < i){
        for (let j = x.length; j < i; j++) {
          x.push(x[x.length-1]);
        }
        this.$emit('update:modelValue', x.join(','));
      }else{
        // remove old values
        x = x.splice( (this.count - i),4);
        this.$emit('update:modelValue',x.join(','));
      }
      this.data = x;
      this.count = i;
    }
  }
}
</script>

<style scoped>

.state {
  display: grid;
  grid-auto-columns: minmax(0, 1fr);
  grid-auto-flow: column;
  padding: 5px;
  overflow: hidden;
  text-align: center;
}

.state i {
  padding: 5px;
  border: 1px solid var(--lighter-bg);
  border-radius: 50%;
  font-size: 20px;
  cursor: pointer;
}

.state .active i {
  background: var(--text-hilight);
  border-color:transparent;
  color: var(--darker-bg);
}

.square {
  border: 1px dashed gray;
  height: 5rem;
  width: 75%;
  margin: 1em auto;
  position: relative;
}

.top, .bottom, .left, .right {
  position: absolute;
  background: var(--darker-bg);
  padding: 5px 1em;
}

.top {
  top: -1em;
  left: 50%;
  transform: translateX(-50%);
}

.bottom {
  bottom: -1em;
  left: 50%;
  transform: translateX(-50%);
}

.left {
  top: 50%;
  left: -1.5em;
  transform: translateY(-50%);
}

.right {
  top: 50%;
  right: -1.5em;
  transform: translateY(-50%);
}

.square i {
  font-size: 30px;
  left: 50%;
  top: 50%;
  transform: translateY(-50%) translateX(-50%);
  position: absolute;
}

.grid{
  display: grid;
  grid-template-columns: repeat(2,1fr);
  grid-gap: 3px;
}

.grid input{
  width: 100%;
  text-align: center;
}

</style>