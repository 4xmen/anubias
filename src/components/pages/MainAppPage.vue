<template>
  <div>
    <div id="main">
      <app-menu></app-menu>
      <div class="container">
        <div v-if="isInitProject">
          <div id="device-selector" :class="(data.pages.length < 1?'inactive':'')">
            <div class="input-field">
              <select @change="changeDisplay" id="dev" v-model="currentDisplay" class="white-text">
                <option :value="dev" v-for="(dev,i) in devices" :key="i">
                  {{ dev.name }}
                  ({{ dev.width }}x{{ dev.height }})
                </option>
              </select>
              <label for="dev">
                <span>Display devices</span>
                <br>
              </label>
            </div>
            <span>
            Scale:
            </span>
            <ul class="pagination">
              <li @click="changeScale(1.25)"
                  :class="'waves-effect waves-light btn btn-small '+(display.scale === 1.25?'green basic':'grey darken-4')">
                125%
              </li>
              <li @click="changeScale(1)"
                  :class="'waves-effect waves-light btn btn-small '+(display.scale === 1?'green':'grey darken-4')">100%
              </li>
              <li @click="changeScale(0.25)"
                  :class="'waves-effect waves-light btn btn-small '+(display.scale === 0.25?'green ':'grey darken-4')">
                25%
              </li>
              <li @click="changeScale(0.5)"
                  :class="'waves-effect waves-light btn btn-small '+(display.scale === 0.5?'green ':'grey darken-4')">
                50%
              </li>
              <li @click="changeScale(0.35)"
                  :class="'waves-effect waves-light btn btn-small '+(display.scale === 0.35?'green':'grey darken-4')">
                auto
              </li>
            </ul>
            <span>
            Rotate:
            </span>
            <button @click="changeRotate(false)"
                    :class="'waves-effect waves-light btn-small '+(!display.landscape?'green':'grey darken-4')">
              <i class="fa fa-mobile-alt"></i>
            </button>
            <button @click="changeRotate(true)"
                    :class="'waves-effect waves-light btn-small '+(display.landscape?'green':'grey darken-4')">
              <i class="fa fa-mobile-alt fa-rotate-90"></i>
            </button>
            <div id="non-visual">
              <drop class="drop non-visual" @drop="onNonVisualDrop" :accepts-data="(n) => !isVisual(n)">
<!--                <span v-for="(n, index) in oddDropped" :key="index">Dropped : {{ n }},&nbsp;</span>-->
              </drop>
            </div>
          </div>
          <div id="mobile" :class="(data.pages.length < 1?'inactive':'')"
               :style="'width:'+(display.landscape?display.height:display.width  )* display.scale+'px;height:'+(display.landscape?display.width:display.height  ) * display.scale+'px'+';background-color:'+data.project.bgColor+';color:'+data.project.textColor+' !important' ">
            <div id="dir" :style="'direction:'+(data.project.isRTL?'rtl':'ltr')">
              <div v-if="data.pages[currentPage] !== undefined && data.pages[currentPage].children.visual !== undefined">
                <span v-for="(comp,i) in data.pages[currentPage].children.visual"
                      :key="i" >
                  <simulator :type="comp.type" :properties="comp" :scale="display.scale"></simulator>
                </span>
              </div>

              <drop class="drop visual" @drop="onVisualDrop" :accepts-data="(n) => isVisual(n)"></drop>
              <!--              <drop class="drop any" @drop="onAnyDrop" mode="cut">-->
              <!--                <span v-for="(n, index) in anyDropped" :key="index">Dropped : {{n}},&nbsp;</span>-->
              <!--              </drop>-->
            </div>
          </div>
        </div>
        <div v-else class="text-center">
          <img src="../../assets/img/logo.svg" class="logo" alt="">
        </div>
      </div>
    </div>
    <div id="side">
      <div id="elements">
        <h2>
          Elements
          <i class="fa fa-cubes"></i>
        </h2>
        <transition-group name="list" tag="div">
          <drag v-for="(comp,n) in components" :key="n" class="drag" :data="n">
            <compo :title="comp.title" :icon="comp.icon"></compo>
          </drag>
        </transition-group>

        <!--        <compo title="Scaffold" icon="fa fa-vector-square"></compo>-->

      </div>
      <div id="properties">
        <h2>
          Properties
          <i class="fa fa-expand"></i>
        </h2>
        <div v-if="isInitProject">
          <property :properties="currentProperties"></property>
        </div>
        <div v-else class="text-center">
          <img src="../../assets/img/logo.svg" class="logo-sm" alt="">
        </div>
      </div>
    </div>
    <div id="pages">
      <div class="container">
        <div v-if="isInitProject">
          <page v-for="(page,i) in data.pages" @click.native="changePage(i)" :key="i" :title="page.name"
                :active="currentPage === i">
            <i class="fa fa-times" @click="removePage(i)"></i>
            hello {{ i }}
            {{ page.name }}
          </page>
          <i class="fa fa-plus-circle" id="page-add" @click="newPage"></i>
        </div>
        <div v-else class="text-center">
          <img src="../../assets/img/logo.svg" class="logo-sm" alt="">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import page from '../elements/PageElement';
import property from '../elements/PropertyElement';
import compo from '../elements/ComponentElement';
import appMenu from '../elements/AppMenuElement';
import simulator from '../elements/Simulator';
import {Drag, Drop} from "vue-easy-dnd";
// const {remote} = require("electron");
import {fnc} from '@/assets/js/functions';

