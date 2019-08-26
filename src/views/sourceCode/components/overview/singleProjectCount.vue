<template>
  <div>
    <a-row :gutter="8" type="flex" justify="center" align="middle">
      <a-col :span="4">
        <span>当前项目名称：</span>
      </a-col>
      <a-col :span="20">
        <a-select v-model="selectValue" style="width: 100%" @change="handleChange">
          <a-select-option v-for="item in projectData" :value="item.hcode">{{item.name}}</a-select-option>
        </a-select>
      </a-col>
    </a-row>
    <br/>
    <a-row>
      <a-col :span="24">
        <div>
          <div v-show="singleProjectData.length !== 0" ref="singleProjectChart" style="height:400px;"></div>
          <div v-show="loading" style="height:400px;">
            <a-spin class="content"/>
          </div>
          <div v-show="visible" style="height: 400px; text-align:center; line-height:400px;"><h3>暂无数据</h3></div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
  import echarts from 'echarts'
  import debounce from 'lodash/debounce'   //防抖
  import {addListener, removeListener} from 'resize-detector' //echart 位置
  import {getDefectCount, getSingleProjectCount} from "@/api/sourceCode/overview"
  import {isNull, timeToDateString} from "@/utils/myUtils"

  export default {
    name: "singleProjectChart",
    //深度监听chart Data 的变化
    watch: {
      timeData: {
        handler(val) {
          this.option.xAxis.data = val;
        },
        deep: true
      },
      startValue: {
        handler(val) {
          this.option.dataZoom[0].startValue = val;
          this.renderChart();
        },
        deep: true
      },
      singleCriticalData: {
        handler(val) {
          this.option.series[0].data = val;
          this.renderChart();
        },
        deep: true
      },
      singleHighData: {
        handler(val) {
          this.option.series[1].data = val;
          this.renderChart();
        },
        deep: true
      },
      singleMediumData: {
        handler(val) {
          this.option.series[2].data = val;
          this.renderChart();
        },
        deep: true
      },
      singleLowData: {
        handler(val) {
          this.option.series[3].data = val;
          this.renderChart();
        },
        deep: true
      },
    },
    data() {
      return {
        chart:null,
        projectData: [],
        selectValue: '',
        singleProjectData: [],
        timeData: [],
        startValue: [],
        singleCriticalData: [],
        singleHighData: [],
        singleMediumData: [],
        singleLowData: [],
        loading: true,
        visible: false,
        option:{
          tooltip: {
            trigger: 'axis'
          },
          color: ['#c23531', '#d48265', '#2f4554', '#61a0a8'],
          legend: {

            data: ['危', '高', '中', '低']
          },
          toolbox: {
            show: true,
            feature: {
              mark: {show: true},
              dataView: {show: true, readOnly: false},
              magicType: {show: true, type: ['line', 'bar']},
              restore: {show: true}
            }
          },
          grid: {
            left: '5%',
            top: "8%",
            right: '5%',
            bottom: '15%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            data: [],
            axisTick: {
              alignWithLabel: true
            },
          },
          yAxis: {
            splitLine: {
              show: false
            }
          },
          dataZoom: [{
            startValue: ''
          }, {
            type: 'inside'
          }],

          series: [
            {
              name: '危',
              type: 'line',
              stack: '总量',
              areaStyle: {},
              data: []
            },
            {
              name: '高',
              type: 'line',
              stack: '总量',
              areaStyle: {},
              data: []
            },
            {
              name: '中',
              type: 'line',
              stack: '总量',
              areaStyle: {},
              data: []
            },
            {
              name: '低',
              type: 'line',
              stack: '总量',
              areaStyle: {},
              data: []
            }
          ]
        }
      }
    },
    created() {
      this.resize = debounce(this.resize, 300);//防抖
    },
    mounted() {
      this.getData().then(() => {
        let hcode = this.selectValue;
        this.getSingleProjectData(hcode).then(() => {
          //option配置
          this.option.xAxis.data = this.timeData;
          this.option.dataZoom[0].startValue = this.startValue;
          this.option.series[0].data = this.singleCriticalData;
          this.option.series[1].data = this.singleHighData;
          this.option.series[2].data = this.singleMediumData;
          this.option.series[3].data = this.singleLowData;
          this.renderChart();
        });
      });
    },
    methods: {
      //获取数据
      getData() {
        this.loading = true;
        return getDefectCount().then(res => {
          if (res.status === 200) {
            this.projectData = res.data;
            this.selectValue = this.projectData[0].hcode;
          }
        });
      },
      //选择框操作
      handleChange(value) {
        this.selectValue = value;
        this.getSingleProjectData(this.selectValue);
      },
      //获取单个数据，渲染echart
      getSingleProjectData(hcode) {
        this.timeData = [];
        this.startValue = [];
        this.singleCriticalData = [];
        this.singleHighData = [];
        this.singleMediumData = [];
        this.singleLowData = [];
        return getSingleProjectCount(hcode).then(res => {
          if (res.status === 200) {
            this.loading = false;
            let data = res.data[0].scanResult;
            //筛选最新的数据
            if (!isNull(data)) {
              let grepData = data.filter(item => !isNull(item.all)); //筛选不为空的数据
              this.singleProjectData = grepData;
              grepData.reverse();//反序
              grepData.forEach(item => {
                this.timeData.push(timeToDateString(item.end_time));
                this.singleCriticalData.push(item.dangerous);
                this.singleHighData.push(item.high);
                this.singleMediumData.push(item.middle);
                this.singleLowData.push(item.low);
              });
              let ArrayIndex;
              if (grepData.length !== 0) {
                this.startValue = timeToDateString(grepData[0].end_time);
              }
              if (grepData.length > 5) {
                ArrayIndex = grepData.length - 5;
                this.startValue = timeToDateString(grepData[ArrayIndex].end_time);
              }
            } else {
              this.visible = true;
            }
          }
        });
      },
      resize() {
        this.chart.resize();
      },
      renderChart() {
        // 基于准备好的dom，初始化echarts实例
        this.chart = echarts.init(this.$refs.singleProjectChart);
        addListener(this.$refs.singleProjectChart, this.resize);
        // 绘制图表
        this.chart.setOption(this.option);
      },
    },
    beforeDestroy() {
      removeListener(this.$refs.singleProjectChart, this.resize);
      this.chart.dispose(); //销毁，防止内存泄漏
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