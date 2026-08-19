<template>
  <section class="resource-manager">

    <prompt-input
        :prompt-text="prompt.title"
        :prompt-title="prompt.title"
        :prompt-placeholder="prompt.placeholder"
        :on-accept="prompt.onAccept"
        :on-cancel="prompt.onCancel"
        :enabled="prompt.enabled"
        :default-value="defPromptValue"
    />

    <anubias-confirm
        :confirm-text="ide.confirm.text"
        :confirm-title="ide.confirm.title"
        :on-confirm="ide.confirm.onConfirm"
        :on-cancel="ide.confirm.onCancel"
        :enabled="ide.confirm.enabled"
    ></anubias-confirm>
    <!-- Header -->
    <header class="toolbar">

      <div class="toolbar-actions">
        <button class="tool-button" @click="addResource">
          <i class="ri-add-line"/>
        </button>

        <button class="tool-button" @click="newDir">
          <i class="ri-folder-add-line"/>
        </button>

        <button class="tool-button">
          <i class="ri-edit-line"/>
        </button>

        <button class="tool-button danger" @click="removeSelectedResources">
          <i class="ri-delete-bin-line"/>
        </button>
      </div>

      <div class="toolbar-search">
        <i class="ri-search-line"/>
        <input placeholder="Search resources..."/>
      </div>

    </header>

    <div class="content">

      <!-- Folder Tree -->

      <aside class="folder-panel">

        <div class="panel-title">
          Resources
        </div>

        <ul class="folder-tree">
          <li v-for="(dir,i) in resourceDirs" :class="i === activeDir?'active':''" :key="i" @click="changeActiveDir(i)">
            <i class="" :class="i === activeDir?'ri-folder-open-line':'ri-folder-line'"/>
            {{ dir }}
          </li>
        </ul>

      </aside>


      <!-- Files -->

      <main class="files-panel">

        <div class="resource-grid">

          <template v-for="res in resources">

            <div :class="resourceClass(res)" v-if="res.directory === resourceDirs[activeDir]"
                 @click="toggleSelect(res)">

              <div class="preview icon">
                <i :class="getFileIcon(res)"/>
              </div>

              <div class="name">
                {{ res.original_name }}
              </div>
            </div>
          </template>

          <!--          <div class="resource-item selected">-->

          <!--            <div class="preview image">-->
          <!--              <img src="https://4xmen.ir/wp-content/uploads/2026/06/rust-golden-rules.jpg" alt="bg"/>-->
          <!--            </div>-->

          <!--            <div class="name">-->
          <!--              background.png-->
          <!--            </div>-->

          <!--          </div>-->

          <div class="resource-item placeholder" v-if="onUploadResource">

            <div class="preview icon">
              <i class="ri-loader-2-line spinner"/>
            </div>

            <div class="name">
              Loading new resource...
            </div>

          </div>

        </div>

      </main>

      <aside class="preview-panel">
        <div class="panel-title">
          Preview
        </div>


        <div>
          <div class="preview-container">

<!--            <a :href="lastSelectedResource.url??'#'">-->
<!--              {{lastSelectedResource.url??'no'}}-->
<!--            </a>-->
            <template v-if="lastSelectedResource">
              <img
                  v-if="detectType(lastSelectedResource.mime) === 'image'"
                  :src="lastSelectedResource.url"
                  class="image-preview"
                  alt="Preview"
              />

              <audio
                  v-else-if="detectType(lastSelectedResource.mime) === 'audio'"
                  :src="lastSelectedResource.url"
                  controls
                  class="audio-preview"
              />

              <video
                  class="video-preview"
                  v-else-if="detectType(lastSelectedResource.mime) === 'video'"
                  :src="lastSelectedResource.url"
                  controls
              />

              <textarea
                  v-else-if="detectType(lastSelectedResource.mime) === 'text'"
                  v-model="textPreview"
                  class="text-preview"
                  readonly
              />

              <div v-else>
                <h4 class="text-center"> Preview unavailable for this type </h4>
              </div>
            </template>

            <div v-else>
              <h4 class="text-center"> Preview unavailable</h4>
            </div>
          </div>

        </div>
      </aside>

    </div>

    <footer class="status-bar">
      {{ resources.length }} Resources • {{ selected.length }} Selected
    </footer>

  </section>
</template>

<script setup>
const MAX_IMPORT_FILE_SIZE = 50 * 1024 * 1024;

const codeAssume = ['js','json','css','php','scss','vue','jsx']

import {computed, nextTick, ref, watch} from "vue";
import {useStore} from "vuex";
import promptInput from "../components/anubias-prompt.vue";
import anubiasConfirm from "../components/anubias-confirm.vue";
import {useToast} from "vue-toastification";
import {generateHashId, getFileInfo} from "../js/system-functions.js";
import {open} from "@tauri-apps/plugin-dialog";
import {invoke} from "@tauri-apps/api/core";


