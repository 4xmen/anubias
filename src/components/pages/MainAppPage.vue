<template>
  <div>
    <div v-if="mobile_error" id="mobile-error">
      <div>
        <div class="fa fa-sad-tear"></div>
        <br>
        Please use desktop to use, Online demo
      </div>
    </div>
    <div v-else>
      <app-menu class="blurable"></app-menu>
      <div id="tabs" class="blurable">
        <ul class="clearfix">
          <li :class="(activeTab == '-1'?'active':'')" @click="changeTab(-1)">
            <i class="fa fa-laptop-code"></i>
            Main
          </li>
          <li v-for="(tab,i) in tabs" :key="i" @click="changeTab(i)" :class="(activeTab == i?'active':'')"
              @mouseup.middle="closeTab(i)">
            <i :class="'fa '+tab.icon"></i>
            {{ tab.title }}
            <span class="fa fa-times" @click="closeTab(i)"></span>
          </li>
          <li class="hidden-tab">

          </li>
        </ul>
      </div>
      <div :class="'tab-control-placeholder '+(tabs.length  === 0?'opacity-0':'')">
        <div class="prev-sc">
          <i class="fa fa-angle-left"></i>
        </div>
        <div class="next-sc">
          <i class="fa fa-angle-right"></i>
        </div>
      </div>

      <div id="tab-content-1">
        <div id="wrapper" :class="(!settings.pages?'page-collapse ':'')+(!settings.sidebar?'side-collapse ':'')">

          <div id="main" :class="(!settings.pages?'page-collapse ':'')+(!settings.sidebar?'side-collapse ':'')">
            <!-- add app menu to main-->
            <div class="container-fluid text-center" id="hold">
              <!-- if project init can show left side -->
              <!-- right sidebar start -->
              <div v-if="isInitProject">
                <!-- inactive when has not page -->
                <div id="device-selector" :class="(data.pages.length < 1?'inactive':'blurable')">
                  <!-- select device -->
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
                  <!-- select scale size -->
                  <span>
            Scale:
            </span>
                  <ul class="pagination">
                    <li @click="changeScale(1.25)"
                        :class="'waves-effect waves-light btn btn-small '+(display.scale === 1.25?'green basic':'grey darken-4')">
                      125%
                    </li>
                    <li @click="changeScale(1)"
                        :class="'waves-effect waves-light btn btn-small '+(display.scale === 1?'green':'grey darken-4')">
                      100%
                    </li>
                    <li @click="changeScale(0.25)"
                        :class="'waves-effect waves-light btn btn-small '+(display.scale === 0.25?'green ':'grey darken-4')">
                      25%
                    </li>
                    <li @click="changeScale(0.5)"
                        :class="'waves-effect waves-light btn btn-small '+(display.scale === 0.5?'green ':'grey darken-4')">
                      50%
                    </li>
                    <li @click="changeScale(.35)"
                        :class="'waves-effect waves-light btn btn-small '+(display.scale === 0.35?'green':'grey darken-4')">
                      auto
                    </li>
                  </ul>
                  <!-- device rotation -->
                  <div v-if="!currentDisplay.isDesktop">
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
                  </div>
                  <!-- non visual components of page -->
                  <div id="non-visual">
                    <div class="non-visual-placeholder"
                         v-if="data.pages[currentPage] !== undefined && data.pages[currentPage].children.nonvisual !== undefined">
                      <div v-for="(nvc,i) in data.pages[currentPage].children.nonvisual"
                           class="non-visual-component" :key="i" @dblclick="removeNonVisual(i)"
                           @click="currentProperties = nvc; isVisualSelected = -1">
                        <i :class="nonVisualIcon[nvc.type]"></i>
                        <span>
                          {{ nvc.name }}
                      </span>
                      </div>
                    </div>
                    <ul v-if="data.pages[currentPage] !== undefined && data.pages[currentPage].children.nonvisual !== undefined && data.pages[currentPage].children.nonvisual.length > 0">
                      <li> - Double click to remove component</li>
                    </ul>
                    <drop class="drop non-visual" @drop="onNonVisualDrop" :accepts-data="(n) => !isVisual(n)">
                      <!--                <span v-for="(n, index) in oddDropped" :key="index">Dropped : {{ n }},&nbsp;</span>-->
                    </drop>
                  </div>
                </div>
                <!-- mobile drawing by project detail and user device selected -->
                <!-- inactive when has not page -->
                <!-- make device size and scale -->
                <!-- bgcolor and text color apply -->
                <div :class="'device-holder blurable '+(currentDisplay.isDesktop? 'laptop':'')">
                  <div id="mobile" :style="getStyleMobile()"
                       :class="+(data.pages.length < 1?'inactive':'blurable')+(currentDisplay.borderLess?' borderless':'')+(display.landscape?' landscape':'')+' '+currentDisplay.camera+' '+currentDisplay.cameraBorder">
                    <div :style="getStyleCamera()" id="camera"><span :style="getStyleCameraDevice()"></span></div>
                    <div id="preview">
                      <div :style="'background-color:'+(data.project.isDark?'#2e2e2e':data.project.bgColor)
               +';color:'+(data.project.isDark?'white':data.project.textColor)+' !important' ">
                        <!-- direction of project and page padding -->
                        <div id="dir" :style="getStyleDir()">
                          <!-- visual components of page -->
                          <div id="safearea" v-if="data.pages[currentPage].safeArea" :style="getStyleSafeArea()"></div>
                          <div
                              id="sortable"
                              v-if="data.pages[currentPage] !== undefined && data.pages[currentPage].children.visual !== undefined">
                            <div v-for="(comp,i) in data.pages[currentPage].children.visual"
                                 :key="i">
                              <simulator @contextmenu.native.prevent="contextOpen(i,$event)"
                                         @click.native="currentProperties = comp; contextIndex = i; isVisualSelected = 1"
                                         :type="comp.type" :properties="comp" :scale="display.scale"
                                         :page="data.pages[currentPage]"></simulator>
                            </div>
                          </div>
                        </div>

                        <drop @contextmenu.native.prevent="contextOpen(-1,$event)" class="drop visual"
                              @drop="onVisualDrop"
                              :accepts-data="(n) => isVisual(n)"></drop>
                        <!--              <drop class="drop any" @drop="onAnyDrop" mode="cut">-->
                        <!--                <span v-for="(n, index) in anyDropped" :key="index">Dropped : {{n}},&nbsp;</span>-->
                        <!--              </drop>-->
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- right sidebar end -->
              <div v-else class="text-center pos-relative">
                <h5 v-if="isOnline && isNotChrome">
                  <br><br>
                  Please use `chromium` or `google chrome` to use online app
                </h5>
                <div v-if="!isOnline">


                  <div id="recent">
                    <h6>
                      Recent projects:
                    </h6>
                    <ul>
                      <li v-for="(f,i) in recents" :key="i" @click="openRecent(i)">
                    <span>
                      {{ f.substr(0, f.lastIndexOf(slash)) }}{{ slash }}
                    </span>
                        {{ f.substr(f.lastIndexOf(slash) + 1) }}
                      </li>
                    </ul>
                  </div>
                </div>
                <div v-else>
                  <h4 class="welcome">
                    Welcome to Anubias online demo
                  </h4>
                </div>
                <h5>
                  Templates:
                </h5>
                <carousel-3d ref="carousel3d"
                             :height="500"
                             :autoplay="true"
                             :autoplayTimeout="5000"
                             :autoplayHoverPause="true"
                             :controlsVisible="true"
                             :onMainSlideClick="slideClick">
                  <slide :index="0">
                    <img src="../../assets/img/template/login.png" alt="login">
                  </slide>
                  <slide :index="1">
                    <img src="../../assets/img/template/cyber.png" alt="cyber">
                  </slide>
                  <slide :index="2">
                    <img src="../../assets/img/template/travel.png" alt="travel">
                  </slide>
                  <slide :index="3">
                    <img src="../../assets/img/template/shop.png" alt="shop">
                  </slide>
                  <slide :index="4">
                    <img src="../../assets/img/template/dna.png" alt="dna">
                  </slide>
                </carousel-3d>

              </div>
            </div>
          </div>
          <div id="side" :class="'blurable ' +(!settings.sidebar?'collapse ':'')">
            <div id="components">
              <h2>
                Components
                <i class="fa fa-cubes"></i>
              </h2>
              <!-- show dragable component to add to page -->
              <transition-group name="list" tag="div">
                <drag v-for="(comp,n) in components" :key="n" class="drag" :data="n">
                  <compo :title="comp.title" :icon="comp.icon" :active="comp.active"></compo>
                </drag>
              </transition-group>

              <!--        <compo title="Scaffold" icon="fa fa-vector-square"></compo>-->

            </div>
            <div id="properties">
              <h2>
                Properties
                <i class="fa fa-expand"></i>
              </h2>
              <!-- if project init sho properties-->
              <div v-if="isInitProject">
                <property :properties="currentProperties" :page="currentPage" ref="properties"></property>
              </div>
              <div v-else class="text-center pos-relative">
                <img src="../../assets/img/logo.svg" class="logo-sm" alt="">
              </div>
            </div>
          </div>
          <div id="pages" :class="'blurable '+(!settings.pages?'collapse ':'')">
            <div class="container">
              <!-- if project init can pages -->
              <div v-if="isInitProject">
                <!-- list of pages -->
                <page v-for="(page,i) in data.pages" :image="page.image!= undefined? page.image: null"
                      :isMain="data.project.mainPage === i" @click.native="changePage(i)" :key="i" :title="page.name"
                      :active="currentPage === i" :bg="(data.project.isDark?'#2e2e2e':data.project.bgColor)">
                  <i class="fa fa-times" @click="removePage(i)"></i>
                </page>
                <i class="fa fa-plus-circle" id="page-add" @click="newPage"></i>
              </div>
              <div v-else class="text-center">
                <img src="../../assets/img/logo.svg" class="logo-sm" alt="">
              </div>
            </div>
          </div>
          <div id="terminal-btn" class="blurable" @click="showTerminalModal = true">
            <i class="fa fa-terminal"></i>
          </div>
          <vue-context ref="menu" class="context-menu">
            <li>
              <a href="#" class="no-paste" @click.prevent="contextTrigger('copy')">
                <i class="fa fa-copy"></i>
                Copy <span>Ctrl+Shift+C</span>
              </a>
            </li>
            <li>
              <a href="#" class="no-paste" @click.prevent="contextTrigger('cut')">
                <i class="fa fa-cut"></i>
                Cut <span>Ctrl+Shift+X</span>
              </a>
            </li>
            <li>
              <a href="#" @click.prevent="contextTrigger('paste')">
                <i class="fa fa-paste"></i>
                Paste <span>Ctrl+Shift+V</span>
              </a>
            </li>
            <li>
              <a href="#" class="no-paste" @click.prevent="contextTrigger('delete')">
                <i class="fa fa-times"></i>
                Delete <span>Shift+Del</span>
              </a>
            </li>
          </vue-context>
        </div>
      </div>
      <div v-for="(tab,i) in tabs" :key="i" class="tab-content" :id="'tab-content'+i">
        <tab-control :type="tab.type" :data="tab.data" :pointer="tab.pointer"></tab-control>
      </div>
      <vue-final-modal v-model="showTerminalModal" @before-open="modalOpen" @before-close="modalClose"
                       name="teminal-modal">
        <terminal ref="terminal">
          <div v-for="(c,i) in terminalContent" :key="i">
            <span v-if="c.substr(0,5) == '--err'" class="red-text" v-html="linkify(c.substr(5))"></span>
            <span v-else v-html="linkify(c)"></span>
          </div>
        </terminal>
      </vue-final-modal>
      <vue-final-modal v-model="showRowModal" @before-open="modalOpen" @before-close="modalClose"
                       name="row-modal">
        <row-control :clpbrd="contextClipBoard" :row-name="currentProperties.name" :rw-data="rowData"></row-control>
      </vue-final-modal>
      <vue-final-modal v-model="showItemsModal" @before-open="modalOpen" @before-close="modalClose"
                       name="row-modal">
        <div v-if="currentProperties.items !== undefined">
          <item-control :items="currentProperties.items "></item-control>
        </div>
      </vue-final-modal>
      <vue-final-modal v-model="showMenuItemsModal" @before-open="modalOpen" @before-close="modalClose"
                       name="row-modal">
        <div v-if="currentProperties.items !== undefined">
          <menu-item-control :items="currentProperties.items "></menu-item-control>
        </div>
      </vue-final-modal>
      <vue-final-modal v-model="showActionsModal" @before-open="modalOpen" @before-close="modalClose"
                       name="row-modal">
        <div v-if="currentProperties.actions !== undefined">
          <action-control :actions="currentProperties.actions "></action-control>
        </div>
      </vue-final-modal>
      <vue-final-modal v-model="showOptionsModal" @before-open="modalOpen" @before-close="modalClose"
                       name="row-modal">
        <div v-if="currentProperties.options !== undefined">
          <option-control :options="currentProperties.options"></option-control>
        </div>
      </vue-final-modal>
      <vue-final-modal v-model="showColorPickerModal" @before-open="modalOpen" @before-close="modalClose"
                       name="row-modal">
        <color-picker :color="onEditColor"></color-picker>
      </vue-final-modal>
      <vue-final-modal v-model="showDownloadModal" @before-open="modalOpen" @before-close="modalClose"
                       name="row-modal">
        <download :dl="download"></download>
      </vue-final-modal>
      <div id="preloader">
        <h4>
          Please wait...
        </h4>
        <i class="fa fa-spin fa-spinner"></i>
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
import tabControl from '../elements/TabControl';
import download from '../elements/Download';
// import codeEditor from '../elements/CodeEditor'
import terminal from '../elements/TerminalElement';
import rowControl from '../elements/RowControlElement';
import actionControl from '../elements/ActionControlElement';
import optionControl from '../elements/OptionControlElement';
import itemControl from '../elements/ItemControlElement';
import menuItemControl from '../elements/MenuItemControlElement';
import colorPicker from '../elements/colorPickerElement';

