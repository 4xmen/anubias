<template>
  <section class="resource-manager">

    <!-- Header -->
    <header class="toolbar">

      <div class="toolbar-actions">
        <button class="tool-button">
          <i class="ri-add-line" />
        </button>

        <button class="tool-button">
          <i class="ri-folder-add-line" />
        </button>

        <button class="tool-button">
          <i class="ri-edit-line" />
        </button>

        <button class="tool-button danger">
          <i class="ri-delete-bin-line" />
        </button>
      </div>

      <div class="toolbar-search">
        <i class="ri-search-line" />
        <input placeholder="Search resources..." />
      </div>

    </header>

    <div class="content">

      <!-- Folder Tree -->

      <aside class="folder-panel">

        <div class="panel-title">
          Resources
        </div>

        <ul class="folder-tree">

          <li class="active">
            <i class="ri-folder-open-line" />
            Textures
          </li>

          <li>
            <i class="ri-folder-line" />
            Audio
          </li>

          <li>
            <i class="ri-folder-line" />
            Icons
          </li>

          <li>
            <i class="ri-folder-line" />
            Fonts
          </li>

        </ul>

      </aside>

      <!-- Files -->

      <main class="files-panel">

        <div class="resource-grid">

          <div class="resource-item selected">

            <div class="preview image">
              <img src="https://picsum.photos/100" />
            </div>

            <div class="name">
              background.png
            </div>

          </div>

          <div class="resource-item">

            <div class="preview icon">
              <i class="ri-music-2-line" />
            </div>

            <div class="name">
              click.wav
            </div>

          </div>

          <div class="resource-item">

            <div class="preview icon">
              <i class="ri-file-code-line" />
            </div>

            <div class="name">
              config.json
            </div>

          </div>

          <div class="resource-item">

            <div class="preview icon">
              <i class="ri-file-line" />
            </div>

            <div class="name">
              readme.txt
            </div>

          </div>

        </div>

      </main>

    </div>

    <footer class="status-bar">
      4 Resources • 1 Selected
    </footer>

  </section>
</template>

<script setup>

import {ref} from "vue";




</script>

<style scoped>

/* Layout */

.resource-manager {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: var(--def-bg);
  color: #ddd;
}

/* Toolbar */

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 10px 14px;

  border-bottom: 1px solid rgba(255,255,255,.06);
  background: var(--darker-bg);
}

.toolbar-actions {
  display: flex;
  gap: 6px;
}

.tool-button {

  width: 32px;
  height: 32px;

  display: flex;
  justify-content: center;
  align-items: center;

  border: 1px solid rgba(255,255,255,.06);
  border-radius: 6px;

  background: transparent;
  color: #bfbfbf;

  transition: .18s;

  cursor: pointer;

  &:hover{
    background: rgba(255,255,255,.05);
    color:white;
  }

  &.danger:hover{
    color:#ff7777;
  }
}

.toolbar-search{

  width:240px;

  display:flex;
  align-items:center;
  gap:8px;

  padding:0 10px;

  border-radius:7px;

  background:rgba(255,255,255,.04);

  input{

    flex:1;

    height:34px;

    border:none;
    outline:none;

    color:#ddd;

    background:none;
  }

}

/* Main */

.content{

  display:flex;
  flex:1;

  overflow:hidden;

}

/* Folder */

.folder-panel{

  width:220px;

  border-right:1px solid rgba(255,255,255,.05);

  background:var(--darker-bg);

}

.panel-title{

  padding:14px;

  font-size:.82rem;

  color:#888;

  text-transform:uppercase;

  letter-spacing:.08em;

}

.folder-tree{

  list-style:none;

  padding:0;
  margin:0;

  li{

    display:flex;
    align-items:center;

    gap:10px;

    padding:9px 14px;

    cursor:pointer;

    color:#aaa;

    transition:.15s;

    &:hover{

      background:rgba(255,255,255,.04);
      color:white;

    }

    &.active{

      background:rgba(255,255,255,.06);
      color:white;

    }

  }

}

/* Files */

.files-panel{

  flex:1;

  overflow:auto;

  padding:16px;

}

.resource-grid{

  display:grid;

  grid-template-columns:repeat(auto-fill,minmax(110px,1fr));

  gap:14px;

}

.resource-item{

  display:flex;
  flex-direction:column;
  align-items:center;

  gap:10px;

  padding:10px;

  border-radius:8px;

  border:1px solid transparent;

  transition:.15s;

  cursor:pointer;

  &:hover{

    background:rgba(255,255,255,.03);
    border-color:rgba(255,255,255,.06);

  }

  &.selected{

    border-color:#4b88ff;

    background:rgba(75,136,255,.12);

  }

}

.preview{

  width:72px;
  height:72px;

  display:flex;
  justify-content:center;
  align-items:center;

  border-radius:8px;

  background:rgba(255,255,255,.04);

  img{

    width:100%;
    height:100%;

    object-fit:cover;

    border-radius:6px;

  }

  &.icon{

    font-size:34px;
    color:#9ea4aa;

  }

}

.name{

  width:100%;

  text-align:center;

  font-size:.82rem;

  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;

}

/* Status */

.status-bar{

  height:30px;

  display:flex;
  align-items:center;

  padding:0 12px;

  border-top:1px solid rgba(255,255,255,.06);

  background:var(--darker-bg);

  color:#8c8c8c;

  font-size:.78rem;

}

</style>