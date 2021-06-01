<template>
  <div class="container">
    <h4>
      {{ title }}
    </h4>
    <div id="codeEditor" class="editor"></div>
  </div>
</template>

<script>
import ace from 'brace';
// import {xscript} from "@/assets/js/xscript";
var editor;
export default {
  name: "CodeEditor",
  data: function () {
    return {
      content: this.value,
    }
  },
  props: [
    'title',
    'value',
  ],
  beforeDestroy() {
    editor.destroy();
  },
  watch: {
    value: function (val) {
      if (this.content !== val) {
        editor.session.setValue(val, 1);
        this.content = val;
      }
    },
  },
  mounted() {
    var self = this;
    require('brace/ext/language_tools') //language extension prerequsite...
    // require('brace/mode/javascript')    //language
    // require('brace/snippets/javascript') //snippe
    require("@/assets/js/xscript");
    require("@/assets/js/xScriptSnipts");
    require('brace/theme/dracula');

    editor = ace.edit('codeEditor');
    editor.getSession().setMode('ace/mode/xscript');
    editor.setTheme('ace/theme/dracula');
    editor.setOptions({
      enableBasicAutocompletion: true,
      enableLiveAutocompletion: true,
      fontSize: 16,
      highlightActiveLine: false,
      enableSnippets: true,
      showLineNumbers: true,
      tabSize: 4,
      showPrintMargin: false,
      showGutter: true,
    });
    // editor.$blockScrolling = Infinity;
    if (this.value)
      editor.setValue(this.value, 1);
    this.content = this.value;
    editor.on('change', function () {
      var content = editor.getValue();
      self.content = content;
      self.$emit('input', content);
    });


  }
}
</script>

<style scoped>
h4 {
  font-size: 18px;
  margin: 10px auto;
  font-weight: bold;
}

.container {
  max-width: 900px;
  margin: auto;
}

#codeEditor {
  height: 85vh;
  font-size: 16px;
}
</style>