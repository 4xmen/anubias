<template>
  <div id="device-container">
    <!--    {{ device.width }}x{{ device.height }}-->
    <!--    {{ device.cameraBorder }}-->

    <div id="device" :style="deviceStyle">


      <svg id="device-holder"
           xmlns="http://www.w3.org/2000/svg"
           :width="holderWidth"
           :height="holderHeight"
           :viewBox="holderViewBox">
        <rect
            :x="rectX" y="3"
            :width="rectWith" height="615"
            rx="8%" stroke="#000"
            stroke-width="5px"
            fill="none"/>
      </svg>
      <svg xmlns="http://www.w3.org/2000/svg"
           id="front-camera"
           :style="frontCameraStyle"
           :width="this.device.width"
           :height="borderLessCameraHeight"
           viewBox="0 0 291.042 26.458">
        <path
            v-if="device.cameraBorder === 'cb1'"
            style="fill:#000;fill-opacity:1;fill-rule:nonzero;stroke:#00000f;stroke-width:.264583;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:57.1465"
            d="M166.688 1.852c.515 1.792-5.292 1.323-6.68 7.996-.848 4.076-2.564 8.021-6.11 10.518a14.552 14.552 0 0 1-16.88-.09c-3.486-2.51-5.146-6.427-5.987-10.461-1.385-6.64-7.224-6.136-6.677-7.963h21.167z"/>
        <path
            v-if="device.cameraBorder === 'cb2'"
            style="fill:#000;fill-opacity:1;fill-rule:nonzero;stroke:#00000f;stroke-width:5.29167;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:57.1465"
            d="M63.5 3.175h164.042c9.26 0 7.937-.53 7.937 7.938a7.92 7.92 0 0 1-7.937 7.937H63.5a7.92 7.92 0 0 1-7.938-7.938c0-8.466-1.322-7.937 7.938-7.937z"/>
        <rect
            v-if="device.cameraBorder === 'cb2'"
            style="fill:#fff;fill-opacity:1;fill-rule:nonzero;stroke:#00000f;stroke-width:0;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:57.1465"
            width="74.083" height="4.233" x="108.479" y="-14.288" transform="scale(1 -1)" ry="2.117"/>
        />
        <path
            v-if="device.cameraBorder === 'cb3'"
            style="fill:#000;fill-opacity:1;fill-rule:nonzero;stroke:#00000f;stroke-width:4.45706;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:57.1465"
            d="M90.26 2.337h110.563c6.242 0 5.35-.557 5.35 8.355 0 4.628-2.386 8.355-5.35 8.355H90.26c-2.964 0-5.35-3.727-5.35-8.355 0-8.912-.891-8.355 5.35-8.355z"/>
        <rect
            v-if="device.cameraBorder === 'cb3'"
            style="fill:#fff;fill-opacity:1;fill-rule:nonzero;stroke:#00000f;stroke-width:0;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:57.1465"
            width="74.083" height="4.233" x="108.479" y="-13.758" transform="scale(1 -1)" ry="2.117" rx="2.117"/>
        <rect
            v-if="device.cameraBorder === 'cb4'"
            style="fill:#000;stroke:#00000f;stroke-width:5.29167;stroke-dashoffset:57.1465" width="74.083"
            height="12.347" x="108.479" y="11.758" rx="5.292" ry="11.465"/>
        <circle
            v-if="device.cameraBorder === 'cbc'"
            style="fill:#000000;stroke:#00000f;stroke-width:5.29167;stroke-dashoffset:57.1465"
            cx="145.48079"
            cy="18.258026"
            r="5.4284501"/>
        <circle
            v-if="device.cameraBorder === 'cbr'"
            style="fill:#000000;stroke:#00000f;stroke-width:5.29167;
            stroke-dashoffset:57.1465;"
            cy="18.258026"
            cx="90%"
            r="5.4284501"/>
        <circle
            v-if="device.cameraBorder === 'cbl'"
            style="fill:#000000;stroke:#00000f;stroke-width:5.29167;stroke-dashoffset:57.1465"
            cx="10%"
            cy="18.258026"
            r="5.4284501"/>
      </svg>
      <div id="scroller">
        <div id="component-holder" :style="componentHolderStyle">
          <!--    c is component  in v-for  -->
          <template  v-if="pages.currentPage.children !== undefined" v-for="(c,componentIndex) in pages.currentPage.children.visual" :key="componentIndex">
            <div class="component" v-if="c.type === 'preloader'" @click="setOnEditComponent(c)">
              <anubias-preloader :properties="c"></anubias-preloader>
            </div>
            <template v-else-if="c.type === 'appbar'">
            </template>
            <template v-else>
              {{c.type}}
            </template>
          </template>
        </div>
        <div id="components-area" :style="componentsAreaStyle">
          <droppable id="drop-area" area="visual" :dropping="dropped">
            Drop visual components here...
          </droppable>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapState} from "vuex";
import droppable from "./droppable.vue";

// anubias component to make falutter
import anubiasPreloader from "./anubias/anubiasPreloader.vue";

