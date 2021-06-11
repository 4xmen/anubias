<!--ide properties controller element-->
<template>
  <div id="property">
    <table>
      <template v-for="(p,k) in properties">

        <tr v-if="k !== 'type' && k !== 'children' && !(k === 'image' && properties.type === 'page')" :key="k">
          <th>
            <label :for="k">
              {{ k }}
            </label>
          </th>
          <td>
            <div v-if="typeof properties[k] === 'boolean'">
              <div class="switch">
                <label>
                  <input type="checkbox" v-model="properties[k]">
                  <span class="lever"></span>
                </label>
              </div>
            </div>
            <div v-else-if="k === 'name'">
              <input type="text" @blur="nameCheck($event,true)" @keyup="nameCheck($event,false)" :id="k"
                     v-model="properties[k]">
            </div>
            <div v-else-if="k === 'padding'">
              <input type="text" @blur="paddingCheck($event,true)" @keyup="paddingCheck($event,false)" :id="k"
                     v-model="properties[k]">
            </div>
            <div v-else-if="k === 'align'">
              <div v-if="properties.type === 'text'">
                <select v-model="properties[k]" :id="k">
                  <option value="null"> default</option>
                  <option value="left"> left</option>
                  <option value="center"> center</option>
                  <option value="right"> right</option>
                  <option value="justify"> justify</option>
                </select>
              </div>
              <div v-else>
                <select v-model="properties[k]" :id="k">
                  <option value="null"> default</option>
                  <option value="left"> left</option>
                  <option value="center"> center</option>
                  <option value="right"> right</option>
                </select>
              </div>
            </div>
            <div v-else-if="k === 'overflow'">
              <select v-model="properties[k]" :id="k">
                <option value="null"> default</option>
                <option value="ellipsis"> ellipsis</option>
                <option value="fade"> fade</option>
                <option value="visible"> visible</option>
                <option value="clip"> clip</option>
              </select>
            </div>
            <div v-else-if="k === 'font'">
              <select v-model="properties[k]" :id="k">
                <option value="null"> default</option>
              </select>
            </div>
            <div v-else-if="k === 'weight'">
              <select v-model="properties[k]" :id="k">
                <option value="normal"> normal</option>
                <option value="bold"> bold</option>
                <option value="w100"> w100</option>
                <option value="w200"> w200</option>
                <option value="w300"> w300</option>
                <option value="w400"> w400</option>
                <option value="w500"> w500</option>
                <option value="w600"> w600</option>
                <option value="w700"> w700</option>
                <option value="w800"> w800</option>
                <option value="w900"> w900</option>
              </select>
            </div>
            <div v-else-if="k === 'fit'">
              <select v-model="properties[k]" :id="k">
                <option value="none"> none</option>
                <option value="fill"> fill</option>
                <option value="contain"> contain</option>
                <option value="cover"> cover</option>
                <option value="fitWidth"> fitWidth</option>
                <option value="fitHeight"> fitHeight</option>
<!--                <option value="scaleDown"> scaleDown</option>-->
              </select>
            </div>
            <div v-else-if="k === 'icon'">
              <select v-model="properties[k]" :id="k">
                <option v-for="(ic,n) in icons" :key="n" class="material-icons">
                  {{ ic.value }}
                </option>
              </select>
            </div>
            <div v-else-if="k.toLowerCase().indexOf('color') !== -1">
              <select v-model="properties[k]" :id="k">
                <option :value="cl.value" v-for="(cl,n) in colors" class="ui dropdown" v-bind:key="n"
                        :style="'background:'+cl.color + (['white','transparent','yellow','lime','grey','default'].indexOf(cl.name) > -1?';color:black;':'')">
                  {{ cl.name }}
                </option>
              </select>
            </div>
            <div v-else-if="k.substr(0,2) == 'on'" class="code" @click="codeEdit(k)">
              {{ k }} <b> <i class="fa fa-code"></i> </b>
            </div>
            <div v-else-if="k === 'image' && properties.type === 'image' && !properties.isOnline" class="code" @click="chooseImage">
              Choose <b> <i class="fa fa-folder-open"></i> </b>
            </div>
            <div v-else-if="k === 'image' && properties.type === 'image' && properties.isOnline">
              <input type="url" v-model="properties.image"/>
            </div>
            <div v-else>
              <input type="text" :id="k" v-model="properties[k]">
            </div>
          </td>
        </tr>
      </template>

    </table>
  </div>
