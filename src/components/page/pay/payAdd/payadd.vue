<template>
  <div class="add">
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane :label="title" name="first">
        <div v-if="$route.query.type=='DETAIL'" v-show="show1">
          <div>
            <span>计费项目名称:</span>：
            <span>{{tableData[0].payname}}</span>
          </div>
          <div>
            <span>项目优先级</span>：
            <span>{{tableData[0].paylevel}}</span>
          </div>
          <div style="margin-left: 20px;">
            <span>项目用量/时长</span>：
            <span>{{tableData[0].paynum}}</span>
          </div>
          <div style="margin-left: 20px;">
            <span>项目价格</span>：
            <span>{{tableData[0].paymoney}}</span>
          </div>
          <div>
            <span>通知状态</span>：
            <span>{{tableData[0].paystatus ==1?'已通知':'未通知'}}</span>
          </div>
          <div>
            <span>通知人</span>：
            <span>{{tableData[0].username}}</span>
          </div>
          <div>
            <span>通知内容</span>：
            <span>{{tableData[0].paycontent}}</span>
          </div>
          <div class="aside">
            <el-button @click="resetForm()" type="primary">
              <i class="el-icon-refresh-left"></i>返回
            </el-button>
            <el-button type="primary" @click="submitForm" v-if="$route.query.type=='ADD'">
              <i class="el-icon-document"></i>保存
            </el-button>
          </div>
        </div>
        <div v-if="$route.query.type=='ADD'" class="ADD">
          <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="115px"
            class="demo-ruleForm"
          >
            <el-form-item label="计费项目名称" prop="payname">
              <el-input v-model="ruleForm.payname"></el-input>
            </el-form-item>
            <el-form-item label="项目优先级" prop="paylevel">
              <el-input v-model="ruleForm.paylevel"></el-input>
            </el-form-item>
            <el-form-item label="项目用量/时长" prop="paynum">
              <el-input v-model="ruleForm.paynum"></el-input>
            </el-form-item>
            <el-form-item label="项目价格" prop="paymoney">
              <el-input v-model="ruleForm.paymoney"></el-input>
            </el-form-item>

            <el-form-item label="通知状态" prop="paystatus">
              <el-select v-model="ruleForm.paystatus" placeholder="请选择状态">
                <el-option label="已通知" value="1"></el-option>
                <el-option label="未通知" value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="计费目录" prop="c_id">
              <el-select v-model="ruleForm.c_id" placeholder="请选择状态">
                <el-option label="电费目录" value="7"></el-option>
                <el-option label="水费固定月目录" value="8"></el-option>
                <el-option label="水费按量目录" value="9"></el-option>
                <el-option label="天然气目录" value="10"></el-option>
                <el-option label="物业费费目录" value="11"></el-option>
                <el-option label="宽带费目录" value="12"></el-option>
              </el-select>
            </el-form-item>

            <div>
              <span style="float: left;transform: translate(55%, 0%);">咨询问候</span>
              <vue-ueditor-wrap class="addtit" v-model="ruleForm.paycontent" :config="ueConfig"></vue-ueditor-wrap>
            </div>
          </el-form>
          <div class="aside">
            <el-button @click="resetForm()" type="primary">
              <i class="el-icon-refresh-left"></i>返回
            </el-button>
            <el-button type="primary" @click="submitForm(1)">
              <i class="el-icon-document" v-if="$route.query.type=='ADD'"></i>保存
            </el-button>
            <el-button type="primary" @click="submitForm()" v-if="$route.query.type=='DETAIL'">编辑</el-button>
          </div>
        </div>
        <div v-show="show2" class="ADD">
          <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item label="小区名称" prop="communityname">
              <el-input v-model="ruleForm.communityname"></el-input>
            </el-form-item>
            <el-form-item label="单元名称" prop="unitname">
              <el-input v-model="ruleForm.unitname"></el-input>
            </el-form-item>
            <el-form-item label="栋数" prop="unitnum">
              <el-input v-model="ruleForm.unitnum"></el-input>
            </el-form-item>

            <el-form-item label="状态选择" prop="unitstatus">
              <el-select v-model="ruleForm.unitstatus" placeholder="请选择状态">
                <el-option label="已建成" value="1"></el-option>
                <el-option label="未建成" value="2"></el-option>
              </el-select>
            </el-form-item>

            <div>
              <span style="float: left;transform: translate(55%, 0%);">咨询问候</span>
              <vue-ueditor-wrap class="addtit" v-model="ruleForm.unitcontext" :config="ueConfig"></vue-ueditor-wrap>
              <p>{{ruleForm.unitcontext}}</p>
            </div>
          </el-form>
          <div class="aside">
            <el-button @click="resetForm()" type="primary">
              <i class="el-icon-refresh-left"></i>返回
            </el-button>
            <el-button type="primary" @click="submitForm(2)">
              <i class="el-icon-document"></i>保存
            </el-button>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
