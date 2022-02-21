<template>
  <div id="tie">
    <canvas id="canvas"></canvas>
    <h5>
      {{ data.title }}
    </h5>
    <div class="grid">
      <div v-for="(component,e) in components" :key="e">
        <div class="live">
          <h2>
            {{ component.name }}
          </h2>
          <ul>
            <li v-for="(prop,i) in findTieInfo(component)" :key="i" @click="selecting" :data-id="component.name+'.'+i"
                :data-json="JSON.stringify(prop)" :data-type="prop.type" :class="prop.status +' '+ prop.type">
              {{ i }}
              <i class="fa fa-arrow-right"></i>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div v-for="(tie,i) in ties" class="tie" :key="i">
      <div>
        <i class="fa fa-times" @click="remTie(i)"></i>
        {{ tie.src }}
        <i class="fa fa-right-long"></i>
        {{ tie.dst }}
        <label v-for="(ev,j) in tie.events" :key="j">
          <input type="checkbox" @change="fixCheck(i,j,$event)" :checked="ev" value="1"/>
          <span>
            {{ j }}
          </span>
        </label>
      </div>
    </div>
  </div>
</template>

<script>

let $;
let canvas;
let ctx;

export default {
  name: "liveTie",
  data: function () {
    return {
      components: [],
      selectedType: '',
      selected: {},
      selectedID: '',
      startSelect: false,
      ties: window.appData.pages[this.data.pageIndex].tie,
    }
  },
  mounted() {
    let self = this;
    setTimeout(function () {
      self.components = self.data.components;
      canvas = document.getElementById('canvas');
      ctx = canvas.getContext('2d');
    }, 100);
    setTimeout(function () {
      self.drawLines();
    },1000);
    // setTimeout(function () {
    //   $(canvas).attr('width', $("#canvas").width());
    //   $(canvas).attr('height', $("#canvas").height());
    //   self.drawline(250, 250, 600, 400);
    //   self.drawline(250, 250, 250, 600);
    // },1000);
    $ = window.jQuery;
  },
  watch:{
    ties: {
      handler: function () {
        // this.$parent.updateProject();
        this.drawLines();
      },
      deep: true,
    },
  },
  methods: {
    drawLines: function () {
      document.getElementById('canvas').setAttribute('width',$("#canvas").width());
      document.getElementById('canvas').setAttribute('height',$("#canvas").height());
      ctx.width = $("#canvas").width();
      ctx.height = $("#canvas").height();

      for( const tie of this.ties) {
        let x1 = $('[data-id="'+tie.src+'"]').offset().left;
        let y1 = $('[data-id="'+tie.src+'"]').offset().top;
        let x2 = $('[data-id="'+tie.dst+'"]').offset().left;
        let y2 = $('[data-id="'+tie.dst+'"]').offset().top;
        this.drawline(x1 + 200, y1 + 15, x2, y2 +15);
      }
    },
    fixCheck: function (i, j, e) {
      this.ties[i].events[j] = e.target.checked;
      // c = e.target.checked;
    },
    // draw:function () {
    //   console.log('drawline');
    //   // this.drawline(120,120,120,400);
    // },
    drawline: function (x1, y1, x2, y2) {

      if (x1> x2){
        x2 += 200;
      }

      const curveAngle = 75;
      // Control points
      // ctx.width = $("#canvas").width();
      // ctx.height = $("#canvas").height();
      ctx.fillStyle = 'green';
      ctx.beginPath();
      ctx.arc(x1, y1, 5, 0, 2 * Math.PI);  // Control point one
      ctx.arc(x2, y2, 5, 0, 2 * Math.PI);  // Control point two
      ctx.fill();


      ctx.beginPath();
      ctx.strokeStyle = 'lime';
      ctx.moveTo(x1, y1);
      ctx.bezierCurveTo(x1 + curveAngle, y1 + curveAngle, x2 + curveAngle, y2 - curveAngle, x2, y2);
      ctx.stroke();
    },
    selecting: function (e) {
      console.log(JSON.parse(e.target.getAttribute('data-json')));
      // check if selected start or not
      if (this.startSelect) {
        let currentProp = JSON.parse(e.target.getAttribute('data-json'));
        // check infinity loop
        let currentID = e.target.getAttribute('data-id');
        if (this.selectedID == currentID) {
          window.alertify.warning("You can't live tie to itself. (infinity loop)");
          return false;
        }
        // check type
        if (this.selected.type != currentProp.type) {
          window.alertify.warning('Type of them not same');
          return false;
        }


        let events = {};
        let inpName = this.selectedID.split('.')[0];


        // duplicare assign
        for (const tie of this.ties) {
          if (tie.name == inpName) {
            window.alertify.warning("Can't duplicate assign.");
            this.resetSel();
            return false;
          }
        }


        // prepare events
        for (const ev of this.selected.events) {
          events[ev] = false;
        }


        this.ties.push({
          name: inpName,
          src: this.selectedID,
          dst: currentID,
          code: currentID + ' = ' + this.selectedID + ';',
          events: events,
        });

        this.resetSel();


      } else {
        // check if output start
        if (e.target.classList.contains('output')) {
          // add export
          e.target.classList.add('export');
          // set start select
          this.startSelect = true;
          // find active type
          let activeType = e.target.getAttribute('data-type');
          // save selected
          this.selected = JSON.parse(e.target.getAttribute('data-json'));
          this.selectedID = e.target.getAttribute('data-id');
          // add export id
          e.target.setAttribute('id', 'exp');
          // show nor selected
          $('#tie li').addClass('no-entry');
          // active import type same as selected
          $('#tie .' + activeType).addClass('import');
        }

      }

    },
    remTie: function (i) {
      this.ties.splice(i, 1);
    },
    resetSel: function () {
      $("#exp").removeAttr('id').removeClass('export');
      $(".import").removeClass('import');
      this.selectedID = '';
      this.selected = {};
      this.selectedType = '';
    },
    calcTop: function (i) {
      let top = 125;
      if (i == 0) {
        return top;
      }
      let w = document.querySelector('#tie').clientWidth - 300;
      top = (Math.floor((250 * i) / w) * 400) + top;
      return top;
    },
    findTieInfo: function (component) {
      let tieProps = window.liveTie;
      for (const props in tieProps) {
        if (component.type === props) {
          return tieProps[props];
        }
      }

    },
  },
  props: ['data']
}
</script>

