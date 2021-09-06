<template>
  <div :style="getStyle()" class="cont">
    <div class="content" :style="'padding:'+(15 * scale)+'px'">
      <div v-if="properties.child == 'null'">
        <drop class="drop visual" @drop="onVisualDrop" :accepts-data="(n) => isVisual(n)"></drop>
      </div>
      <div v-else>
        <child-simulator :type="properties.child.type" :properties="properties.child" :scale="scale"
                   :page="page" @click.native.capture="setProperty(properties.child)"></child-simulator>
      </div>
    </div>
  </div>
</template>

<script>
import {fnc} from "@/assets/js/functions";
import {Drop} from "vue-easy-dnd";

export default {
  name: "Container",
  props: ['properties', 'scale', 'page'],
  components: {
    Drop,
    'child-simulator': () => import('../elements/Simulator')
  },
  methods: {
    setProperty: function (prop) {
      var self = this;
      var propcont = prop;
      setTimeout(function () {
          let  n = self;
          do{
            n = n.$parent;
          } while (n.currentProperties === undefined );
          console.log(n.currentProperties);
          n.currentProperties = propcont;
      }, 20);
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
          this.visualValidator(properties, this.page.children.visual);
          // ***!*** need sort and rename here
        }
      } catch (e) {
        console.log(e.message);
        window.alertify.warning('unknown error on load component');
      }
    },
    visualValidator: function (component
    //    , visuals
    ) {
      var self = this;
      if (component.type === 'appbar' || component.type === 'nav' ) {
        // check non duplicate app bar
        window.alertify.warning("You can't drop two AppBar or Nav in container");
        return false;
      }
      // add component
      var newComponent = fnc.clone(component);
      // // choose name
      // // check not duplicate name add number to name
      // let names = [];
      // for (const comp of visuals) {
      //   names.push(comp.name);
      // }
      // let i = 0;
      // let nextName = false;
      // do {
      //   nextName = false;
      //   i++;
      //   if (names.indexOf(component.type + i.toString()) > -1) {
      //     nextName = true;
      //   }
      // } while (nextName);
      newComponent.name = this.properties.name +  this.capitalizeFirstLetter(component.type);
      this.properties.child = newComponent;
// update page preview
      setTimeout(function () {
        fnc.takeScreenShot("#preview", function (e) {
          self.page.image = e;
        });
      }, 1000);
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
      style += 'border-style:solid;';
      style += 'border-width:'+fnc.calcPadding(this.properties.border)+';';
      if (this.properties.borderColor != 'null') {
        style += 'border-color:' + this.color2web(this.properties.borderColor) + ';';
      }


      if (this.properties.width != 'null') {
        style += 'width:' + fnc.getSize(this.properties.width, this.scale, 3) + ';'
      }
      if (this.properties.height != 'null') {
        style += 'height:' + fnc.getSize(this.properties.height , this.scale , 3, true) + ';'
      }
      if (this.properties.size != 'null') {
        style += 'font-size:' + (this.properties.size * this.scale * 2.5) + 'px;';
      }
      if (this.properties.padding != 'null' && this.properties.padding != '') {
        style += 'padding:' + this.calcPadding(this.properties.padding) + ';'
      }
      if (this.properties.margin != 'null' && this.properties.margin != '') {
        style += 'margin:' + this.calcPadding(this.properties.margin) + ';'
      }
      if (this.properties.borderRadius != 'null' && this.properties.borderRadius != '') {
        style += 'border-radius:' + this.calcPadding(this.properties.borderRadius) + ';'
      }


      return style;
    }
    ,
    color2web: function (clr, b = false) {
      return fnc.color2web(clr, b);
    }
    ,
    calcPadding: function (pad) {
      try {
        return fnc.calcPadding(pad);
      } catch {
          return '0';
      }

    }
  }
}
</script>

<style scoped>
.cont {
  background: transparent;
}
</style>