// 引入富文本插件
import VueUeditorWrap from "vue-ueditor-wrap";
export default {
  // 标识,当前组件的名称
  name: "text_f",
  components: {
    VueUeditorWrap
  },
  data() {
    return {
      show1: true,
      show2: false,
      ruleForm: {
        payname: "",
        paylevel: "",
        paynum: "",
        paymoney: "",
        paystatus: "",
        c_id: "",
        paycontent: "",
        coststatus: 2
      },
      rules: {
        payname: [
          { required: true, message: "计费项目不能为空", trigger: "blur" }
        ],
        paylevel: [
          { required: true, message: "项目级别不能为空", trigger: "blur" }
        ],
        paynum: [
          { required: true, message: "项目用量/时长不能为空", trigger: "blur" }
        ],
        paymoney: [
          { required: true, message: "项目价格不能为空", trigger: "change" }
        ],
        paystatus: [
          { required: true, message: "通知状态不能为空", trigger: "change" }
        ],
        c_id: [
          { required: true, message: "项目目录不能为空", trigger: "change" }
        ]
      },
      ueConfig: {
        // UEditor 资源文件的存放路径，就是放置UEditor的文件路径
        UEDITOR_HOME_URL: "/ueditor/", // 编辑器不自动被内容撑高
        autoHeightEnabled: false, // 初始容器高度
        initialFrameHeight: 300, // 初始容器宽度
        initialFrameWidth: "90%", // 上传文件接口
        enableAutoSave: false, // 上传文件接口
        // serverUrl: this.$axios.defaults.baseURL + '/mh/ueditor/config',
        serverUrl: "http://112.6.99.125:7013/safetyPatrol/mh/ueditor/config",
        elementPathEnable: false,
        wordCount: false
      },
      title: "新增单元",
      activeName: "first",
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
        url: "/cost/getCostDetail",
        method: "get",
        params: {
          id: this.$route.query.detailId,
          token:sessionStorage.getItem("token")
        }
      }).then(res => {
        this.tableData = res.data; // 1. 记录数据
      });
    },
    submitEdit() {
      this.show1 = false;
      (this.show2 = true),
        (this.ruleForm.communityname = this.tableData[0].communityname);
      this.ruleForm.unitname = this.tableData[0].unitname;
      this.ruleForm.unitnum = this.tableData[0].unitnum;
      this.ruleForm.unitstatus =
        this.tableData[0].unitstatus == 1 ? "已建成" : "未建成";
      this.ruleForm.unitcontext = this.tableData[0].unitcontext;
    },
    submitForm(val) {
      if (
        this.ruleForm.payname == "" ||
        this.ruleForm.paylevel == "" ||
        this.ruleForm.paynum == "" ||
        this.ruleForm.paymoney == "" ||
        this.ruleForm.paystatus == "" ||
        this.ruleForm.c_id == "" ||
        this.ruleForm.c_id == ""
      ) {
        this.$message({
          showClose: true,
          message: "新增信息不能为空",
          type: "error"
        });
        return false;
      } else {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            this.$confirm("确认保存计费信息？", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消"
            }).then(() => {
              if (val == 1) {
                this.$http({
                  url: "/cost/addCostData",
                  method: "post",
                  data: {
                    payname: this.ruleForm.payname,
                    paylevel: this.ruleForm.paylevel,
                    paynum: this.ruleForm.paynum,
                    paymoney: this.ruleForm.paymoney,
                    paystatus: this.ruleForm.paystatus,
                    c_id: this.ruleForm.c_id,
                    paycontent: this.ruleForm.paycontent,
                    coststatus: this.ruleForm.coststatus,
                    token: sessionStorage.getItem("token")
                  }
                }).then(() => {
                  this.$message({
                    type: "success",
                    message: "计费项目新增成功"
                  });
                  this.$router.push("/pay/payType");
                });
              } else {
                this.$http({
                  url: "/house/updateunitList",
                  method: "post",
                  data: {
                    u_id: this.$route.query.detailId,
                    communityname: this.ruleForm.communityname,
                    unitname: this.ruleForm.unitname,
                    unitnum: this.ruleForm.unitnum,
                    unitstatus: this.ruleForm.unitstatus,
                    unitcontext: this.ruleForm.unitcontext,
                    token: localStorage.getItem("token")
                  }
                }).then(() => {
                  this.$message({
                    type: "success",
                    message: "房屋信息更新成功"
                  });
                  this.$router.push("/house/unit");
                });
              }
            });
          } else {
            this.$message({
              showClose: true,
              message: "新增信息不能为空",
              type: "error"
            });
            return false;
          }
        });
      }
    },
    resetForm() {
      this.$router.push("/pay/payType");
    }
  },
  created() {
    if (this.$route.query.type == "DETAIL") {
      this.handleSubmit();
    } else {
      this.title = "新增计费项目";
    }
  }
};
</script>
<style lang="scss" scoped>
.add {
  .el-tabs {
    .ADD {
      .el-form {
        .el-select {
          width: 100%;
        }
        .el-form-item {
          width: 45%;
          display: inline-block;
          vertical-align: middle;
          &:nth-child(3),
          &:nth-child(4) {
            margin-left: 20px;
            .el-select {
              width: 100%;
            }
          }
        }
        .addtit {
          transform: translate(8%, 0%);
        }
      }
    }
    .aside {
      position: fixed;
      right: 1%;
      top: 25%;
      display: flex;
      flex-direction: column;
      .el-button {
        width: 70px;
        height: 30px;
        margin-left: 0;
        margin: 5px 0;
        span {
          i {
            margin-right: 5px;
            margin-left: -3px;
          }
        }
      }
    }
    div {
      vertical-align: middle;
      font-size: 14px;
      color: #606266;
      line-height: 40px;
      padding: 0 12px 0 0;
      box-sizing: border-box;
      margin-left: 20px;
      &:nth-child(3),
      &:nth-child(4) {
        margin-left: 47px;
      }
    }
  }
}
</style>