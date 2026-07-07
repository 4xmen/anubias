<template>
  <div id="project-properties">
    <transition name="fade-scale">
      <div v-if="project.backups.length > 0" class="backup-alert">
        <div class="backup-alert__icon">
          <i class="ri-save-2-line"></i>
        </div>

        <div class="backup-alert__content">
          <div class="backup-alert__title">
            {{ project.backups.length }} backups available
          </div>
          <div class="backup-alert__text">
            A recent backup was found for this project.
          </div>
        </div>

        <div class="backup-alert__actions">
          <button class="btn btn-ghost" @click="ignoreBackupsNow">
            Ignore
          </button>
          <button class="btn btn-primary" @click="viewBackups">
            View backups
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import {mapMutations, mapState} from "vuex";

export default {
  name: "project-properties",
  computed: {
    ...mapState(["project"]),
    ...mapMutations({
      ignoreBackups: "project/IGNORE_BACKUPS"
    })
  },
  methods: {
    ignoreBackupsNow() {
      this.ignoreBackups();
    },
    viewBackups() {
      this.$emit("view-backups");
    },
  },
};
</script>

<style scoped>
#project-properties {
  padding: 12px;
}

.backup-alert {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border: 1px solid rgba(255, 193, 7, 0.18);
  background: linear-gradient(180deg, rgba(255, 193, 7, 0.08), rgba(255, 193, 7, 0.04));
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
  color: #e8e8e8;
}

.backup-alert__icon {
  width: 34px;
  height: 34px;
  min-width: 34px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  background: rgba(255, 193, 7, 0.12);
  color: #ffcc4d;
}

.backup-alert__icon svg {
  width: 20px;
  height: 20px;
}

.backup-alert__content {
  flex: 1;
  min-width: 0;
}

.backup-alert__title {
  font-size: 13px;
  font-weight: 600;
  line-height: 1.3;
  margin-bottom: 2px;
}

.backup-alert__text {
  font-size: 12px;
  color: rgba(232, 232, 232, 0.7);
}

.backup-alert__actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.btn {
  height: 30px;
  padding: 0 12px;
  border-radius: 8px;
  border: 1px solid transparent;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.18s ease;
}

.btn-ghost {
  background: rgba(255, 255, 255, 0.04);
  color: rgba(232, 232, 232, 0.85);
  border-color: rgba(255, 255, 255, 0.08);
}

.btn-ghost:hover {
  background: rgba(255, 255, 255, 0.08);
}

.btn-primary {
  background: #4c8bf5;
  color: white;
  box-shadow: 0 6px 14px rgba(76, 139, 245, 0.25);
}

.btn-primary:hover {
  background: #5a95f7;
}

.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.18s ease;
}

.fade-scale-enter,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.98);
}
</style>
