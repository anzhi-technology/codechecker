<template>
  <div>
    <a-card title="等级分类统计">
      <a-row>
        <a-col :span="24">
          <div>
            <div v-show="singleRankData.length !== 0" ref="rankClassifiedChart" style="height:175px;"></div>
            <div v-show="loading" style="height:175px;">
              <a-spin class="content"/>
            </div>
            <div v-show="visible" style="height: 175px; text-align:center; line-height:175px;"><h3>暂无数据</h3></div>
          </div>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script>
import echarts from 'echarts'
import debounce from 'lodash/debounce'   //防抖
import {addListener, removeListener} from 'resize-detector' //echart 位置


export default {
  name: "rankClassified",
  props: {
    singleRankData: {
      type: Array,
      required: true
    },
    loading: {
      type: Boolean,
      required: true,
    },
    visible: {
      type: Boolean,
      required: true,
    },
  },
  //深度监听chart Option 的变化
  watch: {
    singleRankData: {
      handler(vul) {
        this.option.series[0].data = vul;
        this.renderChart();
      },
      deep: true
    },
  },
  data() {
    return {
      chart: null,
      option: {
        tooltip: {
          trigger: 'item',
        },
        color: ['#c23531', '#d48265', '#2f4554', '#61a0a8'],
        legend: {
          data: ['危', '高', '中', '低'],
          orient: 'vertical',
          x: 'left',
        },
        series: [
          {
            name: '总数',
            type: 'pie',
            radius: '80%',
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
            data: this.singleRankData
          }
        ]
      }
    }
  },
  created() {
    this.resize = debounce(this.resize, 300);//防抖
  },
  mounted() {
    this.renderChart();
    addListener(this.$refs.rankClassifiedChart, this.resize);
  },
  methods: {
    resize() {
      this.chart.resize();
    },
    renderChart() {
      // 基于准备好的dom，初始化echarts实例
      this.chart = echarts.init(this.$refs.rankClassifiedChart);
      // 绘制图表
      this.chart.setOption(this.option);
    },
  },
  beforeDestroy() {
    removeListener(this.$refs.rankClassifiedChart, this.resize);
    this.chart.dispose(); //销毁，防止内存泄漏
    this.chart = null;
  },
}
</script>

<style scoped>

</style>