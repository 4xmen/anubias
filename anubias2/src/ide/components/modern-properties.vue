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
    <collapsible v-if="properties.align !== undefined" :title="'Align ('+showValue(properties.align)+')'"
                 icon="ri-layout-right-2-line">
      <div class="btn-group">
        <div v-for="(v,i) in extractItems(properties.validator.align.regex)"
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
    <collapsible v-if="propTypeCount('String') > 0" icon="ri-text" title="Text properties">
      <template v-for="(p,index) in properties" :key="index">
        <div v-if="properties.validator[index] !== undefined
                && properties.validator[index].type === 'String' && index !== 'name'">
          <label class="input-container">
            {{ index }}:
            <div v-if="properties.validator[index].regex === '.*'">
              <textarea v-model="properties[index]" :pattern="properties.validator[index].regex" rows="2"></textarea>
            </div>
            <div v-else>
              <input type="text" v-model="properties[index]" :pattern="properties.validator[index].regex">
            </div>
          </label>
        </div>
      </template>
    </collapsible>
    <collapsible v-if="propTypeCount('String|select') > 0" icon="ri-bank-card-line" title="Choose properties">
      <template v-for="(p,index) in properties" :key="index">
        <div v-if="properties.validator[index] !== undefined
                && properties.validator[index].type === 'String|Select'">
          <label class="input-container">
            {{ index }}:
            <select>
              <option v-for="(v,i) in extractItems(properties.validator[index].regex)" :key="i" :value="v"> {{ v }}
              </option>
            </select>
          </label>
        </div>
      </template>
    </collapsible>
    <div v-if="propTypeCount('Number') > 0">

      <collapsible v-if="properties.width !== undefined || properties.height !== undefined"
                   icon="ri-pencil-ruler-2-line"
                   title="Number control">
        <template v-for="(p,index) in properties" :key="index">
          <div v-if="properties.validator[index] !== undefined
                && properties.validator[index].type === 'Number' && index !== 'width' && index !== 'height'">
            <label v-if="properties.height !== undefined && !isLinkedWidthHeight" class="input-container">
              {{ index }}:
              <dinput v-model="properties[index]" :percentable="true" max-value="9999999" min-value="0"/>
            </label>
          </div>
        </template>
      </collapsible>
    </div>

    <collapsible v-if="properties.width !== undefined || properties.height !== undefined" icon="ri-pencil-ruler-2-line"
                 title="Size control">
      <label class="input-container" v-if="properties.width !== undefined">
        Width
        <template v-if="isLinkedWidthHeight"> & height</template>
        :
        <dinput :on-update="widthUpdate" v-model="properties.width" min-value="0" max-value="999" :percentable="true"/>
      </label>
      <label class="input-container" v-if="properties.height !== undefined && !isLinkedWidthHeight">
        Height:
        <dinput v-model="properties.height" min-value="0" max-value="999" :percentable="true"/>
      </label>
      <div v-if="properties.width !== undefined && properties.height !== undefined">
        <toggle icon="ri-links-line" label="Link width & height" v-model="isLinkedWidthHeight" :size=".6"></toggle>
      </div>
    </collapsible>
    <collapsible v-if="propTypeCount('String|Color') > 0" icon="ri-palette-line" title="Colors properties">
      <template v-for="(p,index) in properties" :key="index">
        <div v-if="properties.validator[index] !== undefined
                && properties.validator[index].type === 'String|Color'">
          <color-picker v-model="properties[index]" :label="index"></color-picker>
        </div>
      </template>
    </collapsible>
    <collapsible v-if="properties.padding !== undefined" title="Padding">
      <around v-model="properties.padding"></around>
    </collapsible>
    <collapsible v-if="propTypeCount('Boolean') > 0" icon="ri-checkbox-multiple-line" title="Checkable properties">
      <template v-for="(p,index) in properties" :key="index">
        <div v-if="properties.validator[index] !== undefined
                && properties.validator[index].type === 'Boolean'">
          <toggle :label="index" v-model="properties[index]" :size=".6"></toggle>
        </div>
      </template>
    </collapsible>
    <collapsible v-if="properties.actions !== undefined" title="Actions" icon="ri-stack-line">

      <div title="You can drag and drop to change sort of action's button">
        <Sortable
            :list="properties.actions"
            item-key="icon"
            tag="div"
            @update="updateActionsSort"
        >
          <template #item="{element, index}">
            <div class="draggable" :key="element.icon">
              <icon-picker :label="element.tooltip" v-model="properties.actions[index].icon">
                <div class="grid-equal">
                  <div class="rem" @click="remAction(index)">
                    <i class="ri-close-line"></i>
                  </div>
                  <div class="code-editor">
                    <i class="ri-code-s-slash-line"></i>
                  </div>
                </div>
              </icon-picker>
            </div>
          </template>
        </Sortable>
      </div>
      <ul>

      </ul>
      <hr>
      New action:
      <div>
        <div class="input-container">
          <input type="text" ref="tooltip" v-model="tooltip" placeholder="Tool tip">
        </div>
        <icon-picker label="Action icon" v-model="actIcon"></icon-picker>

        <div class="text-center">
          <button class="circle-btn small m-auto" @click="addAction">
            <i class="ri-add-line"></i>
          </button>
        </div>
      </div>
    </collapsible>

  </div>
