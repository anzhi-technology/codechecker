<template>
  <div>
    <a-tabs
      hideAdd
      v-model="activeKey"
      type="editable-card"
      @edit="onEdit"
    >
      <a-tab-pane v-for="pane in panes" :tab="pane.title" :key="pane.key" :closable="pane.closable" >
        <!-- codemirror -->
        <codemirror v-model="pane.content"
                    :options="cmOption"
                    @cursorActivity="onCmCursorActivity"
                    @ready="onCmReady"
                    @focus="onCmFocus"
                    @blur="onCmBlur"
                    ref="myCm"
        >
        </codemirror>
      </a-tab-pane>
    </a-tabs>
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
    components: {
      codemirror
    },
    data() {
      const panes = [
        {title: '源代码', content: '', key: '1', closable: false},
      ];
      return {
        activeKey: panes[0].key,
        panes,
        code: '',
        newTabIndex: 0,
        filePath: '',
        ruleID:'',
        cmOption: {
          tabSize: 4,
          foldGutter: true,
          styleActiveLine: true,
          lineNumbers: true,
          lineWrapping: true,
          readOnly: true,
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
        },
      }
    },
    mounted() {
      Bus.$on('getData', (data) => {
        this.filePath = data.filePath;
        this.ruleID = data.ruleID;
        this.getData().then(() => {
          this.add();
        });
      });
    },
    methods: {
      callback(key) {
        console.log(key)
      },
      onEdit(targetKey, action) {
        this[action](targetKey)
      },
      /*添加标签*/
      add() {
        //this.remove("1");
        const panes = this.panes;
        const activeKey = `newTab${this.newTabIndex++}`;
        let judge= this.ruleID + this.filePath; //判断tab 重复的条件
        panes.push({title: `${this.filePath}`, content: `${this.code}`, key: activeKey});
        this.panes = panes;
        this.activeKey = activeKey
      },
      /*清除标签*/
      remove(targetKey) {
        let activeKey = this.activeKey;
        let lastIndex;
        this.panes.forEach((pane, i) => {
          if (pane.key === targetKey) {
            lastIndex = i - 1
          }
        });
        const panes = this.panes.filter(pane => pane.key !== targetKey);
        if (lastIndex >= 0 && activeKey === targetKey) {
          activeKey = panes[lastIndex].key
        }
        if (panes.length === 1) panes[0].closable = false;
        this.panes = panes;
        this.activeKey = activeKey;
      },
      /*获取数据*/
      getData() {
        let formData = new FormData();
        formData.append("sid", this.$route.params.parameter);
        formData.append("filePath", this.filePath);
        return getFileContent(formData).then(res => {
          if( res.status === 200 ){
            this.code = res.data.content.join("\n");
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
    },
  }
</script>
