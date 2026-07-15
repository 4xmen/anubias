<template>
  <div v-if="localProperties.type !== undefined" class="prop-container">
    <!--    <pre>{{ localProperties }}</pre> &lt;!&ndash; Temporary for debugging &ndash;&gt;-->

    <!-- check is on edit has name show -->
    <collapsible title="Name" icon="ri-codepen-line" v-if="localProperties.name !== undefined">
      <!--  change name -->
      <div class="input-container">
        <input type="text" @keyup="checkName" v-model="localProperties.name"
               :data-blur="isNameValid" @blur="canBlur">
      </div>
      <div class="err" v-if="!isNameValid">
        Name is invalid...
      </div>
    </collapsible>
    <!-- show aligns loop-->
    <template v-for="align in groupedProperties.aligns">
      <collapsible :title="'Align ('+showValue(align.value)+')'+alignLabel(align.key)" icon="ri-layout-right-2-line">
        <div class="btn-group">
          <div v-for="(v,i) in extractItems(align.validator.regex)"
               :class="'btn '+(v === align.value?'active':'')"
               :key="i">
            <div v-if="v === 'null'" title="default" @click="straitEditProps(align,'null')">
              <i class="ri-eraser-line"></i>
            </div>
            <div v-else :title="v" @click="straitEditProps(align,v)">
              <i :class="`ri-align-${v}`"></i>
            </div>
          </div>
        </div>
      </collapsible>
    </template>
    <!-- check if we have colors here -->
    <collapsible v-if="groupedProperties.colors.length > 0" icon="ri-palette-line" title="Colors properties">
      <!-- show color props loop-->
      <template v-for="(color,index) in groupedProperties.colors" :key="index">
        <div v-if="color.validator !== undefined
                && color.validator.type === 'String|Color'">
          <color-picker
              v-model="color.value" :label="color.label"
              @update:model-value="(newVal) => {updateProps(color,newVal);}">
          </color-picker>
        </div>
      </template>
    </collapsible>

    <!--  select props loop  -->
    <collapsible v-if="groupedProperties.selects.length > 0" icon="ri-bank-card-line" title="Choose properties">
      <label class="input-container" v-for="(select,index) in groupedProperties.selects" :key="index">
        {{ select.key.capitalize() }}:
        <select
            v-model="select.value "
            @update:model-value="(newVal) => {updateProps(select,newVal);}">
          <option v-for="(v,i) in select.items"
                  :class="'btn '+(v === select.value?'active':'')"
                  :key="i" :value="v"> {{ titleFixer(v) }}
          </option>
        </select>
      </label>
    </collapsible>

    <!--  boolean props loop  -->
    <collapsible v-if="groupedProperties.booleans.length > 0" icon="ri-checkbox-multiple-line"
                 title="Checkable properties">
      <template v-for="(boolean,index) in groupedProperties.booleans" :key="index">
        <div v-if="boolean.validator !== undefined
                && boolean.validator.type === 'Boolean'">
          <toggle
              :label="boolean.key.capitalize()"
              v-model="boolean.value" :size=".6"
              @update:model-value="(newVal) => {updateProps(boolean,newVal);}"></toggle>
        </div>
      </template>
    </collapsible>
    <!--  text props loop  -->
    <!--  why 1 cuz name is String  -->
    <collapsible v-if="groupedProperties.strings.length > 1" icon="ri-text" title="Text properties">
      <template v-for="(txt,index) in groupedProperties.strings" :key="index">
        <template v-if="txt.key === 'name'"></template>
        <div v-else-if="txt.validator !== undefined
                && txt.validator.type === 'String' && index !== 'name'">
          <label class="input-container">
            {{ txt.label.capitalize() }}:
            <span v-if="txt.validator.regex === '.*'">
              <textarea @focus="lazyChangeFocus" @blur="lazyChangeBlur"
                        v-model="txt.value" rows="2" :pattern="txt.validator.regex"
                        @update:model-value="(newVal) => {updateProps(txt,newVal);}">
              </textarea>
            </span>
            <span v-else>
              <input type="text" v-model="txt.value" :pattern="txt.validator.regex"
                     @focus="lazyChangeFocus" @blur="lazyChangeBlur"
                     @update:model-value="(newVal) => {updateProps(txt,newVal);}">
            </span>
          </label>
        </div>
      </template>
    </collapsible>
    <!--  numbers props loop  -->
    <div v-if="groupedProperties.numbers.length > 0">
      <collapsible icon="ri-pencil-ruler-2-line"
                   title="Number control">
        <template v-for="(num,index) in groupedProperties.numbers" :key="index">
          <div v-if="num.validator !== undefined
                && num.validator.type === 'Number' && index !== 'width' && index !== 'height'">
            <label v-if="keys.indexOf('height')  !== -1 && !isLinkedWidthHeight" class="input-container">
              {{ index }}:
              <dinput v-model="num.value" :percentable="true" max-value="9999999" min-value="0"/>
            </label>
          </div>
        </template>
      </collapsible>
    </div>
    <!--  size control  -->
    <collapsible v-if="groupedProperties.sizes.length > 0"
                 icon="ri-pencil-ruler-2-line"
                 title="Size control">
      <div v-for="size in groupedProperties.sizes">
        <label v-if="size.key === 'width'" class="input-container">
          Width
          <template v-if="isLinkedWidthHeight"> & height</template>
          :
          <template v-if="isLinkedWidthHeight">
            <dinput v-model="size.value" min-value="0" max-value="999"
                    :percentable="true" @update:model-value="(newVal) => {widthHeightUpdate(newVal);}"/>
          </template>
          <template v-else>
            <dinput v-model="size.value" min-value="0" max-value="999"
                    :percentable="true" @update:model-value="(newVal) => {updateProps(size,newVal);}"/>
          </template>

        </label>
        <label class="input-container" v-if="size.key === 'height' && !isLinkedWidthHeight">
          Height:
          <dinput v-if="size.key === 'height'" v-model="size.value" min-value="0" max-value="999"
                  :percentable="true" @update:model-value="(newVal) => {updateProps(size,newVal);}"/>
        </label>
        <div v-if="keys.indexOf('width') !== -1 && keys.indexOf('height')  !== -1 && size.key === 'height'">
          <toggle icon="ri-links-line" label="Link width & height" v-model="isLinkedWidthHeight" :size=".6"></toggle>
        </div>
      </div>
    </collapsible>

    <!-- action control  -->
    <collapsible v-if="localProperties.actions !== undefined" title="Actions" icon="ri-stack-line">
      <div title="You can drag and drop to change sort of action's button">
        <Sortable
            :list="localProperties.actions"
            item-key="icon"
            tag="div"
            @update="updateActionsSort"
        >
          <template #item="{element, index}">
            <div class="draggable" :key="element.icon">
              <icon-picker :label="element.tooltip" v-model="localProperties.actions[index].icon">
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
          <input type="text" ref="inpTooltip" v-model="tooltip" placeholder="Tool tip">
        </div>
        <icon-picker label="Action icon" v-model="actIcon"></icon-picker>
        <div class="text-center">
          <button class="circle-btn small m-auto" @click="addAction">
            <i class="ri-add-line"></i>
          </button>
        </div>
      </div>
    </collapsible>
    <!--  padding editor  -->
    <collapsible v-if="groupedProperties.paddings.length === 1" title="Padding">
      <around v-model="localProperties.padding"   @update:model-value="(newVal) => {updateProps(groupedProperties.paddings[0],newVal);}"></around>
    </collapsible>
  </div>