const store = useStore();
const toast = useToast();

const resourceDirs = computed(() => {
  return store.state.project.resourceDirectories;
});

const resources = computed(() => {
  return store.state.project.resources;
})
const prompt = computed(() => {
  return store.state.ide.prompt;
})
const ide = computed(() => {
  return store.state.ide;
});

const activeDir = ref(0);
const defPromptValue = ref('');
const selected = ref([]);
const onUploadResource = ref(false);
const lastSelectedResource = ref(null);
const textPreview = ref(null);

function changeActiveDir(i) {
  activeDir.value = i;
  selected.value = [];
}

function newDir() {
  defPromptValue.value = 'newfolder';
  // prompt.value.title = 'New folder';
  // prompt.value.text = "New directory name";
  // prompt.value.placeholder = "New directory name";
  // prompt.value.onAccept = (value) => {
  //
  //   if (resourceDirs.value.indexOf(value) === -1) {
  //     store.commit("project/ADD_RESOURCES_DIR", value)
  //   } else {
  //     toast.warning("Duplicate resource directory");
  //   }
  // }
  // prompt.value.enabled = true;

  store.dispatch("ide/showPrompt", {
    onAccept: (value) => {
      if (resourceDirs.value.indexOf(value) === -1) {
        store.commit("project/ADD_RESOURCES_DIR", value)
      } else {
        toast.warning("Duplicate resource directory");
      }
    },
    title: 'New folder',
    text: "New folder name",
    placeholder: 'folder name',
  })

}

async function addResource() {
  const path = await open({
    multiple: false,
    directory: false,
    filters: [
      {
        name: 'App General Resources',
        extensions: [
          'jpg', 'jpeg', 'png', 'webp', 'gif', 'svg', 'bmp', 'ico', 'mp3', 'wav',
          'aac', 'flac', 'm4a', 'ogg', 'wma', 'mp4', 'webm', 'avi', 'mov', 'mkv', '3gp', 'ttf',
          'otf', 'woff', 'woff2', 'eot', 'json', 'xml', 'yaml', 'yml', 'csv', 'txt', 'md', 'html',
          'css', 'js', 'pdf'
        ],
      },
      {
        name: 'All files',
        extensions: ['*'],
      },
    ],
  });
  if (path) {
    const hash_id = generateHashId();
    onUploadResource.value = true;
    try {

      const fileInfo = getFileInfo(path);
      if (!fileInfo.hasExtension) {
        toast.error("Import error: You can't import file don't have extension");
      }

      // const metadata = await invoke("get_fast_file_metadata", {path});
      //
      // if (metadata.size > MAX_IMPORT_FILE_SIZE) {
      //   toast.error("The selected file exceeds the maximum supported size.");
      //   return;
      // }

      const data = await invoke("add_resource", {
        hash: hash_id,
        path,
        dir: resourceDirs.value[activeDir.value],
      });

      // const uint8 = new Uint8Array(bytes);
      // assetStore.register(hash_id, 'resource', new Blob([new Uint8Array(data.bytes)], {
      //   type: data.mime
      // }));
      // delete data.bytes;
      // data.hash_id = hash_id;
      // data.directory = resourceDirs.value[activeDir.value];
      await store.dispatch('project/addResource', data);
      // console.log(data);
    } catch (e) {
      console.log(e.message);
      onUploadResource.value = false;
    } finally {
      onUploadResource.value = false;
    }

  }
}

async function toggleSelect(resource) {
  if (selected.value.indexOf(resource) === -1) {
    selected.value.push(resource);
  } else {
    selected.value.splice(selected.value.indexOf(resource), 1);
  }
  if (selected.value.length > 0) {
    lastSelectedResource.value = selected.value[selected.value.length - 1];
  } else {
    lastSelectedResource.value = null;
  }
}


/**
 * @returns {string}
 * @param resource
 */
function getFileIcon(resource) {

  switch (detectType(resource.mime)) {
    case "audio":
      return 'ri-music-2-line';
    case "video":
      return 'ri-video-on-line';
    // case "Font":
    //   return 'ri-font-serif';
    case "image":
      return 'ri-image-2-line';
    case "text":
      const fileInfo = getFileInfo(resource.original_name);
      if (codeAssume.indexOf(fileInfo.ext) !== -1) {
        return 'ri-file-code-line';
      } else {
        return 'ri-file-text-line'
      }
    default:
      return 'ri-file-line';
  }
}

