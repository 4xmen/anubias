<template>
  <div class="terminal">
    <i class="fa fa-circle red-text" @click="closeModal"></i>
    <!--    <i class="fa fa-circle yellow-text text-darken-2"></i>-->
    <!--    <i class="fa fa-circle green-text text-lighten-2"></i>-->
    <div class="content" id="container">
      <div class="row">
        <div class="col s12">
          <ul class="collection" id="actSort">
            <li @click="change(k)" @dblclick="openCodeEditor(k)" :class="'collection-item '+(k == current?'active':'')"
                v-for="(action,k) in allItems" :key="k">
              <i class="material-icons">{{ action.icon }}</i>
              <i class="secondary-content fa fa-times" title="Remove" @click="rem(k)"></i>
            </li>
          </ul>
          <div class="btn  waves-effect waves-light green" id="new-action" @click="newAction">
            Add new item
          </div>

          <hr>
          <div v-if="allItems[current] !== undefined">
            <label for="icon-select">
              Icon:
            </label>
            <select v-model="allItems[current].icon" id="icon-select">
              <option v-for="(ic,n) in icons" :key="n" data-icon="" class="material-icons">
                {{ ic.value }}
              </option>
            </select>
            <br>
            <label for="text-hint">
              Label:
            </label>
            <input type="text" id="text-hint" v-model="allItems[current].label"/>
          </div>
          <ul>
            <li>
              - You can drag and drop to sort
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Sortable from '@/assets/js/Sortable.min';
import {fnc} from "@/assets/js/functions";
// import {xscript} from "@/assets/js/xscript";
export default {
  mounted() {
    this.allItems = this.items;
    // this.rowData = this.rwData;
    this.sortInit();
  },
  beforeDestroy() {
    // editor2.destroy();
  },
  name: "ItemControlElement",
  data: function () {
    return {
      allItems: [],
      icons: window.material_icons,
      current: 0,
      content: '//',
    };
  },
  props: ['items', 'value'],
  methods: {
    sortInit: function () {
      var that = this;
      Sortable.create(document.querySelector('#actSort'), {
        animation: 100,
        onUpdate: function (e) {
          that.$parent.$parent.$parent.isInternalDrag = false;
          let arr = JSON.parse(JSON.stringify(that.allItems));
          that.allItems = [];
          fnc.arrayMove(arr, e.oldIndex, e.newIndex);
          let n = that;
          do {
            n = n.$parent;
          } while (n.closeAllModal === undefined);
          n.currentProperties.items = [];
          setTimeout(function () {
            that.allItems = arr;
            n.currentProperties.items = arr;
          }, 100);
        },
      });
    },
    openCodeEditor: function (e) {

      let title = window.appData.pages[this.$parent.$parent.currentPage].name
          + '.action[' + e + '].onPressed';
      let pointer = 'window.appData.pages[' + this.$parent.$parent.currentPage + '].children.visual[0].items['+e+'].onPressed';
      this.$parent.$parent.addTab(title, 'code', {
        codeTitle: title,
      }, 'fa-code', e,pointer);
      this.closeModal();
    },
    updateResource: function () {

    },
    closeModal: function () {
      let n = this;
      do {
        n = n.$parent;
      } while (n.closeAllModal === undefined);
      n.closeAllModal();
    },
    newAction: function () {
      this.allItems.push({
            icon: 'home',
            label: 'home',
          }
      );
      // this.sortInit();
    },
    change: function (k) {
      this.current = k;
      // console.log(this.$parent.$parent.addTab);
      // editor2.setValue( this.allItems[this.current].onPressed,1);
    },
    rem: function (i) {
      let self = this;
      window.alertify.confirm(`Are you sure to remove this action
      "${i}" ?`,
          'Remove confirm', function () {
            self.allItems.splice(i, 1);
          }
          , function () {
            // window.alertify.error('Cancel')
          });
    }
  }
  ,
  watch: {
    items: function (newVal) {
      this.allItems = newVal;
      // if (this.allItems.length === 0){
      //   editor2.setValue('',1);
      // }else{
      //   if (this.allItems[0].onPressed !== undefined){
      //     editor2.setValue( this.allItems[0].onPressed,1);
      //   }
      // }
    }
    ,
  }
}
</script>

<style scoped>


.terminal {
  width: 80%;
  margin: 50px auto 0 auto;
  max-width: 500px;
  border-radius: 7px;
  background: #272c34;
  padding: 15px;
  line-height: 1.2em;

}

.clear {
  margin-top: -10px;
  display: inline-block;
  padding: 5px;
  float: right;
  cursor: pointer;
  padding-bottom: 0;
}

.clear:hover {
  background: rgba(0, 0, 0, .5);
}

.content {
  padding: 0 20px;
  color: #eee;
  height: 600px;
  overflow-x: hidden;
  overflow-y: scroll;
  scroll-behavior: smooth;
  -webkit-user-select: text; /* Chrome 49+ */
  -moz-user-select: text; /* Firefox 43+ */
  -ms-user-select: text; /* No support yet */
  user-select: text; /* Likely future */
}

.content ul li {
  white-space: pre;
}

.fa-circle {
  margin-right: 10px;
}

.fa {
  margin-left: 10px;
  font-size: 20px;
}

.fa-times {
  color: darkred;
}

.fa-times:hover {
  color: red;
}

#icon-select {
  display: block;
}

#new-action {
  display: block;
}

#codeEditor2 {
  height: 85vh;
  font-size: 16px;
}

li {
  margin-bottom: 5px;
}
</style>