<template>
  <div class="codeEdit">
    <div :id="'codeEdit'+id"></div>
<!--    <textarea id="codeEditor" class="input-field" v-model="content" ></textarea>-->
  </div>
</template>

<script>


import loader from '@monaco-editor/loader';
const myRnId = () => parseInt(Date.now() * Math.random());
export default {
  name: "CodeEditor",
  data: function () {
    return {
      content: eval(this.pointer),
      id : myRnId(),
      options: {
        //Monaco Editor Options
      }
    }
  },
  components: {
    // MonacoEditor
  },
  props:{
    pointer: String,
  },
  beforeDestroy() {
    // editor.destroy();
  },
  watch:{
    content:function () {
      eval(this.pointer + `= this.content ;`)  ;
    }
  },
  mounted() {
    var self = this;
    const wrapper = document.getElementById('codeEdit'+this.id);
    loader.init().then(monaco => {
      let monEditor = monaco.editor.create(wrapper, {
        value: this.content,
        language:"dart",
        theme:"vs-dark",
        fontFamily: "VazirCodeX",
        fontSize: 18,
        automaticLayout: true
      });
      /*eslint-disable */
      monEditor.onDidChangeModelContent(function (e) {
        // console.log(e);
        self.content = monEditor.getValue();
        // render();
      });
      /*eslint-enable */
      // setTimeout(function () {
      //   // console.log(monaco.editor);
      //   // monaco.editor.width = '100%';
      //   // monaco.editor.height = '100vh';
      //
      //   // monaco.editor.setTheme('vs-dark');
      //
      //   // monaco.editor.setModelLanguage('javascript');
      // },1000);
    });


  },
  methods:{
    onChange(value) {
      this.content = value;
    }
    // closeModal:function () {
    //   this.$parent.$parent.closeAllModal();
    // }
  },
  plugins: [
    // new MonacoWebpackPlugin({
    //   languages: ['javascript']
    // })
  ]
}
</script>

<style scoped>
h4 {
  font-size: 18px;
  margin: 10px auto;
  font-weight: bold;
}

.container {
  width: 80%;
  margin: 50px auto 0 auto;
  max-width: 1000px;
  border-radius: 7px;
  background: #1e2329;
  padding: 15px;
  line-height: 2em;
}
.fa-circle {
  margin-right: 10px;
}
h4{
  display: inline-block;
  padding-left: 20px;
}
#codeEditor {
  height: 100vh;
  font-size: 16px;
  border: 0;
  color: white;
  outline: none;
}

.codeEdit{
  padding-top: 1rem;
}

#codeEdit{
  height: 100vh;
  width: 100%;
}
</style>