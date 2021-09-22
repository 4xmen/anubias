<template>
  <div :style="getStyle()">
    <div class="gridc" :id="page.name+properties.name">
      <drop class="drop visual" @drop="onVisualDrop" :accepts-data="(n) => isVisual(n)"></drop>
      <div class="content" :style="getStyleMain()">
        <child-simulator :style="getStyleChild(child)" class="grid-child" v-for="(child,k) in properties.children"
                         :type="child.type"
                         :properties="child" :scale="scale"
                         :page="page" @click.native.capture="setProperty(child)" :key="k"></child-simulator>
      </div>

      <div class="control" title="Children control" @click="modalOpen">
        <i class="fa fa-list"></i>
      </div>
    </div>

    <!--    <vue-final-modal v-model="showChildrenModal" @before-open="modalOpen" @before-close="modalClose" name="code-modal">-->
    <!--      <div class="terminal" >-->
    <!--        <i class="fa fa-circle red-text" @click="showChildrenModal = false"></i>-->
    <!--        <i class="fa fa-circle yellow-text text-darken-2"></i>-->
    <!--        <i class="fa fa-circle green-text text-lighten-2"></i>-->
    <!--        <div class="content" id="container">-->
    <!--           hello-->
    <!--        </div>-->
    <!--      </div>-->
    <!--    </vue-final-modal>-->
  </div>
</template>

<script>
import {fnc} from "@/assets/js/functions";
import {Drop} from "vue-easy-dnd";
// import Sortable from '@/assets/js/Sortable.min';

export default {
  name: "Row",
  data: function () {
    return {
      showChildrenModal: false,
    }
  },
  props: ['properties', 'scale', 'page'],
  components: {
    Drop,
    'child-simulator': () => import('../elements/Simulator')
  },
  methods: {
    getClass: function () {
      return '';
    },
    getStyleMain: function () {
      let style = '';
      let $ = window.jQuery;
      let height = (($("#" + this.page.name + this.properties.name).width() / this.properties.column));
      let rowsCount = Math.ceil(this.properties.children.length /this.properties.column);
      style += 'grid-template-columns: repeat(' + this.properties.column + '  , 1fr) ;';
      style += 'grid-template-rows: repeat('+ rowsCount +', ' + height +'px);';
      return style;
    },
    modalOpen: function () {
      let n = this;
      do {
        n = n.$parent;
      } while (n.showRowModal === undefined);
      n.showRowModal = true;
      n.rowData = this.properties.children;
      // console.log(n.rowData);
    },
    setProperty: function (prop) {
      var self = this;
      setTimeout(function () {
        let n = self;
        do {
          n = n.$parent;
        } while (n.currentProperties === undefined);
        n.currentProperties = prop;
      }, 50);
    },
    capitalizeFirstLetter: function (string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    onVisualDrop(event) {
      try {

        // find component
        let component = window.components[event.data];
        // load default value
        let properties = eval(component.data);
        // if can't loaded
        if (properties === undefined) {
          window.alertify.warning('Invalid component', 15);
        } else {
          // when loaded add to page with validate
          this.visualValidator(properties, this.properties.children);
          // ***!*** need sort and rename here
        }
      } catch (e) {
        console.log(e.message);
        window.alertify.warning('unknown error on load component');
      }
    },
    visualValidator: function (component, visuals) {
      var self = this;
      if (component.type === 'appbar' || component.type === 'nav') {
        // check non appbar or row
        window.alertify.error("You can't drop appbar or nav into row");
        return false;
      }
      // add component
      var newComponent = fnc.clone(component);
      // // choose name
      // // check not duplicate name add number to name
      let names = [];
      newComponent.name = this.properties.name + this.capitalizeFirstLetter(component.type);
      for (const comp of visuals) {
        names.push(comp.name);
      }
      let i = 0;
      let nextName = false;
      do {
        nextName = false;
        i++;
        if (names.indexOf(this.properties.name + this.capitalizeFirstLetter(component.type) + i.toString()) > -1) {
          nextName = true;
        }
      } while (nextName);
      newComponent.name = this.properties.name + this.capitalizeFirstLetter(component.type) + i;
      visuals.push(newComponent);
// update page preview
      if (!window.ide.settings.performanceMode) {
        setTimeout(function () {
          fnc.takeScreenShot("#preview", function (e) {
            self.page.image = e;
          });
        }, 1000);
      }
      return true;
    },
    isVisual: function (n) { // check is visual component or not
      return window.components[n].visual;
    },
    getStyle: function () {
      let style = '';
      // style += 'background-color:' + this.color2web(this.properties.color, false) + ';';

      if (this.properties.bgColor != 'null') {
        style += 'background:' + this.color2web(this.properties.bgColor) + ';';
      }
      // console.log('bgRow',this.properties.bgColor,style);
      style += 'border-style: solid;';
      style += 'border-width:' + fnc.calcPadding(this.properties.border) + ';';
      if (this.properties.borderColor != 'null') {
        style += 'border-color:' + this.color2web(this.properties.borderColor) + ';';
      }
      if (this.properties.padding != 'null' && this.properties.padding != '') {
        style += 'padding:' + this.calcPadding(this.properties.padding) + ';'
      }
      if (this.properties.margin != 'null' && this.properties.margin != '') {
        style += 'margin:' + this.calcPadding(this.properties.margin) + ';'
      }
      style += 'margin-top:' + 100 * this.scale + 'px;'
      if (this.properties.borderRadius != 'null' && this.properties.borderRadius != '') {
        style += 'border-radius:' + this.calcPadding(this.properties.borderRadius) + ';'
      }


      return style;
    }
    ,
    getStyleChild: function (child) {
      let style = '';
      if (child.type === 'column' || child.type === 'row' || child.type === 'container') {
        style += 'min-width:75px;' // width:'+fnc.getSize( child.width, this.scale, 2.5) +';';
      }
      return style;
    },
    color2web: function (clr, b = false) {
      return fnc.color2web(clr, b);
    }
    ,
    calcPadding: function (pad) {
      return fnc.calcPadding(pad);
    }
  }
}
</script>

<style scoped>
.gridc {
  background: transparent;
  min-height: 25px;
  border: 1px dotted silver;
  position: relative;
  white-space: nowrap;
}

.control {
  position: absolute;
  right: 0;
  top: 0;
  padding: 5px;
  color: white;
  width: 35px;
  text-align: center;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 3px;
  transition: .3s;
}

.control:hover {
  background: rgba(0, 0, 0, 0.7);
}

.content {
  /*display: flex;*/
  /*flex-direction: column;*/
  /*flex-wrap: wrap ;*/
  /*column-count: 2 ;*/
  /*width: 100%;*/
  display: grid;
}

.grid-child {
  overflow: hidden;
  position: relative;
}

</style>