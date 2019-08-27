<template>
  <div>
    <a-card title="等级分布统计">
      <a-row>
        <a-col :span="24">
          <div>
            <div v-show="valueData.length !== 0" ref="rankDistributionChart" style="height:175px;"></div>
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
  name: "rankDistribution",
  props: {
    valueData: {
      type: Array,
      required: true
    },
    max: {
      type: Number,
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
    max: {
      handler(val) {
        this.option.radar[0].indicator.forEach(item => {
          item.max = val;
        })
      },
      deep: true
    },
    valueData: {
      handler(val) {
        this.option.series[0].data[0].value = val;
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
          trigger: 'axis'
        },
        radar: [
          {
            indicator: [
              {text: '危', max: this.max},
              {text: '高', max: this.max},
              {text: '中', max: this.max},
              {text: '低', max: this.max}
            ],
            center: ['50%', '50%'],
            radius: 60,
            startAngle: 90,
            splitNumber: 4,
            shape: 'circle',
            name: {
              formatter: '【{value}】',
              textStyle: {
                color: '#72ACD1'
              }
            },
            splitArea: {
              areaStyle: {
                color: ['rgba(114, 172, 209, 0.2)',
                        'rgba(114, 172, 209, 0.4)', 'rgba(114, 172, 209, 0.6)',
                        'rgba(114, 172, 209, 0.8)', 'rgba(114, 172, 209, 1)'],
                shadowColor: 'rgba(0, 0, 0, 0.3)',
                shadowBlur: 10
              }
            },
            axisLine: {
              lineStyle: {
                color: 'rgba(255, 255, 255, 0.5)'
              }
            },
            splitLine: {
              lineStyle: {
                color: 'rgba(255, 255, 255, 0.5)'
              }
            }
          }
        ],
        series: [
          {
            name: '雷达图',
            type: 'radar',
            tooltip: {
              trigger: 'item'
            },
            itemStyle: {
              emphasis: {
                // color: 各异,
                lineStyle: {
                  width: 4
                }
              }
            },
            data: [
              {
                value: this.valueData,
                name: '统计',
                symbol: 'rect',
                symbolSize: 5,
                lineStyle: {
                  normal: {
                    type: 'dashed'
                  }
                }
              }
            ]
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
    addListener(this.$refs.rankDistributionChart, this.resize);
  },
  methods: {
    resize() {
      this.chart.resize();
    },
    renderChart() {
      // 基于准备好的dom，初始化echarts实例
      this.chart = echarts.init(this.$refs.rankDistributionChart);
      // 绘制图表
      this.chart.setOption(this.option);
    },
  },
  beforeDestroy() {
    removeListener(this.$refs.rankDistributionChart, this.resize);
    this.chart.dispose(); //销毁，防止内存泄漏
    this.chart = null;
  },
}
</script>

<style scoped>

</style>