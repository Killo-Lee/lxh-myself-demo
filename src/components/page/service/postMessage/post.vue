<template>
  <div class="post">
    <div class="el-top">
      <el-input v-model="obj.communityname" placeholder="请输入发布小区"></el-input>
      <el-input v-model="obj.title" placeholder="请输入公告主题" clearable></el-input>
      <el-input v-model="obj.content" placeholder="请输入发布内容" clearable></el-input>
      <el-button type="success" @click="handleAdd">
        <i class="el-icon-plus"></i> 发布公告
      </el-button>
      <el-button type="primary" @click="handleSearch">重置</el-button>
    </div>
    <div class="table">
      <el-tabs type="border-card">
        <el-tab-pane label="用户管理">
          <el-table :data="tableData" border style="width: 100%">
            <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
            <el-table-column prop="title" label="主题" width="230" align="center"></el-table-column>
            <el-table-column
              prop="content"
              label="公告内容"
              width="480"
              show-overflow-tooltip
              align="center"
            ></el-table-column>
            <el-table-column prop="createtime" label="发布时间" width="230" align="center" sortable>
              <template
                slot-scope="scope"
              >{{ scope.row.createtime.substring(0, 10) }} {{ scope.row.createtime.substring(11,19)}}</template>
            </el-table-column>
            <el-table-column prop="communityname" label="小区名称" width="160" align="center"></el-table-column>
            <el-table-column label="操作" width="230" align="center">
              <template slot-scope="scope">
                <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">
                  <i class="el-icon-delete"></i>
                  归档
                </el-button>
                <el-button
                  size="mini"
                  type="primary"
                  @click="handleDetail(scope.$index, scope.row)"
                >
                  <i class="el-icon-zoom-in"></i>
                  查看公告
                </el-button>
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
        </el-tab-pane>
      </el-tabs>

      <el-dialog title="公告详情" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
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
      </el-dialog>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dialogVisible: false,
      input: "",
      tableData: [],
      ruleForm: {
        title: "",
        content: "",
        createtime: "",
        communityname: ""
      },
      obj: {
        currPage: 0,
        pageNum: 10,
        total: 0,

        currentPage: 1,

        communityname: "",
        title: "",
        content: ""
      }
    };
  },
  methods: {
    //查询
    handleSearch() {
      this.$http({
        url: "/poster/getPosterData",
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
      if (
        this.obj.communityname == "" &&
        this.obj.title == "" &&
        this.obj.content == ""
      ) {
        this.$alert("请确保发布的公告内容是否填写完整", "上传内容不全", {
          confirmButtonText: "确定"
        });
      } else {
        this.$http({
          url: "/poster/addPoster",
          method: "post",
          data: {
            communityname: this.obj.communityname,
            title: this.obj.title,
            content: this.obj.content
          }
        }).then(res => {
          this.handleSearch();
          this.$message({
            message: "发布公告成功",
            type: "success"
          });
        });
        (this.obj.communityname = ""),
          (this.obj.title = ""),
          (this.obj.content = "");
      }
    },
    //详情
    handleDetail(index, row) {
      this.ruleForm = row;
      this.dialogVisible = true;
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
            url: "/poster/delPoster",
            method: "get",
            params: {
              p_id: row.p_id
            }
          }).then(res => {
            this.handleSearch();
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
      this.handleSearch();
    },
    handleCurrentChange(val) {
      this.obj.currPage = val - 1;
      this.handleSearch();
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
      width: 21%;
      font-size: 13px;
      display: inline-block;
      border-radius: 8px;
      background-color: rgba(0, 0, 0, 0.09);
      margin-right: 10px;
      &:nth-child(3) {
        width: 30%;
      }
    }
    /* 按钮 */
    .el-button {
      margin-left: 15px;
      width: 8%;
      font-size: 14px;
      color: #fff;
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
        font-weight: 500;
        height: 50px;
        line-height: 40px;
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