<template>
  <div class="post">
    <div class="el-top">
      <el-input v-model="obj.communityname" placeholder="小区名称"></el-input>
      <el-input v-model="obj.unitname" placeholder="单元名称"></el-input>
      <el-date-picker
        v-model="obj.createDt"
        align="right"
        type="date"
        placeholder="建设时间"
        :picker-options="pickerOptions"
      ></el-date-picker>

      <el-select v-model="obj.value" placeholder="选择状态" clearable>
        <el-option label="已建成" value="1"></el-option>
        <el-option label="未建成" value="2"></el-option>
      </el-select>

      <el-button class="search" type="primary" @click="handleFind">
        <i class="el-icon-search"></i>
      </el-button>
      <el-button type="success" @click="handleAdd">
        <i class="el-icon-plus"></i> 录入
      </el-button>
      <el-button type="primary" @click="handleReset">
        <i class="el-icon-refresh-right"></i>
        重置
      </el-button>
    </div>
    <div class="table">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="communityname" label="小区名称" width="275" align="center"></el-table-column>
        <el-table-column
          prop="unitname"
          label="单元名称"
          width="275"
          show-overflow-tooltip
          align="center"
        ></el-table-column>
        <el-table-column prop="unitnum" label="栋数" width="165" align="center"></el-table-column>

        <el-table-column prop="createtime" label="建设时间" width="270" align="center">
          <template
            slot-scope="scope"
          >{{ scope.row.createtime.substring(0, 10) }} {{ scope.row.createtime.substring(11,19)}}</template>
        </el-table-column>
        <el-table-column prop="unitstatus" label="状态" width="160" align="center">
          <template slot-scope="scope">{{ scope.row.unitstatus == 1? '已建成' :'未建成'}}</template>
        </el-table-column>
        <el-table-column label="操作" width="230" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              style="color: rgb(98, 168, 234);"
              plain
              @click="handleDetail(scope.$index, scope.row)"
            >详情</el-button>
            <el-button
              size="mini"
              type="danger"
              plain
              @click="handleDelete(scope.$index, scope.row)"
            >归档</el-button>
          </template>
        </el-table-column>
      </el-table>
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
export default {
  data() {
    return {
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
      ruleForm: {
        title: "",
        content: "",
        createtime: ""
      },
      obj: {
        communityname: "",
        unitname: "",
        createDt: "",
        value: "",

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
    //条件查询
    handleFind() {
      this.$http({
        url: "/house/searchList",
        method: "get",
        params: {
          communityname: this.obj.communityname,
          unitname: this.obj.unitname,
          createDt: this.obj.createDt,
          value: this.obj.value,
          currPage: this.obj.currPage + 1,
          pageNum: this.obj.pageNum,
          token: sessionStorage.getItem("token")
        }
      }).then(res => {
        console.log(res);
        this.tableData = res.data.data; // 1. 记录数据
        this.obj.total = res.data.total; // 2. 记录总数
      });
    },
    //重置
    handleReset() {
      this.obj.communityname = "";
      this.obj.unitname = "";
      this.obj.createDt = "";
      this.obj.value = "";

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
      this.$http({
        url: "/house/gethouseList",
        method: "get",
        params: {
          currPage: this.obj.currPage,
          pageNum: this.obj.pageNum
        }
      }).then(res => {
        console.log(res);
        this.tableData = res.data.data; // 1. 记录数据
        this.obj.total = res.data.total; // 2. 记录总数
      });
    },
    handleAdd() {
      this.$router.push({
        path: "add",
        query: {
          type: "ADD",
        }
      });
      //   if (
      //     this.obj.communityname == "" &&
      //     this.obj.title == "" &&
      //     this.obj.content == ""
      //   ) {
      //     this.$alert("请确保发布的公告内容是否填写完整", "上传内容不全", {
      //       confirmButtonText: "确定"
      //     });
      //   } else {
      //     this.$http({
      //       url: "/poster/addPoster",
      //       method: "post",
      //       data: {
      //         communityname: this.obj.communityname,
      //         title: this.obj.title,
      //         content: this.obj.content
      //       }
      //     }).then(res => {
      //       this.handleSearch();
      //       this.$message({
      //         message: "发布公告成功",
      //         type: "success"
      //       });
      //     });
      //     (this.obj.communityname = ""),
      //       (this.obj.title = ""),
      //       (this.obj.content = "");
      //   }
    },
    //详情
    handleDetail(index, row) {
      this.$router.push({
        path: "add",
        query: {
          type: "DETAIL",
          detailId: row.id
        }
      });
    },
    //删除
    handleDelete(index, row) {
      console.log(row.p_id);
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
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
      width: 17%;
      font-size: 13px;
      display: inline-block;
      border-radius: 8px;
      background-color: rgba(0, 0, 0, 0.09);
      margin-right: 10px;
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
      width: 4%;
      margin-left: 80px;
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