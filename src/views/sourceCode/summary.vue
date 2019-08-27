<template>
  <div>
    <a-row :gutter="16">
      <a-col :span="8">
        <projectInformation/>
      </a-col>
      <a-col :span="16">
        <vulCount v-if="flag"
                  :timeData="timeData"
                  :startValue="startValue"
                  :singleCriticalData="singleCriticalData"
                  :singleHighData="singleHighData"
                  :singleMediumData="singleMediumData"
                  :singleLowData="singleLowData"
                  :loading="loading"
                  :visible="visible"/>
        <a-card v-show="loading" title="缺陷统计">
          <div style="height:218px;">
            <a-spin class="content"/>
          </div>
        </a-card>

      </a-col>
    </a-row>
    <br/>
    <a-row :gutter="16">
      <a-col :span="8">
        <vulInformation :listData="vulnerabilityData"/>
      </a-col>
      <a-col :span="8">
        <rankClassified v-if="flag"
                        :singleRankData="singleRankData"
                        :loading="loading"
                        :visible="visible"/>
        <a-card v-show="loading" title="等级分类统计">
          <div style="height:175px;">
            <a-spin class="content"/>
          </div>
        </a-card>
      </a-col>
      <a-col :span="8">
        <rankDistribution v-if="flag"
                          :valueData="valueData"
                          :max="max"
                          :loading="loading"
                          :visible="visible"/>
        <a-card v-show="loading" title="等级分布统计">
          <div style="height:175px;">
            <a-spin class="content"/>
          </div>
        </a-card>
      </a-col>
    </a-row>
    <br/>
    <a-row :gutter="16">
      <a-col :span="24">
        <vulClassified :dataSource="vulnerabilityTableData"/>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import projectInformation from "@/views/sourceCode/components/summary/projectInformation"
import vulInformation from "@/views/sourceCode/components/summary/vulnerabilityInformation"
import vulClassified from "@/views/sourceCode/components/summary/vulnerabilityClassified"
import vulCount from "@/views/sourceCode/components/summary/vulnerabilityCount"
import rankDistribution from "@/views/sourceCode/components/summary/rankDistribution"
import rankClassified from "@/views/sourceCode/components/summary/rankClassified"
import {getVulnerabilityCount} from "@/api/sourceCode/summary";
import {getSingleProjectCount} from "@/api/sourceCode/overview"
import {isNull, timeToDateString} from "@/utils/myUtils";
import _ from "underscore" //引入数据处理的分装方法
export default {
  name: "",
  components: {
    projectInformation,
    vulInformation,
    vulClassified,
    vulCount,
    rankClassified,
    rankDistribution
  },
  data() {
    return {
      vulnerabilityData: {},
      vulnerabilityTableData: [],
      //缺陷统计
      flag: false,
      timeData: [],
      startValue: '',
      singleCriticalData: [],
      singleHighData: [],
      singleMediumData: [],
      singleLowData: [],
      //缺陷分类统计
      singleRankData: [],
      //等级分布
      valueData: [],
      max: 0,
      loading: true,
      visible: false,
    }
  },
  watch: {
    //监听相同路由下参数变化的时候，从而实现异步刷新
    '$route'(to, from) {
      //做一些路由变化的响应
      //重新获取数据
      this.getVulnerabilityData();
      this.getSingleProjectData();
    },
  },
  created() {
    this.$nextTick(() => {
      this.getVulnerabilityData();
      this.getSingleProjectData();
    });
  },
  methods: {
    /*获取缺陷扫描信息*/
    getVulnerabilityData() {
      let projectId = this.$route.params.parameter;
      getVulnerabilityCount(projectId).then(res => {
        let typeMap = _.groupBy(res.content, item => item.type); //按类型处理数据
        let typeNumber = _.keys(typeMap).length;  //缺陷种类的数量
        let countData = [];
        for (let item_type in typeMap) {
          let fileMap = _.groupBy(typeMap[item_type], item => item.sourceFilePath);
          let fileNumber = _.keys(fileMap).length;
          //计算缺陷行数
          let lineCountArray = [];
          typeMap[item_type].forEach(item => {
            lineCountArray.push((item.lineEnd - item.lineStart + 1)); //将行数添加到数组中
          });
          let totalLines = _.reduce(lineCountArray, (memo, num) => memo + num, 0); //将数组的数据相加
          let sortByInstanceSeverity = _.sortBy(typeMap[item_type], 'instanceSeverity');//按等级排序 从小到大
          sortByInstanceSeverity.reverse(); //反序数组
          countData.push({
            name: item_type,
            number: lineCountArray.length,
            files: fileNumber,
            totalLines,
            highestLevel: sortByInstanceSeverity[0].instanceSeverity
          });
        }
        this.vulnerabilityTableData = countData;
        let lineArray = _.pluck(countData, 'totalLines');
        let lines = _.reduce(lineArray, (memo, num) => memo + num, 0); //将行数相加
        let filesCount = _.groupBy(res.content, item => item.sourceFilePath);
        let files = _.keys(filesCount).length;
        this.vulnerabilityData = {typeNumber, total: res.content.length, lines, files};
      })
    },
    //获取单个扫描数据，渲染echart
    getSingleProjectData() {
      let timeData = [];
      let startValue = [];
      let singleCriticalData = [];
      let singleHighData = [];
      let singleMediumData = [];
      let singleLowData = [];
      let projectId = this.$route.params.parameter;
      return getSingleProjectCount(projectId).then(res => {
        this.loading = false;
        let data = res.data[0].scanResult;
        //筛选最新的数据
        if (!isNull(data)) {
          let grepData = data.filter(item => !isNull(item.all)); //筛选不为空的数据
          grepData.reverse();//反序
          grepData.forEach(item => {
            timeData.push(timeToDateString(item.end_time));
            singleCriticalData.push(item.dangerous);
            singleHighData.push(item.high);
            singleMediumData.push(item.middle);
            singleLowData.push(item.low);
          });
          let ArrayIndex;
          if (grepData.length !== 0) {
            startValue = timeToDateString(grepData[0].end_time);
          }
          if (grepData.length > 5) {
            ArrayIndex = grepData.length - 5;
            startValue = timeToDateString(grepData[ArrayIndex].end_time);
          }
          this.timeData = timeData;
          this.startValue = startValue;
          this.singleCriticalData = singleCriticalData;
          this.singleHighData = singleHighData;
          this.singleMediumData = singleMediumData;
          this.singleLowData = singleLowData;
          //等级分类统计
          this.singleRankData = [
            {"name": "危", "value": data[0].dangerous},
            {"name": "高", "value": data[0].high},
            {"name": "中", "value": data[0].middle},
            {"name": "低", "value": data[0].low}
          ];
          //等级分布
          this.valueData = [data[0].dangerous, data[0].high, data[0].middle, data[0].low];
          this.max = Math.max.apply(null, this.valueData);
          this.flag = true;
        } else {
          this.visible = true;
        }
      });
    }
  }
}
</script>

<style scoped>
  .content {
    position: relative;
    left: 50%;
    top: 50%;
    -webkit-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
  }
</style>