<template>
  <div>
    <div style="height: 57px;background-color:#fff;border-bottom:1px solid #E8E8E8;">
      <h3 class="title">文件名：{{filePath}}</h3>
    </div>
    <!-- codemirror -->
    <codemirror v-model="code"
                :options="cmOption"
                @cursorActivity="onCmCursorActivity"
                @ready="onCmReady"
                @focus="onCmFocus"
                @blur="onCmBlur"
                style="height: 1500px"
    >
    </codemirror>

  </div>
</template>

<script>
  import {getFileContent} from "@/api/sourceCode/codeDetail";
  import Bus from '@/utils/bus';
  import {codemirror} from 'vue-codemirror' // require component

  import 'codemirror/lib/codemirror.css'  // require styles
  import 'codemirror/mode/vue/vue.js'
  // theme css
  import 'codemirror/theme/monokai.css'
  // active-line.js
  import 'codemirror/addon/selection/active-line.js'
  // styleSelectedText
  import 'codemirror/addon/selection/mark-selection.js'
  import 'codemirror/addon/search/searchcursor.js'
  // highlightSelectionMatches
  import 'codemirror/addon/scroll/annotatescrollbar.js'
  import 'codemirror/addon/search/matchesonscrollbar.js'
  import 'codemirror/addon/search/searchcursor.js'
  import 'codemirror/addon/search/match-highlighter.js'
  // keyMap
  import 'codemirror/mode/clike/clike.js'
  import 'codemirror/addon/edit/matchbrackets.js'
  import 'codemirror/addon/comment/comment.js'
  import 'codemirror/addon/dialog/dialog.js'
  import 'codemirror/addon/dialog/dialog.css'
  import 'codemirror/addon/search/searchcursor.js'
  import 'codemirror/addon/search/search.js'
  import 'codemirror/keymap/sublime.js'
  // foldGutter
  import 'codemirror/addon/fold/foldgutter.css'
  import 'codemirror/addon/fold/brace-fold.js'
  import 'codemirror/addon/fold/comment-fold.js'
  import 'codemirror/addon/fold/foldcode.js'
  import 'codemirror/addon/fold/foldgutter.js'
  import 'codemirror/addon/fold/indent-fold.js'
  import 'codemirror/addon/fold/markdown-fold.js'
  import 'codemirror/addon/fold/xml-fold.js'

  export default {
    name: "codeDetail",
    components: {
      codemirror
    },
    data() {
      return {
        code:'',
        filePath:'',
        cmOption: {
          tabSize: 4,
          foldGutter: true,
          styleActiveLine: true,
          lineNumbers: true,
          lineWrapping: true,
          readOnly:true,
          line: true,
          keyMap: "sublime",
          mode: 'text/x-java',
          theme: "monokai",
          extraKeys: {
            'F11'(cm) {
              cm.setOption("fullScreen", !cm.getOption("fullScreen"))
            },
            'Esc'(cm) {
              if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false)
            }
          }
        }
      }
    },
    mounted() {
      Bus.$on('getFilePath', (data) => {
        this.filePath = data;
        this.getData();
      })
    },
    methods: {
      /*获取数据*/
      getData(){
        let formData = new FormData();
        formData.append("sid",this.$route.params.parameter);
        formData.append("filePath",this.filePath);
        getFileContent(formData).then(res => {
          if(res.status === 200){
             this.code = res.data.content.join("\n");
          }else{
            this.code ="错误信息：\n" +  res.msg;
          }
        });
      },
      onCmCursorActivity(codemirror) {
        console.log('onCmCursorActivity', codemirror)
      },
      onCmReady(codemirror) {
        console.log('onCmReady', codemirror)
      },
      onCmFocus(codemirror) {
        console.log('onCmFocus', codemirror)
      },
      onCmBlur(codemirror) {
        console.log('onCmBlur', codemirror)
      }
    }
  }
</script>

<style scoped>
  .title {
    position: relative;
    margin-left: 15px;
    left: 50%;
    top: 50%;
    -webkit-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
  }
</style>