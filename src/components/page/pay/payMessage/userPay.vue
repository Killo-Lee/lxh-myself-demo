<template>
  <div class="userPay">
    <el-tabs v-model="yhzf" type="border-card">
        <el-tab-pane label="用户支付" name="yhzf">
            <el-form ref="formyhzf" :model="formyhzf" label-width="120px">
                <el-form-item label="缴费产品:">
                    <el-input v-model="formyhzf.payname" readonly></el-input>
                </el-form-item>
                <el-form-item label="缴费人员:">
                    <el-input v-model="formyhzf.username" readonly></el-input>
                </el-form-item>
                <el-form-item label="缴费金额:">
                    <el-input v-model="formyhzf.paymoney" readonly></el-input>
                </el-form-item>
                <el-form-item label="缴费优先级:">
                    <el-input v-model="formyhzf.paylevel" readonly></el-input>
                </el-form-item>
                <el-form-item label="支付时间:">
                    <el-input v-model="formattedCostTime" readonly></el-input>
                </el-form-item>
                <el-form-item label="支付状态:">
                    <el-input v-model="formattedCostStatus" readonly></el-input>
                </el-form-item>
                <el-form-item label="支付类型:">
                    <el-radio-group v-model="selectedPayType">
                        <el-radio label="zfb">
                            <img src="@/assets/images/zfb1.png" alt="支付宝">
                        </el-radio>
                        <el-radio label="wx">
                            <img src="@/assets/images/wx1.png" alt="微信">
                        </el-radio>
                        <el-radio label="ysf">
                            <img src="@/assets/images/ysf.png" alt="云闪付">
                        </el-radio>
                    </el-radio-group>
                </el-form-item> 
                <el-form-item label="通知内容:">
                    <div v-html="formyhzf.paycontent"></div>
                </el-form-item>
                <el-form-item label="我的回复:">
                    <el-input type="textarea" :rows="4" v-model="formyhzf.costcontent"></el-input>
                </el-form-item>
            </el-form>
            <div class="fhzf">
                <el-button type="primary" @click="handlefh"><i class='iconfont color'>&#xe6ca;</i>返回</el-button>
                <el-button type="primary" class="el-icon-s-promotion" @click="handlezf">支付</el-button>
            </div>
        </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import axios from "axios";
import '../../../../assets/albbslt/iconfont.css';
export default {
  data() {
    return {
        yhzf:"yhzf",
        formyhzf:{
            payname: "",
            username: "",
            paymoney: "",
            paylevel: "",
            costtime: "",
            coststatus: "",
            costtype: "",
            paycontent:"",
            costcontent:"",
        },
        selectedPayType: "" // 单选按钮
    };
  },
  computed: {
    // 格式化支付时间
    formattedCostTime() {
      if (!this.formyhzf.costtime) return '';
      
      const date = new Date(this.formyhzf.costtime);
      // 转换为本地时间并格式化
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },
    // 格式化支付状态
    formattedCostStatus() {
      return this.formyhzf.coststatus === 1 ? '已支付' : '未支付';
    }
  },
  methods: {
    // 赋值
    handleyhzf() {
      const payId = this.$route.query.payId;
      let fz = {
        id: payId,
        token:sessionStorage.getItem('token'),
      };
      axios({
        method: "get",
        url: "/cost/getCostDetail",
        params: fz,
      }).then(res => {
        const data = Array.isArray(res.data) && res.data.length > 0 ? res.data[0] : {};
        this.formyhzf.payname = data?.payname;
        this.formyhzf.username = data?.username;
        this.formyhzf.paymoney = data?.paymoney;
        this.formyhzf.paylevel = data?.paylevel;
        this.formyhzf.costtime = data?.costtime;
        this.formyhzf.coststatus = data?.coststatus;
        this.formyhzf.costtype = data?.costtype;
        this.formyhzf.paycontent = data?.paycontent;
        this.formyhzf.costcontent = data?.costcontent;
        this.setSelectedPayType();
      });
    },
    // 设置选中的支付类型
    setSelectedPayType() {
      // 定义数值到支付类型的映射关系
      const typeMap = {
        "1": "jfb",    // 1对应第一个(支付宝)
        "2": "wx",    // 2对应第二个(微信)
        "3": "ysf"   // 3对应第三个(云闪付)
      };
      
      // 将costtype转换为字符串，确保类型匹配
      const costtype = String(this.formyhzf.costtype);
      
      // 根据映射关系设置选中值，如果是其他值则不选中
      this.selectedPayType = typeMap[costtype] || "";
    },
    // 返回
    handlefh() {
      this.$router.push("/pay/payMessage");
    },
    // 支付
    handlezf() {
      const payId = this.$route.query.payId;
      let zf = {
        u_id:payId,
        coststatus: this.formyhzf.coststatus,
        costtype: this.formyhzf.costtype,
        costcontent: this.formyhzf.costcontent,
        token: sessionStorage.getItem('token'),
      };
      axios({
        method: "post",
        url: "/cost/updateUserPay",
        data: zf,
      }).then(res => {
        this.handlefh();
      });
    },
  },
  mounted() {
    this.handleyhzf();
  }
};
</script>
<style lang="scss" scoped>
.userPay::v-deep {
    .el-tabs{
      width: 98.8%;
      padding: 0px;
      min-height: 650px;
      margin-left: 10px;
      margin-bottom: 10px;
    }
    .el-form {
        display: flex;
        flex-wrap: wrap;
        .el-form-item {
            width: 46%;
            .el-radio__input{
                margin-bottom: 88px;
            }
            img{
                width: 100px;
                height: 100px;
            }
        }
        .el-form-item:nth-child(7),
        .el-form-item:nth-child(8),
        .el-form-item:nth-child(9) {
            width: 92%;
        }
    }
    .fhzf{
        position: fixed;
        top: 27%;
        right: 20px;
        z-index: 100;
        display: flex;
        flex-direction: column;
        align-items: center;
        .el-button{
            margin:0;
            width: 85px;
            margin-bottom: 15px;
            border-radius: 4px;
            font-size: 14px;
            padding: 10px 15px;
        }
    }
}
</style>