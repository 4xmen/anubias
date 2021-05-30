<template>
  <div>
     <div id="codeEditor" class="editor"></div>
  </div>
</template>

<script>
import ace from 'brace';
// import {xscript} from "@/assets/js/xscript";

export default {
  name: "CodeEditor",
  mounted() {
    require('brace/ext/language_tools') //language extension prerequsite...
    // require('brace/mode/javascript')    //language
    // require('brace/snippets/javascript') //snippe
    require("@/assets/js/xscript");
    require("@/assets/js/xScriptSnipts");
    require('brace/theme/dracula');

    let editor = ace.edit('codeEditor');
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

  }
}
</script>

<style scoped>
  #codeEditor{
    height: 70vh;
    font-size: 16px;
  }
</style>