import {Drag, Drop} from "vue-easy-dnd";
import VueContext from 'vue-context';
import {Carousel3d, Slide} from 'vue-carousel-3d';


/*eslint-disable */
import Sortable from '@/assets/js/Sortable.min';
/*eslint-enable */
// import editor  from '../elements/TitleElement';
// const {remote} = require("electron");
import {fnc} from '@/assets/js/functions';
import axios from "axios";

require('@/assets/js/sly.min');


export default {
  name: "MainAppPage",
  components: {
    page,
    property,
    compo,
    appMenu,
    simulator,
    // codeEditor,
    terminal,
    rowControl,
    VueContext,
    actionControl,
    optionControl,
    itemControl,
    menuItemControl,
    colorPicker,
    tabControl,
    download,
    Drag,
    Drop,
    Carousel3d,
    Slide,
  },
  data: function () {
    return {
      sly: null,
      nonVisualIcon: {
        menu: 'fa fa-list-alt',
      },
      showTerminalModal: false,
      showRowModal: false,
      showOptionsModal: false,
      showActionsModal: false,
      showItemsModal: false,
      showMenuItemsModal: false,
      showColorPickerModal: false,
      showDownloadModal: false,
      download: '',
      mobile_error: false,
      onEditColor: '',
      onEditColorKey: '',
      rowData: [],
      content: '',
      data: window.appData,
      components: window.components,
      currentDisplay: window.devices[0],
      currentPage: 0,
      currentProperties: {},
      contextIndex: -1,
      isVisualSelected: -1,
      contextClipBoard: '',
      isOnline: window.ide.isOnline,
      settings: window.ide.settings,
      isNotChrome: window.chrome == undefined,
      terminalContent: ['Welcome to Anbuias v' + window.ide.version()],
      recents: window.ide.settings.recents,
      slash: fnc.getOS() == 'Windows' ? '\\' : '/',
      // isInitProject: false,
      display: {
        name: 'Nexus 5x',
        width: 1080,
        height: 1920,
        scale: .35,
        landscape: false,
      },
      devices: window.devices,
      activeTab: -1,
      lastActiveTab: -1,
      tabs: [],
      tabKeeper: [],
    }
  },
  mounted() {

    try {

      window.project.isSave = true;
      this.$parent.isSaved = true;

      if (window.ide.isOnline && window.innerWidth < 1000) {
        this.mobile_error = true;
      }


      var $ = window.jQuery;


      // $("#main").niceScroll();
      // $("#mobile").niceScroll({touchbehavior: true});
      // $("#elements").niceScroll();
      $('#main select').formSelect();

      var self = this;

      setTimeout(function () {
        self.changeScale(.3501);
      }, 100);

      $(document).unbind('keyup.contextShortcut').bind('keyup.contextShortcut', function (e) {
        if (e.ctrlKey && e.shiftKey && e.key === 'c') {
          self.contextTrigger('copy');
        }
        if (e.ctrlKey && e.shiftKey && e.key === 'x') {
          self.contextTrigger('cut');
        }
        if (e.ctrlKey && e.shiftKey && e.key === 'v') {
          try {
            self.contextTrigger('paste');
          } catch (e) {
            window.alertify.warning('Nothing to paste');
          }
        }
        if (e.shiftKey && e.keyCode === 46) {
          self.removeVisual(self.contextIndex);
        }

      });

      if (this.isInitProject && this.data.pages.length > 0) {
        this.changePage(this.data.project.mainPage);
        this.updateProject();
      } else {
        this.$parent.title = '';
        this.$parent.isSaved = true;
      }
      /*eslint-disable */
      /*eslint-enable */
      window.api.receive("terminal", (data) => {
        if (data.trim().replace(/^(?=\n)$|^\s*|\s*$|\n\n+/gm, "").length > 0) {
          self.terminalContent.push(data.replace(/^\s*$(?:\r\n?|\n)/gm, ''));
        }
      })
      window.api.receive("terminal-error", (data) => {
        if (data.replace(/^(?=\n)$|^\s*|\s*$|\n\n+/gm, "").trim().length > 0) {
          self.terminalContent.push('--err' + data.replace(/^(?=\n)$|^\s*|\s*$|\n\n+/gm, "").trim());
        }
      });
      this.handleSly();

    } catch (e) {
      //
      // window.ipcRenderer.send('open-save-chart-dialog');
      console.log(e.messages);
    }

  },
  watch: {
    // tabs: {
    //   handler: function (val) {
    //     for( const i in val) {
    //         console.log(this.tabKeeper[i],val[i].value);
    //         this.tabKeeper[i] = val[i].value;
    //     }
    //
    //     // this.$refs.properties.onEdit = newval;
    //     // console.log(this.$refs.properties.onEdit);
    //   },
    //   deep: true,
    // },
    data: {
      handler: function (val) {
        this.updateProject(val);
      },
      deep: true
    },
    terminalContent: {
      handler: function () {
        this.$refs.terminal.scroll();
        var self = this;
        setTimeout(function () {
          self.$refs.terminal.scroll();
        }, 500);
      },
    }
  },
  methods: {
    linkify: fnc.linkify,
    closeAllModal() {
      this.showItemsModal = false;
      this.showTerminalModal = false;
      this.showRowModal = false;
      this.showOptionsModal = false;
      this.showActionsModal = false;
      this.showColorPickerModal = false;
      this.showMenuItemsModal = false;
    },
    slideClick: function () {
      let template = '';
      switch (this.$refs.carousel3d.currentIndex) {
        case 0:
          template = 'login';
          break;
        case 1:
          template = 'cyber';
          break;
        case 2:
          template = 'travel';
          break;
        case 3:
          template = 'shop';
          break;
        case 4:
          template = 'dna';
          break;
        default:
          template = 'login';
      }
      let url = 'https://anubias.app/templates/dl.php?dl=' + template;

      var self = this;
      document.querySelector("#preloader").style.display = 'flex';
      window.alertify.message('Wait a few moments to download template :)');
      axios.get(url).then(
          function (e) {
            document.querySelector("#preloader").style.display = 'none';
            if (e.data.ok === false) {
              window.alertify.error(e.data.message);
            } else {
              window.appData = e.data.data;
              self.$router.push('/projectLoaded');
            }
          }
      ).catch(function (e) {
        document.querySelector("#preloader").style.display = 'none';
        window.alertify.error(e.message);
      });

    },
    handleSly: function () {
      try {
        try {
          if (this.sly != null) {
            var self = this;
            setTimeout(function () {
              self.sly.reload();
            }, 500);
            return;
          }
        } catch (e) {
          console.log(e.message);
        }

        let options = {
          horizontal: 1,
          itemNav: 'centered',
          activateMiddle: 1,
          // activateOn: 'click',
          mouseDragging: 1,
          touchDragging: 1,
          releaseSwing: 1,
          startAt: 0,
          // scrollBar: document.querySelector('.scrollbar'),
          scrollBy: 1,
          speed: 300,
          elasticBounds: 1,
          dragHandle: 1,
          dynamicHandle: 1,
          clickBar: 1,
          scrollTrap: 1,
          moveBy: 900,
          forward: document.querySelector('.prev-sc'),
          backward: document.querySelector('.next-sc'),
        };
        /*eslint-disable */
        //let frame = new
        this.sly = Sly('#tabs', options).init();

      } catch (e) {
        console.log(e.message);
      }
      /*eslint-enable */

    },
    changeTab: function (i) {
      // check if active tab try to reactive
      // console.log(i);
      if (this.activeTab === i) {
        return;
      }

      let $ = window.jQuery;
      if (i === -1 || this.activeTab === -1) {
        let last = '#tab-content' + this.activeTab;
        $(last).slideUp(300);
        // $('#tab-content'+i).addClass('slide-fade-tab');
        this.lastActiveTab = this.activeTab;
        this.activeTab = i;
        setTimeout(function () {
          $('#tab-content' + i).slideDown(300);
        }, 100);
        return;
      }
      let last = '#tab-content' + this.activeTab;
      $(last).addClass('slide-fade-tab');
      $('#tab-content' + i).addClass('slide-fade-tab');
      this.lastActiveTab = this.activeTab;
      this.activeTab = i;
      setTimeout(function () {
        $(last).hide().removeClass('slide-fade-tab');
        $('#tab-content' + i).removeClass('slide-fade-tab').show();
      }, 450);
      // console.log(i);
      // console.log(this.$refs[][0]);
      // this.$refs['tab-content'+i][0].style.display = 'none';
      // this.activeTab = i;
      // this.$refs['tab-content'+i][0].style.display = 'block';
    },
    addTab: function (title, type, data, icon, key, pointer = null) {
      // editable += '// ops \n ';
      // return;
      // console.log(pointer);
      let $ = window.jQuery;
      // check if tab exists active it
      if (this.tabs.length > 0) {
        for (let i in this.tabs) {
          let tab = this.tabs[i];
          if (tab.title === title) {
            this.changeTab(i);
            return;
          }
        }
      }
      // add tab
      // this.currentProperties[key] += '// yas \n';
      let p = 'window.appData.pages[' + this.currentPage + ']';
      let isVisual = this.isVisualSelected;
      if (pointer !== null) {
        p = pointer;
      } else {
        switch (isVisual) {
          case -1:
            p += '.' + key;
            break;
          case 1:
          case 0:
            p = fnc.findVarPath(key, this.currentProperties, this.currentPage, isVisual);
            break;
          default:
            console.log('error isVisual selected');
        }
      }

      // console.log(p);
      this.tabs.push({
        title: title,
        type: type,
        data: data,
        pointer: p,
        icon: icon,
      });
      // this.tabKeeper.push(
      //     this.currentProperties[key]
      // );
      // // show added tab
      // var self = this;
      $('.tab-content').removeClass('slide-fade-tab');
      // console.log();
      this.changeTab(parseInt(this.tabs.length) - 1);

      this.handleSly();
    },
    closeTab: function (i) {
      this.tabs.splice(i, 1);
      this.tabKeeper.splice(i, 1);
      var self = this;
      setTimeout(function () {
        self.changeTab(-1);
        self.handleSly();
      }, 100);
    },
    closeMultiTab: function (title) {
      for (const i in this.tabs) {
        let tab = this.tabs[i];
        if (tab.title.indexOf(title) !== -1) {
          this.tabs.splice(i, 1);
          this.tabKeeper.splice(i, 1);
          this.closeMultiTab(title);
          return;
        }
      }
      var self = this;
      setTimeout(function () {
        self.changeTab(-1);
        self.handleSly();
      }, 100);
    },
    openRecent: function (e) {
      window.api.send('open-project-direct', this.recents[e]);
    },
    openSite: function (e) {
      window.api.send("openWeb", e);
    },
    changeColor: function (clr) {
      this.currentProperties[this.onEditColorKey] = clr;
    },
    updateProject: function () {
      this.$parent.isSaved = false;
      this.$parent.title = this.data.project.name;
    },
    getStyleCamera: function () {
      let style = '';
      if (this.currentDisplay.camera === 'type1') {
        if (this.currentDisplay.cameraBorder === '') {
          style += 'left: calc( 50% - ' + (55 * this.display.scale / 2) + 'px);';
        } else if (this.currentDisplay.cameraBorder === 'cb1') {

          try {
            document.querySelector('#preview').style.marginTop = '-'+document.querySelector('#camera').clientHeight+'px';
          } catch {
            //
          }
          style += 'padding:' + (15 * this.display.scale) + 'px ' + (50 * this.display.scale) + 'px;';
          style += 'background-image: url("data:image/svg+xml,%3Csvg xmlns:dc=\'http://purl.org/dc/elements/1.1/\' xmlns:cc=\'http://creativecommons.org/ns%23\' xmlns:rdf=\'http://www.w3.org/1999/02/22-rdf-syntax-ns%23\' xmlns:svg=\'http://www.w3.org/2000/svg\' xmlns=\'http://www.w3.org/2000/svg\' xmlns:sodipodi=\'http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\' xmlns:inkscape=\'http://www.inkscape.org/namespaces/inkscape\' width=\'900\' height=\'700\' viewBox=\'0 0 238.12501 185.20834\' version=\'1.1\' id=\'svg8\' inkscape:version=\'0.92.4 (5da689c313, 2019-01-14)\' sodipodi:docname=\'ops.svg\'%3E%3Cdefs id=\'defs2\' /%3E%3Csodipodi:namedview id=\'base\' pagecolor=\'%23ffffff\' bordercolor=\'%23666666\' borderopacity=\'1.0\' inkscape:pageopacity=\'0.0\' inkscape:pageshadow=\'2\' inkscape:zoom=\'0.98994949\' inkscape:cx=\'227.62831\' inkscape:cy=\'512.07454\' inkscape:document-units=\'mm\' inkscape:current-layer=\'layer1\' showgrid=\'true\' units=\'px\' showguides=\'true\' inkscape:snap-object-midpoints=\'true\' inkscape:guide-bbox=\'true\' inkscape:window-width=\'1920\' inkscape:window-height=\'1053\' inkscape:window-x=\'0\' inkscape:window-y=\'27\' inkscape:window-maximized=\'1\'%3E%3Cinkscape:grid type=\'xygrid\' id=\'grid10\' /%3E%3Csodipodi:guide position=\'119.06251,124.35417\' orientation=\'1,0\' id=\'guide20\' inkscape:locked=\'false\' /%3E%3Csodipodi:guide position=\'47.625002,134.9375\' orientation=\'0,1\' id=\'guide27\' inkscape:locked=\'false\' /%3E%3Csodipodi:guide position=\'148.16667,42.333335\' orientation=\'0,1\' id=\'guide29\' inkscape:locked=\'false\' /%3E%3Csodipodi:guide position=\'222.25001,74.083336\' orientation=\'0,1\' id=\'guide31\' inkscape:locked=\'false\' /%3E%3Csodipodi:guide position=\'219.60418,177.27084\' orientation=\'0,1\' id=\'guide33\' inkscape:locked=\'false\' /%3E%3C/sodipodi:namedview%3E%3Cmetadata id=\'metadata5\'%3E%3Crdf:RDF%3E%3Ccc:Work rdf:about=\'\'%3E%3Cdc:format%3Eimage/svg+xml%3C/dc:format%3E%3Cdc:type rdf:resource=\'http://purl.org/dc/dcmitype/StillImage\' /%3E%3Cdc:title%3E%3C/dc:title%3E%3C/cc:Work%3E%3C/rdf:RDF%3E%3C/metadata%3E%3Cg inkscape:label=\'Layer 1\' inkscape:groupmode=\'layer\' id=\'layer1\' transform=\'translate(0,-111.79166)\'%3E%3Cpath style=\'stroke-width:0.26458332\' d=\'m 193.73276,160.85774 c -2.18912,19.13718 1.01825,44.44182 -5.40836,61.68709 -11.05357,29.66133 -36.44712,40.24465 -69.26189,40.24465 -32.99899,0 -59.517829,-11.35826 -71.420154,-39.86899 C 40.61695,206.09189 43.561232,180.78114 40.650489,161.39228 34.395833,119.72916 13.31255,112.11048 0.18887997,111.99371 -26.162771,111.75924 80.167658,111.5781 118.79524,111.5781 c 38.49521,0 145.52217,0.21356 119.18346,0.249 -13.24447,0.0178 -39.5412,7.90206 -44.24594,49.03064 z\' id=\'path24\' inkscape:connector-curvature=\'0\' sodipodi:nodetypes=\'sssssssss\' /%3E%3C/g%3E%3C/svg%3E");';
          style += 'border-radius: 0 0 45% 45% ;';
          style += ' width: '+(this.currentDisplay.width / 6 * this.display.scale )+'px;';
          if (this.display.landscape) {
            style += 'transform: rotateZ(-90deg) translate(0,-'+(this.display.scale * this.currentDisplay.height / 50 ) +'px);';
            style += 'top: ' + (((this.currentDisplay.width * this.display.scale) / 2) - (150 * this.display.scale / 2)) + 'px;';

          } else {
            style += 'top:0;';
            style += 'left: calc( 50% - ' + (150 * this.display.scale / 2) + 'px);';
          }

        } else if (this.currentDisplay.cameraBorder === 'cb2') {
          try {
          document.querySelector('#preview').style.marginTop = '-'+document.querySelector('#camera').clientHeight+'px';
          } catch {
            //
          }

          style += 'padding:15px 0;';
          style += 'background-image: url("data:image/svg+xml,%3Csvg width=\'318pt\' height=\'49pt\' viewBox=\'0 0 318 49\' version=\'1.1\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg id=\'%23000000ff\'%3E%3Cpath fill=\'%23000000\' opacity=\'1.00\' d=\' M 0.00 0.00 L 318.00 0.00 L 318.00 0.99 C 312.34 1.22 306.09 -0.07 300.94 2.86 C 296.42 6.26 297.46 12.66 296.39 17.58 C 295.49 26.07 289.85 33.35 282.78 37.80 C 277.49 41.05 271.15 41.93 265.05 42.03 C 194.70 41.97 124.35 42.01 54.00 42.01 C 46.41 41.92 38.67 42.57 31.22 40.76 C 20.50 37.91 12.36 27.89 11.12 16.96 C 10.46 12.55 10.65 7.74 8.24 3.81 C 5.93 2.01 2.75 2.12 0.00 1.49 L 0.00 0.00 Z\' /%3E%3C/g%3E%3C/svg%3E");';
          style += 'padding:' + (5 * this.display.scale) + 'px ' + (0 * this.display.scale) + 'px;';
          style += 'border-radius: 0 0 50% 50% ;';
          if (this.display.landscape) {
            style += 'transform: rotateZ(-90deg) translate(0,-'+(this.display.scale * this.currentDisplay.height /  6.3 ) +'px);';
            style += 'width:' + (this.currentDisplay.width * this.display.scale * .75) + 'px;';
            style += 'left:-' + (this.currentDisplay.width * this.display.scale * .35) + 'px;';
            style += 'top:' + (this.currentDisplay.width * this.display.scale * .45) + 'px;';
          } else {

            style += 'width:50%;';
            style += 'top:0;';
            style += 'left: 25%;';
            style += 'right: 25%;';
          }
        }
      }
      if (this.currentDisplay.camera === 'type2') {
        style += 'right: 20px;';
      }
      if (this.currentDisplay.camera === 'type3') {
        style += 'left: 20px;';
      }

      // console.log(style);
      return style;
    },
    getStyleCameraDevice: function () {
      let style = '';
      if (this.currentDisplay.borderLess) {
        style += 'display:inline-block;';
      } else {
        style += 'display:none;';
      }
      style += 'width:' + (55 * this.display.scale) + 'px;';
      style += 'height:' + (55 * this.display.scale) + 'px;';
      return style;
    },
    getStyleMobile: function () {
      let style = '';
      style += 'width:' + (this.display.landscape ? this.display.height : this.display.width) * this.display.scale + 'px;';
      style += 'height:' + (this.display.landscape ? this.display.width : this.display.height) * this.display.scale + 'px;';
      style += 'background-color:' + (this.data.project.isDark ? '#2e2e2e' : this.data.project.bgColor) + ';';
      style += 'color:' + (this.data.project.isDark ? 'white' : this.data.project.textColor) + ' !important';
      return style;
    },
    getStyleDir: function () {
      let style = '';
      style += 'direction:' + (this.data.project.isRTL ? 'rtl' : 'ltr') + ';';
      style += 'padding:' + this.calcPadding(this.data.pages[this.currentPage].padding, this.display.scale) + ';';
      if (this.data.pages[this.currentPage].align !== 'null') {
        style += 'text-align:' + this.data.pages[this.currentPage].align + ';';
      }
      return style;
    },
    getStyleSafeArea: function () {
      let style = '';
      style += 'height:' + (150 * this.display.scale) + 'px;';
      try {
        let app = this.data.pages[this.currentPage].children.visual[0];
        if (app !== undefined && app.type === 'appbar') {
          if (app.color !== 'null') {
            style += 'background-color: ' + this.color2web(app.color) + ';';
          } else {

            if (this.data.project.isDark === true) {
              style += 'background-color: gray;';
            } else {
              style += 'background-color: ' + this.color2web(this.data.project.appColor) + ';';
            }
          }
        }
      } catch (e) {
        console.log(e.message);
      }
      style += 'margin:' + fnc.calcPadding(this.data.pages[this.currentPage].padding, this.display.scale, true) + ';';

      return style;
    },
    TerminalShow: function () {
      this.showTerminalModal = true;
    },
    contextOpen: function (i, ev) {
      this.$refs.menu.open(ev);
      this.contextIndex = i;
      this.currentProperties = this.data.pages[this.currentPage].children.visual[this.contextIndex];
      if (i === -1) {
        this.$refs.menu.$el.classList.add('just-paste');
      } else {
        this.$refs.menu.$el.classList.remove('just-paste');
      }

    },
    contextTrigger: function (e) {
      switch (e) {
        case 'delete':
          this.removeVisual(this.contextIndex);
          break;
        case 'copy':
          this.contextClipBoard = JSON.stringify(this.data.pages[this.currentPage].children.visual[this.contextIndex]);
          break;
        case 'cut':
          this.contextClipBoard = JSON.stringify(this.data.pages[this.currentPage].children.visual[this.contextIndex]);
          this.data.pages[this.currentPage].children.visual.splice(this.contextIndex, 1);
          break;
        case 'paste':
          try {
            let json = JSON.parse(this.contextClipBoard);
            json.name = json.type + Math.floor(Math.random() * 10000);
            this.data.pages[this.currentPage].children.visual.push(json);
          } catch {
            //
          }
          break;
      }
    },
    modalOpen: function () {
      let $ = window.jQuery;
      $("#wrapper").addClass('blur');
    },
    modalClose: function () {
      let $ = window.jQuery;
      $("#wrapper").removeClass('blur');
    },
    changeDisplay: function () { // change device display size
      this.display.name = this.currentDisplay.name;
      this.display.width = this.currentDisplay.width;
      this.display.height = this.currentDisplay.height;
    },
    changeScale: function (e) { // change device display scale
      this.display.scale = e;
    },
    changeRotate: function (e) { // rotate device
      this.display.landscape = e;
    },
    newPage: function () { // create new page to page
      this.data.pages.push(fnc.clone(window.defaults.page));
      let j = 0;
      let nextName = false;
      // check name of page to bypass duplicate page name
      do {
        var currrentName = 'page' + (this.data.pages.length + j).toString();
        nextName = false;
        for (const page of this.data.pages) {
          if (page.name === currrentName) {
            j++;
            nextName = true;
          }
        }
      } while (nextName);
      // change page name after choose non-duplicated name
      this.data.pages[this.data.pages.length - 1].name = currrentName;
      // show new page
      this.changePage(this.data.pages.length - 1);
    },
    changePage: function (i) { // view clicked page
      this.currentPage = i;
      this.isVisualSelected = -1;
      this.currentProperties = this.data.pages[i];
      this.contextIndex = -1;
      var that = this;
      Sortable.create(document.querySelector('#sortable'), {
        animation: 200,
        onUpdate: function (e) {
          that.$parent.isInternalDrag = false;
          var array = JSON.parse(JSON.stringify(that.data.pages[that.currentPage].children.visual));
          that.data.pages[that.currentPage].children.visual = [];
          fnc.arrayMove(array, e.oldIndex, e.newIndex);
          setTimeout(function () {
            that.data.pages[that.currentPage].children.visual = array;
          }, 11);
        },
      });
      // console.log(this.currentProperties);
    },
    removePage: function (i) { // remove page form project
      var self = this;
      // confirm before remove
      window.alertify.confirm('Are you sure to element page?', 'Remove confirm', function () {
            self.data.pages.splice(i, 1);
            self.changePage(0);
            window.alertify.success('element removed');
            setTimeout(function () {
              fnc.takeScreenShot("#preview", function (e) {
                self.data.pages[self.currentPage].image = e;
                self.$forceUpdate();
              });
            }, 300);
          }
          , function () {
            window.alertify.error('Cancel')
          });
    },
    visualValidator: function (component, visuals) {
      var self = this;
      if (component.type === 'appbar' || component.type === 'nav') {
        // check non duplicate app bar and nav
        for (const comp of visuals) {
          if (comp.type === 'appbar' && component.type === 'appbar') {
            window.alertify.warning("You can't drop two AppBar in page");
            return false;
          } else if (comp.type === 'nav' && component.type === 'nav') {
            window.alertify.warning("You can't drop two Nav in page");
            return false;
          }
        }
        // add appbar
        if (component.type === 'appbar') {
          visuals.unshift(fnc.clone(component));
          return true;
        }
      }
      // add component
      visuals.push(fnc.clone(component));
      // choose name
      // check not duplicate name add number to name
      let names = [];
      for (const comp of visuals) {
        names.push(comp.name);
      }
      let i = 0;
      let nextName = false;
      do {
        nextName = false;
        i++;
        if (names.indexOf(component.type + i.toString()) > -1) {
          nextName = true;
        }
      } while (nextName);
      visuals[visuals.length - 1].name = component.type + i.toString();
      // update page preview
      setTimeout(function () {
        fnc.takeScreenShot("#preview", function (e) {
          self.data.pages[self.currentPage].image = e;
        });
      }, 1000);
      return true;
    },
    nonVisualValidator: function (component, nonVisuals) {
      if (component.type === 'menu') {
        // check non duplicate app bar and nav
        for (const comp of nonVisuals) {
          if (comp.type === 'menu' && component.type === 'menu') {
            window.alertify.warning("You can't drop two Menu in page");
            return false;
          }
        }
        if (component.type === 'menu') {
          nonVisuals.unshift(fnc.clone(component));
          return true;
        }
      }
      // add component
      nonVisuals.push(fnc.clone(component));
      // choose name
      // check not duplicate name add number to name
      let names = [];
      for (const comp of nonVisuals) {
        names.push(comp.name);
      }
      let i = 0;
      let nextName = false;
      do {
        nextName = false;
        i++;
        if (names.indexOf(component.type + i.toString()) > -1) {
          nextName = true;
        }
      } while (nextName);
      nonVisuals[nonVisuals.length - 1].name = component.type + i.toString();

      return true;
    },
    onVisualDrop(event) {
      // on add a viusal component to page
      // this.evenDropped.push(event.data);
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
          this.visualValidator(properties, this.data.pages[this.currentPage].children.visual);
          // ***!*** need sort and rename here
        }
      } catch (e) {
        console.log(e.message);
        window.alertify.warning('unknown error on load component');
      }

    },
    onNonVisualDrop(event) {
      // this.oddDropped.push(event.data);
      // find component
      let component = window.components[event.data];
      // load default value
      let properties = eval(component.data);
      if (properties === undefined) {
        window.alertify.warning('Invalid component', 15);
      } else {
        // when loaded add to page with validate
        this.nonVisualValidator(properties, this.data.pages[this.currentPage].children.nonvisual);
        // ***!*** need sort and rename here
      }
    },
    removeVisual(n) { // remove visual component from page
      var self = this;
      window.alertify.confirm(`Are you sure to remove this component
      "${this.data.pages[this.currentPage].children.visual[n].name}" ?`,
          'Remove confirm', function () {
            self.data.pages[self.currentPage].children.visual.splice(n, 1);
          }
          , function () {
            // window.alertify.error('Cancel')
          });
    },
    removeNonVisual(n) { // remove visual component from page
      var self = this;
      window.alertify.confirm(`Are you sure to remove this component
      "${this.data.pages[this.currentPage].children.nonvisual[n].name}" ?`,
          'Remove confirm', function () {
            self.data.pages[self.currentPage].children.nonvisual.splice(n, 1);
          }
          , function () {
            // window.alertify.error('Cancel')
          });
    },
    isVisual: function (n) { // check is visual component or not
      return window.components[n].visual;
    },
    calcPadding: fnc.calcPadding,
    color2web: fnc.color2web,
  },
  computed: {
    // check is init project or not
    isInitProject: function () {
      return window.appData.project.name !== '';
    }
  }
}
</script>

