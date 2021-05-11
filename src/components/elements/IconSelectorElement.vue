<template>
  <div>
    <div class="field">
      <label>Icon</label>
      <div class="ui fluid selection dropdown search">
        <input type="hidden" name="color" v-model="icon">
        <i class="dropdown icon"></i>
        <div class="default text">Select Color</div>
        <div class="menu">
          <div v-for="(ic,n) in icons" v-bind:key="n" class="item" :data-value="ic.value">
            <span class="icon material-icons-round">{{ ic.value }}</span>
            <b> {{ ic.name }} </b>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "IconSelectorElement",
  data: function () {
    return {
      icon: 'add',
      icons: window.material_icons
    }
  },mounted() {
    var $ = window.jQuery;
    $(".ui .dropdown").dropdown();
  }
}
</script>

<style scoped>
  .menu{
    vertical-align: middle;
  }
  b{
    font-weight: normal;
    position: relative;
    top: -6px;
  }
</style>