/*eslint-disable */
ace.define("ace/snippets/xscript",
    ["require", "exports", "module"],
    function (e, t, n) {
        "use strict";
        t.snippetText = '# Function\n' +
            'snippet fun\n' +
            '\tfunction ${1?:function_name}(${2:argument}) {\n' +
            '\t\t${3:// body...}\n' +
            '\t}\n' +
            '# if\n' +
            'snippet if\n' +
            '\tif (${1:true}) {\n' +
            '\t\t${0}\n' +
            '\t}\n' +
            '# if ... else\n' +
            'snippet ife\n' +
            '\tif (${1:true}) {\n' +
            '\t\t${2}\n' +
            '\t} else {\n' +
            '\t\t${0}\n' +
            '\t}\n' +
            '# tertiary conditional\n' +
            'snippet ter\n' +
            '\t${1:/* condition */} ? ${2:a} : ${3:b}\n' +
            '# switch\n' +
            'snippet switch\n' +
            '\tswitch (${1:expression}) {\n' +
            '\t\tcase \'${3:case}\':\n' +
            '\t\t\t${4:// code}\n' +
            '\t\t\tbreak;\n' +
            '\t\t${5}\n' +
            '\t\tdefault:\n' +
            '\t\t\t${2:// code}\n' +
            '\t}\n' +
            '# case\n' +
            'snippet case\n' +
            '\tcase \'${1:case}\':\n' +
            '\t\t${2:// code}\n' +
            '\t\tbreak;\n' +
            '\t${3}\n' +
            '\n' +
            '# while (...) {...}\n' +
            'snippet wh\n' +
            '\twhile (${1:/* condition */}) {\n' +
            '\t\t${0:/* code */}\n' +
            '\t}\n' +
            '# try\n' +
            'snippet try\n' +
            '\ttry {\n' +
            '\t\t${0:/* code */}\n' +
            '\t} catch (e) {}\n' +
            '# do...while\n' +
            'snippet do\n' +
            '\tdo {\n' +
            '\t\t${2:/* code */}\n' +
            '\t} while (${1:/* condition */});\n' +
            '# console.log (Firebug)\n' +
            'snippet cl\n' +
            '\tconsole.log(${1});\n' +
            '# return\n' +
            'snippet ret\n' +
            '\treturn ${1:result}\n' +
            '# for (property in object ) { ... }\n' +
            'snippet fori\n' +
            '\tfor (var ${1:prop} in ${2:Things}) {\n' +
            '\t\t${0:$2[$1]}\n' +
            '\t}\n' +
            '# JSON.parse\n' +
            'snippet jsonp\n' +
            '\tJSON.parse(${1:jstr});\n' +
            '# JSON.stringify\n' +
            'snippet jsons\n' +
            '\tJSON.stringify(${1:object});\n' +
            '# for 2\n' +
            'snippet for-\n' +
            '\tfor (var ${1:i} = ${2:Things}.length; ${1:i}--; ) {\n' +
            '\t\t${0:${2:Things}[${1:i}];}\n' +
            '\t}\n' +
            '# for (...) {...}\n' +
            'snippet for\n' +
            '\tfor (var ${1:i} = 0; $1 < ${2:Things}.length; $1++) {\n' +
            '\t\t${3:$2[$1]}$0\n' +
            '\t}\n' +
            '# for (...) {...} (Improved Native For-Loop)\n' +
            'snippet forr\n' +
            '\tfor (var ${1:i} = ${2:Things}.length - 1; $1 >= 0; $1--) {\n' +
            '\t\t${3:$2[$1]}$0\n' +
            '\t}\n' +
            '\n' +
            '# page back\n' +
            'snippet pb\n' +
            '\tpage.back();\n'+
            '# page go\n' +
            'snippet pg\n' +
            '\tpage.go(\'${1:pagename}\');'
            , t.scope = "xscript"
    })
/*eslint-enable */