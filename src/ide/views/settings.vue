<template>
  <section class="settings">
    <header class="setting-header">
      <h1>Settings</h1>

      <button
          class="back-btn"
          type="button"
          @click="goBack"
      >
        ← Back
      </button>
    </header>

    <div class="settings-body">
      <aside class="sidebar">
        <button
            v-for="category in categories"
            :key="category"
            :class="{ active: currentCategory === category }"
            @click="currentCategory = category"
        >
          {{ category }}
        </button>
      </aside>

      <main class="content">

        <template v-if="currentCategory === 'General'">

          <section class="group">
            <h2>Workspace</h2>

            <label class="row">
              <span>Workspace Name</span>
              <input
                  v-model="settings.workspace"
                  type="text"
                  placeholder="My Workspace"
              >
            </label>

            <label class="row">
              <span>Language</span>

              <select v-model="settings.language">
                <option>English</option>
                <option>Persian</option>
                <option>German</option>
              </select>
            </label>

            <label class="row checkbox">
              <span>Open last project on startup</span>

              <input
                  type="checkbox"
                  v-model="settings.restoreSession"
              >
            </label>

            <label class="row checkbox">
              <span>Enable notifications</span>

              <input
                  type="checkbox"
                  v-model="settings.notifications"
              >
            </label>

          </section>

        </template>

      </main>
    </div>
  </section>
</template>

<script>
export default {
  name: "Settings",

  data() {
    return {
      currentCategory: "General",

      categories: [
        "General",
        "Appearance",
        "Editor",
        "Terminal",
        "Extensions",
        "Advanced"
      ],

      settings: {
        workspace: "My Workspace",
        language: "English",
        restoreSession: true,
        notifications: false
      }
    }
  },

  methods: {
    goBack() {
      this.$router.back();
    }
  }
}
</script>

<style scoped>

.settings{
  height:100vh;
  display:flex;
  flex-direction:column;
  background:var(--def-bg);
  color:#d7dae0;
}

/* Header */

.setting-header {
  height: 52px;
  padding: 0 18px;
  border-bottom: 1px solid #31343a;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.setting-header h1 {
  margin: 0;
  font-size: 17px;
  font-weight: 600;
  color: #eceff4;
}

.back-btn {
  background: transparent;
  border: 1px solid #3a3d44;
  color: #9ea4af;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: .15s;
}

.back-btn:hover {
  background: #2b2d31;
  border-color: #4b4f58;
  color: #fff;
}

/* Layout */

.settings-body{
  flex:1;
  display:flex;
  overflow:hidden;
  height: 100vh;
}

/* Sidebar */

.sidebar{
  width:210px;
  padding:10px;
  background:var(--darker-bg);
  border-right:1px solid rgba(255,255,255,.06);
}

.sidebar button{
  width:100%;
  height:36px;
  padding:0 12px;
  border:none;
  border-radius:6px;
  background:transparent;
  color:#b9bec8;
  text-align:left;
  cursor:pointer;
  transition:.15s;
}

.sidebar button:hover{
  background:rgba(255,255,255,.05);
}

.sidebar button.active{
  background:#3b82f620;
  color:#7fb3ff;
}

/* Content */

.content{
  flex:1;
  overflow:auto;
  padding:24px 34px;
}

.group{
  //max-width:620px;
}

.group h2{
  margin:0 0 18px;
  font-size:18px;
  font-weight:600;
}

/* Rows */

.row{
  min-height:54px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:24px;
  border-bottom:1px solid rgba(255,255,255,.05);
}

.row span{
  color:#cfd3da;
  font-size:14px;
}

.row:hover{
  background: #00000011;
}

.row input[type=text],
.row select{
  width:240px;
  height:34px;
  padding:0 10px;
  border:1px solid rgba(255,255,255,.08);
  border-radius:6px;
  background:var(--darker-bg);
  color:white;
  outline:none;
  transition:.15s;
}

.row input[type=text]:focus,
.row select:focus{
  border-color:#4d8dff;
}

.checkbox input{
  width:16px;
  height:16px;
  accent-color:#4d8dff;
}

</style>