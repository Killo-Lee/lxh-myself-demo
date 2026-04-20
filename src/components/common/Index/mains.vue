<template>
  <div class="main-s">
    <div class="sfz1">
      <div class="jz">
        <i class="iconfont color">&#xe600;</i>
        <div>
          <h1>{{yhm}}</h1>
          <div>系统用户数</div>
        </div>
      </div>
    </div>
    <div class="sfz1">
      <div class="jz">
        <i class="iconfont color">&#xe601;</i>
        <div>
          <h1>{{ddsl}}</h1>
          <div>计费订单数量</div>
        </div>
      </div>
    </div>
    <div class="sfz1">
      <div class="jz">
        <i class="iconfont color">&#xe602;</i>
        <div>
          <h1>{{cwzs}}</h1>
          <div>车位总量</div>
        </div>
      </div>
    </div>
    <div class="sfz1">
      <div class="jz">
        <i class="iconfont color">&#xe603;</i>
        <div>
          <h1>{{fksl}}</h1>
          <div>用户反馈数量</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import '../../../assets/albbslt/iconfont.css';
export default {
  data() {
    return {
      yhm:"",
      ddsl:"",
      cwzs:"",
      fksl:"",
    };
  },
  methods: {
    handleyhm(){
      axios({
        method: "get",
        url: "/users/getUsersData",
        params: {
          currPage: 0,
          pageNum: 1000000000000000,
        },
      }).then(res => {
          this.yhm = res.data.data.length;
        })
    },
    handleddsl(){
      axios({
        method: "get",
        url: "/cost/getPayMessage",
        params: {
          currPage: 0,
          pageNum: 1000000000000000,
        },
      }).then(res => {
          this.ddsl = res.data.data.length;
        })
    },
    handlecwzs(){
      axios({
        method: "get",
        url: "/parking/getParkOrder",
        params: {
          currPage: 0,
          pageNum: 1000000000000000,
        },
      }).then(res => {
          this.cwzs = res.data.data.length;
        })
    },
    handlefksl(){
      axios({
        method: "get",
        url: "/poster/getFeedBack",
        params: {
          currPage: 0,
          pageNum: 1000000000000000,
        },
      }).then(res => {
          this.fksl = res.data.data.length;
        })
    },
  },
  mounted() {
    this.handleyhm();
    this.handleddsl();
    this.handlecwzs();
    this.handlefksl();
  },
};
</script>
<style lang="scss" scoped>
@import "style.scss";
</style>
