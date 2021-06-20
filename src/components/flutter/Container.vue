<template>
  <div :style="getStyle()" class="cont">
    <div class="content" :style="'padding:'+(15 * scale)+'px'">
      <div v-if="properties.child == 'null'">
        <drop class="drop visual" @drop="onVisualDrop" :accepts-data="(n) => isVisual(n)"></drop>
      </div>
      <div v-else>
        <simulator :type="properties.child.type" :properties="properties.child" :scale="scale"
                   :page="page" @click.native="setProperty"></simulator>
      </div>
    </div>
  </div>
</template>

<script>
import {fnc} from "@/assets/js/functions";
import {Drop} from "vue-easy-dnd";
import simulator from '../elements/Simulator';

export default {
  name: "Container",
  props: ['properties', 'scale', 'page'],
  components: {
    Drop, simulator
  },
  methods: {
    setProperty: function () {
      var self = this;
      setTimeout(function () {
        self.$parent.$parent.currentProperties = self.properties.child;
      }, 10);
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
      if (component.type === 'appbar') {
        // check non duplicate app bar
        window.alertify.warning("You can't drop two AppBar in container");
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
      style += 'border-width:1px;';
      if (this.properties.borderColor != 'null') {
        style += 'border-color:' + this.color2web(this.properties.borderColor) + ';';
      }


      if (this.properties.width != 'null') {
        style += 'width:' + (this.properties.width * this.scale * 3) + 'px;'
      }
      if (this.properties.height != 'null') {
        style += 'height:' + (this.properties.height * this.scale * 3) + 'px;'
      }
      if (this.properties.size != 'null') {
        style += 'font-size:' + (this.properties.size * this.scale * 2.5) + 'px;';
      }
      if (this.properties.padding != 'null' && this.properties.padding != '') {
        style += 'padding:' + this.calcPadding(this.properties.padding) + ';'
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
      return fnc.calcPadding(pad);
    }
  }
}
</script>

<style scoped>
.cont {
  background: transparent;
}
</style>