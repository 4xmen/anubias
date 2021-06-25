<template>
  <div :style="getStyle()" class="row">
    <div class="content" :style="'padding:'+(15 * scale)+'px'">
      <drop class="drop visual" @drop="onVisualDrop" :accepts-data="(n) => isVisual(n)"></drop>
      <child-simulator v-for="(child,k) in properties.children" :type="child.type" :properties="child" :scale="scale"
                       :page="page" @click.native="setProperty(child)" :key="k"></child-simulator>

    </div>
  </div>
</template>

<script>
import {fnc} from "@/assets/js/functions";
import {Drop} from "vue-easy-dnd";

export default {
  name: "Row",
  props: ['properties', 'scale', 'page'],
  components: {
    Drop,
    'child-simulator': () => import('../elements/Simulator')
  },
  methods: {
    setProperty: function (prop) {
      let self = this;
      setTimeout(function () {
        console.log('tr2');
        self.$parent.$parent.currentProperties = prop;
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
      newComponent.name = this.properties.name + this.capitalizeFirstLetter(component.type);
      visuals.push(newComponent);
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

      if (this.properties.scrollable == true) {
        style += 'overflow-y:hidden ;overflow-x: scroll;';
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
.row {
  background: transparent;
  min-height: 50px;
  border: 1px dotted silver;
  position: relative;
  white-space: nowrap;
}

.row:before {

}

</style>