</template>

<script>
import {fnc} from '@/assets/js/functions';

export default {
  name: "PropertyElement",
  mounted() {
    var setme;
    var $ = window.jQuery;
    let updatePreview = function () {
      clearTimeout(setme);
      setme = setTimeout(function () {
        console.log('exet');
        fnc.takeScreenShot("#preview", function (e) {
          window.appData.pages[self.page].image = e;
        });
      }, 300);
    };
    var self = this;
    $(document).on('change', "#property select", updatePreview)
    $(document).on('keyup', "#property input", updatePreview)
    $(document).on('keyup', "#property change", updatePreview)

  },
  data: function () {
    return {
      onEditKey: '',
      onEdit: '',
      colors: window.colors,
      icons: window.material_icons
    }
  },
  props: {
    properties: {
      default: function () {
        return {}
      },
      type: Object
    },
    page: {
      default: 0,
      type: Number
    }
  }, methods: {
    chooseImage: function () {
      var self = this;
      window.api.send('open-file-image', {});
      window.api.receive('image-selected', (data) => {
        self.properties.image = data;
      });

    },
    nameCheck: function (e, isBlur) {
      let name = e.target.value;
      if (!/^[a-zA-Z_$][a-zA-Z_$0-9]*$/.test(name)) {
        e.target.classList.add('invalid');
        if (isBlur) {
          this.properties.name = this.properties.type + Math.floor(Math.random() * 10000);
          e.target.classList.remove('invalid');
        }
      } else {
        e.target.classList.remove('invalid');
      }

    },
    paddingCheck: function (e, isBlur) {
      const regex = /^([0-9]{1,3},[0-9]{1,3},[0-9]{1,3},[0-9]{1,3}$)|([0-9]{1,3},[0-9]{1,3}$)|([0-9]{1,3}$)/gm;
      let name = e.target.value;
      if (!regex.test(name)) {
        e.target.classList.add('invalid');
        if (isBlur) {
          this.properties.padding = '0';
          e.target.classList.remove('invalid');
        }
      } else {
        e.target.classList.remove('invalid');
      }

    },
    codeEdit: function (k) {
      this.$parent.codeContent = this.properties[k];
      this.onEdit = this.properties[k];
      this.onEditKey = k;
      this.$parent.showCodeModal = true;
      this.$parent.codeTitle = '[' + window.appData.pages[this.page].name + '] ' + this.properties.name + '.' + k;
    },
    // blurTitle:function (e) {
    //
    //   if(e.target.value === ''){
    //     this.properties[e.target.id]  = '[NO TEXT]';
    //   }
    // },
    // focusTitle: function (e) {
    //     if(e.target.value === '[NO TEXT]'){
    //       this.properties[e.target.id]  = '';
    //     }
    // },
  }, watch: {
    onEdit: function (newval) {
      this.properties[this.onEditKey] = newval;
    },
  }
}
</script>

<style scoped>
#property {
  overflow-x: hidden;
}

table {
  width: 100%;
  overflow: hidden;
}

th {
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-right: 0;
  width: 45%;
  border-bottom: 0;
  font-weight: normal;
  font-size: 12px;
  padding: 0;
  margin: 0;
}

td {
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-bottom: 0;
  padding: 0;
  margin: 0;
  overflow: hidden;
  height: 30px;
}

tr:last-child td, tr:last-child th {
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
}

input, select, .dropdown {
  background: transparent;
  color: #ffffff;
  border: 0;
  padding: 4px !important;
  font-weight: bold;
  font-size: 15px;
  display: block;
  width: 100%;
  line-height: 1.2em !important;
  height: auto !important;
  margin: 0 !important;
  box-sizing: border-box;
}

select option {
  color: #20252b;
}

/*input:focus, input:hover, select:hover, select:focus {*/
/*  outline-color: #666666;*/
/*  outline-width: 1px;*/
/*  outline-style: dashed;*/
/*}*/

input[type='checkbox'] {
  outline: none !important;
  width: auto !important;
}

label {
  display: block;
}

.code {
  display: block;
  text-align: center;
  -o-transition: .3s;
  -ms-transition: .3s;
  -moz-transition: .3s;
  -webkit-transition: .3s;
  transition: .3s;
  height: 20px;
  padding: 2px;
}

.code:hover {
  background: #1b9a59;
}

td b {
  margin-left: 5px;
}
</style>