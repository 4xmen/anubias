<template>
  <div v-if="open" id="restore-modal">
    <div class="backdrop" @click="close"></div>

    <div class="panel">
      <div class="header">
        <div>
          <div class="title">Restore Backup</div>
          <div class="sub">Select a snapshot to restore</div>
        </div>

        <button class="close-btn" type="button" @click="close">×</button>
      </div>

      <div class="body">
        <div v-if="!sortedBackups.length" class="empty">
          No backups available
        </div>

        <button
            v-for="item in sortedBackups"
            :key="item.path"
            type="button"
            class="item"
            :class="{ active: selected && selected.path === item.path }"
            @click="selected = item"
        >
          <div class="item-main">
            <div class="item-time">{{ formatTimestamp(item.timestamp) }}</div>
            <div class="item-path">{{ item.path.substring(item.path.length - 51) }}</div>
          </div>
          <div class="badge">backup</div>
        </button>
      </div>

      <div class="footer">
        <button type="button" class="btn secondary" @click="close">Cancel</button>
        <button type="button" class="btn primary" :disabled="!selected" @click="restore">
          Restore
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import {invoke} from "@tauri-apps/api/core";

export default {
  name: "restore-modal",
  data: () => ({
    selected: null
  }),
  computed: {
    ...mapState('project',{
      backups: state => state.backups,
    }),
    ...mapState('ide',{
      open: state => state.modals.restore,
    }),
    sortedBackups() {
      return [...(this.backups || [])].sort((a, b) => b.timestamp - a.timestamp);
    }
  },
  methods: {
    close() {
      this.$store.commit("ide/CHANGE_MODAL_STATE", {
        name: "restore",
        isShow: false,
      });
    },
    async restore() {
      const result = await invoke("load_project", {
        path: this.selected.path,
      });


      await this.$store.dispatch('project/loadProject', JSON.parse(result.project));
      setTimeout(() => {
        this.$store.dispatch('project/updateProjectPreview', result.previews);
        window.location.reload();
      }, 100);
    },
    formatTimestamp(ts) {
      return new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short"
      }).format(new Date(ts * 1000));
    }
  }
};
</script>

<style scoped>
#restore-modal {
  position: fixed;
  inset: 0;
  z-index: 1000;
}

.backdrop {
  position: absolute;
  inset: 0;
  background: rgba(10, 12, 16, 0.72);
}

.panel {
  position: absolute;
  left: 50%;
  top: 50%;
  width: min(680px, calc(100vw - 32px));
  max-height: min(80vh, 720px);
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,.08);
  border-radius: 12px;
  background: #1b1f26;
  box-shadow: 0 24px 70px rgba(0,0,0,.55);
}

.header,
.footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
}

.header {
  border-bottom: 1px solid rgba(255,255,255,.06);
}

.title {
  color: #eef1f6;
  font-size: 14px;
  font-weight: 600;
}

.sub {
  margin-top: 3px;
  color: #8f96a3;
  font-size: 12px;
}

.close-btn {
  width: 28px;
  height: 28px;
  border: 0;
  border-radius: 8px;
  background: rgba(255,255,255,.04);
  color: #9aa2af;
  cursor: pointer;
}

.body {
  padding: 12px;
  overflow: auto;
  display: grid;
  gap: 8px;
}

.item {
  width: 100%;
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 11px 12px;
  border: 1px solid rgba(255,255,255,.06);
  border-radius: 10px;
  background: rgba(255,255,255,.02);
  color: inherit;
  text-align: left;
  cursor: pointer;
}

.item:hover,
.item.active {
  border-color: rgba(83, 119, 255, .35);
  background: rgba(83, 119, 255, .10);
}

.item-main {
  min-width: 0;
  flex: 1;
}

.item-time {
  font-size: 13px;
  color: #e9edf4;
}

.item-path {
  margin-top: 4px;
  font-size: 12px;
  color: #8f96a3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.badge {
  flex: 0 0 auto;
  height: 22px;
  padding: 0 8px;
  border-radius: 999px;
  font-size: 11px;
  line-height: 22px;
  color: #b9c6ff;
  background: rgba(83, 119, 255, .14);
}

.empty {
  padding: 28px 12px;
  border: 1px dashed rgba(255,255,255,.08);
  border-radius: 12px;
  text-align: center;
  color: #8f96a3;
  font-size: 12px;
}

.btn {
  height: 32px;
  padding: 0 14px;
  border: 0;
  border-radius: 8px;
  font-size: 12px;
  cursor: pointer;
}

.secondary {
  color: #d7dbe3;
  background: rgba(255,255,255,.04);
}

.primary {
  color: #fff;
  background: linear-gradient(180deg, #5f7cff 0%, #4b67f0 100%);
}

.primary:disabled {
  opacity: .45;
  cursor: not-allowed;
}
</style>