export default {
  name: "MainAppPage",
  components: {
    page,
    property,
    compo,
    appMenu,
    simulator,
    Drag,
    Drop
  },
  data: function () {
    return {
      numbers: [1, 2, 3, 4, 5, 6],
      data: window.appData,
      components: window.components,
      currentDisplay: "Nexus 5",
      currentPage: 0,
      currentProperties: {},
      // isInitProject: false,
      display: {
        name: 'Nexus 5',
        width: 1080,
        height: 1920,
        scale: .35,
        landscape: false,
      },
      devices: window.devices
    }
  }, mounted() {

    try {
      var $ = window.jQuery;
      // $("#main").niceScroll();
      // $("#mobile").niceScroll({touchbehavior: true});
      // $("#elements").niceScroll();
      $('#main select').formSelect();


      if(this.isInitProject &&  this.data.pages.length > 0){
        this.changePage(0);
      }
      /*eslint-disable */
      /*eslint-enable */
    } catch (e) {
      //
      // window.ipcRenderer.send('open-save-chart-dialog');

    }

  }, methods: {
    changeDisplay: function () {
      this.display.name = this.currentDisplay.name;
      this.display.width = this.currentDisplay.width;
      this.display.height = this.currentDisplay.height;

    },
    changeScale: function (e) {
      this.display.scale = e;
    },
    changeRotate: function (e) {
      this.display.landscape = e;
    },
    newPage: function () {
      this.data.pages.push(fnc.clone(window.defaults.page));
      let j = 0;
      let nextName = false;
      do {
        var currrentName = 'page' + (this.data.pages.length + j).toString();
        nextName = false;
        for (const page of this.data.pages) {
          if (page.name === currrentName) {
            j++;
            nextName = true;
          }
        }
      } while (nextName)
      this.data.pages[this.data.pages.length - 1].name = currrentName;
      this.changePage(this.data.pages.length - 1);
    },
    changePage: function (i) {
      this.currentPage = i;
      this.currentProperties = this.data.pages[i];
    },
    removePage: function (i) {
      var self = this;
      window.alertify.confirm('Are you sure to remove page?', 'Remove confirm', function () {
            let pages = [];
            for (const j in self.data.pages) {
              let page = self.data.pages[j];
              if (i != j) {
                pages.push(page);
              }
            }
            self.data.pages = pages;
            self.changePage(0);
            window.alertify.success('Page removed');
          }
          , function () {
            window.alertify.error('Cancel')
          });
    },
    onVisualDrop(event) {
      // this.evenDropped.push(event.data);
      try {
        var component = window.components[event.data];
        var properties = eval(component.data);
        if (properties === undefined){
          window.alertify.warning('Invalid component',15);
        }else{

          this.data.pages[this.currentPage].children.visual.push(properties);
        }
      } catch(e) {
        console.log(e.message);
        window.alertify.warning('unknown error on load component');
      }

    },
    onNonVisualDrop(event) {
      // this.oddDropped.push(event.data);
    },
    remove(n) {
      let index = this.numbers.indexOf(n);
      this.numbers.splice(index, 1);
    },
    isVisual:function (n) {
      return window.components[n].visual;
    },
  },computed:{
    isInitProject:function () {
     return  window.appData.project.name !== '';
    }
  }
}
</script>

<style scoped>
#side {
  background: #20252b;
  width: 25%;
  position: fixed;
  right: 0;
  top: 0;
  bottom: 0;
  min-height: 100vh;
  box-sizing: border-box;
  border-left: 1px solid rgba(0, 0, 0, .1);
}

#side #elements {
  height: 50vh;
  overflow-y: scroll;
}

#properties {
  height: 50vh;
  overflow: hidden;
  overflow-y: scroll;
}

#side h2 {
  padding: 7px;
  text-align: center;
  background: #272c34;
  border-bottom: 1px solid rgba(0, 0, 0, .1);
  font-size: 17px;
  box-sizing: border-box;
  width: 100%;
}

#side h2 .fa {
  float: right;
  padding: 2px;
}

#main {
  width: 75%;
  min-height: 80vh;
}

#mobile {
  background: white;
  /*width: 300px;*/
  /*height: 600px;*/
  margin: 10px auto 10px auto;
  border-radius: 15px;
  border: 10px solid black;
  border-top-width: 30px;
  border-bottom-width: 30px;
  overflow-y: scroll;
}

#main .container {
  padding: 15px;
  width: 95%;
}

#pages {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 25%;
  background: #20252b;
  height: 20vh;
  border: 1px solid rgba(0, 0, 0, .1);
  border-right: 0;
}

#pages .container {
  padding: 5px;
  width: 95%;
}

#pages .fa-times {
  position: absolute;
  left: 0;
  top: 0;
  color: red;
  font-size: 18px;
}

#page-add {
  font-size: 50px;
  vertical-align: top;
  margin-top: 5vh;
  color: #666;
  cursor: pointer;
  margin-left: 25px;
}

#page-add:hover {
  color: #eeeeee;
}

#device-selector {
  margin: 10px;
  float: left;
}

#device-selector select {
  padding: 4px;
}

#device-selector span {
  display: block;
  padding: 10px 0;
}

#device-selector .buttons {
  padding-bottom: 5px;
}

#non-visual {
  border: 1px solid #20252b;
  background: #1e2329;
  margin-top: 15px;
  min-height: 20vh;
  overflow: hidden;
  max-width: 315px;
}

.logo {
  width: 45%;
}

.logo-sm {
  width: 128px;
  padding-top: 10px;
  opacity: .3;
}


</style>