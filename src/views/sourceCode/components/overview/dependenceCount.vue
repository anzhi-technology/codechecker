<template>
  <div>
    <div v-show="dependenceData.length !== 0" ref="dependenceChart" style="height:200px;"></div>
    <div v-show="loading" style="height:200px;">
      <a-spin class="content"/>
    </div>
    <div v-show="visible" style="height: 200px; text-align:center; line-height:200px;"><h3>暂无数据</h3></div>
  </div>
</template>

<script>
  import echarts from 'echarts'
  // import debounce from 'lodash/debounce'   //防抖
  import {addListener, removeListener} from 'resize-detector' //echart 位置
  import {getDependencyCount} from "@/api/sourceCode/overview";

  import {isNull} from "@/utils/myUtils"

  export default {
    name: "dependenceChart",
    data() {
      return {
        chart: null,
        dependenceData: [],
        loading: true,
        visible: false
      }
    },
    mounted() {
      getDependencyCount().then(res => {

        this.loading = false;
        let projectDependenceData = res.data.project_dependency;
        if (!isNull(projectDependenceData)) {
          let grepData = projectDependenceData.filter(item => !isNull(item.dependencies_num));
          grepData.forEach(item => {
            this.dependenceData.push({"name": item.name, "value": item.vulnerabilities_num});
          })
        } else {
          this.visible = true;
        }

        this.option = {
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
          },
          series: [
            {
              name: '漏洞总数',
              type: 'pie',
              roseType: 'radius',
              label: {
                normal: {
                  show: false,
                  position: 'center'
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              radius: ['10%', '90%'],
              data: this.dependenceData
            }
          ]
        };
        this.renderChart();
      });
    },
    methods: {
      resize() {
        this.chart.resize();
      },
      renderChart() {
        // 基于准备好的dom，初始化echarts实例
        this.chart = echarts.init(this.$refs.dependenceChart);
        addListener(this.$refs.dependenceChart, this.resize);
        // 绘制图表
        this.chart.setOption(this.option);
      },
    },
    beforeDestroy() {
      removeListener(this.$refs.dependenceChart, this.resize);
      this.chart.dispose();
      this.chart = null;
    },

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