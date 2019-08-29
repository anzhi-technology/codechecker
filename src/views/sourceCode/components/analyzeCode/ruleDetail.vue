<template>
  <div class="ruleDetail">
    <a-tabs>
      <a-tab-pane tab="概况" key="1" class="tabContent" v-html="abstractContent"></a-tab-pane>
      <a-tab-pane tab="修复建议" key="2" class="tabContent" v-html="recommendations"></a-tab-pane>
      <a-tab-pane tab="解释说明" key="3" class="tabContent" v-html="explanation"></a-tab-pane>
      <a-tab-pane tab="参考文献" key="4" class="tabContent" v-html="references"></a-tab-pane>
      <a-tab-pane tab="结点追踪" class="tabContent" key="5">
        <a-timeline>
          <a-timeline-item v-if="language === 'en'" v-for="item in entryDtos">
            <p>action:{{item.action}}</p>
            <p>snippet:{{item.snippet}}</p>
          </a-timeline-item>
          <a-timeline-item v-if="language === 'cn'" v-for="item in entryDtos">
            <p>操作方法:{{item.action}}</p>
            <p>代码段:{{item.snippet}}</p>
          </a-timeline-item>
        </a-timeline>
      </a-tab-pane>
      <a-button slot="tabBarExtraContent" size="small" v-text="buttonName" type="primary" @click="translation"></a-button>
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
      references: null,
      entryDtos: null,
      buttonName:"翻译",
      language:"en"
    }
  },
  mounted() {
    Bus.$on('getData', (data) => {
      this.ruleIDs = data.ruleID;
      this.getData();
    });
    //结点追终
    Bus.$on('getEntryDtos', (data) => {
      //结点追终
      let entryDtos = [];
      data.forEach(item_detail =>{
        item_detail.entryDtos.forEach(item_entryDtos => {
          item_entryDtos.nodeRefs.forEach(item_nodeRefs => {
            if(item_nodeRefs.action){
              entryDtos.push({"action": item_nodeRefs.action, "snippet": item_nodeRefs.sourceLocation.snippet})
            }
          });
        });
      });
      this.entryDtos = entryDtos;
    });
  },
  methods: {
    /*获取数据*/
    getData() {
      let ruleIDs = this.ruleIDs;
      return getRuleInfos(ruleIDs, this.language).then(res => {
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
    translation(){
      if(this.language === "en"){
        this.language = "cn"
      }else if(this.language === "cn"){
        this.language = "en"
      }
      this.getData();
    }
  }
}
</script>

<style scoped>
  .ruleDetail {
    background: #fff;
    margin-left:2px;
    margin-right:2px;
  }
  .tabContent {
    padding: 0 10px 10px 10px;
    height:280px;
    overflow:auto
  }
</style>