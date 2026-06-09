<template>
  <div id="modal" v-if="enabled">
    <div id="anubias-confirm">
      <h3>
        {{ confirmTitle }}
      </h3>
      <p>
        {{ confirmText }}
      </p>
      <div class="grid-equal">
        <div>
          <div class="circle-btn" title="Yes" @click="confirming">
            <i class="ri-check-line"></i>
          </div>
        </div>
        <div>
          <div class="circle-btn" title="No" @click="canceling">
            <i class="ri-close-line"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "anubias-confirm",
  components: {},
  data: () => {
  },
  props: {
    enabled: {
      type: Boolean,
      default:false,
      required: false,
    },
    confirmTitle: {
      type: String,
      default: "Confirm",
      required: false,
    },
    confirmText: {
      type: String,
      default: "Are you sure?",
      required: false,
    },
    onCancel: {
      type: Function,
      default: () => {
      }
    },
    onConfirm: {
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
      this.$store.commit('ide/HIDE_CONFIRM');
      this.onCancel();
    },
    confirming(){
      this.$store.commit('ide/HIDE_CONFIRM');
      this.onConfirm();
    }
  },
  watch:{
    enabled(newval){
      if (newval){
        document.addEventListener('keyup', this.handleKeyup)
      }else{
        document.removeEventListener('keyup', this.handleKeyup)
      }
    }

  }
}
</script>

<style scoped>
#modal {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  background: #00000022;
  backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99;
}

#anubias-confirm {
  background: var(--darker-bg);
  min-width: 500px;
  box-shadow: 0 0 7px #aaaaaa;
  border-radius: 7px;
}

h3 {
  border-radius: 7px;
  font-size: 24px;
  padding: 0;
  text-align: center;
  margin: 0;
  background: var(--def-bg);
  font-weight: 200;
}

p {
  padding: 1rem;
}
.grid-equal {
  padding: 0 10px 10px;
  grid-gap: 10px;
  text-align: center;
  margin-bottom: -35px;
}

.grid-equal .circle-btn {
  margin: auto;
  width: 45px;
  height: 45px;
  margin-top: .5rem;
}

</style>