function removeSelectedResources() {
  store.dispatch('ide/showConfirm', {
    onConfirm() {
      for (const res of selected.value) {
        store.dispatch('project/removeResource', res.hash_id)
      }
      selected.value = [];

    },
    onCancel() {

    },
    text: "Are you sure to remove these resources?",
    title: 'Remove resources confirm',
  });

}

function resourceClass(resource) {
  if (selected.value.indexOf(resource) === -1) {
    return 'resource-item';
  }
  return 'resource-item selected';
}

const detectType = (mime) => {
  if (!mime) return null;

  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("audio/")) return "audio";
  if (mime.startsWith("video/")) return "video";
  if (mime.startsWith("text/")) return "text";

  return null;
};

const loadTextPreview = async (url) => {
  const response = await fetch(url, {
    headers: {
      Range: "bytes=0-102399"
    }
  });

  if (!response.ok) {
    throw new Error("Failed to load preview");
  }

  return (await response.text()).slice(0, 100 * 1024);
};

watch(lastSelectedResource, async (resource) => {
  const type = detectType(resource?.mime);

  // Clear text preview for non-text resources
  if (type !== "text") {
    textPreview.value = null;
    return;
  }

  // Load text preview for text resources
  textPreview.value = await loadTextPreview(resource.url);
});

</script>

<style scoped>


/* Preview items */

.video-preview, .audio-preview, .image-preview, .text-preview {
  width: 100%;
  height: auto;
  display: block;
}

.text-preview {
  padding: .45rem;
  height: calc(100vh - 85px);
  background: #00000088;
  color: #eeeeee;
  outline: none;
  border: none;
  width: 100%;
}

.preview-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 85px);
  width: 100%;
}

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

  border-bottom: 1px solid rgba(255, 255, 255, .06);
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

  border: 1px solid rgba(255, 255, 255, .06);
  border-radius: 6px;

  background: transparent;
  color: #bfbfbf;

  transition: .18s;

  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, .05);
    color: white;
  }

  &.danger:hover {
    color: #ff7777;
  }
}

.toolbar-search {

  width: 240px;

  display: flex;
  align-items: center;
  gap: 8px;

  padding: 0 10px;

  border-radius: 7px;

  background: rgba(255, 255, 255, .04);

  input {

    flex: 1;

    height: 34px;

    border: none;
    outline: none;

    color: #ddd;

    background: none;
  }

}

/* Main */

.content {

  display: flex;
  flex: 1;

  overflow: hidden;

}

/* Folder */

.folder-panel {

  width: 220px;

  border-right: 1px solid rgba(255, 255, 255, .05);

  background: var(--darker-bg);

}

.preview-panel {

  width: 350px;
  border-right: 1px solid rgba(255, 255, 255, .05);
  background: var(--darker-bg);

}

.panel-title {

  padding: 14px;

  font-size: .82rem;

  color: #888;

  text-transform: uppercase;

  letter-spacing: .08em;

}

.folder-tree {

  list-style: none;

  padding: 0;
  margin: 0;

  li {

    display: flex;
    align-items: center;

    gap: 10px;

    padding: 9px 14px;

    cursor: pointer;

    color: #aaa;

    transition: .15s;

    &:hover {

      background: rgba(255, 255, 255, .04);
      color: white;

    }

    &.active {

      background: rgba(255, 255, 255, .06);
      color: white;

    }

  }

}

/* Files */

.files-panel {

  flex: 1;

  overflow: auto;

  padding: 16px;

}

.resource-grid {

  display: grid;

  grid-template-columns:repeat(auto-fill, minmax(110px, 1fr));

  gap: 14px;

}

.resource-item {

  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 10px;

  padding: 10px;

  border-radius: 8px;

  border: 1px solid transparent;

  transition: .15s;

  cursor: pointer;

  &:hover {

    background: rgba(255, 255, 255, .03);
    border-color: rgba(255, 255, 255, .06);

  }

  &.selected {

    border-color: #4b88ff;

    background: rgba(75, 136, 255, .12);

  }

}

.preview {

  width: 72px;
  height: 72px;

  display: flex;
  justify-content: center;
  align-items: center;

  border-radius: 8px;

  background: rgba(255, 255, 255, .04);

  img {

    width: 100%;
    height: 100%;

    object-fit: cover;

    border-radius: 6px;

  }

  &.icon {

    font-size: 34px;
    color: #9ea4aa;

  }

}

.name {

  width: 100%;

  text-align: center;

  font-size: .82rem;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

}

/* Status */

.status-bar {

  height: 30px;

  display: flex;
  align-items: center;

  padding: 0 12px;

  border-top: 1px solid rgba(255, 255, 255, .06);

  background: var(--darker-bg);

  color: #8c8c8c;

  font-size: .78rem;

}

.placeholder {
  opacity: .7;
}

</style>