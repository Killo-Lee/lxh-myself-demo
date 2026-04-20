<template>
  <div class="post">
    <div class="el-top">
      <el-input v-model="obj.parkname" placeholder="车位名称"></el-input>
      <el-input v-model="obj.orderpay" placeholder="应缴金额"></el-input>
      <el-select v-model="obj.orderstatus" placeholder="缴费状态" clearable>
        <el-option label="已缴费" value="1"></el-option>
        <el-option label="未缴费" value="2"></el-option>
      </el-select>
      <el-button class="search" type="primary" @click="handleFind">
        <i class="el-icon-search"></i>查询
      </el-button>
      <el-button type="success" @click="handleExport">
        <i class="el-icon-upload2"></i> 全部导出
      </el-button>
      <el-button type="primary" @click="handleReset">
        <i class="el-icon-delete"></i>
        重置
      </el-button>
    </div>
    <div class="table">
      <el-table :data="tableData" border style="width: 100%" v-loading="loading">
        <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
        <el-table-column
          prop="parkname"
          label="车位名称"
          width="230"
          show-overflow-tooltip
          align="center"
        ></el-table-column>
        <el-table-column prop="parkpay" label="车位金额" width="165" align="center">
          <template slot-scope="scope">{{ scope.row.parkpay==null? '暂无' : scope.row.parkpay}}</template>
        </el-table-column>
        <el-table-column prop="startdate" label="开始时间" width="165" align="center">
          <template slot-scope="scope">
            {{ scope.row.startdate==null? '暂无' :(function() {
            const d = new Date(scope.row.startdate);
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            const hour = String(d.getHours()).padStart(2, '0');
            const minute = String(d.getMinutes()).padStart(2, '0');
            const second = String(d.getSeconds()).padStart(2, '0');
            return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
            })()}}
          </template>
        </el-table-column>
        <el-table-column prop="enddate" label="结束时间" width="165" align="center">
          <template slot-scope="scope">
            {{ scope.row.enddate==null? '暂无' : (function() {
            const d = new Date(scope.row.enddate);
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            const hour = String(d.getHours()).padStart(2, '0');
            const minute = String(d.getMinutes()).padStart(2, '0');
            const second = String(d.getSeconds()).padStart(2, '0');
            return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
            })()}}
          </template>
        </el-table-column>
        <el-table-column prop="orderpay" label="应缴金额" width="165" align="center">
          <template slot-scope="scope">{{ scope.row.orderpay==null? '暂无' : scope.row.orderpay}}</template>
        </el-table-column>
        <el-table-column prop="orderstatus" label="缴费状态" width="160" align="center">
          <template slot-scope="scope">
            <el-tooltip
              :content="`order status :   ${scope.row.orderstatus == 1?1:2}` "
              placement="top"
            >
              <el-switch
                disabled
                v-model="scope.row.orderstatus"
                class="switchStyle"
                :active-value="1"
                :inactive-value="0"
                active-color="#13ce66"
                inactive-color="#cccccc"
                :class="{
              'switch-is-actived':  scope.row.orderstatus == '1',
            }"
              ></el-switch>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="230" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              
              plain
              @click="handleEdit(scope.$index, scope.row)"
            >通知缴费</el-button>
            <el-button style="color: rgb(98, 168, 234);" size="mini" plain @click="handleDetail(scope.$index, scope.row)">缴费详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog :title="title" :visible.sync="dialogFormVisible">
        <el-form label-width="100px" :model="ruleForm" :rules="rules">
          <el-form-item label="开始时间：" prop="startdate">
            <el-date-picker v-model="ruleForm.startdate" :disabled="disabled" type="date" placeholder="请输入开始时间"></el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间：" prop="enddate">
            <el-date-picker v-model="ruleForm.enddate" :disabled="disabled" type="date" placeholder="请输结束时间"></el-date-picker>
          </el-form-item>

          <el-form-item label="应缴金额：" prop="orderpay">
            <el-input v-model="ruleForm.orderpay" :disabled="disabled" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item label="缴费状态：" prop="orderstatus">
            <el-select v-model="ruleForm.orderstatus" :disabled="disabled" placeholder="请选择活动区域">
              <el-option label="已缴费" value="1"></el-option>
              <el-option label="未缴费" value="2"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="通知缴费：">
            <el-input type="textarea" :rows="3" :disabled="disabled" placeholder="请输入内容" v-model="ruleForm.note"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogFormVisible = false">关闭</el-button>
          <el-button type="primary" @click="handleEditPark" v-if="this.title=='车位订单通知'">通知</el-button>
          <el-button type="primary" @click="handleResetForm" v-if="this.title=='车位订单通知'">重置</el-button>
        </div>
      </el-dialog>

      <el-pagination
        background
        layout="total, sizes, prev, pager, next"
        :total="obj.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="obj.currentPage"
        :page-sizes="[7, 10, 20, 50,100]"
        :page-size="obj.pageNum"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
