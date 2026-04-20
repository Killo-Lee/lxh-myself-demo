<template>
  <div class="main-z-z">
    <div id="tbmzz" class="che"></div>
  </div>
</template>
<script>
import axios from "axios";
import echarts from "echarts";
export default {
  data() {
    return {
      cws: [],
      yfpl: [],
      yjf: []
    };
  },
  methods: {
    // 通用请求函数：获取车位数据
    handlemzzcy(parkname, index, parkstatus = null) {
      const params = { parkname, currPage: 0, pageNum: 4 };
      if (parkstatus !== null) {
        params.parkstatus = parkstatus;
      }
      return axios.get('parking/getParkData', { params })
        .then(res => {
          if (parkstatus === null) {
            this.cws[index] = res.data.total;
          } else {
            this.yfpl[index] = res.data.total;
          }
        });
    },

    // 通用请求函数：获取订单数据
    handlemzzyjf(parkname, index) {
      return axios.get('parking/getParkOrder', {
        params: {
          parkname,
          orderstatus: 1,
          currPage: 0,
          pageNum: 4
        }
      }).then(res => {
        this.yjf[index] = res.data.total;
      });
    },
    // 图表
    handletbmzz() {
      let myChart = echarts.init(document.getElementById("tbmzz"));
      let option = {
        title: {
          text: "车位数/已分配量/已缴费",
          top: 10,
          left: 0,
        },
        legend: {
          data: ["车位数", "已分配量", "已缴费"],
          top: 10,
          right: 50,
        },
        xAxis: [
          {
            type: 'category',
            data: ["A区车位", "B区车位", "C区车位", "D区车位"],
            axisPointer: {
              type: 'shadow'
            },
          }
        ],
        yAxis: [
          {
            type: 'value',
            splitLine: {
              show: true,
              lineStyle: {
                color: '#979797',
              },
            },
          },
        ],
        series: [
          {
            name: '车位数',
            type: 'bar',
            color: '#4E79A7',
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  position: 'top',
                  textStyle: {
                    color: 'black',
                    fontSize: 12
                  }
                }
              }
            },
            data: this.cws,
          },
          {
            name: '已分配量',
            type: 'bar',
            color: '#59A14F',
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  position: 'top',
                  textStyle: {
                    color: 'black',
                    fontSize: 12
                  }
                }
              }
            },
            data: this.yfpl,
          },
          {
            name: '已缴费',
            type: 'bar',
            color: '#c993e2',
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  position: 'top',
                  textStyle: {
                    color: 'black',
                    fontSize: 12
                  }
                }
              }
            },
            data: this.yjf,
          },
        ]
      };
      myChart.setOption(option);
    },
  },
  mounted() {
    // 批量调用请求函数
    const parks = ['A', 'B', 'C', 'D'];
    parks.forEach((park, index) => {
      this.handlemzzcy(park, index);          // 车位数
      this.handlemzzcy(park, index, 1);       // 已分配量
      this.handlemzzyjf(park, index);         // 已缴费
    });

    // 等待所有请求完成后再渲染图表（更可靠的方式）
    setTimeout(() => {
      this.handletbmzz();
    }, 1000);
  },
};
</script>
<style lang="scss" scoped>
@import "style.scss";
</style>