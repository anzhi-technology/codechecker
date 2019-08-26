<template>
  <div>
    <div v-show="defectData.length !== 0" ref="defectChart" style="height:200px;"></div>
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
  import {getDefectCount} from "@/api/sourceCode/overview"
  import {isNull} from "@/utils/myUtils"

  export default {
    name: "defectChart",
    data() {
      return {
        chart:null,
        defectData: [],
        nameData: [],
        loading: true,
        visible: false
      }
    },
    mounted() {
      getDefectCount().then(res => {
        if (res.status === 200) {
          this.loading = false;
          let data = res.data;
          let lastData = [];
          let startValue;
          //筛选最新的数据
          if (!isNull(data)) {
            data.forEach(item => {
              item.scanResult[0].name = item.name;
              lastData.push(item.scanResult[0])
            });   //每条项目的最新数据
            let grepData = lastData.filter(item => !isNull(item.all)); //筛选数据不为空的数据
            grepData.reverse();                                        //颠倒数组元素
            grepData.forEach(item => {
              this.nameData.push(item.name);
              this.defectData.push(item.all);
            });
            let ArrayIndex;
            startValue = grepData[0].name;
            if(grepData.length > 5){
              ArrayIndex = grepData.length -5;
              startValue = grepData[ArrayIndex].name
            }

          } else {
            this.visible = true;
          }

          this.option = {
            tooltip: {
              trigger: 'axis'
            },
            grid: {
              top: '5%',
              width: '95%',
              bottom: '25%',
              left: 10,
              containLabel: true
            },
            xAxis: {
              type: 'category',
              data: this.nameData,
              axisLabel: {
                show: false
              },
              axisTick: {
                alignWithLabel: true
              }
            },
            yAxis: {
              type: 'value'
            },
            dataZoom: [

              {
                show: true,
                startValue: startValue,
                //endValue:'Walownie'
              }

            ],
            series: [{
              data: this.defectData,
              type: 'line'
            }]
          };
          this.renderChart();
        }
      });
    },
    methods: {
      resize() {
        this.chart.resize();
      },
      renderChart() {
        // 基于准备好的dom，初始化echarts实例
        this.chart = echarts.init(this.$refs.defectChart);
        addListener(this.$refs.defectChart, this.resize);
        // 绘制图表
        this.chart.setOption(this.option);
      },
    },
    beforeDestroy() {
      removeListener(this.$refs.defectChart, this.resize);
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