export default {
  name: "device",
  components: {
    droppable,
    anubiasPreloader,
  },
  data: () => {
    return {
      zooms: [.25, 1.25, 1, .75, .50],
      holderWidth: 290,
      holderHeight: 620,

      holderViewBox: '0 0 290 620',
      defRectWith: 286,
      rectWith: 286,
      rectX: 3,
      defRatio: 2.137931034,
    };
  },
  computed: {
    ...mapState(['ide']),
    ...mapState('ide',{
      pages: 'pages'
    }),
    ...mapState('project',{
      project: 'project'
    }),
    ...mapState('ide', ['defaultComponents']),
    ...mapGetters(
        'ide', ['currentPage', 'activePageIndex']
    ),
    componentsAreaStyle() {

      let style = '';
      // if landscape
      if (this.isLandscape) {
        if (!this.device.borderLess) {
          style += `border-left: ${this.device.height / 15}px solid black;
        border-right: ${this.device.height / 15}px solid black;
        margin-right:-3px`;
        }
      } else {
        // otherwise add bordr top and bottom
        if (!this.device.borderLess) {
          style += `border-top: ${this.device.height / 15}px solid black;
        border-bottom: ${this.device.height / 15}px solid black;
        margin-top:-3px`;
        }
      }

      return style;
    },
    frontCameraStyle() {
      let style = '';
      if (this.device.height < 2000) {
        style += 'top: -' + (Math.abs(Math.ceil((2000 - this.deviceWidth) / 400))) * 0.5 + '%;'
        console.log(style);
      }
      if (this.isLandscape) {
        style += 'transform: rotateZ(-90deg);';
        style += 'transform-origin: 100% 50%;';
        style += 'top:-4.5%;';
        style += 'left:-44.5%;';
        style += 'right:auto;';


      }

      return style;
    },
    isLandscape() {
      return this.orient === 1;
    },
    deviceHeight() {
      // console.log(this.device.height, this.device.width);
      if (this.isLandscape) {
        return parseInt(this.device.width);
      }
      return this.device.height;
    },
    deviceWidth() {
      if (this.isLandscape) {
        return parseInt(this.device.height);
      }
      return this.device.width;
    },
    deviceStyle() {

      let ratio = this.zooms[this.zoom];
      let style = '';
      const deviceRatio = (this.deviceHeight / this.deviceWidth);
      style += 'height:' + (this.deviceHeight) + 'px;';
      style += 'width:' + (this.deviceWidth) + 'px;';
      style += 'transform: scale(' + (ratio) + ');';
      style += 'border-radius: ' + (deviceRatio * 2) + '%;'
      style += 'margin-bottom: -' + this.deviceHeight * (1 - ratio) + 'px;';
      style += 'margin-left: -' + ((this.deviceWidth * (1 - ratio)) / 2) + 'px;';
      style += 'margin-right: -' + ((this.deviceWidth * (1 - ratio)) / 2) + 'px;';
      if (!this.project.isDark){
        style += 'color: black;';
      }else{
        style += 'background: #2e2e2e;';
      }
      if (!this.project.isRTL){
        style += 'direction: rtl;';
      }
      this.resizeSvg();
      return style;
    },
    componentHolderStyle(){
      const deviceRatio = (this.deviceHeight / this.deviceWidth);
      let style = '';
      style += 'border-radius: ' + (deviceRatio * 2) + '%;'
    },
    borderLessCameraHeight() {
      let n = this.device.width / this.ide.devices[0].width;
      return 100 + Math.round(n * 23);
    },
    zoom() {
      return this.ide.device.zoom;
    },
    orient() {
      return this.ide.device.orient;
    },
    device() {
      return this.ide.devices[this.ide.device.active];
    }
  },
  methods: {
    test(){
      console.log('test');
    },
    setOnEditComponent(component){
      this.$store.dispatch('setOnEditComponent',component);
    },
    resizeSvg() {
      // new device ratio
      const deviceRatio = (this.deviceHeight / this.deviceWidth)
      // add border to holder width
      this.holderWidth = this.deviceWidth + 40;
      // add border to holder height
      this.holderHeight = this.deviceHeight + 40;
      // new rect size
      this.rectWith = this.defRectWith * this.defRatio / deviceRatio;
      // new rect x
      this.rectX = ((this.defRectWith - this.rectWith) / 2) + 2;
      // this.holderViewBox = `0 0 ${originalWidth} ${originalWidth * scaleFactor + 40}`;

    },
    dropped(data) {
      // check is valid area or not
      if ('visual' === data.area) {
        // add component to active page
        this.$store.dispatch('project/addComponentToPage', {
          pageIndex: this.activePageIndex,
          isVisual: true,
          component: this.defaultComponents[data.name]
        });
      } else {
        console.log('invalid area');
      }
    }
  },
}
</script>

<style scoped>

#device-container {
  width: 100%;
  height: 100%;
  overflow: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 20px;
  padding-bottom: 20px;
}

#device {
  background: #fff;
  transform-origin: center top;
  margin: 0 auto;
  position: relative;
}

#device:hover #front-camera{
  pointer-events: none;
  opacity: .5;
}

#device-holder {
  z-index: 1;
  position: absolute;
  left: -20px;
  top: -1%;
  right: -20px;
  bottom: -1%;
  height: 102%;
  width: calc(100% + 40px);
}


#components-area {
  position: relative;
  z-index: 1;
  overflow: hidden;
  overflow-y: auto;
  border-radius: inherit;
  min-height: 101%;
}


#drop-area {
  min-height: 15rem;
  background: rgba(192, 192, 192, 0.35);
  margin: 1rem 3rem;
  border: 3px dashed gray;
  display: flex;
  color: black;
  font-size: 45px;
  align-items: center;
  justify-content: center;
  border-radius: 35px;
  font-weight: 200;
}

#drop-area:hover {
  background: rgba(192, 192, 192, 0.85);
}

#front-camera {
  position: absolute;
  top: -.95%;
  left: 0;
  right: 0;
  z-index: 9;
}

#component-holder{
  overflow: hidden;
  padding-bottom: 50px;
  margin: 0 .5rem;
  z-index: 1;
  position: relative;
  border-radius: 4rem;
}
#component-holder .component{
  transition: var(--transition-duration);
  border: 1px dashed transparent ;
}
#component-holder .component:hover{
  border-color: #77777766;
  background: linear-gradient(90deg, #77777700 0%, #77777733  25%, #77777733 75%, #77777700 100%);
}

#scroller{
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>