<template>
  <div class="collapsible">
    <h4 @click="expanded = !expanded">
      <i :class="'icon '+headIcon"></i>
      {{ title }}
      <span class="state">
        <i class="ri-arrow-drop-up-line" v-if="expanded"></i>
        <i class="ri-arrow-drop-down-line" v-else></i>
      </span>
    </h4>
    <div class="content" v-if="expanded">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "collapsible",
  props: {
    title: {
      type: String,
      required: true,
      default: 'collapsible',
    },
    icon: {
      type: String,
      default: '',
    },
    expand: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      expanded: true,
      headIcon: '',
    }
  },
  mounted() {
    this.expanded = this.expand;
    this.headIcon = this.icon;
  }
}
</script>

<style scoped>
.collapsible{
  border-top: 1px solid var(--lighter-bg);
}
h4{
  font-size: 15px;
  border-bottom:  1px solid var(--lighter-bg);
  background: var(--darker-bg);
  text-align: center;
  overflow: hidden;
  padding: 3px;
  padding-bottom: 0;
  position: relative;
}
h4 i{
  font-size: 20px;
}
h4 .icon{
  position: absolute;
  left: 5px;
  top: -2px;
}
.state{
  position: absolute;
  right: 5px;
  top: -2px;
}
.content{
  padding: 5px;
}
</style>