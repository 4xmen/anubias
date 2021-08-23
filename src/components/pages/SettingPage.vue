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
        </div>
      </div>
      <div class="collection-item">
        <div>
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
            It can fix your problem to find flutter ( only OSX or Linux )
          </span>
        </div>
      </div>
      <div class="collection-item">
        <div>
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
        </div>
      </div>
      <br>
      <div class="btn waves-effect waves-block" @click="save">
        <i class="fa fa-save"></i>
        <span class="fix-btn">
            Save setting
         </span>
      </div>
    </div>
  </div>
</template>

<script>
import titlec from '../elements/TitleElement';

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
      }
    }
  },
  mounted() {
    var self = this;
    window.api.receive("storage-back", (data) => {
      if (data.performanceMode == undefined) {
        data.performanceMode = false;
      }
      if (data.pathFix == undefined) {
        data.pathFix = false;
      }
      if (data.exitConfirm == undefined) {
        data.exitConfirm = true;
      }
      self.setting = data;
    });
    window.api.send('storage-get', 'setting');

  },
  methods: {
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
    }
  },
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
}

.collection-item span {
  color: #aaa;
  display: block;
  font-weight: 100;
}


</style>