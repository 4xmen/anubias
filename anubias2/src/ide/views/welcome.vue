<template>
  <div class="container">
    <img src="src/ide/assets/svg/logo/white-logo.svg" alt="">
    <h1>
      Anubias
    </h1>
    <h4>
      Welcome to Anubias, Develop your native application cross platform anywhere Painless
    </h4>
    <br>
    <div id="welcome-grid">
      <div id="new-project">
        <i class="ri-file-add-line"></i>
        New project
      </div>
      <div id="open-project">
        <i class="ri-folder-open-line"></i>
        Open project
      </div>
      <div id="recent-project">
        <h2>
          <i class="ri-history-line"></i>
          Recent projects
        </h2>
      </div>
      <div id="document" @click="openWebsite('https://anubias.app/doc/#/')">
        <i class="ri-book-open-line"></i>
        Online documents
      </div>
      <div id="setting" @click="goSetting">
        <i class="ri-settings-3-line"></i>
        IDE settings
      </div>
      <div id="website" @click="openWebsite('https://anubias.app/')">
        <i class="ri-cloudy-line"></i>
        Anubias website
      </div>
      <div id="update">
        <i class="ri-refresh-line"></i>
        Check update
      </div>
    </div>
  </div>
</template>

<script>
import {ipcRenderer} from 'electron';
export default {
  name: "welcome",
  data: () => {
    return {}
  },
  computed:{

  },
  methods:{
    openWebsite(url) {
      ipcRenderer.send('open-website',url);
    },
    goSetting(){
      this.$router.push('/settings');
    }
  }
}
</script>

<style scoped>

h4 {
  font-size: 110%;
}

#welcome-grid {
  display: grid;
  grid-template-columns: repeat(21, 1fr);
  grid-template-rows: 8fr;
  grid-gap: 1rem;
}

#welcome-grid > div {
  text-align: center;
  opacity: .5;
  transition: .5s;
  padding: 1em 0;
  font-weight: 300;
  font-size: 110%;
  cursor: pointer;
}

#welcome-grid > div:hover {
  opacity: 1;
}

#welcome-grid > div i {
  font-size: 48px;
  display: block;
}

#new-project {
  grid-column: 1 / 10;
  grid-row: 1 / 2;
  border: 1px solid #00e676;
}

#new-project:hover {
  background: #00e67660;
  color: white;
}

#open-project {
  grid-column: 1 / 10;
  grid-row: 2 / 4;
  border: 1px solid dodgerblue;
}

#open-project:hover {
  background: #1e90ff60;
  color: white;
}

#update {
  grid-column: 1 / 10;
  grid-row: 4 / 6;
  border: 1px solid goldenrod;
}

#update:hover {
  background: #daa52060;
  color: white;
}

#document {
  grid-row: 6 / 9;
  grid-column: 1 / 8;
  border: 1px solid silver;
}

#setting {
  grid-row: 6 / 9;
  grid-column: 8 / 15;
  border: 1px solid silver;
}

#website {
  grid-row: 6 / 9;
  grid-column: 15 / 22;
  border: 1px solid silver;
}

#recent-project {
  grid-column: 10 / 22;
  grid-row: 1 / 6;
  border: 1px solid silver;
  cursor: default !important;
}

#recent-project h2 {
  font-weight: 200;
  border-bottom: 1px solid silver;
  padding-bottom: .5em;
  font-size: 20px;
}

#recent-project h2 i {
  font-size: 32px;
  float: left;
  margin: -.4em -32px 0 .5em;
}

img {
  height: 5em;
  float: right;
}
</style>