<style scoped>
#tie {
  padding: 85px 25px;
  background: rgba(0, 0, 0, .3);
}

#canvas {
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.grid {
  /*display: grid;*/
  /*grid-template-columns: repeat(3, 1fr);*/
  /*grid-auto-rows: minmax(min-content, max-content);*/

  -moz-column-count: 2;
  -webkit-column-count: 2;
  column-count: 2;
  -moz-column-gap: 10px;
  -webkit-column-gap: 10px;
  column-gap: 10px;
  position: relative;
  z-index: 9;
}

.grid > div {
  padding-top: 1em;
}

/*-900px width*/
@media ( max-width: 900px ) {
  /*.grid{*/
  /*  -moz-column-count: 2;*/
  /*  -webkit-column-count: 2;*/
  /*  column-count: 2;*/
  /*  -moz-column-gap: 10px;*/
  /*  -webkit-column-gap: 10px;*/
  /*  column-gap: 10px;*/
  /*}*/
}

.live {
  border: 1px dashed white;
  width: 200px;
  border-left: 3px solid yellowgreen;
  background: #202539;
  top: 125px;
  overflow: hidden;
  display: inline-block;
  opacity: .75;
  transition: 300ms;
}

.live:hover {
  opacity: 1;
}

.live h2 {
  font-size: 14px;
  border-bottom: 1px solid #7aaf00aa;
  padding: 1em 4px;
  text-align: center;
  font-weight: 800;
  margin-bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: yellow;
}

.live h2:before {
  content: 'name: ';
  margin-right: 15px;
  color: #777;
  font-weight: 100;
  float: left;
}

.live ul {
  padding: 0;
  margin: 0;
}

.live ul li {
  padding: 3px;
  border-bottom: 1px dashed #eee;
  padding-left: 20px;
  transition: 300ms;
}

.output {
  background: rebeccapurple;
  cursor: pointer;
}

.output:after {

}

.output:hover {
  background: yellowgreen;
  color: darkred;
}

.tie {
  padding: 7px 15px;
  background: rgba(0, 0, 0, 0.2);
  margin-top: 7px;
}

.tie .fa-right-long {
  margin: 0 15px;
  color: yellow;
}

.tie .fa-times {
  color: red;
  font-weight: 900;
  font-size: 20px;
  margin-right: 25px;
  position: relative;
  top: 2px;
  cursor: pointer;
}

.tie label {
  border: 1px solid gray;
  padding: 4px 15px;
  margin-left: 15px;
  margin-top: -6px;
  float: right;
}

.tie label span:after {
  margin-top: 2px;
}

</style>
