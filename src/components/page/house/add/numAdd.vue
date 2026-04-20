<template>
  <div class="add">
    <el-page-header @back="resetForm"></el-page-header>
    <div class="ADD">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <h4>
          <span></span>
          房号信息
        </h4>
        <el-form-item label="单元名称" prop="unitname">
          <el-input v-model="ruleForm.unitname"></el-input>
        </el-form-item>
        <el-form-item label="幢号" prop="buildnum">
          <el-input v-model="ruleForm.buildnum"></el-input>
        </el-form-item>
        <el-form-item label="楼层号" prop="storeynum">
          <el-input v-model="ruleForm.storeynum"></el-input>
        </el-form-item>
        <el-form-item label="房号" prop="homenum">
          <el-input v-model="ruleForm.homenum"></el-input>
        </el-form-item>
        <el-form-item label="住客姓名" prop="homename">
          <el-input v-model="ruleForm.homename"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="homestatus">
          <el-select v-model="ruleForm.homestatus" placeholder="请选择">
            <el-option label="已入住" value="1"></el-option>
            <el-option label="未入住" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="房屋信息" style="width:91.2%;" prop="homemessage">
          <el-input type="textarea" :rows="4" placeholder="请填写房屋信息" v-model="ruleForm.homemessage"></el-input>
        </el-form-item>
        <el-form-item label="家庭成员" style="width:91.2%;" prop="homesuggestion">
          <el-input
            type="textarea"
            :rows="4"
            placeholder="请填写家庭成员"
            v-model="ruleForm.homesuggestion"
          ></el-input>
        </el-form-item>
        <h4>
          <span></span>
          智能设备
        </h4>
        <el-form-item label="洗衣机数量" prop="washnum">
          <el-input v-model="ruleForm.washnum"></el-input>
        </el-form-item>
        <el-form-item label="WI-FI名称" prop="wifiname">
          <el-input v-model="ruleForm.wifiname"></el-input>
        </el-form-item>
        <el-form-item label="空调数量" prop="airnum">
          <el-input v-model="ruleForm.airnum"></el-input>
        </el-form-item>
        <el-form-item label="智能设备状态" prop="smartstatus" label-width="107px">
          <el-select v-model="ruleForm.smartstatus" placeholder="请选择">
            <el-option label="完好" value="1"></el-option>
            <el-option label="待维修" value="2"></el-option>
          </el-select>
        </el-form-item>
        <h4>
          <span></span>
          家居设备
        </h4>
        <el-form-item label="书桌数量" prop="homedesk">
          <el-input v-model="ruleForm.homedesk"></el-input>
        </el-form-item>
        <el-form-item label="椅子数量" prop="homechair">
          <el-input v-model="ruleForm.homechair"></el-input>
        </el-form-item>
        <el-form-item label="衣橱数量" prop="homeclothes">
          <el-input v-model="ruleForm.homeclothes"></el-input>
        </el-form-item>
        <el-form-item label="家居设备状态" prop="familystatus" label-width="107px">
          <el-select v-model="ruleForm.familystatus" placeholder="请选择">
            <el-option label="完好" value="1"></el-option>
            <el-option label="待维修" value="2"></el-option>
          </el-select>
        </el-form-item>
           <div class="aside">
             <el-button type="success" @click="submitForm(2)">保存</el-button>
        <el-button @click="resetForm()" type="primary">
          <i class="el-icon-refresh-left"></i>返回
        </el-button>
       
      </div>
      </el-form>

   
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      ruleForm: {
        communityname: "",
        buildnum: "",
        storeynum: "",
        homenum: "",
        homename: "",
        homestatus: "",
        homemessage: "",
        homesuggestion: "" ,
        washnum: "",
        wifiname: "",
        airnum: "",
        smartstatus: "" ,
        homedesk: "",
        homechair: "",
        homeclothes: "",
        familystatus: "",
        unitname:"",
      },
      rules: {
        unitname: [
          { required: true, message: "单元名称不能为空", trigger: "blur" }
        ],
        buildnum: [
          { required: true, message: "幢号不能为空", trigger: "blur" }
        ],
        storeynum: [
          { required: true, message: "楼层号不能为空", trigger: "blur" }
        ],
        homenum: [{ required: true, message: "房号不能为空", trigger: "blur" }],
        homename: [
          { required: true, message: "住客姓名不能为空", trigger: "blur" }
        ],
        homestatus: [
          { required: true, message: "状态不能为空", trigger: "blur" }
        ],
        homemessage: [
          { required: true, message: "房屋信息不能为空", trigger: "blur" }
        ],
        homesuggestion: [
          { required: true, message: "家庭成员不能为空", trigger: "blur" }
        ],
        washnum: [
          { required: true, message: "洗衣机数量不能为空", trigger: "blur" }
        ],
        wifiname: [
          { required: true, message: "WI-FI名称不能为空", trigger: "blur" }
        ],
        airnum: [
          { required: true, message: "空调数量不能为空", trigger: "blur" }
        ],
        smartstatus: [
          { required: true, message: "智能设备状态不能为空", trigger: "blur" }
        ],
        homedesk: [
          { required: true, message: "书桌数量不能为空", trigger: "blur" }
        ],
        homechair: [
          { required: true, message: "椅子数量不能为空", trigger: "blur" }
        ],
        homeclothes: [
          { required: true, message: "衣橱数量不能为空", trigger: "blur" }
        ],
        familystatus: [
          { required: true, message: "家居设备状态不能为空", trigger: "blur" }
        ]
      },

      tableData: [
        {
          communityname: "",
          unitname: "",
          unitnum: "",
          unitstatus: "",
          homesuggestion: ""
        }
      ]
    };
  },
  methods: {
    handleSubmit() {
      console.log(this.$route);
      this.$http({
        url: "/house/getDetailId",
        method: "get",
        params: {
          id: this.$route.query.detailId
        }
      }).then(res => {
        this.ruleForm.communityname = res.data[0].communityname;
        this.ruleForm.buildnum = res.data[0].buildnum;
        this.ruleForm.storeynum = res.data[0].storeynum;
        this.ruleForm.homenum = res.data[0].homenum;
        this.ruleForm.homename = res.data[0].homename;
        this.ruleForm.homestatus = res.data[0].homestatus ==1?'已入住':'未入住';
        this.ruleForm.homemessage = res.data[0].homemessage;
        this.ruleForm.homesuggestion = res.data[0].homesuggestion;
        this.ruleForm.washnum = res.data[0].washnum;
        this.ruleForm.wifiname = res.data[0].wifiname;
        this.ruleForm.airnum = res.data[0].airnum;
        this.ruleForm.smartstatus = res.data[0].smartstatus ==1?'完好':'待维修';
        this.ruleForm.homedesk = res.data[0].homedesk;
        this.ruleForm.homechair = res.data[0].homechair;
        this.ruleForm.homeclothes = res.data[0].homeclothes;
        this.ruleForm.familystatus = res.data[0].familystatus ==1?'完好':'待维修';
        this.ruleForm.unitname = res.data[0].unitname;
      });
    },
    submitEdit() {
      this.ruleForm.communityname = this.tableData[0].communityname;
      this.ruleForm.unitname = this.tableData[0].unitname;
      this.ruleForm.unitnum = this.tableData[0].unitnum;
      this.ruleForm.unitstatus =
        this.tableData[0].unitstatus == 1 ? "已建成" : "未建成";
      this.ruleForm.unitcontext = this.tableData[0].unitcontext;
    },
    submitForm(val) {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交信息？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消"
          }).then(() => {
            if (val == 1) {
              this.$message({
                type: "success",
                message: "房屋信息录入成功"
              });
              this.$http({
                url: "/house/addunitList",
                method: "post",
                data: {
                  communityname: this.ruleForm.communityname,
                  unitname: this.ruleForm.unitname,
                  unitnum: this.ruleForm.unitnum,
                  unitstatus: this.ruleForm.unitstatus,
                  unitcontext: this.ruleForm.unitcontext
                }
              }).then(() => {
                this.$router.push("/house/unit");
              });
            } else {
              this.$http({
                url: "/house/updatenumList",
                method: "post",
                data: {
                   id: this.$route.query.detailId,
                   unitname:this.ruleForm.unitname ,
                  buildnum: this.ruleForm.buildnum,
                  storeynum: this.ruleForm.storeynum,
                  homenum: this.ruleForm.homenum,
                  homename: this.ruleForm.homename,
                  homestatus: this.ruleForm.homestatus  =='已入住'?1: 2,
                  homemessage: this.ruleForm.homemessage,
                  homesuggestion: this.ruleForm.homesuggestion,
                  airnum: this.ruleForm.airnum,
                  wifiname: this.ruleForm.wifiname,
                  washnum: this.ruleForm.washnum,
                  smartstatus: this.ruleForm.smartstatus == '完好'? 1 : 2 ,
                  homedesk: this.ruleForm.homedesk,
                  homechair: this.ruleForm.homechair,
                  homeclothes: this.ruleForm.homeclothes,
                  familystatus: this.ruleForm.familystatus == '完好'? 1 : 2,
                  h_id:this.$route.query.detailId,
                  homeaddress:encodeURIComponent("浙江包子铺餐饮管理已完成12313"),
                  token: sessionStorage.getItem("token")
                }
              }).then(() => {
                 this.$message({
                type: "success",
                message: "房屋信息更新成功"
              });
                this.$router.push("/house/number");
              });
            }
          });
        } else {
          this.$message({
            showClose: true,
            message: "录入信息不能为空",
            type: "error"
          });
          return false;
        }
      });
    },
    resetForm() {
      this.$router.push("/house/number");
    }
  },
  created() {
    if (this.$route.query.type == "DETAIL") {
      this.handleSubmit();
    }
  }
};
</script>
<style lang="scss" scoped>
.add::v-deep {
  .el-page-header {
    color: #409eff;
    font-size: 14px;
    margin-bottom: 10px;
  }
  .ADD {
    > div {
      vertical-align: middle;
      font-size: 12px;
      color: #606266;
      box-sizing: border-box;
      margin-left: 20px;
    }
    .el-form {
      h4 {
        margin-left: 10px;
        margin-bottom: 20px;
        span {
          margin-right: 5px;
          width: 1px;
          height: 30px;
          box-sizing: border-box;
          border: 2px #409eff solid;
        }
      }
      .el-form-item {
        margin-left: 30px;
        width: 45%;
        display: inline-block;
        vertical-align: middle;
        .el-select {
          width: 100%;
          margin-left: 0;
        }
      }
    }
    .addtit {
      transform: translate(8%, 0%);
    }
  }
}
.aside {
  text-align: right;
margin-right:5%;
  .el-button {
    width: 70px;
    height: 30px;
   
    margin:5px 10px 5px 0;
    span {
      i {
        margin-right: 5px;
        margin-left: -3px;
      }
    }
  }
}
</style>