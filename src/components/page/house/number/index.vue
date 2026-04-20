<template>
  <div class="post">
    <div class="el-top">
      <el-select v-model="obj.homestatus" placeholder="入住状态" clearable>
        <el-option label="已入住" value="1"></el-option>
        <el-option label="未入住" value="2"></el-option>
      </el-select>
      <el-input v-model="obj.unitname" placeholder="单元名称"></el-input>
      <el-input v-model="obj.buildnum" placeholder="幢号"></el-input>
      <el-input v-model="obj.homenum" placeholder="房号"></el-input>
      <el-input v-model="obj.homename" placeholder="住客姓名"></el-input>

      <el-button class="search" type="primary" @click="handleFind">
        <i class="el-icon-search"></i>查询
      </el-button>
      <el-button type="success" @click="handleExport">
        <i class="el-icon-upload2"></i> 批量导出
      </el-button>
      <el-button type="danger" @click="handleDelAll">
        <i class="el-icon-delete"></i>
        批量删除
      </el-button>
    </div>
    <div class="table">
      <el-table
        ref="multipleTable"
        :data="tableData"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
        v-loading="loading"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
        <el-table-column
          prop="unitname"
          label="单元名称"
          width="230"
          show-overflow-tooltip
          align="center"
        ></el-table-column>
        <el-table-column prop="buildnum" label="幢号" width="165" align="center">
          <template slot-scope="scope">{{ scope.row.buildnum == null ?'暂无' :scope.row.buildnum}}</template>
        </el-table-column>
        <el-table-column prop="storeynum" label="楼层号" width="165" align="center">
          <template slot-scope="scope">{{ scope.row.storeynum == null ?'暂无' :scope.row.storeynum}}</template>
        </el-table-column>
        <el-table-column prop="homenum" label="房号" width="165" align="center">
          <template slot-scope="scope">{{ scope.row.homenum == null ?'暂无' :scope.row.homenum}}</template>
        </el-table-column>
        <el-table-column prop="homename" label="住客姓名" width="165" align="center">
          <template slot-scope="scope">{{ scope.row.homename == null ?'暂无' :scope.row.homename}}</template>
        </el-table-column>
        <el-table-column prop="homestatus" label="状态" width="160" align="center">
          <template slot-scope="scope">{{ scope.row.homestatus == 1? '已入住' :'未入住'}}</template>
        </el-table-column>
        <el-table-column label="操作" width="230" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              style="color: rgb(98, 168, 234);"
              plain
              @click="handleDetail(scope.$index, scope.row)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              plain
              @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
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

      <!-- <el-dialog title="公告详情" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
        <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <div class="row1">
            <el-form-item label="小区名称">
              <el-input v-model="ruleForm.communityname" readonly></el-input>
            </el-form-item>

            <el-form-item label="活动时间">
              <el-col :span="11">
                <el-form-item>
                  <el-date-picker
                    size
                    readonly
                    type="date"
                    v-model="ruleForm.createtime"
                    style="width: 100%;"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
            </el-form-item>
          </div>

          <el-form-item label="公告主题" class="row2">
            <el-input v-model="ruleForm.title" readonly></el-input>
          </el-form-item>

          <el-form-item label="公告内容">
            <el-input type="textarea" v-model="ruleForm.content" readonly rows="4"></el-input>
          </el-form-item>

          <el-form-item label="公告状态">
            <el-button disabled>阅读量</el-button>
          </el-form-item>

          <div class="el-footer">
            <el-button @click="handleClose">关闭</el-button>
          </div>
        </el-form>
      </el-dialog>-->
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
      loading: true,
      multipleSelection: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            }
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            }
          }
        ]
      },
      dialogVisible: false,
      input: "",
      tableData: [],
      tableDta: [],
      ruleForm: {
        title: "",
        content: "",
        createtime: ""
      },
      obj: {
        homestatus: "",
        unitname: "",
        buildnum: "",
        homenum: "",
        homename: "",

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
      this.loading = true;
      this.$http({
        url: "/house/searchnumList",
        method: "get",
        params: {
          homestatus: this.obj.homestatus,
          unitname: this.obj.unitname,
          buildnum: this.obj.buildnum,
          homenum: this.obj.homenum,
          homename: this.obj.homename,
          currPage: this.obj.currPage,
          pageNum: this.obj.pageNum,
          token: sessionStorage.getItem("token")
        }
      }).then(res => {
        this.tableData = res.data.data; // 1. 记录数据
        this.obj.total = res.data.total; // 2. 记录总数
        setTimeout(() => {
          this.loading = false;
        }, 1000);
      });
    },
    //重置
    handleReset() {
      this.obj.homestatus = "";
      this.obj.unitname = "";
      this.obj.buildnum = "";
      this.obj.homenum = "";
      this.obj.homename = "";

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
        url: "/house/gethouseList?",
        method: "get",
        params: {
          currPage: this.obj.currPage,
          pageNum: this.obj.pageNum
        }
      }).then(res => {
        console.log(res);
        this.tableData = res.data.data; // 1. 记录数据
        this.obj.total = res.data.total; // 2. 记录总数
        setTimeout(() => {
          this.loading = false;
        }, 1000);
      });
    },
    handleExport() {
      // 检查标志位状态
      if (this.tableDta.length !== 0) {
        // 创建一个workbook
        const workbook = XLSX.utils.book_new(); // 导出数据
        const worksheet = XLSX.utils.json_to_sheet(this.tableDta);
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet 1"); // 将workbook转为二进制数据

        const excelData = XLSX.write(workbook, {
          type: "array",
          bookType: "xlsx"
        }); // 创建blob对象并保存excel文件
        const blob = new Blob([excelData], {
          type: "application/octet-stream"
        }); // 设置导出文件名字
        saveAs(blob, "data.xlsx");
      } else {
        this.$alert("请选择要导出的房号信息", "提示", {
          confirmButtonText: "确定"
        });
      }
    },
    //详情
    handleDetail(index, row) {
      this.$router.push({
        path: "numAdd",
        query: {
          type: "DETAIL",
          detailId: row.id
        }
      });
    },
    //删除
    handleDelete(index, row) {
      this.$confirm("确定删除该单元信息？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http({
            url: "/house/delunitList",
            method: "get",
            params: {
              id: row.id
            }
          }).then(res => {
            this.handleReset();
          });

          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //批量删除
    handleDelAll() {
      if (this.tableDta.length !== 0) {
        this.$confirm("确定删除该房号信息？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.$http({
            url: "/house/delnumList",
            method: "get",
            params: {
              ids: this.tableDta.map(item => item.id),
              token: sessionStorage.getItem("token")
            }
          }).then(res => {
            this.handleReset();
          });
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        });
        //   .catch(() => {
        //     this.$message({
        //       type: "info",
        //       message: "已取消删除"
        //     });
        //   });
      } else {
        this.$alert("请选择要删除的房号信息", "提示", {
          confirmButtonText: "确定"
        });
      }
    },
    //分页
    handleSizeChange(val) {
      this.obj.pageNum = val;
      if (
        this.obj.communityname == "" &&
        this.obj.unitname == "" &&
        this.obj.createDt == "" &&
        this.obj.value == ""
      ) {
        this.handleSearch();
      } else {
        this.handleFind();
      }
    },
    handleCurrentChange(val) {
      if (
        this.obj.communityname == "" &&
        this.obj.unitname == "" &&
        this.obj.createDt == "" &&
        this.obj.value == ""
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
      width: 15%;
      font-size: 13px;
      display: inline-block;
      border-radius: 8px;
      background-color: rgba(0, 0, 0, 0.09);
      margin-right: 10px;
    }
    .el-select {
      .el-input__inner {
        width: 180px;
      }
      .el-input__suffix {
        right: -150px;
      }
    }
    /* 按钮 */
    .el-button {
      margin-left: 15px;
      width: 7%;
      font-size: 14px;
      color: #fff;
    }
    .search {
      width: 5%;
      margin-left: 10px;
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
</style>