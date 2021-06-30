<template>
  <div class="terminal">
    <i class="fa fa-circle red-text" @click="closeModal"></i>
<!--    <i class="fa fa-circle yellow-text text-darken-2"></i>-->
<!--    <i class="fa fa-circle green-text text-lighten-2"></i>-->
    <div class="content" id="container">
      <p>
        You can edit component sort and or remove them here:
      </p>
      <ul class="collection" id="rowSort">
        <li class="collection-item" v-for="(comp,k) in rowData" :key="k">
          {{comp.name}}
          <i class="secondary-content fa fa-times" @click="rem(k)"></i>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Sortable from '@/assets/js/Sortable.min';
import {fnc} from "@/assets/js/functions";

export default {
  mounted() {
    // this.rowData = this.rwData;
    var that = this;
    Sortable.create(document.querySelector('#rowSort'), {
      animation:100,
      onUpdate: function (e) {
        let arr = JSON.parse(JSON.stringify(that.rowData));
        that.rowData = [];
        fnc.arrayMove(arr, e.oldIndex, e.newIndex);
        let n = that;
        do {
          n = n.$parent;
        } while (n.closeAllModal === undefined);
        n.currentProperties.children = arr;
        setTimeout(function () {
          that.rowData = arr;
        },100);
      },
    });
  },
  name: "RowControlElement",
  data:function () {
    return{
      rowData: this.rwData,
    };
  },
  props:['rwData'],
  methods:{
    rem:function (i) {
      var self = this;
      window.alertify.confirm(`Are you sure to remove this component
      "${this.rowData[i].name}" ?`,
          'Remove confirm', function () {
            self.rowData.splice(i, 1);
          }
          , function () {
            // window.alertify.error('Cancel')
          });
    },
    closeModal:function () {
      let n = this;
      do {
        n = n.$parent;
      } while (n.closeAllModal === undefined);
      n.closeAllModal();
    },
    scroll:function () {
      let container = this.$el.querySelector("#container");
      container.scrollTop = container.scrollHeight;
    }
  },
  watch: {
    rwData: function(newVal) {
      this.rowData = newVal;
    }
  }
}
</script>

<style scoped>

.terminal {
  width: 80%;
  margin: 50px auto 0 auto;
  max-width: 600px;
  border-radius: 7px;
  background: #272c34;
  padding: 15px;
  line-height: 1.2em;

}
.clear{
  margin-top: -10px;
  display: inline-block;
  padding: 5px;
  float: right;
  cursor: pointer;
  padding-bottom: 0;
}
.clear:hover{
  background: rgba(0,0,0,.5);
}
.content{
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
.content ul li{
  white-space: pre;
}
.fa-circle {
  margin-right: 10px;
}

.fa{
  margin-left: 10px;
  font-size: 20px;
}

.fa-times{
  color: darkred;
}

.fa-times:hover{
  color: red;
}
</style>