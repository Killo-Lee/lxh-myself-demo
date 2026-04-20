<template>
  <div class="main-z-l">
    <div id="tbmzl" class="fbt"></div>
  </div>
</template>
<script>
import axios from "axios";
import echarts from "echarts";
export default {
  data() {
    return {
      a: 0,
      b: 0,
      c: 0,
      d: 0,
      loading: true, // 加载状态
      myChart: null // 图表实例
    };
  },
  methods: {
    handlecmzl(unit) {
      return axios({
        method: "get",
        url: `/house/searchList?unitname=${unit}&currPage=1&pageNum=4`
      }).then(res => {
        return res.data.total;
      });
    },
    handletbmzl() {
      this.myChart = echarts.init(document.getElementById("tbmzl"));
      let option = {
        // 添加工具栏配置
        toolbox: {
          show: true, // 显示工具栏
          feature: {
            // 数据视图按钮（可查看/编辑数据）
            dataView: {
              show: true,
              title: "数据视图",
              readOnly: false, // 允许编辑数据
            },
            // 还原按钮（重置图表）
            restore: {
              show: true,
              title: "还原"
            },
            // 保存为图片按钮
            saveAsImage: {
              show: true,
              title: "保存为图片",
              type: "png", // 图片格式
              name: "小区分布统计图表" // 图片文件名
            }
          },
          // 工具栏位置（右上角）
          top: 10,
          right: 10
        },
        title: {
          text: "小区分布统计",
          left: "center",
          top: 10
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c}({d}%)"
        },
        legend: {
          orient: "vertical",
          left: "left",
          top: 10
        },
        label: {
          show: true,
          formatter: "{b}\n {c}幢"
        },
        series: [
          {
            name: "小区分布",
            type: "pie",
            center: ["50%", "60%"],
            data: [
              { value: this.a, name: "A区", itemStyle: { color: "#C0E4FF" } },
              { value: this.b, name: "B区", itemStyle: { color: "#cdeaaa" } },
              { value: this.c, name: "C区", itemStyle: { color: "#4DA6FF" } },
              { value: this.d, name: "D区", itemStyle: { color: "#f3d478" } }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      };
      this.myChart.setOption(option);
    }
  },
  async mounted() {
    try {
      // 并行请求所有数据，提高效率
      const [aData, bData, cData, dData] = await Promise.all([
        this.handlecmzl("A"),
        this.handlecmzl("B"),
        this.handlecmzl("C"),
        this.handlecmzl("D")
      ]);

      // 赋值数据
      this.a = aData;
      this.b = bData;
      this.c = cData;
      this.d = dData;

      // 数据加载完成后初始化图表
      this.handletbmzl();

      // 监听窗口大小变化，自适应图表
      window.addEventListener("resize", this.handleResize);
    } catch (error) {
      console.error("数据加载失败:", error);
    } finally {
      // 无论成功失败，都结束加载状态
      this.loading = false;
    }
  }
};
</script>
<style lang="scss" scoped>
@import "style.scss";
</style>