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
    // let snippetManager = ace.acequire('ace/snippets').snippetManager;
        // editor.setValue([
    //       '// JavaScript'
    //       , 'var a = 3;'
    //       , ''
    //       , '// below line has an error which is annotated'
    //       , 'var b ='
    //     ].join('\n')
    // );
    // editor.clearSelection();


    // console.log('hello');
    // console.log(snippetManager);
    // console.log('bye');
    // let customSnippet = snippetManager.parseSnippetFile(xscript, 'xscript');
    //

    let editor = ace.edit('codeEditor');
    editor.getSession().setMode('ace/mode/xscript');
    editor.setTheme('ace/theme/dracula');
    editor.setOptions({
      enableBasicAutocompletion: true,
      enableLiveAutocompletion: true,
      fontSize: 16,
      highlightActiveLine: true,
      enableSnippets: true,
      showLineNumbers: true,
      tabSize: 2,
      showPrintMargin: false,
      showGutter: true,
    });
    // snippetManager.register(editor, editor.session, customSnippet, 'xscript');
    // console.log(xscript);
  }
}
</script>

<style scoped>
  #codeEditor{
    height: 70vh;
    font-size: 16px;
  }
</style>