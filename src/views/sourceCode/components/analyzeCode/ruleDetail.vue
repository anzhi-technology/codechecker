<template>
  <div class="ruleDetail">
    <a-tabs>
      <a-tab-pane tab="概况" key="1" v-html="abstractContent"></a-tab-pane>
      <a-tab-pane tab="修复建议" key="2" v-html="recommendations"></a-tab-pane>
      <a-tab-pane tab="解释说明" key="3" v-html="explanation"></a-tab-pane>
      <a-tab-pane tab="参考文献" key="4" v-html="references"></a-tab-pane>
      <a-tab-pane tab="结点追踪" key="5">Content of tab 3</a-tab-pane>
      <a-tab-pane tab="缺陷审计" key="6">Content of tab 3</a-tab-pane>
      <a-button slot="tabBarExtraContent" size="small">中文</a-button>
    </a-tabs>
  </div>
</template>

<script>
  import {getRuleInfos} from "@/api/sourceCode/codeDetail";
  import Bus from '@/utils/bus';
  import {isNull} from "@/utils/myUtils"

  export default {
    name: "ruleDetail",
    data() {
      return {
        ruleIDs: null,
        abstractContent: null,
        recommendations: null,
        explanation: null,
        references: null
      }
    },
    mounted() {
      Bus.$on('getData', (data) => {
        this.ruleIDs = data.ruleID;
        this.getData();
      });
    },
    methods: {
      /*获取数据*/
      getData() {
        let ruleIDs = this.ruleIDs;
        let lang = "cn";
        return getRuleInfos(ruleIDs, lang).then(res => {
          let content = res.content[0];
          this.abstractContent = content.abstractContent;
          this.recommendations = content.recommendations;
          this.explanation = content.explanation;
          //参考文献
          let references = '';
          let title = "";
          let source = "";
          let author = "";
          for (let i = 0; i < content.references.length; i++) {
            if (!isNull(content.references[i].title)) title = content.references[i].title;
            if (!isNull(content.references[i].source)) source = content.references[i].source;
            if (!isNull(content.references[i].author)) author = content.references[i].author;
            references = references + '<p>[' + (i + 1) + '].&nbsp;' + title + ';&nbsp;<a href=' + source + ' target="_Blank">' + source + '</a>&nbsp;' + author + ';</p>';
          }
          this.references = references;
        });
      },
    }
  }
</script>

<style scoped>
  .ruleDetail {
    background: #fff;
  }
</style>