<style scoped>

#safearea {
  opacity: 0.5;
}

#side {
  background: #20252b;
  width: 25%;
  position: fixed;
  right: 0;
  top: 69px;
  bottom: 0;
  min-height: calc(100vh - 65px);
  box-sizing: border-box;
  border-left: 1px solid rgba(0, 0, 0, .1);
  border-top: 1px solid rgba(0, 0, 0, .1);
  transition: 900ms;
  z-index: 999;
}

#recent {
  text-align: start;
  padding: 2rem;
  padding-bottom: 0;
}

#recent li {
  background: rgba(0, 0, 0, 0.1);
  padding: 2px;
  margin-bottom: 2px;
  color: yellowgreen;
  transition: 300ms;
  cursor: pointer;
}

#recent li:hover {
  color: yellow;
  transform: scaleX(1.05);
  box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.3);
}

#recent li span {
  color: gray;
}

#side.collapse {
  width: 15px;
  opacity: 0.001;
}

#side.collapse:hover {
  width: 25%;
  border-left: 2px;
  opacity: 1;
}

#side #components {
  height: 50%;
  overflow-y: scroll;
  font-weight: 100;
}

#properties {
  height: 50%;
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
  margin-bottom: 20vh;
  padding-top: 55px;
}

#main.page-collapse {
  margin-bottom: 0;
}

