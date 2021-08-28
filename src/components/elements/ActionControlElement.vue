<template>
  <div class="terminal">
    <i class="fa fa-circle red-text" @click="closeModal"></i>
    <!--    <i class="fa fa-circle yellow-text text-darken-2"></i>-->
    <!--    <i class="fa fa-circle green-text text-lighten-2"></i>-->
    <div class="content" id="container">
      <div class="row">
        <div class="col s9">
          <div id="codeEditor2" class="editor"></div>
        </div>
        <div class="col s3">
          <ul class="collection" id="actSort">
            <li @click="change(k)" :class="'collection-item '+(k == current?'active':'')"
                v-for="(action,k) in allActions" :key="k">
              <i class="material-icons">{{ action.icon }}</i>
              <i class="secondary-content fa fa-times" title="Remove" @click="rem(k)"></i>
            </li>
          </ul>
          <div class="btn  waves-effect waves-light green" id="new-action" @click="newAction">
            Add new action
          </div>

          <hr>
          <div v-if="allActions[current] !== undefined">
            <label for="icon-select">
              Icon:
            </label>
            <select v-model="allActions[current].icon" id="icon-select">
              <option v-for="(ic,n) in icons" :key="n" data-icon="" class="material-icons">
                {{ ic.value }}
              </option>
            </select>
            <label for="text-hint">
              Tooltip:
            </label>
            <input type="text" id="text-hint" v-model="allActions[current].tooltip"/>
          </div>
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
    this.allActions = this.actions;
    // this.rowData = this.rwData;
    this.sortInit();
    // var self = this;
    // require('brace/ext/language_tools') //language extension prerequsite...
    // // require('brace/mode/javascript')    //language
    // // require('brace/snippets/javascript') //snippe
    // require("@/assets/js/xscript");
    // require("@/assets/js/xScriptSnipts");
    // require('brace/theme/dracula');
    // //
    // editor2 = ace.edit('codeEditor2');
    // editor2.getSession().setMode('ace/mode/xscript');
    // editor2.setTheme('ace/theme/dracula');
    // editor2.setOptions({
    //   enableBasicAutocompletion: true,
    //   enableLiveAutocompletion: true,
    //   fontSize: 16,
    //   highlightActiveLine: false,
    //   enableSnippets: true,
    //   showLineNumbers: true,
    //   tabSize: 4,
    //   showPrintMargin: false,
    //   showGutter: true,
    // });
    // // editor.$blockScrolling = Infinity;
    // if (this.allActions != undefined &&
    //     this.allActions[this.current] != undefined &&
    //     this.allActions[this.current].onPressed != undefined) {
    //   editor2.setValue(this.allActions[this.current].onPressed, 1);
    //   this.content = this.allActions[this.current].onPressed;
    // }
    // editor2.on('change', function () {
    //   var content = editor2.getValue();
    //   self.content = content;
    //   if (self.allActions[self.current].onPressed !== undefined){
    //     self.allActions[self.current].onPressed = content;
    //   }
    //   // self.$emit('input', content);
    // });

  },
  beforeDestroy() {
    // editor2.destroy();
  },
  name: "ActionControlElement",
  data: function () {
    return {
      allActions: [],
      icons: window.material_icons,
      current: 0,
      content: '//',
    };
  },
  props: ['actions', 'value'],
  methods: {
    sortInit: function () {
      var that = this;
      Sortable.create(document.querySelector('#actSort'), {
        animation: 100,
        onUpdate: function (e) {
          let arr = JSON.parse(JSON.stringify(that.allActions));
          that.allActions = [];
          fnc.arrayMove(arr, e.oldIndex, e.newIndex);
          let n = that;
          do {
            n = n.$parent;
          } while (n.closeAllModal === undefined);
          n.currentProperties.actions = [];
          setTimeout(function () {
            that.allActions = arr;
            n.currentProperties.actions = arr;
          }, 100);
        },
      });
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
      this.allActions.push({
            icon: 'settings',
            onPressed: "// run when press on action ",
            tooltip: 'action tooltip',
          }
      );
      // this.sortInit();
    },
    // change: function (k) {
    //   this.current = k;
    //   editor2.setValue( this.allActions[this.current].onPressed,1);
    // },
    rem: function (i) {
      let self = this;
      window.alertify.confirm(`Are you sure to remove this action
      "${i}" ?`,
          'Remove confirm', function () {
            self.allActions.splice(i, 1);
          }
          , function () {
            // window.alertify.error('Cancel')
          });
    }
  }
  ,
  watch: {
    actions: function (newVal) {
      this.allActions = newVal;
      // if (this.allActions.length === 0){
      //   editor2.setValue('',1);
      // }else{
      //   if (this.allActions[0].onPressed !== undefined){
      //     editor2.setValue( this.allActions[0].onPressed,1);
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
  max-width: 1100px;
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
</style>