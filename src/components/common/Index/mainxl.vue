<template>
  <div class="main-x-l">
    <div id="tbmxl" class="dyyhfwqk"></div>
  </div>
</template>
<script>
import axios from "axios";
import echarts from "echarts";
export default {
  data() {
    return {
      obj:[],
    };
  },
  methods: {
    handlecmxl() {
      return axios({
        method: "get",
        url: `/users/getLoginMonth`
      }).then(res => {
        // 初始化32个元素的数组（0-31号），初始值都为0
        this.obj = new Array(32).fill(0);
        res.data.forEach(item => {
          const createtime = item.createtime;
          const date = new Date(createtime);
          const day = date.getDate(); // 获取1-31的日期
          // 只处理1-31号，0号保持初始值0
          if (day >= 1 && day <= 31) {
            this.obj[day]++; // 1号对应obj[1]，31号对应obj[31]
          }
        });
      });
    },
    handletbzmsl() {
      let myChart = echarts.init(document.getElementById("tbmxl"));
      let option = {
        title: {
          text: "当月用户访问情况",
          top: 10,
          left: 0
        },
        legend: {
          data: ["用户访问量"],
          top: 10
        },
        tooltip: {
          trigger: "axis"
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        toolbox: {
          top: 10,
          right: 20,
          show: true, // 显示工具栏
          feature: {
            dataView: {
              show: true,
              title: "数据视图",
              readOnly: false,
              lang: ["数据视图", "关闭", "刷新"]
            },
            restore: {
              show: true,
              title: "还原"
            },
            saveAsImage: {
              show: true,
              title: "保存为图片"
            },
            magicType: {
              show: true,
              title: {
                bar: "切换为柱状图",
                line: "切换为折线图"
              },
              type: ["bar", "line"]
            },
            dataZoom: {
              yAxisIndex: 'none'
            },
          },
          iconStyle: {
            borderColor: "#32a89e",
          }
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: [
            "00",
            "01",
            "02",
            "03",
            "04",
            "05",
            "06",
            "07",
            "08",
            "09",
            "10",
            "11",
            "12",
            "13",
            "14",
            "15",
            "16",
            "17",
            "18",
            "19",
            "20",
            "21",
            "22",
            "23",
            "24",
            "25",
            "26",
            "27",
            "28",
            "29",
            "30",
            "31"
          ]
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            name: "用户访问量",
            type: "line",
            stack: "Total",
            // 平滑线条
            smooth: true,
            // 设置折线和数据点颜色
            itemStyle: {
              color: "#4ECDC4" // 数据点颜色
            },
            lineStyle: {
              color: "#4ECDC4" // 折线颜色
            },
            data: this.obj,
          }
        ]
      };
      myChart.setOption(option);
    }
  },
  mounted() {
    this.handlecmxl();
    setTimeout(() => {
      this.handletbzmsl();
    }, 1000);
  }
};
</script>
<style lang="scss" scoped>
@import "style.scss";
</style>