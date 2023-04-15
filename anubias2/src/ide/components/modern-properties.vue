<template>
  <div v-if="properties.type !== undefined" class="prop-container">
    <collapsible title="Name" icon="ri-codepen-line">
      <!--  change name -->
      <div class="input-container">
        <input type="text" @keyup="checkName" v-model="properties.name"
               :data-blur="isNameValid" @blur="canBlur">
      </div>
      <div class="err" v-if="!isNameValid">
        Name is invalid...
      </div>
    </collapsible>
    <collapsible v-if="properties.align !== undefined" :title="'Align ('+showValue(properties.align)+')'" icon="ri-layout-right-2-line">
      <div class="btn-group">
        <div  v-for="(v,i) in extractItems(properties.validator.align.regex)"
              :class="'btn '+(v === properties.align?'active':'')"
              :key="i">
            <div v-if="v === 'null'" title="default" @click="properties.align = 'null'">
               <i class="ri-eraser-line"></i>
            </div>
            <div v-else :title="v" @click="properties.align = v">
                <i :class="`ri-align-${v}`"></i>
            </div>
        </div>
      </div>
    </collapsible>
    <collapsible v-if="properties.width !== undefined || properties.height !== undefined"  title="Size control" icon="ri-pencil-ruler-2-line">
      <label class="input-container" v-if="properties.width !== undefined">
        Width <template v-if="isLinkedWidthHeight"> & height </template> :
        <dinput  :on-update="widthUpdate" v-model="properties.width" min-value="0" max-value="999" :percentable="true" />
      </label>
      <label class="input-container" v-if="properties.height !== undefined && !isLinkedWidthHeight" >
        Height:
        <dinput v-model="properties.height" min-value="0" max-value="999" :percentable="true" />
      </label>
      <div v-if="properties.width !== undefined && properties.height !== undefined">
        <toggle icon="ri-links-line" label="Link width & height" v-model="isLinkedWidthHeight" :size=".6"></toggle>
      </div>
    </collapsible>
    <collapsible title="Colors properties" icon="ri-palette-line">
      <template v-for="(p,index) in properties"  :key="index">
        <div  v-if="properties.validator[index] !== undefined
                && properties.validator[index].type === 'String|Color'">
          <color-picker v-model="properties[index]" :label="index"></color-picker>
        </div>
      </template>
    </collapsible>
    <collapsible v-if="properties.padding !== undefined" title="Padding">
      <around v-model="properties.padding"></around>
    </collapsible>
    <collapsible title="Checkable properties" icon="ri-checkbox-multiple-line">
      <template v-for="(p,index) in properties"  :key="index">
        <div  v-if="properties.validator[index] !== undefined
                && properties.validator[index].type === 'Boolean'">
          <toggle :label="index" v-model="properties[index]" :size=".6"></toggle>
        </div>
      </template>
    </collapsible>

  </div>
</template>

<script>
import {mapGetters, mapState} from 'vuex';
import collapsible from "./collapsible.vue";
import  toggle from './switch.vue';
import around from './around-controller.vue'
import colorPicker from './color-picker.vue'
import dinput from './input-draggable.vue';
export default {
  name: "modern-properties",
  components: {
    collapsible,
    toggle,
    around,
    colorPicker,
    dinput,
  },
  data() {
    return {
      isNameValid: true,
      isLinkedWidthHeight: false,
    }
  },
  mounted() {
    // this.properties.name += '_';
    this.isLinkedWidthHeight = false;
  },
  computed: {
    ...mapState('ide', {
      properties: 'onEditComponent',
    }),
    ...mapGetters('project',['appColor'])
  },
  methods: {
    /**
     * extract items form regex
     * @param regex
     */
    extractItems(regex){
      try {
        return  regex.split('(')[1].split(')')[0].split('|');
      } catch {
          return [];
      }

    },
    showValue(title){
      if (title === 'null'){
        return 'Default';
      }
      return  title;
    },
    checkName(){
      if (this.properties.name.match(this.properties.validator.name.regex)) {
        this.isNameValid = true;
      }else{
        this.isNameValid = false;
      }
      // need to check other names of project
    },
    canBlur(e){
      if (e.target.getAttribute('data-blur') === 'false'){
        e.target.focus();
      }
    },
    widthUpdate(){
      if (this.isLinkedWidthHeight){
        this.properties.height = this.properties.width;
      }
    }
  }
}
</script>

<style scoped>
  input{
    padding: 4px;
  }
  .prop-container{
    overflow-y: auto;
  }
  .err{
    background: #8B000066;
    padding: 4px;
  }
  .btn-group{
    display: grid;
    grid-auto-columns: minmax(0, 1fr);
    grid-auto-flow: column;
    padding: .5rem .2rem;
  }
  .btn-group .btn{
    border: 1px solid var(--lighter-bg);
    text-align: center;
    transition: var(--transition-duration);
  }
  .btn-group .btn.active{
    color: var(--text-hilight);
    border-color: var(--text-hilight-darker);
  }
</style>