#main.side-collapse {
  width: 100%;
}


#camera {
  position: sticky;
  top: 15px;
  z-index: 9;
  text-align: center;
  background-size: 100% auto;
  background-repeat: no-repeat;
}

#camera span {
  display: inline-block;
  width: 20px;
  height: 20px;
  background: black;
  border-radius: 50%;
  border: 2px solid black;
  background: radial-gradient(circle, rgba(2, 0, 36, 1) 0%, rgba(54, 54, 78, 1) 24%, rgba(26, 25, 56, 1) 30%, rgba(60, 60, 84, 1) 48%, rgba(30, 30, 42, 1) 67%, rgba(91, 91, 106, 1) 74%, rgba(0, 0, 0, 1) 100%);
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
  overflow-y: scroll;
  overflow-x: hidden;
  z-index: 998;
  transition: 900ms;
}

.side-collapse #pages {
  right: 0;
}

#pages.collapse {
  height: 5px;
}

#pages.collapse .logo-sm {
  display: none;
}

#pages.collapse:hover {
  height: 20vh;
}

#pages.collapse:hover .logo-sm {
  display: block;
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
  z-index: 999;
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

#terminal-btn {
  position: fixed;
  left: 0;
  bottom: 0;
  padding: 5px;
  background: #272c34;
  border: 1px solid black;
  opacity: .35;
  cursor: pointer;
  -o-transition: .3s;
  -ms-transition: .3s;
  -moz-transition: .3s;
  -webkit-transition: .3s;
  transition: .3s;
  z-index: 9999;
}

#terminal-btn:hover {
  opacity: 1;
}

#mobile{
  position: relative;
}

#dir {
  position: relative;
}

.logo {
  height: 30vh;
  animation: fliper 15s infinite;
}

.page-collapse .logo {
  margin-top: calc(50vh - 30vh);
}

.logo-sm {
  height: 128px;
  padding-top: 10px;
  opacity: .3;
  position: absolute;
  top: calc(50% - 65px);
  left: calc(50% - 40px);
}

.modal-close {
  font-size: 30px;
  color: red;
  margin-left: 20px;
  margin-top: 10px;
}

#preloader {
  position: fixed;
  top: 30vh;
  bottom: 30vh;
  left: 25%;
  right: 25%;
  z-index: 99999;
  background: rgba(0, 0, 0, .6);
  color: white;
  display: flex;
  text-align: center;
  align-items: center;
  border-radius: 15px;
  padding: 25px;
  display: none;
}

#preloader .fa {
  font-size: 90px;
  display: block;
  margin: auto;
}

#mobile-error{
  display: flex;
  font-size: 25px;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 95vh;
}

#mobile-error .fa{
  font-size: 75px;
  display: block;
}

.welcome {
  margin: 2rem auto;
}

</style>