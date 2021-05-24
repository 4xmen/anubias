<!--ide properties controller element-->
<template>
  <div id="property">
    <table>
      <template v-for="(p,k) in properties" >

        <tr v-if="k !== 'type' && k !== 'children'" :key="k">
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
              <select v-model="properties[k]" :id="k">
                <option value="default"> default</option>
                <option value="left"> left</option>
                <option value="center"> center</option>
                <option value="right"> right</option>
              </select>
            </div>
            <div v-else-if="k === 'overflow'">
              <select v-model="properties[k]" :id="k">
                <option value="default"> default</option>
                <option value="ellipsis"> ellipsis </option>
                <option value="fade"> fade </option>
                <option value="visible"> visible </option>
                <option value="clip"> clip </option>
              </select>
            </div>
            <div v-else-if="k === 'font'">
              <select v-model="properties[k]" :id="k">
                <option value="default"> default </option>
              </select>
            </div>
            <div v-else-if="k === 'weight'">
              <select v-model="properties[k]" :id="k">
                <option value="normal"> normal </option>
                <option value="bold"> bold </option>
                <option value="w100"> 100 </option>
                <option value="w200"> 200 </option>
                <option value="w300"> 300 </option>
                <option value="w400"> 400 </option>
                <option value="w500"> 500 </option>
                <option value="w600"> 600 </option>
                <option value="w700"> 700 </option>
                <option value="w800"> 800 </option>
                <option value="w900"> 900 </option>
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
<!--            <div v-else-if="k === 'text' || k === 'title'">-->
<!--              <input type="text" :id="k" v-model="properties[k]" @blur="blurTitle" @focus="focusTitle">-->
<!--            </div>-->
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
    var setme ;
    var $ = window.jQuery;
    let updatePreview=function () {
      clearTimeout(setme);
      setme = setTimeout(function () {
        console.log('exet');
        fnc.takeScreenShot("#preview",function (e) {
          window.appData.pages[self.page].image = e;
        });
      },300);
    };
    var self = this;
    $(document).on('change',"#property select",updatePreview)
    $(document).on('keyup',"#property input",updatePreview)
    $(document).on('keyup',"#property change",updatePreview)

  },
  data: function () {
    return {
      colors: window.colors,
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
      default:0,
      type: Number
    }
  }, methods: {
    nameCheck: function (e, isBlur) {
      let name = e.target.value;
      if (!/^[a-zA-Z_$][a-zA-Z_$0-9]*$/.test(name)) {
        e.target.classList.add('invalid');
      } else {
        e.target.classList.remove('invalid');
      }
      if (isBlur) {
        e.target.focus();
      }
    },
    paddingCheck: function (e, isBlur) {
      const regex = /^([0-9]{1,3},[0-9]{1,3},[0-9]{1,3},[0-9]{1,3}$)|([0-9]{1,3},[0-9]{1,3}$)|([0-9]{1,3}$)/gm;
      let name = e.target.value;
      if (!regex.test(name)) {
        e.target.classList.add('invalid');
      } else {
        e.target.classList.remove('invalid');
      }
      if (isBlur) {
        e.target.focus();
      }
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
</style>