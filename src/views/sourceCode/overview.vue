<template>
  <div class="overview">
    <a-row :gutter="8">
      <a-col :span="12">
        <a-card title="缺陷检测统计">
          <a-tag color="#108ee9" slot="extra">缺陷总数</a-tag>
          <defectCount/>
        </a-card>
      </a-col>
      <a-col :span="12">
        <a-card title="高危漏洞总数排列">
          <a-tag color="#f50" slot="extra">Top5</a-tag>
          <highRiskVulnerabilityCount/>
        </a-card>
      </a-col>
    </a-row>
    <br/>
    <a-row :gutter="8">
      <a-col :span="8">
        <a-card title="缺陷总数排列">
          <a-tag color="#2db7f5" slot="extra">Top5</a-tag>
          <vulnerabilityCount/>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card title="项目缺陷检测次数统计">
          <a-tag color="#87d068" slot="extra">检测次数</a-tag>
          <checkNumberCount/>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card title="依赖检测统计">
          <a-tag color="#1ab394" slot="extra">漏洞总数</a-tag>
          <dependenceCount/>
        </a-card>
      </a-col>
    </a-row>
    <br/>
    <a-row>
      <a-col :span="24">
        <a-card title="单个项目缺陷数量统计">
          <singleProjectCount />
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
  import defectCount from "@/views/sourceCode/components/overview/defectCount"
  import highRiskVulnerabilityCount from "@/views/sourceCode/components/overview/highRiskVulnerabilityCount"
  import vulnerabilityCount from "@/views/sourceCode/components/overview/vulnerabilityCount"
  import checkNumberCount from "@/views/sourceCode/components/overview/checkNumberCount"
  import dependenceCount from "@/views/sourceCode/components/overview/dependenceCount"
  import singleProjectCount from "@/views/sourceCode/components/overview/singleProjectCount"

  export default {
    name: "overview",
    components: {
      defectCount,
      highRiskVulnerabilityCount,
      vulnerabilityCount,
      checkNumberCount,
      dependenceCount,
      singleProjectCount
    }
  }
</script>

<style scoped>

</style>