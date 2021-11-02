<!--load project and verify project page-->
<template>
  <div class="container">
    <titlec>
      Run emulator
    </titlec>
    <h4 v-if="isWait">
      Wait to scan emulators...
      <i class="fa fa-search left"></i>
      <i class="fa fa-spinner fa-spin right"></i>
    </h4>
    <h4 v-else-if="msg != ''">
      <i class="fa fa-sad-cry"></i>
      {{msg}}
    </h4>
    <h5>
      Select emulator to start:
      <br>
      <br>
    </h5>
    <div class="btn btn-block btn-flat  waves-effect" v-for="(emu,k) in emulators"
         :key="k" @click="start(emu)">
      {{emu.split("_").join(' ')}}
    </div>
    <div class="btn btn-block btn-flat  waves-effect" @click="checkFlutter">
      Flutter check
    </div>
    <div class="btn btn-block btn-flat  waves-effect" @click="checkEngine">
      Anubias Engine check
    </div>
    <br>
    <blockquote class="pre">
      <span v-for="(msg,i) in terminal" :key="i" :class="msg.err?'red-text':''">{{msg.data}}</span>
    </blockquote>
    <div class="btn btn-block btn-flat  waves-effect" style="border-bottom-color: darkred" @click="terminal = []">
      Clear log
    </div>
  </div>
</template>

<script>
import  titlec from '../elements/TitleElement';
import {fnc} from '@/assets/js/functions';
export default {
  components:{
    titlec
  },
  name: "EmulatorPage",
  data:function () {
    return{
      isWait : true,
      emulators:[],
      msg:'',
      terminal: [],
    }
  },

  methods:{
    start:function (e) {
        window.api.send("emulator", 'emulator -avd '+e);
    },
    checkFlutter:function () {
        this.terminal.push('______________________________________________________________________\n');
        window.api.send("emulator", 'flutter doctor');
    },
    checkEngine:function () {
        this.terminal.push('______________________________________________________________________\n');
      // console.log("emulator", './'+this.engineName())
      if( fnc.getOS() == 'Windows' ){
        window.api.send("emulator", '.\\'+this.engineName());
      }else{
        window.api.send("emulator", './'+this.engineName());
      }
    },
    engineName: function () {
      switch (fnc.getOS()) {
        case "Linux":
          return 'anubias-engine';
        case "Windows":
          return  'anubias-engine.exe';
        case "Osx":
          return 'anubias-engine-osx';
        default:
          return 'anubias-engine';
      }
    },
  },
  mounted() {
    var self = this;
    window.api.send("emulator", 'emulator -list-avds');
    window.api.receive("emulator-terminal", (data) => {
      self.terminal.push(data);
    });
    window.api.receive("emulator", (data) => {
      self.isWait = false;
      if (data === false){
        self.msg = 'Ops emulator not found...';
      }else{
        self.emulators = data.trim().split('\n');
      }
      // console.log(emulators);
    });
  }
}
</script>

<style scoped>
blockquote{
  margin: 20px 0;
  padding: 1em;
  padding-left: 1.5rem;
  border-left: 5px solid #00c853;
  /* Just change the color value and that's it*/
}
.btn{
  margin-bottom: 1em;
  color: white;
  border-bottom: 1px solid #444;
  display: block;
}
</style>