</template>

<script setup>
import {ref, computed, watch, onMounted, reactive} from 'vue';
import {useStore} from 'vuex'
import collapsible from "./collapsible.vue";
import {safeClone} from "../js/system-functions.js";
import colorPicker from './color-picker.vue'
import {arrayMove, fixFlutterObjectTitle} from "../js/general-functions.js";
import toggle from "./switch.vue";
import dinput from "./input-draggable.vue";
import {Sortable} from "sortablejs-vue3";
import iconPicker from "./icon-picker.vue";
import {useToast} from "vue-toastification";
import around from "./around-controller.vue";

/**
 * Why we use Composition API in this component:
 *
 * This is a complex Property Editor (1000+ lines) with dynamic properties,
 * heavy grouping logic based on validator, and Undo/Redo requirement.
 * Composition API gives us:
 * - Better organization through composables
 * - Much cleaner local reactive state management
 * - Easier undo/redo implementation (history stack)
 * - Better reusability and testability
 *
 * We are only migrating this one complex component for now.
 * The rest of the project remains in Options API.
 */

let nameWatch = null;

const store = useStore();

const toast = useToast();
// ====================== STATE ======================

// Raw data from Vuex (readonly reference)
const onEditComponent = computed(() =>
    store.state.ide.onEditComponent
)

// Local editable copy - this is where all UI changes happen
const localProperties = ref(null)

const isNameValid = ref(true)
const isLinkedWidthHeight = ref(false)

const keys = ref([])

const tooltip = ref('')
const inpTooltip = ref(null)
const actIcon = ref('')
// Grouped properties for UI sections (colors, sizes, booleans, etc.)
const groupedProperties = reactive({
  aligns: [],
  sizes: [],
  numbers: [],
  paddings: [],
  colors: [],
  booleans: [],
  strings: [],
  lists: [],
  selects: [],
  // Add more groups as needed
})

// ====================== COMPUTED ======================


// Example computed
const hasSizeProperties = computed(() =>
    !!(localProperties.value?.width !== undefined || localProperties.value?.height !== undefined)
)

// ====================== METHODS ======================

function lazyChangeFocus(e){
  store.dispatch('ide/lazyChangeStart',e.target.value);
}
function lazyChangeBlur(){
  store.dispatch("ide/lazyChangeDone");
}