// 导入插件
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
export default {
  name: "homeTel",
  data() {
    return {
      disabled:false,
      ruleForm: {
        parkname: "",
        orderstatus: "",
        orderpay: "",
        startdate: "",
        enddate: "",
        orderstatus: "",
        note: ""
      },
      rules: {
        startdate: [
          { required: true, message: "开始时间为空", trigger: "blur" }
        ],
        enddate: [{ required: true, message: "结束时间为空", trigger: "blur" }],
        orderpay: [
          { required: true, message: "应缴金额为空", trigger: "blur" }
        ],

        orderstatus: [
          { required: true, message: "缴费状态为空", trigger: "blur" }
        ]
      },
      loading: true,
      multipleSelection: [],
      title: "",
      dialogFormVisible: false,
      input: "",
      tableData: [],
      tableDta: [],
      ruleForm: {
        startdate: "",
        enddate: "",
        orderpay: "",
        orderstatus: "",
        note: "",
        id: ""
      },
      obj: {
        parkname: "",
        parkpay: "",
        parktype: "",
        parkstatus: "",

        orderstatus: "",
        orderpay: "",

        currPage: 0,
        pageNum: 10,
        total: 0,

        currentPage: 1,

        communityname: "",
        title: "",
        date: "",
        region: ""
      },
      // 标志位，用于记录函数是否被触发
      targetFunctionTriggered: false
    };
  },
  methods: {
    //条件查询
    handleFind() {
      this.handleSearch();
    },
    //重置
    handleReset() {
      this.obj.parkname = "";
      this.obj.orderstatus = "";
      this.obj.orderpay = "";

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
        url: "/parking/getParkOrder",
        method: "get",
        params: {
          parkname: this.obj.parkname,
          orderstatus: this.obj.orderstatus,
          orderpay: this.obj.orderpay,
          currPage: this.obj.currPage,
          pageNum: this.obj.pageNum
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
    //导出
    handleExport() {
      this.$confirm("确定全量导出excel文件？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // 创建一个workbook
          const workbook = XLSX.utils.book_new(); // 导出数据
          const worksheet = XLSX.utils.json_to_sheet(this.tableData);
          XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet 1"); // 将workbook转为二进制数据

          const excelData = XLSX.write(workbook, {
            type: "array",
            bookType: "xlsx"
          }); // 创建blob对象并保存excel文件
          const blob = new Blob([excelData], {
            type: "application/octet-stream"
          }); // 设置导出文件名字
          saveAs(blob, "data.xlsx");
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消全部导出"
          });
        });
    },
    //编辑
    handleEdit(index, row) {
      this.title = "车位订单通知";
      this.dialogFormVisible = true;
      this.ruleForm.startdate = row.startdate;
      this.ruleForm.enddate = row.enddate;
      this.ruleForm.orderpay = row.orderpay;
      this.ruleForm.orderstatus = row.orderstatus == 1 ? "已缴费" : "未缴费";
      this.ruleForm.note = row.orderstatus;
      this.ruleForm.id = row.id;
    },
    // 重置表单
    handleResetForm() {
      this.ruleForm.startdate = null;
      this.ruleForm.enddate = null;
      this.ruleForm.orderpay = null;
      this.ruleForm.orderstatus = null;
      this.ruleForm.note = null;
    },
    //通知
    handleEditPark() {
      if(  
      this.ruleForm.startdate == null &&
      this.ruleForm.enddate == null &&
      this.ruleForm.orderpay ==null &&
      this.ruleForm.orderstatus ==null&& 
      this.ruleForm.note ==null ){
        this.$message.error('必填项不能为空');
      }else{
        this.$http({
        url: "/parking/editParkOrder",
        method: "post",
        data: {
          u_id: this.ruleForm.id,
          startdate: this.Time(this.ruleForm.startdate),
          enddate: this.Time(this.ruleForm.enddate),
          orderpay: this.ruleForm.orderpay,
          orderstatus: this.ruleForm.orderstatus == "未缴费" ? 2 :  this.ruleForm.orderstatus == "已缴费" ? 1 :this.ruleForm.orderstatus == 1 ? 1 : 2,
          note: this.ruleForm.note,
          token: sessionStorage.getItem("token")
        }
      }).then(() => {
        (this.dialogFormVisible = false),
          this.$message({
            type: "success",
            message: "车位修改成功"
          });
        this.handleSearch();
      });
      }
      
    },
    //详情
    handleDetail(index, row) {
      this.disabled = true;
       this.title = "车位订单详情";
      this.dialogFormVisible = true;
      this.ruleForm.startdate = row.startdate;
      this.ruleForm.enddate = row.enddate;
      this.ruleForm.orderpay = row.orderpay;
      this.ruleForm.orderstatus = row.orderstatus == 1 ? "已缴费" : "未缴费";
      this.ruleForm.note = row.orderstatus;
      this.ruleForm.id = row.id;
    },
    //分页
    handleSizeChange(val) {
      this.obj.pageNum = val;
      if (
        this.obj.parkname == "" &&
        this.obj.orderstatus == "" &&
        this.obj.orderpay == ""
      ) {
        this.handleSearch();
      } else {
        this.handleFind();
      }
    },
    handleCurrentChange(val) {
      console.log(this.obj, "obj");
      if (
        this.obj.parkname == "" &&
        this.obj.orderstatus == "" &&
        this.obj.orderpay == ""
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
    //批量操作
    handleSelectionChange(val) {
      this.multipleSelection = val;
      // 函数执行时将标志位设为true
      this.targetFunctionTriggered = true;
      this.tableDta = val;
      console.log(this.tableDta);
    },
    Time(data) {
      const utcDate = new Date(data);
      // 转为 UTC+12 的本地时间
      const localTime = new Date(utcDate.getTime() + 12 * 60 * 60 * 1000);

      const year = localTime.getUTCFullYear();
      const month = String(localTime.getUTCMonth() + 1).padStart(2, "0");
      const day = String(localTime.getUTCDate()).padStart(2, "0");
      const hours = String(localTime.getUTCHours()).padStart(2, "0");
      const minutes = String(localTime.getUTCMinutes()).padStart(2, "0");
      const seconds = String(localTime.getUTCSeconds()).padStart(2, "0");

      // 或按你要求的非标准格式（仅日期 + +12:00:00）
      return  `${year}-${month}-${day}+12:00:00`;
    }
  },
  mounted() {
    this.handleSearch();
  }
};
</script>
<style lang="scss" scoped>
.post ::v-deep {
  .el-top {
    .el-input {
      width: 18%;
      font-size: 13px;
      display: inline-block;
      border-radius: 8px;
      background-color: rgba(0, 0, 0, 0.09);
      margin-right: 10px;
    }
    .el-select {
      .el-input__inner {
        width: 270px;
      }
      .el-input__suffix {
        right: -215px;
      }
    }
    /* 按钮 */
    .el-button {
      margin-left: 15px;
      width: 9%;
      font-size: 14px;
      color: #fff;
      height: 32px;
    }

    .search {
      width: 9%;
      margin-left: 10px;
      height: 32px;
    }
  }

  .table {
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
      .el-switch {
        .el-switch__core {
          width: 70px !important;
          height: 20px;
          line-height: 17px;
          &::before {
            content: "未缴费";
            color: #fff;
            position: absolute;
            // font-size: 14px;
            transform: scale(0.85);
            left: 20px;
          }
        }
        &.switch-is-actived {
          .el-switch__core {
            &::before {
              content: "已缴费";
              left: 10px;
              transform: scale(0.85);
            }
          }
        }
      }
    }
    .el-table__body-wrapper {
      overflow-x: hidden !important;
    }
    .el-pagination {
      margin-top: 10px;
      text-align: right;
    }
    .el-dialog {
      .el-date-editor {
        width: 100%;
      }
      .el-select {
        width: 100%;
      }
    }
  }
}
</style>