</template>

<script>
import {mapGetters, mapState} from 'vuex';
import collapsible from "./collapsible.vue";
import toggle from './switch.vue';
import around from './around-controller.vue'
import colorPicker from './color-picker.vue'
import dinput from './input-draggable.vue';
import iconPicker from './icon-picker.vue';

import {arrayMove} from "../js/general-functions";

import {useToast} from "vue-toastification";
import {Sortable} from "sortablejs-vue3";


let toast;
export default {
  name: "modern-properties",
  components: {
    collapsible,
    toggle,
    around,
    colorPicker,
    dinput,
    iconPicker,
    Sortable,
  },
  data() {
    return {
      isNameValid: true,
      isLinkedWidthHeight: false,
      test: '',
      tooltip: '',
      actIcon: '',
    }
  },
  mounted() {
    // this.properties.name += '_';
    this.isLinkedWidthHeight = false;
    toast = useToast();
  },
  computed: {
    ...mapState('ide', {
      properties: 'onEditComponent',
    }),
    ...mapGetters('project', ['appColor'])
  },
  methods: {
    /**
     * extract items form regex
     * @param regex
     */
    extractItems(regex) {
      try {
        return regex.split('(')[1].split(')')[0].split('|');
      } catch {
        return [];
      }

    },
    propTypeCount(type) {
      if (this.properties === null) {
        return 0;
      }
      let count = 0;
      const except = ['type',
        'width',
        'height',
        'name',
        'validator',
        'margin',
        'padding',
      ];

      try {
        for (let [i] of Object.entries(this.properties)) {

          if (except.indexOf(i) !== -1) {
            continue;
          }
          let p = this.properties.validator[i];
          if (p.type === type) {
            count++;
          }
        }
      } catch (e) {
        console.log(e.message);
        return 0;
      }

      return count;
    },
    showValue(title) {
      if (title === 'null') {
        return 'Default';
      }
      return title;
    },
    checkName() {
      if (this.properties.name.match(this.properties.validator.name.regex)) {
        this.isNameValid = true;
      } else {
        this.isNameValid = false;
      }
      // need to check other names of project
    },
    canBlur(e) {
      if (e.target.getAttribute('data-blur') === 'false') {
        e.target.focus();
      }
    },
    widthUpdate() {
      if (this.isLinkedWidthHeight) {
        this.properties.height = this.properties.width;
      }
    },
    addAction() {
      if (this.tooltip === '') {
        toast.warning('Tooltip is necessary!');
        this.$refs.tooltip.focus();
        return false;
      }
      if (this.actIcon === '') {
        toast.warning('Icon is necessary!');
        return false;
      }
      for (const act of this.properties.actions) {
        if (act.icon === this.actIcon) {
          toast.warning('Icons is duplicate!');
          return false;
        }
      }

      this.properties.actions.push({
        icon: this.actIcon,
        onPressed: "// run when press on action ",
        tooltip: this.tooltip,
      });
      this.tooltip = '';
    },
    remAction(i) {
      this.properties.actions.splice(i, 1);
    },
    updateActionsSort(e) {
      arrayMove(this.properties.actions, e.oldIndex, e.newIndex);
    }
  }
}
</script>

<style scoped>
input {
  padding: 4px;
}

.prop-container {
  overflow-y: auto;
}

.err {
  background: #8B000066;
  padding: 4px;
}

.btn-group {
  display: grid;
  grid-auto-columns: minmax(0, 1fr);
  grid-auto-flow: column;
  padding: .5rem .2rem;
}

.btn-group .btn {
  border: 1px solid var(--lighter-bg);
  text-align: center;
  transition: var(--transition-duration);
}

.btn-group .btn.active {
  color: var(--text-hilight);
  border-color: var(--text-hilight-darker);
}

.code-editor {
  background: var(--def-bg);
  display: flex;
  width: 2em;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  transition: var(--transition-duration);
  margin-top: 2px;
}

.code-editor:hover {
  background: var(--text-hilight);
}

.rem {
  margin-top: 2px;
  background: var(--def-bg);
  display: flex;
  width: 2em;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  transition: var(--transition-duration);
}

.rem:hover {
  background: #ff000044;
}
</style>