<template>
  <div class="main-z-r">
    <div id="tbmzr" class="ldtj"></div>
  </div>
</template>
<script>
import axios from "axios";
import echarts from 'echarts'
export default {
  data() {
    return {
      mzr:[],
    };
  },
  methods: {
    handlemzr(cId, index) {
      return axios({
        method: "get",
        url: `/cost/getCostData?c_id=${cId}&currPage=0&pageNum=4`
      }).then(res => {
        this.mzr[index] = res.data.total;
      });
    },
    handletbmzr() {
      let myChart = echarts.init(document.getElementById("tbmzr"));
     let option = {
        title: {
          text: '缴费项目订单',
          top: 10,
          right: 20,
        },
        legend: {
          data: ['计费项目'],
          top: 10,
          left: 20,
        },
        radar: {
          indicator: [
            { name: '电费单', max: 200 },
            { name: '水费固定月单', max: 12 },
            { name: '水费按量单', max: 12 },
            { name: '天然气单', max: 12 },
            { name: '物业费单', max: 12 },
            { name: '宽带费单', max: 12 }
          ],
          radius: '60%', // 调整大小
          splitArea: {
            // 分割区域样式，类似图片中的网格
            areaStyle: {
              color: ['#FFF0F5']
            }
          },
          axisLine: {
            // 轴线样式
            lineStyle: {
              color: '#bbb'
            }
          },
          splitLine: {
            // 分割线样式
            lineStyle: {
              color: '#bbb'
            }
          },
          name: {
            // 项目名称样式
            textStyle: {
              color: '#333',
              fontSize: 12
            }
          }
        },
        series: [
          {
            type: 'radar',
            symbol: 'circle', // 数据点样式
            symbolSize: 6, // 数据点大小
            lineStyle: {
              width: 2,
              color: 'rgba(78, 133, 229, 0.6)' // 线条颜色
            },
            areaStyle: {
              // 填充区域样式，更接近图片中的蓝色填充
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 1,
                y2: 1,
                colorStops: [
                  { offset: 0, color: 'rgba(78, 133, 229, 0.6)' },
                  { offset: 1, color: 'rgba(78, 133, 229, 0.2)' }
                ]
              }
            },
            // 配置 label，在图形上直接显示数值
            label: {
              show: true, // 显示数值
              color: '#rgba(78, 133, 229, 0.6)', // 数值颜色
              fontSize: 12 // 数值字体大小
            },
            data: [
              {
                value: this.mzr,
                name: '计费项目',
                itemStyle: {
                  color: '#3B82F6',
                }
              }
            ]
          }
        ]
      };
      myChart.setOption(option);
    }
  },
  mounted() {
    [7,8,9,10,11,12].forEach((cId, index) => {
      this.handlemzr(cId, index);
    });
    setTimeout(() => {
      this.handletbmzr();
    },1000);
  }
};
</script>
<style lang="scss" scoped>
@import "style.scss";
</style>