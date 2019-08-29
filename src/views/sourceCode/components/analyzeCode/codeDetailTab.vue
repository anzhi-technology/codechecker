<template>
  <div>
    <a-tabs
      hideAdd
      v-model="activeKey"
      type="editable-card"
      @edit="onEdit"
    >
      <a-tab-pane v-for="pane in panes" :key="pane.key" :closable="pane.closable">
        <a-tooltip slot="tab" :title="pane.filePath">
          <span v-text="pane.title"></span>
        </a-tooltip>
        <!-- codemirror -->
        <codemirror v-model="pane.content"
                    :options="cmOption"
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
import _ from "underscore" //引入数据处理的分装方法
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
    const content = "# 请点击左侧缺陷列表查看缺陷详情";
    const panes = [
      {title: '文件路径', content: content, key: '1', closable: false},
    ];
    return {
      activeKey: panes[0].key,
      panes,
      code: '',
      newTabIndex: 0,
      filePath: '',
      fileName: '',
      preciseLineArray:[],
      newTabKey: '',
      ruleID: '',
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
        highlightSelectionMatches: {showToken: /\w/, annotateScrollbar: true},
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter", "CodeMirror-selected"],
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
  computed: {
    codemirror() {
      return this.$refs.myCm
    },
  },
  mounted() {
    //this.setCodemirror();
    Bus.$on('getData', (data) => {
      this.filePath = data.filePath;
      this.ruleID = data.ruleID;
      this.fileName = data.fileName;
      this.newTabKey = data.key;
      this.preciseLineArray = data.preciseLineArray;
      //let fristPreciseLine = _.min(preciseLineArray);

      this.getData().then(() => {
        this.add();//添加标签
      });
    });
    //this.setCodemirror();
  },
  created() {
    this.$nextTick(() => {
      this.setCodemirror();
    });
  },
  updated(){
    this.$nextTick(() => {
      this.setCodemirror();
    });
  },
  methods: {
    /*新增和删除页签的回调，在 type="editable-card" 时有效*/
    onEdit(targetKey, action) {
      this[action](targetKey)
    },
    /*添加标签*/
    add() {
      const panes = this.panes;
      const judgeKey = `newTab${this.newTabIndex++}`;
      const activeKey = this.newTabKey.toString();
      let judgeActiveKey = panes.filter(obj => obj.key === activeKey);
      if(judgeActiveKey.length === 0){
        //判断第一个tab的时候情况
        if (judgeKey === "newTab0") {
          panes[0] = {title: `${this.fileName}`, content: `${this.code}`, key: activeKey, closable: false, filePath: this.filePath};
        } else {
          panes.push({title: `${this.fileName}`, content: `${this.code}`, key: activeKey, filePath: this.filePath});
        }
      }
      //如果只有一个tab 设置为不可关闭
      if (panes.length !== 1) panes[0].closable = true;
      this.panes = panes;
      this.activeKey = activeKey;

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
      //如果只有一个tab 设置为不可关闭
      if (panes.length === 1) panes[0].closable = false;
      this.panes = panes;
      this.activeKey = activeKey;
    },
    /*获取数据*/
    getData() {
      let formData = new FormData();
      formData.append("hcode", this.$route.params.parameter);
      formData.append("filePath", this.filePath);
      return getFileContent(formData).then(res => {
        this.code = res.data.content.join("\n");
      });
    },
    /*setCodemirror*/
    setCodemirror(){
      this.codemirror.forEach(obj => {
        //设置codemirror的高度
        obj.codemirror.setSize('auto', '350px');
        //将第一个精确行放在视野中间
        if(this.preciseLineArray.length !== 0){
          let fristPreciseLine = _.min(this.preciseLineArray);
          let h = obj.codemirror.getScrollInfo().clientHeight;
          let coords = obj.codemirror.charCoords({
            line: parseInt(fristPreciseLine),
            ch: 0
          }, "local");
          obj.codemirror.scrollTo(null, (coords.top + coords.bottom - h) / 2);
          this.preciseLineArray.forEach(item=>{
            obj.codemirror.getDoc().addLineClass((parseInt(item) - 1), "background", "lineDemo");
          })
        }
      });
    }
  },
}
</script>
<style>
  /* codemirror 高亮行样式 */
  .lineDemo{
    background-color:#f3f3f4;
    opacity: 0.4;
  }
</style>