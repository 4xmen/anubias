<template>
  <div class="container">
    <img src="../assets/svg/logo/white-logo.svg" alt="">
    <h1>
      Anubias welcome
    </h1>
    <h4>
      Welcome to Anubias, Develop your native application cross platform anywhere Painless
    </h4>
    <br>
    <div id="welcome-grid">
      <div id="new-project" @click="goNewProject">
        <i class="ri-file-add-line big-icon"></i>
        New project
      </div>
      <div id="open-project" @click="openProject">
        <i class="ri-folder-open-line  big-icon"></i>
        Open project
      </div>
      <section id="recent-project" class="recent-project-root" >
        <h2 class="text-center">
          <i class="ri-history-line"></i>
          Recent projects
        </h2>

        <div class="recent-project-list">
          <div
              class="recent-project"
              v-for="(prj,i) in recentProjects"
              :key="prj.path || prj.name"
              tabindex="0"
              role="button"
              @click="openRecent(prj.path)"
              @keydown.enter.prevent="openProject(prj)"
          >
            <div class="recent-project-main">
              <span class="recent-project-name" :title="prj.name">{{ prj.name }}</span>
              <span class="recent-project-path" :title="prj.path">{{ prj.path }}</span>
            </div>

            <div class="recent-project-actions" @click.stop>
              <button class="action-btn" type="button" @click="openRecent(prj.path)">Open</button>
              <button class="action-btn danger" type="button" @click="removeRecent(i)">Remove</button>
            </div>
          </div>
        </div>
      </section>
      <div id="document" @click="openWebsite('https://anubias.app/doc/#/')">
        <i class="ri-book-open-line  big-icon"></i>
        Online documents
      </div>
      <div id="setting" @click="goSetting">
        <i class="ri-settings-3-line  big-icon"></i>
        IDE settings
      </div>
      <div id="website" @click="openWebsite('https://anubias.app/')">
        <i class="ri-cloudy-line  big-icon"></i>
        Anubias website
      </div>
      <div id="update">
        <i class="ri-refresh-line  big-icon"></i>
        Check update
      </div>
    </div>
  </div>
</template>

<script>
import {invoke} from '@tauri-apps/api/core';
import {open} from '@tauri-apps/plugin-dialog';
import {mapActions} from "vuex";
import {LazyStore} from "@tauri-apps/plugin-store";
import {RecentProjectManager} from "../js/recent-project-manager.js";
const storage = new LazyStore('ide.json', {autoSave: false});
const recentManager = new RecentProjectManager(storage);

export default {
  name: "welcome",
  data: () => {
    return {
      recentProjects: [],
    }
  },
  async mounted() {
    this.recentProjects = await recentManager.getAll();
    // reset menu of app
    await this.ResetMenuState();
    await this.setTitle();
  },
  computed: {

  },
  methods: {
    ...mapActions(
        'ide',['setTitle','ResetMenuState']
    ),
    async openWebsite(url) {
      await invoke('open_url', {
        url: url
      });
    },
    goSetting() {
      this.$router.push('/settings');
    },
    goNewProject() {
      this.$router.push('/new-project');
    },
    async removeRecent(i){
      await recentManager.remove(i);
      this.recentProjects = await recentManager.getAll();
    },
    async openRecent(path){
      await this.$store.dispatch('project/prepareProjectFile', path);
      this.$router.push('/main');
    },
    async openProject() {
      const path = await open({
        multiple: false,
        directory: false,
        filters: [
          {
            name: 'Anubias files',
            extensions: ['anb'],
          },
          {
            name: 'All files',
            extensions: ['*'],
          },
        ],
      });
      if (path) {

        await this.$store.dispatch('project/prepareProjectFile', path);
        this.$router.push('/main');

      }
    }
  }
}
</script>

<style scoped>

h4 {
  font-size: 110%;
  padding-top: .3em;
}

img {
  height: 5.5em;
  float: right;
}

#welcome-grid {
  display: grid;
  grid-template-columns: repeat(21, 1fr);
  grid-template-rows: 8fr;
  grid-gap: 1rem;
}

#welcome-grid i {
  -webkit-text-stroke-color: var(--darker-bg);
  -webkit-text-stroke-width: 1px;
}

#welcome-grid .big-icon {
  -webkit-text-stroke-color: var(--darker-bg);
  -webkit-text-stroke-width: 2px;
}

#welcome-grid > div {
  text-align: center;
  opacity: .5;
  transition: .5s;
  padding: 1em 0;
  font-weight: 300;
  font-size: 110%;
  cursor: pointer;
  background: var(--darker-bg);
  border-radius: 6px;
  box-shadow: 0 10px 26px rgba(0, 0, 0, 0.16);
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
  border-radius: 6px;
  box-shadow: 0 10px 26px rgba(0, 0, 0, 0.16);
}

#recent-project h2 {
  font-weight: 200;
  border-bottom: 1px solid silver;
  padding: .5em;
  font-size: 20px;
}

#recent-project h2 i {
  font-size: 32px;
  float: left;
  margin: -.3em -32px 0 .5em;
}

.container {
  user-select: none;
}

/* recent project */

/* Layout */
.recent-project-root {
  color: rgba(233, 236, 239, 0.92);
  padding: 0;
}


/* List */
.recent-project-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: .7rem .4rem;
}

/* Row */
.recent-project {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  padding: 10px 12px;

  border-radius: 10px;
  box-shadow: 0 10px 26px rgba(0, 0, 0, 0.16);
  border: 1px solid rgba(255, 255, 255, 0.07);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.015));

  cursor: pointer;
  transition: border-color 140ms ease, background 140ms ease, transform 140ms ease, box-shadow 140ms ease;
  outline: none;
}

.recent-project:hover {
  transform: translateY(-1px);
  border-color: rgba(255, 255, 255, 0.13);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.045), rgba(255, 255, 255, 0.02));
}

.recent-project:focus {
  border-color: rgba(96, 165, 250, 0.45);
  box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.18), 0 12px 30px rgba(0, 0, 0, 0.22);
}

/* Info */
.recent-project-main {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.recent-project-name,
.recent-project-path {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.recent-project-name {
  font-size: 13px;
  font-weight: 650;
  color: rgba(233, 236, 239, 0.98);
}

.recent-project-path {
  font-size: 12px;
  color: rgba(233, 236, 239, 0.65);
}

/* Actions */
.recent-project-actions {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex: 0 0 auto;
}

.action-btn {
  appearance: none;
  border: 1px solid rgba(255, 255, 255, 0.09);
  background: rgba(255, 255, 255, 0.02);
  color: rgba(233, 236, 239, 0.88);

  border-radius: 8px;
  padding: 7px 10px;

  font-size: 12px;
  font-weight: 650;

  cursor: pointer;
  transition: background 140ms ease, border-color 140ms ease, transform 120ms ease;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.14);
  transform: translateY(-1px);
}

.action-btn:active {
  transform: translateY(0);
}

.action-btn.danger {
  border-color: rgba(248, 113, 113, 0.22);
  color: rgba(248, 113, 113, 0.95);
  background: rgba(248, 113, 113, 0.06);
}

.action-btn.danger:hover {
  background: rgba(248, 113, 113, 0.09);
  border-color: rgba(248, 113, 113, 0.34);
}

/* Compact */
@media (max-width: 520px) {
  .recent-project {
    flex-direction: column;
    align-items: stretch;
  }
  .recent-project-actions {
    justify-content: flex-end;
  }
}
</style>