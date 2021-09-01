<template>
  <div class="container">
    <titlec>
      Anubias Setting
    </titlec>

    <div id="settings">

      <div>
        <input type="search" v-model="q" class="input-field" placeholder="Search..." @keyup="search"/>
      </div>

      <div class="collection-item">
        <div>
          <i class="fa fa-tachometer-alt ico"></i>
          <b>
            Performance mode
          </b>
          <div class="secondary-content">
            <div class="switch">
              <label>
                <input type="checkbox" v-model="setting.performanceMode">
                <span class="lever"></span>
              </label>
            </div>
          </div>
          <span>
            Performance mode should improve IDE performance, By the way the page preview refresh reducing
          </span>
        </div>
      </div>
      <div class="collection-item">
        <div>
          <i class="fa fa-screwdriver ico"></i>
          <b>
            Path fix
          </b>
          <div class="secondary-content">
            <div class="switch">
              <label>
                <input type="checkbox" v-model="setting.pathFix">
                <span class="lever"></span>
              </label>
            </div>
          </div>
          <span>
            It can fix your problem to find flutter <span class="yellow-text">( only OSX or Linux )</span>
          </span>
        </div>
      </div>
      <div class="collection-item">
        <div>
          <i class="fa fa-door-closed ico"></i>
          <b>
            Exit confirm
          </b>
          <div class="secondary-content">
            <div class="switch">
              <label>
                <input type="checkbox" v-model="setting.exitConfirm">
                <span class="lever"></span>
              </label>
            </div>
          </div>
          <span>
            Exit IDE without save confirm <span class="yellow-text">(Not recommended)</span>
          </span>
        </div>
      </div>
      <div class="collection-item">
        <div>
          <i class="fa fa-laptop-code ico"></i>
          <b>
            Custom environment path
          </b>
          <div class="secondary-content">
            <input type="text" class="input-field"  v-model="setting.env"  placeholder="exm: /usr/bin:/usr/lib"/>
          </div>
          <span>
            You can add your environment path here, Split with <span class="yellow-text">:</span>
          </span>
        </div>
      </div>
      <div class="collection-item">
        <div class="secondary-content">
          <div class="switch">
            <label>
              <input type="checkbox" v-model="setting.pages">
              <span class="lever"></span>
            </label>
          </div>
        </div>
        <div>
          <i class="fa fa-copy ico"></i>
          <b>
            Pages control panel pin
          </b>
          <span>
            You can choose page control view type here (active is pinned)
          </span>
        </div>
      </div>
      <div class="collection-item">
        <div class="secondary-content">
          <div class="switch">
            <label>
              <input type="checkbox" v-model="setting.sidebar">
              <span class="lever"></span>
            </label>
          </div>
        </div>
        <div>
          <i class="fa fa-indent ico"></i>
          <b>
            Sidebar panel pin
          </b>
          <span>
            You can choose sidebar view type here (active is pinned)
          </span>
        </div>
      </div>
      <div class="collection-item">
        <div class="secondary-content">
          <input type="text" class="input-field"  v-model="setting.fontSize"  placeholder="font-size"/>
        </div>
        <div>
          <i class="fa fa-code ico"></i>
          <b>
            Code style
          </b>
          <span>
            You can change ide code here, font-size and code style
          </span>
          <div class="clearfix"></div>
          <div :class="'code-style' + (setting.codeStyle === 'vs-dark'?' active':'') " @click="changeTheme('vs-dark')"></div>
          <div :class="'code-style cs2' + (setting.codeStyle === 'hc-black'?' active':'') " @click="changeTheme('hc-black')"></div>
          <div :class="'code-style cs3' + (setting.codeStyle === 'vs-light'?' active':'') " @click="changeTheme('vs-light')"></div>
        </div>
      </div>
      <br>
      <div class="btn waves-effect waves-block" @click="save">
        <i class="fa fa-save"></i>
        <span class="fix-btn">
            Save setting
         </span>
      </div>
      <br>
    </div>
  </div>
</template>

<script>
import titlec from '../elements/TitleElement';
import {fnc} from '@/assets/js/functions';

export default {
  name: "SettingPage",
  components: {
    titlec
  },
  data: function () {
    return {
      q: '',
      setting: {
        performanceMode: false,
        pathFix: false,
        exitConfirm: false,
        pages: true,
        sidebar: true,
        codeStyle: 'vs-dark',
        fontSize: 18,
      }
    }
  },
  mounted() {
    var self = this;

    window.api.receive("storage-back", (data) => {
      if (data.key == 'setting'){
        delete  data.key;
        self.setting = fnc.fixSetting(data);
      }
    });
    window.api.send('storage-get', 'setting');

  },
  methods: {
    changeTheme: function (e) {
      this.setting.codeStyle = e;
    },
    search: function () {
      let items = document.querySelectorAll('#settings .collection-item');
      for (const item of items) {
        if (item.innerText.toLowerCase().indexOf(this.q.toLowerCase()) === -1) {
          item.classList.add('slide-fade-enter');
        } else {
          item.classList.remove('slide-fade-enter');
        }
      }
    },
    save: function () {
      let  data = {key: 'setting', value: this.setting};
      // console.log(data);
      window.api.send('storage-set', data);
      window.ide.settings = this.setting;
    }
  },
  beforeDestroy() {
    window.api.send('storage-get', 'setting');
  }
}
</script>

<style scoped>
.collection-item {
  background: transparent;
  padding: 15px;
  border-bottom: 1px solid #99999940;
  overflow: hidden;
  transition: 900ms;
  box-sizing: border-box;
  position: relative;
}

.collection-item span {
  color: #aaa;
  display: block;
  font-weight: 100;
}


.collection-item .ico{
  float: left;
  font-size: 35px;
  margin: 7px 25px 7px 0;
  color: #00e67644;
  transition: 600ms;
}
.collection-item:hover .ico{
  color: #00e676;
}

.collection-item input[type='text']{
  transition: 300ms;
  position: static;
  left: 700px;
  background: #272c34;
}
.collection-item input[type='text']:focus{
  position: absolute;
  left: 0;
  right: 0;
}

.yellow-text{
  display: inline !important;
  font-weight: 500 !important;
}

.code-style{
  margin-top: 15px;
  width: 33%;
  background: url("../../assets/img/code/code1.png") left center no-repeat;
  height: 140px;
  border: 1px solid black;
  float: left;
  margin-right: .49%;
  opacity: .3;
  transition: 300ms;
}
.code-style:nth-child(3n+1){
  margin-right: 0;
}
.code-style.cs2{
  background-image: url("../../assets/img/code/code2.png");
}
.code-style.cs3{
  background-image: url("../../assets/img/code/code3.png");
}
.code-style:hover{
  opacity: 1;
}
.code-style.active{
  opacity: 1 !important;
  border-color: #0f9d58 ;
}
/*.switch .lever {*/
/*  display: inline-block;*/
/*  min-width: 35px;*/
/*}*/
</style>