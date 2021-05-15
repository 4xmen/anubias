<template>
  <div>
    <app-menu></app-menu>
    <div id="main">
      <div class="container">
        <div v-if="isInitProject">
          <div id="device-selector">
            <label>
              <span>Display:</span>
              <select @change="changeDisplay" v-model="currentDisplay">
                <option :value="dev" v-for="dev in devices"> {{ dev.name }} ({{ dev.width }}x{{ dev.height }})
                </option>
              </select>
            </label>
            <span>
            Scale: {{ display.scale }}
          </span>
            <div class="ui buttons inverted small">
              <button @click="changeScale(1.25)"
                      :class="'ui button  '+(display.scale === 1.25?'green basic':'inverted')">
                125%
              </button>
              <button @click="changeScale(1)" :class="'ui button  '+(display.scale === 1?'green basic':'inverted')">100%
              </button>
              <button @click="changeScale(0.25)"
                      :class="'ui button  '+(display.scale === 0.25?'green basic':'inverted')">
                25%
              </button>
              <button @click="changeScale(0.5)" :class="'ui button  '+(display.scale === 0.5?'green basic':'inverted')">
                50%
              </button>
              <button @click="changeScale(0.35)"
                      :class="'ui button  '+(display.scale === 0.35?'green basic':'inverted')">
                auto
              </button>
            </div>
            <span>
            Rotate:
          </span>
            <button @click="changeRotate(false)"
                    :class="'ui button small '+(!display.landscape?'green basic':'inverted')">
              <i class="fa fa-mobile-alt"></i>
            </button>
            <button @click="changeRotate(true)"
                    :class="'ui button small '+(display.landscape?'green basic':'inverted')">
              <i class="fa fa-mobile-alt fa-rotate-90"></i>
            </button>
          </div>
          <div id="mobile"
               :style="'width:'+(display.landscape?display.height:display.width  )* display.scale+'px;height:'+(display.landscape?display.width:display.height  ) * display.scale+'px'">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur error ipsum placeat quam? Ad alias
            commodi debitis distinctio doloribus illo necessitatibus neque nesciunt nobis optio quo reprehenderit, sed,
            sequi voluptatum!
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur error ipsum placeat quam? Ad alias
            commodi debitis distinctio doloribus illo necessitatibus neque nesciunt nobis optio quo reprehenderit, sed,
            sequi voluptatum!
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur error ipsum placeat quam? Ad alias
            commodi debitis distinctio doloribus illo necessitatibus neque nesciunt nobis optio quo reprehenderit, sed,
            sequi voluptatum!
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur error ipsum placeat quam? Ad alias
            commodi debitis distinctio doloribus illo necessitatibus neque nesciunt nobis optio quo reprehenderit, sed,
            sequi voluptatum!
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur error ipsum placeat quam? Ad alias
            commodi debitis distinctio doloribus illo necessitatibus neque nesciunt nobis optio quo reprehenderit, sed,
            sequi voluptatum!
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur error ipsum placeat quam? Ad alias
            commodi debitis distinctio doloribus illo necessitatibus neque nesciunt nobis optio quo reprehenderit, sed,
            sequi voluptatum!
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
        <compo title="Container" icon="far fa-square"></compo>
        <compo title="AppBar" icon="far fa-window-maximize"></compo>
        <compo title="Image" icon="far fa-image"></compo>
        <compo title="Icon" icon="far fa-smile"></compo>
        <compo title="Text" icon="fas fa-font"></compo>
        <compo title="Column" icon="fas fa-bars"></compo>
        <compo title="Row" icon="fas fa-bars fa-rotate-90"></compo>
        <compo title="Scaffold" icon="fa fa-vector-square"></compo>
        <compo title="Nav" icon="far fa-window-maximize fa-rotate-180"></compo>
        <compo title="List" icon="fa fa-list"></compo>
        <compo title="Dropdown" icon="fa fa-prescription-bottle"></compo>
        <compo title="Text" icon="fab fa-yoast"></compo>
        <compo title="Button" icon="far fa-plus-square"></compo>
        <compo title="Toggle" icon="fa fa-toggle-on"></compo>
        <compo title="Menu" icon="fa fa-list-alt"></compo>
        <compo title="Grid" icon="fa fa-th"></compo>
        <compo title="Preloader" icon="fa fa-spinner"></compo>
        <compo title="Rate" icon="fa fa-star"></compo>
        <compo title="Calendar" icon="fa fa-calendar-alt"></compo>
        <compo title="DatePicker" icon="fa fa-calendar-check"></compo>
        <compo title="Map" icon="fa fa-map"></compo>
        <compo title="Location" icon="fa fa-map-marker-alt"></compo>
        <compo title="Slider" icon="fa fa-ellipsis-h"></compo>
        <compo title="Timer" icon="fa fa-stopwatch"></compo>
        <compo title="Image Picker" icon="fa fa-file-image"></compo>
        <compo title="File Picker" icon="fa fa-folder-open"></compo>

      </div>
      <div id="properties">
        <h2>
          Properties
          <i class="fa fa-expand"></i>
        </h2>
        <div v-if="isInitProject">
          <property></property>
        </div>
        <div v-else class="text-center">
          <img src="../../assets/img/logo.svg" class="logo-sm" alt="">
        </div>
      </div>
    </div>
    <div id="pages">
      <div class="container">
        <div v-if="isInitProject">
          <page title="page1" :active="true">
            hello 1
          </page>
          <page title="page2">
            hello 2
          </page>
          <i class="fa fa-plus-circle" id="page-add"></i>
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
// const {remote} = require("electron");


export default {
  name: "MainAppPage",
  components: {page, property, compo, appMenu},
  data: function () {
    return {
      data: window.appData,
      currentDisplay: null,
      isInitProject: true,
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

    if (window.appData.project.name === '') {
      this.isInitProject = false;
    }
    try {
      var $ = window.jQuery;
      $(".ui .dropdown").dropdown();
      $("html").niceScroll();
      $("#properties").niceScroll();
      $("#mobile").niceScroll({touchbehavior: true,});
      $("#elements").niceScroll();

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
  padding: 3px;
  text-align: center;
  background: #272c34;
  border-bottom: 1px solid rgba(0, 0, 0, .1);
  font-size: 17px;
  box-sizing: border-box;
  width: 100%;
}

#side h2 .fa {
  float: right;
  padding: 5px;
}

#main {
  width: 75%;
  min-height: 80vh;
}

#mobile {
  background: white;
  /*width: 300px;*/
  /*height: 600px;*/
  margin: auto;
  border-radius: 15px;
  border: 10px solid black;
  border-top-width: 30px;
  border-bottom-width: 30px;
  color: #1e2329;
}

#main .container {
  padding: 15px;
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

.logo {
  width:55%;
}

.logo-sm {
  width: 128px;
  padding-top: 10px;
  opacity: .3;
}

</style>