function alignLabel(key) {
  if (key === 'align') {
    return '';
  }
  return `[${key}]`;
}


function titleFixer(title) {
  return fixFlutterObjectTitle(title);
}

/**
 * extract items form regex
 * @param regex
 */
function extractItems(regex) {
  try {
    return regex.split('(')[1].split(')')[0].split('|');
  } catch {
    return [];
  }
}

function showValue(title) {
  if (title === 'null') {
    return 'Default';
  }
  return title;
}

function checkName() {
  if (localProperties.value.name.match(localProperties.value.validator.name.regex)) {
    isNameValid.value = true;
  }
  isNameValid.value = false;
  // WIP: need to check other names of project
}

function canBlur(e) {
  if (e.target.getAttribute('data-blur') === 'false') {
    setTimeout(() => {
      e.target.focus();
    }, 40);
  }
}

function straitEditProps(item, value) {
  item.value = value;
  let payload = {};
  payload[item.key] = value;
  store.dispatch("ide/setOnEditProperties", payload);
}


function updateProps(item, value) {
  let payload = {};
  payload[item.key] = value;
  store.dispatch("ide/setOnEditProperties", payload);
}

function groupProperties() {
  if (!localProperties.value) return

  // Reset groups
  Object.keys(groupedProperties).forEach(key => {
    groupedProperties[key] = []
  })
  keys.value = [];

  const validator = localProperties.value.validator || {}

  Object.keys(localProperties.value).forEach(key => {
    const valInfo = validator[key]
    if (!valInfo) return

    if (valInfo.type === 'Invisible') return;


    const item = {
      key,
      value: localProperties.value[key],
      validator: valInfo,
      label: key, // you can improve label mapping later
      items: valInfo.items ?? [],
    }

    keys.value.push(key);

    // console.log(item);
    // Simple grouping logic - improve as needed
    if (['width', 'height'].includes(key)) {
      groupedProperties.sizes.push(item)
    } else if (key.toLowerCase().indexOf('padding') !== -1) {
      groupedProperties.paddings.push(item)
    } else if (valInfo.type?.includes('Number')) {
      groupedProperties.numbers.push(item)
    } else if (valInfo.type?.includes('Color')) {
      groupedProperties.colors.push(item)
    } else if (valInfo.type?.includes('Boolean')) {
      groupedProperties.booleans.push(item)
    } else if (valInfo.type?.includes('Align')) {
      groupedProperties.aligns.push(item)
    } else if (valInfo.type?.includes('Select')) {
      groupedProperties.selects.push(item)
    } else {
      groupedProperties.strings.push(item)
    }
  })
  // console.log(groupedProperties);
}

// function updateProperty(key, value) {
//   if (!localProperties.value) return
//   localProperties.value[key] = value
//   // You can trigger auto-save or commit here later
// }

function widthHeightUpdate(value) {
  if (this.isLinkedWidthHeight) {
    groupedProperties.sizes.forEach(item => {
      if (item.key === 'width' || item.key === 'height') {
        item.value = value;
      }
    });
    store.dispatch("ide/setOnEditProperties", {
      height: value,
      width: value,
    });
  }
}

function addAction() {
  if (tooltip.value === '') {
    toast.warning('Tooltip is necessary!');
    inpTooltip.value.focus();
    return false;
  }
  if (actIcon.value === '') {
    toast.warning('Icon is necessary!');
    return false;
  }
  for (const act of localProperties.value.actions) {
    if (act.icon === actIcon.value) {
      toast.warning('Icons is duplicate!');
      return false;
    }
  }

  localProperties.value.actions.push({
    icon: actIcon.value,
    onPressed: "// run when press on action ",
    tooltip: tooltip.value,
  });
  tooltip.value = '';
  store.dispatch("ide/setOnEditProperties", {
    actions: localProperties.value.actions,
  });
}

function remAction(i) {
  localProperties.value.actions.splice(i, 1);
  store.dispatch("ide/setOnEditProperties", {
    actions: localProperties.value.actions,
  });
}

function updateActionsSort(e) {
  arrayMove(localProperties.value.actions, e.oldIndex, e.newIndex);
  store.dispatch("ide/setOnEditProperties", {
    actions: localProperties.value.actions,
  });
}

// ====================== LIFECYCLE ======================

onMounted(() => {
  // console.log('onEditComponent editor mounted')
})

// Watch for changes coming from outside (Vuex)
watch(onEditComponent, (newVal) => {
  if (newVal) {
    localProperties.value = safeClone(newVal) // deep clone
    groupProperties()
  }
}, {immediate: true});

watch(() => localProperties.value.name, (newVal) => {
  clearTimeout(nameWatch);
  // delay to commit name
  nameWatch = setTimeout(() => {
    store.dispatch("ide/setOnEditProperties", {
      name: newVal,
    });
  }, 5000);
});


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

select {
  color: black;
}
</style>