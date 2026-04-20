<template>
  <div class="post">
    <div class="el-top">
      <el-select v-model="obj.smartstatus" placeholder="智能设备状态" clearable>
        <el-option label="已建成" value="1"></el-option>
        <el-option label="未建成" value="2"></el-option>
      </el-select>

      <el-date-picker
        v-model="dateRange"
        type="daterange"
        align="right"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions"
      ></el-date-picker>
      <el-input v-model="obj.homenum" placeholder="房号"></el-input>

      <el-button class="search" type="primary" @click="handleFind">
        <i class="el-icon-search"></i>查询
      </el-button>
    </div>
    <div class="table">
      <el-tabs type="border-card">
        <el-tab-pane label="智能设备">
          <el-table :data="tableData" border style="width: 100%" v-loading="loading">
            <el-table-column
              prop="unitname"
              label="单元名称"
              width="180"
              show-overflow-tooltip
              align="center"
            ></el-table-column>
            <el-table-column prop="buildnum" label="幢号" width="100" align="center"></el-table-column>
            <el-table-column prop="homenum" label="房号" width="100" align="center"></el-table-column>
            <el-table-column prop="homename" label="房主" width="130" align="center"></el-table-column>
            <el-table-column prop="airnum" label="空调" width="100" align="center"></el-table-column>
            <el-table-column prop="wifiname" label="WI-FI" width="100" align="center"></el-table-column>
            <el-table-column prop="washnum" label="洗衣机" width="100" align="center"></el-table-column>

            <el-table-column prop="createtime" label="建设时间" width="200" align="center">
              <template
                slot-scope="scope"
              >{{ scope.row.createtime.substring(0, 10) }} {{ scope.row.createtime.substring(11,19)}}</template>
            </el-table-column>

            <el-table-column prop="smartstatus" label="状态" width="100" align="center">
              <template slot-scope="scope">{{ scope.row.smartstatus == 1? '完好' :'待维修'}}</template>
            </el-table-column>

            <el-table-column label="操作状态" width="100" align="center" prop="smartstatus">
              <template slot-scope="scope">
                <el-tooltip :content="'Switch value: ' + scope.row.smartstatus" placement="top">
                  <el-switch
                    v-model="scope.row.smartstatus"
                    active-color="#13ce66"
                    :active-value="1"
                    :inactive-value="2"
                    @change="handleUpdate1(scope.row)"
                  ></el-switch>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="家具设备">
          <el-table :data="tableData" border style="width: 100%" v-loading="loading">
            <el-table-column
              prop="unitname"
              label="单元名称"
              width="180"
              show-overflow-tooltip
              align="center"
            ></el-table-column>
            <el-table-column prop="buildnum" label="幢号" width="100" align="center"></el-table-column>
            <el-table-column prop="homenum" label="房号" width="100" align="center"></el-table-column>
            <el-table-column prop="homename" label="房主" width="130" align="center"></el-table-column>
            <el-table-column prop="homedesk" label="书桌" width="100" align="center"></el-table-column>
            <el-table-column prop="homechair" label="椅子" width="100" align="center"></el-table-column>
            <el-table-column prop="homeclothes" label="衣柜" width="100" align="center"></el-table-column>

            <el-table-column prop="createtime" label="授予时间" width="200" align="center">
              <template
                slot-scope="scope"
              >{{ scope.row.createtime.substring(0, 10) }} {{ scope.row.createtime.substring(11,19)}}</template>
            </el-table-column>

            <el-table-column prop="familystatus" label="状态" width="100" align="center">
              <template slot-scope="scope">{{ scope.row.familystatus == 1? '完好' :'待维修'}}</template>
            </el-table-column>

            <el-table-column label="操作状态" width="100" align="center" prop="familystatus">
              <template slot-scope="scope">
                <el-tooltip :content="'Switch value: ' + scope.row.familystatus" placement="top">
                  <el-switch
                    v-model="scope.row.familystatus"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    :active-value="1"
                    :inactive-value="2"
                    @change="handleUpdate2(scope.row)"
                  ></el-switch>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="obj.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="obj.currentPage"
          :page-sizes="[5, 10, 20, 50,100]"
          :page-size="obj.pageNum"
        ></el-pagination>
      </el-tabs>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dateRange: [], // 用于绑定组件的数组
      startDate: null, // 独立的开始日期变量
      endDate: null, // 独立的结束日期变量
      loading: true,
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      dialogVisible: false,
      input: "",
      tableData: [],
      ruleForm: {
        title: "",
        content: "",
        createtime: ""
      },
      obj: {
        smartstatus: "",
        familystatus: "",
        homenum: "",
        startDate: "",
        endDate: "",

        currPage: 0,
        pageNum: 10,
        total: 0,

        currentPage: 1,

        communityname: "",
        title: "",
        date: "",
        region: ""
      }
    };
  },
  methods: {
    //更新数据
    handleUpdate1(val) {
      this.$confirm("确定更新该智能设备状态？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
           this.$http({
            url: "/house/updatesmartStatus",
            method: "POST",
            data: {
              id: val.id,
              smartstatus: val.smartstatus,
              token: sessionStorage.getItem("token")
            }
          }).then(res => {
            this.$message({
              type: "success",
              message: "智能设备状态改变成功"
            });
         
            this.handleSearch();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消改变智能状态"
          });

          this.handleSearch();
        });
    },
    handleUpdate2(val) {
      this.$confirm("确定更新该智能设备状态？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
           this.$http({
            url: "/house/searchdeviceList",
            method: "POST",
            data: {
              id: val.id,
              familystatus: val.familystatus,
              token: sessionStorage.getItem("token")
            }
          }).then(res => {
            this.$message({
              type: "success",
              message: "家居设备状态改变成功"
            });
         
            this.handleSearch();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消改变家居状态"
          });

          this.handleSearch();
        });
    },
    //条件查询
    handleFind() {
      this.$http({
        url: "/house/searchdeviceList",
        method: "get",
        params: {
          smartstatus: this.obj.smartstatus,
          familystatus: this.obj.familystatus,
          homenum: this.obj.homenum,
          startDate:this.startDate==null? null : this.startDate.substring(0,10),
          endDate: this.endDate ==null? null :  this.endDate.substring(0,10),
          currPage: this.obj.currPage,
          pageNum: this.obj.pageNum,
          token: sessionStorage.getItem("token")
        }
      }).then(res => {
        console.log(res);
        this.tableData = res.data.data; // 1. 记录数据
        this.obj.total = res.data.total; // 2. 记录总数
        setTimeout(() => {
          this.loading = false;
        }, 500);
      });
    },
    //重置
    handleReset() {
      this.obj.smartstatus = "";
      this.obj.familystatus = "";
      this.obj.homenum = "";
      this.obj.startDate = "";
      this.obj.endDate = "";

      this.obj.currentPage = 1;

      this.obj.currPage = 0;
      this.obj.pageNum = 10;
      this.$forceUpdate();
      this.$nextTick(() => {
        this.handleSearch();
      });
    },
    //查询
    handleSearch() {
      this.loading = true;
      this.$http({
        url: "/house/searchdeviceList",
        method: "get",
        params: {
          smartstatus: this.obj.smartstatus,
          familystatus: this.obj.familystatus,
          homenum: this.obj.homenum,
          startDate: this.obj.startDate,
          endDate: this.obj.endDate,
          currPage: this.obj.currPage,
          pageNum: this.obj.pageNum,
          token: sessionStorage.getItem("token")
        }
      }).then(res => {
        console.log(res);
        this.tableData = res.data.data; // 1. 记录数据
        this.obj.total = res.data.total; // 2. 记录总数
        setTimeout(() => {
          this.loading = false;
        }, 500);
      });
    },
    //分页
    handleSizeChange(val) {
      this.obj.pageNum = val;
      if (
        this.obj.smartstatus == "" &&
        this.obj.familystatus == "" &&
        this.obj.homenum == "" &&
        this.obj.startDate == "" &&
        this.obj.endDate == ""
      ) {
        this.handleSearch();
      } else {
        this.handleFind();
      }
    },
    handleCurrentChange(val) {
      if (
        this.obj.smartstatus == "" &&
        this.obj.familystatus == "" &&
        this.obj.homenum == "" &&
        this.obj.startDate == "" &&
        this.obj.endDate == ""
      ) {
        this.obj.currPage = val - 1;
        this.handleSearch();
      } else {
        this.obj.currPage = val - 1;
        this.handleFind();
      }
    },
    //模态框
    handleClose(done) {
      this.dialogVisible = false;
    },
    Time(val){
       const date = new Date(val);
        // 提取年、月、日、时、分、秒（注意月份从 0 开始，需 +1）
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0"); // 补 0 成两位数（如 10 月不补，2 月补为 02）
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const seconds = String(date.getSeconds()).padStart(2, "0");
        // 拼接成标准格式
        const standardTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        return standardTime
    }
  },
  mounted() {
    this.handleSearch();
  },
  watch: {
    // 监听日期范围变化，拆分到两个变量
    dateRange(newVal) {
      if (newVal && newVal.length === 2) {
        this.startDate = this.Time(newVal[0]) // 开始日期
        this.endDate = this.Time(newVal[1]); // 结束日期
      } else {
        // 未选择时清空
        this.startDate = null;
        this.endDate = null;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.post ::v-deep {
  .el-top {
    .el-input {
      width: 17%;
      font-size: 13px;
      display: inline-block;
      border-radius: 8px;
      background-color: rgba(0, 0, 0, 0.09);
      margin-right: 10px;
      margin-left: 10px;
    }
    .el-select {
      .el-input__inner {
        width: 233px;
      }
      .el-input__suffix {
        right: -185px;
      }
    }
    /* 按钮 */
    .el-button {
      margin-left: 15px;
      width: 8%;
      font-size: 14px;
      color: #fff;
    }
    .search {
      width: 7%;
    }
  }
  .table {
    .el-tabs {
      margin-top: 20px;
      .el-form {
        .row1 {
          margin-bottom: 20px;
          height: 33px;
          .el-form-item {
            &:nth-child(1) {
              display: inline-block;
              float: left;
            }
            &:nth-child(2) {
              display: inline-block;
              float: right;
              .el-col-11 {
                width: 85.83333%;
              }
            }
          }
        }
        .row2 {
          .el-input {
            transform: translate(0, -15px);
          }
        }
        .el-footer {
          text-align: right;
        }
      }
      .el-table__header {
        width: 100% !important;
        th {
          background: #eef1f6;
          color: rgb(31, 45, 61);
          border-color: rgb(223, 230, 236);
          font-size: 14px;
          font-weight: 700;
        }
        .el-table__empty-block {
          display: none;
        }
      }
      .el-table__body {
        width: 100% !important;
      }
      .el-table__body-wrapper {
        overflow-x: hidden !important;
      }
      .el-pagination {
        margin-top: 10px;
        text-align: right;
      }
    }
  }
}
</style>