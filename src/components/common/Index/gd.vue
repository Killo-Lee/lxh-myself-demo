<template>
  <div class="gd">
    <P class="gg"> <i class="iconfont color">&#x101d2;</i>最新公告</P>
    <!-- 
        interval	自动切换的时间间隔，单位为毫秒
        direction	走马灯展示的方向
        height	走马灯的高度
        indicator-position	指示器的位置
        autoplay	是否自动切换
    -->
    <el-carousel
      :interval="2000"
      direction="vertical"
      indicator-position="none"
      :autoplay="true"
      class="vertical-carousel"
    >
      <el-carousel-item v-for="(item, index) in obj" :key="index">
        <div class="marquee-item">
          <p>• {{ item.title }}</p>
          <p>• {{ item.content }}</p>
          <p>
            • {{ formatTime(item.createtime) }}
            <span @click="goToPost">更多</span>
          </p>
        </div>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>
<script>
import axios from "axios";
import '../../../assets/albbslt/iconfont.css';
export default {
  name: "VerticalMarquee",
  data() {
    return {
      obj: [], // 存储接口返回的数据
    };
  },
  methods: {
    handleClick() {
      axios({
        method: "get",
        url: "/poster/getPosterData",
        params: {
          currPage: 0,
          pageNum: 100,
        },
      }).then(res => {
          this.obj = res.data.data
        })
    },
    formatTime(timestamp) {
      if (!timestamp) return "";
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); 
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },
    goToPost() {
      this.$router.push({ name: 'postMessage' });
    }
  },
  mounted() {
    this.handleClick();
  }
};
</script>
<style lang="scss" scoped>
@import "style.scss";
</style>
