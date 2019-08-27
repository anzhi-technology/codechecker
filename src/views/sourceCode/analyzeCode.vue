<template>
  <div >
    <a-row :gutter="8">
      <a-col :span="8">
        <vulnerabilityList/>
      </a-col>
      <a-col :span="16">
        <!--<codeDetail />-->
        <div class="fileDetail">
          <codeDetailTab />
        </div>
        <div class="ruleDetail">
          <ruleDetail />
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import vulnerabilityList from "@/views/sourceCode/components/analyzeCode/vulnerabilityList"
import codeDetailTab from "@/views/sourceCode/components/analyzeCode/codeDetailTab"
import ruleDetail from "@/views/sourceCode/components/analyzeCode/ruleDetail"
export default {
  name: "",
  components:{
    vulnerabilityList,
    codeDetailTab,
    ruleDetail
  }
}
</script>

<style scoped>

</style>