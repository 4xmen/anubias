<template>
  <div class="tab-page">
    <div v-if="type == 'code'">
      <code-editor :pointer="this.pointer"></code-editor>
    </div>
  </div>
</template>

<script>
import codeEditor from '../elements/CodeEditor'
export default {
  name: "TabControl",
  props:['data','type','pointer'],
  mounted() {
    // this.content = this.value;
  },
  components:{
    codeEditor
  },
  watch:{
    // content:function (v) {
    //   // console.log('tab',v);
    //   this.$emit("input", v);
    //   this.$forceUpdate();
    // }
  },
  data:function () {
    return{
      content: this.value,
    }
  },
  methods: {

  }
}
</script>

<style scoped>
.tab-page {
  min-height: 100vh;
}
</style>