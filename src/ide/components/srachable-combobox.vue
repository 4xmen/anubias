<template>
  <div class="combobox-wrapper" ref="wrapper">
    <!-- Trigger -->
    <div class="search-btn" @click="modalShow = true">
      <i class="ri-search-line"></i>
    </div>
    <div
        class="combobox-trigger"
        :class="{ open }"
        tabindex="0"
        @click="toggleDropdown"
        @keydown="handleTriggerKeydown"
        @focus="onFocus"
    >
      <slot name="trigger">
        <div class="selected-value">
          {{ displayValue }}
        </div>
      </slot>
      <span class="arrow">▼</span>
    </div>

    <!-- Dropdown -->
    <transition name="fade">
      <div v-if="open" class="combobox-dropdown" ref="dropdown">
        <div class="options-container" ref="optionsList">
          <slot></slot>
        </div>
      </div>
    </transition>
  </div>
  <div id="sc-modal" v-if="modalShow" @click.self="modalShow = false">
    <div id="search-box">
      <input type="search" placeholder="Search..." v-model="q" @keyup="searching">
      <div id="scrolled-list" ref="scrolledList">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SearchableCombobox",
  props: {
    modelValue: {
      type: [String, Number, Object],
      default: null
    },
    placeholder: {
      type: String,
      default: "Choose one ..."
    }
  },
  emits: ["update:modelValue"],
  provide() {
    return {
      combobox: this
    }
  },
  data() {
    return {
      open: false,
      highlightedValue: null,
      options: [], // {value, label}
      q: '',
      modalShow: false,
    }
  },
  computed: {
    displayValue() {
      const found = this.options.find(opt => opt.value === this.modelValue)
      return found ? found.label : this.placeholder
    }
  },
  watch: {
    modelValue() {
      //change from outside highlighted
      this.highlightedValue = this.modelValue
    }
  },
  methods: {
    handleClickOutside(e) {
      if (!this.$refs.wrapper?.contains(e.target)) {
        this.closeDropdown()
      }
    },
    toggleDropdown() {
      this.open = !this.open
      if (this.open) {
        this.$nextTick(() => {
          this.highlightedValue = this.modelValue
          this.scrollToHighlighted()
        })
      }
    },

    closeDropdown() {
      this.open = false
      this.highlightedValue = null
    },

    select(value) {
      this.$emit("update:modelValue", value)
      this.closeDropdown()
      this.$refs.wrapper?.focus()
    },

    highlight(value) {
      this.highlightedValue = value
    },

    // Keyboard Navigation
    handleTriggerKeydown(e) {
      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        if (!this.open) this.open = true
        this.$nextTick(() => this.highlightFirst())
      } else if (e.key === "Escape" && this.open) {
        this.closeDropdown()
      }
    },

    handleDropdownKeydown(e) {
      if (!this.open) return

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault()
          this.highlightNext()
          break
        case "ArrowUp":
          e.preventDefault()
          this.highlightPrev()
          break
        case "Enter":
          e.preventDefault()
          if (this.highlightedValue !== null) {
            this.select(this.highlightedValue)
          }
          break
        case "Escape":
          this.closeDropdown()
          break
      }
    },

    highlightFirst() {
      const firstOption = this.options[0]
      if (firstOption) this.highlightedValue = firstOption.value
      this.scrollToHighlighted()
    },

    highlightNext() {
      const currentIndex = this.options.findIndex(opt => opt.value === this.highlightedValue)
      const nextIndex = currentIndex < this.options.length - 1 ? currentIndex + 1 : 0
      this.highlightedValue = this.options[nextIndex].value
      this.scrollToHighlighted()
    },

    highlightPrev() {
      const currentIndex = this.options.findIndex(opt => opt.value === this.highlightedValue)
      const prevIndex = currentIndex > 0 ? currentIndex - 1 : this.options.length - 1
      this.highlightedValue = this.options[prevIndex].value
      this.scrollToHighlighted()
    },

    scrollToHighlighted() {
      this.$nextTick(() => {
        const highlightedEl = this.$refs.optionsList?.querySelector(".highlighted")
        if (highlightedEl) {
          highlightedEl.scrollIntoView({ block: "nearest" })
        }
      })
    },

    onFocus() {

    },

    searching(){
      const q = this.q;
      let list =this.$refs.scrolledList.querySelectorAll(':scope > div');
      for( const item of list) {
        if( item.innerText.toLowerCase().indexOf(this.q.toLowerCase()) === -1 ) {
          item.style.display = 'none';
        }else{
          item.style.display = 'block';
        }
      }

    },

    registerOption(option) {
      this.options.push(option)
    },

    unregisterOption(value) {
      this.options = this.options.filter(opt => opt.value !== value)
    }
  },

  mounted() {
    // close on blur
    document.addEventListener("click", this.handleClickOutside)
    // keyboard dropdown handle
    this.$refs.dropdown?.addEventListener("keydown", this.handleDropdownKeydown)
  },

  beforeUnmount() {
    document.removeEventListener("click", this.handleClickOutside)
  },

}
</script>

<style scoped>
.search-btn{
  padding: 4px 1rem;
  background: #282c34;
  border-right: 1px solid #1f1f1f;
  &:hover,&:focus{
    background: var(--text-hilight);
  }
}
.combobox-wrapper {
  position: relative;
  min-width: 160px;
  font-family: inherit;
  display: inline-flex;
}

.combobox-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: .3rem 1rem;
  border: 1px solid #282c34;
  background: #282c34;
  cursor: pointer;
  user-select: none;
}

.combobox-trigger:focus {
  outline: none;
  border-color: var(--text-hilight);
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.2);
}

.combobox-trigger.open {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

.arrow {
  font-size: 0.8em;
  transition: transform 0.2s;
}

.combobox-trigger.open .arrow {
  transform: rotate(180deg);
}

.combobox-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 220px;
  background: #282c34;
  border: 1px solid #1f1f1f;
  border-top: none;
  border-radius: 0 0 6px 6px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  max-height: 320px;
  overflow-y: auto;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.15s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

#sc-modal {
  background: #00000055;
  backdrop-filter: blur(10px) grayscale(1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2000;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
#search-box{
  background: #282c34;
  padding: .5rem;
  width: 300px;

  input{
    display: block;
    width: 100%;
    padding: 3px;
  }
}
#scrolled-list{
  height: 75vh;
  overflow-y: scroll;
  padding: .5rem 0;
}
</style>