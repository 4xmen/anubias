<!-- InputPromptModal.vue -->
<template>
  <section id="prompt-modal" v-if="enabled">
    <div class="modal-container-layout">
      <div class="modal-header">
        <i class="ri-close-line" @click="canceling"></i>
        <h3>{{promptTitle}}</h3>
      </div>
      <div class="modal-body">
        <label for="prmpt-modal-input">{{promptText}}:</label>
        <input type="text" ref="renameInput"
               id="prmpt-modal-input" v-model="val" :placeholder="promptPlaceholder">
      </div>
      <div class="modal-footer">
        <button type="button" class="main-btn" @click="accepting">Accept</button>
        <button type="button" class="cancel-btn" @click="canceling">Cancel</button>
      </div>
    </div>
  </section>
</template>

<script>
import {nextTick} from "vue";

export default {
  name: "anubias-prompt",
  components: {},
  data: () => {
    return{
      val: '',
    }
  },
  props: {
    enabled: {
      type: Boolean,
      default:false,
      required: false,
    },
    promptTitle: {
      type: String,
      default: "prompt",
      required: false,
    },
    promptText: {
      type: String,
      default: "Input",
      required: false,
    },
    promptPlaceholder: {
      type: String,
      default: "Input",
      required: false,
    },
    onCancel: {
      type: Function,
      default: () => {
      }
    },
    defaultValue:{
      type: String,
      default: "",
    },
    onAccept: {
      type: Function,
      default: () => {
      }
    },
  },
  mounted() {
  },
  computed: {},
  methods: {
    handleKeyup(event) {
      if (event.key === 'Enter') {
        this.confirming();
        // Do something when Enter is pressed
      } else if (event.key === 'Escape') {
        this.canceling();
        // Do something when ESC is pressed
      }
    },
    canceling(){
      this.$store.commit('ide/HIDE_PROMPT');
      this.onCancel();
    },
    accepting(){
      this.$store.commit('ide/HIDE_PROMPT');
      this.onAccept(this.val);
    }
  },
  watch:{
    enabled(newval){
      if (newval){
        document.addEventListener('keyup', this.handleKeyup)
        this.val = this.defaultValue;
        nextTick(() => {
          this.$refs.renameInput.focus();
          this.$refs.renameInput.select();
        })
      }else{
        document.removeEventListener('keyup', this.handleKeyup)
      }
    }
  },
}
</script>
<style scoped>
#prompt-modal {
  position: fixed;
  left: calc(50% - 250px);
  top: 35%;
  width: 500px;
  z-index: 1000;
}

.modal-container-layout {
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
  overflow: hidden;

  .modal-header {
    background: var(--darker-bg);
    padding: 14px 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    display: flex;
    align-items: center;
    gap: 12px;

    h3 {
      margin: 0;
      font-size: 13px;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.9);
    }

    i {
      margin-right: auto;
      cursor: pointer;
      color: rgba(255, 255, 255, 0.5);
      padding: 4px;
      border-radius: 3px;
      transition: all 0.2s ease;

      &:hover {
        background: rgba(255, 255, 255, 0.08);
        color: rgba(255, 255, 255, 0.8);
      }
    }
  }

  .modal-body {
    background: var(--def-bg);
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;

    label {
      font-size: 12px;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.75);
    }

    input {
      padding: 8px 12px;
      background: var(--darker-bg);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 4px;
      color: rgba(255, 255, 255, 0.9);
      font-size: 12px;
      transition: all 0.2s ease;

      &::placeholder {
        color: rgba(255, 255, 255, 0.4);
      }

      &:hover {
        border-color: rgba(255, 255, 255, 0.15);
      }

      &:focus {
        outline: none;
        border-color: rgba(255, 255, 255, 0.25);
        background: rgba(255, 255, 255, 0.02);
      }
    }
  }

  .modal-footer {
    background: var(--darker-bg);
    padding: 12px 16px;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
    display: flex;
    gap: 8px;
    justify-content: flex-end;

    button {
      padding: 6px 16px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      border: 1px solid transparent;
    }

    .main-btn {
      background: rgba(88, 166, 255, 0.2);
      color: #58a6ff;
      border-color: rgba(88, 166, 255, 0.3);

      &:hover {
        background: rgba(88, 166, 255, 0.25);
        border-color: rgba(88, 166, 255, 0.4);
      }
    }

    .cancel-btn {
      background: transparent;
      color: rgba(255, 255, 255, 0.7);
      border-color: rgba(255, 255, 255, 0.1);

      &:hover {
        background: rgba(255, 255, 255, 0.06);
        border-color: rgba(255, 255, 255, 0.2);
        color: rgba(255, 255, 255, 0.85);
      }
    }
  }
}
</style>
