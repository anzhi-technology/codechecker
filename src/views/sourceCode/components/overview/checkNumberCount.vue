<template>
  <div>
    <div v-show="checkNumberData.length !== 0" ref="checkNumberChart" style="height:200px;"></div>
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
import {getProjectsList} from "@/api/sourceCode/list";

import {isNull} from "@/utils/myUtils"

export default {
  name: "checkNumberChart",
  data() {
    return {
      chart: null,
      checkNumberData: [],
      loading: true,
      visible: false
    }
  },
  mounted() {
    getProjectsList().then(res => {
      this.loading = false;
      if (!isNull(res.data)) {
        res.data.forEach(item => {
          item.detectNum = isNull(item.detectNum) ? 0 : item.detectNum;
          this.checkNumberData.push({"name": item.name, "value": item.detectNum});
        })

      } else {
        this.visible = true;
      }

      this.option = {
        tooltip: {
          trigger: 'item',
        },
        series: [
          {
            name: '检测次数',
            type: 'pie',
            radius: '90%',
            center: ['50%', '50%'],
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
            data: this.checkNumberData
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
      this.chart = echarts.init(this.$refs.checkNumberChart);
      addListener(this.$refs.checkNumberChart, this.resize);
      // 绘制图表
      this.chart.setOption(this.option);
    },
  },
  beforeDestroy() {
    removeListener(this.$refs.checkNumberChart, this.resize);
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