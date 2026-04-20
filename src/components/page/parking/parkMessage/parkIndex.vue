<template>
  <div class="park">
    <div class="left">
      <span>车位名：</span>
      <el-input v-model="obj.parkname" placeholder="请输入车位名"></el-input>
      <span>车位金额：</span>
      <el-input v-model="obj.parkpay" placeholder="请输入车位金额"></el-input>
      <span>车位类型：</span>
      <el-select v-model="obj.parktype" placeholder="请选择车位类型">
        <el-option label="底下" value="1"></el-option>
        <el-option label="底上" value="2"></el-option>
      </el-select>
      <br />
      <span>车位状态：</span>
      <el-select v-model="obj.parkstatus" placeholder="请选择车位状态">
        <el-option label="已有车" value="1"></el-option>
        <el-option label="未有车" value="2"></el-option>
      </el-select>
      <div>
        <el-button type="primary" icon="el-icon-edit" @click="handleFind">查询</el-button>
        <el-button type="primary" icon="el-icon-search" @click="handleReset">重置</el-button>
      </div>
    </div>
    <div class="right">
      <div class="r-top">
        <h2>车位列表</h2>
        <el-button type="success" icon="el-icon-plus" @click="handleEdit(null,1)">新增</el-button>
      </div>
      <div class="table">
        <el-table :data="tableData" border style="width: 100%" v-loading="loading" stripe>
          <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
          <el-table-column prop="parkname" label="车位名称" width="160" align="center" sortable></el-table-column>
          <el-table-column prop="parkpay" label="车位金额" width="160" align="center" sortable></el-table-column>
          <el-table-column prop="parktype" label="车位类型" width="180" align="center">
            <template slot-scope="scope">
              <el-tooltip :content="'parktype: ' +scope.row.parktype" placement="top">
                <el-switch
                  v-model="scope.row.parktype"
                  active-text="地上"
                  inactive-text="地下"
                  :active-value="1"
                  :inactive-value="2"
                  @change="handleUpdate1(scope.row)"
                ></el-switch>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="parkstatus" label="车位状态" width="180" align="center">
            <template slot-scope="scope">
              <el-tooltip :content="'park status: ' +scope.row.parkstatus" placement="top">
                <el-switch
                  v-model="scope.row.parkstatus"
                  active-text="已有车"
                  inactive-text=" 未有车"
                  :active-value="1"
                  :inactive-value="2"
                  @change="handleUpdate2(scope.row)"
                ></el-switch>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="300" align="center" prop="parkstatus">
            <template slot-scope="scope">
              <el-button
                size="small"
                icon="el-icon-share"
                plain
                @click="handleDeliver(scope.row)"
                :disabled="scope.row.parkstatus==1?true:false"
              >分配车位</el-button>
              <el-button
                size="small"
                icon="el-icon-edit"
                plain
                style="color: rgb(98, 168, 234);"
                @click="handleEdit(scope.row,2)"
              >编辑</el-button>
              <el-button
                size="small"
                type="danger"
                plain
                icon="el-icon-delete"
                @click="handleDel(scope.row)"
              >移除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination
            background
            layout="total, sizes, prev, pager, next, jumper"
            :total="obj.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="obj.currentPage"
            :page-sizes="[9, 10, 20, 50,100]"
            :page-size="obj.pageNum"
          ></el-pagination>
        </div>

        <el-dialog :title="title" :visible.sync="dialogFormVisible">
          <el-form label-width="100px" :model="ruleForm" :rules="rules">
            <el-form-item label="车位名称：" prop="parkname">
              <el-input v-model="ruleForm.parkname" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="车位金额：" prop="parkpay">
              <el-input v-model="ruleForm.parkpay" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="车位类型：" prop="parktype">
              <el-select v-model="ruleForm.parktype" placeholder="请选择活动区域">
                <el-option label="地下" value="1"></el-option>
                <el-option label="地上" value="2"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="车位状态：" prop="parkstatus">
              <el-select v-model="ruleForm.parkstatus" placeholder="请选择活动区域">
                <el-option label="已有车" value="1"></el-option>
                <el-option label="未有车" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleEditPark" v-if="this.title=='车位修改'">保存</el-button>
            <el-button type="primary" @click="handleAdd" v-if="this.title=='新增车位'">提交</el-button>
            <el-button type="primary" @click="handleResetForm">重置</el-button>
          </div>
        </el-dialog>

        <el-drawer
          title="车位分配"
          :visible.sync="table"
          direction="ltr"
          size="50%"
          ref="drawer"
          custom-class="demo-drawer"
        >
          <div class="demo-drawer__content">
            <el-table
              :data="gridData"
              stripe
              border
              style="width: 90%; margin-left:5% "
              max-height="500px"
              ref="multipleTable"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="60" :selectable="selectable"></el-table-column>
              <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
              <el-table-column prop="username" label="用户账号" width="130" align="center"></el-table-column>
              <el-table-column
                prop="homeaddress"
                label="家庭住址"
                width="155"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column prop="type" label="类型" width="100" align="center">
                <template slot-scope="scope">{{scope.row.type==1?"管理员":"普通用户"}}</template>
              </el-table-column>
              <el-table-column prop="parkname" label="车位" width="134" align="center"></el-table-column>
            </el-table>

            <div class="demo-drawer__footer">
              <el-button @click="table = false">取 消</el-button>
              <el-button type="primary" @click="handlePost">确定</el-button>
            </div>
          </div>

          <div class="pagination2">
            <el-pagination
              background
              layout="total, sizes, prev, pager, next, jumper"
              :total="obj.total2"
              @size-change="handleSizeChange2"
              @current-change="handleCurrentChange2"
              :current-page="obj.currentPage2"
              :page-sizes="[5, 10, 20, 50,100]"
              :page-size="obj.pageNum2"
            ></el-pagination>
          </div>
        </el-drawer>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      singleSelection: null,
      previousSelection: [],
      gridData: [],
      table: false,
      selectedValue: "2",
      ruleForm: {
        parkname: "",
        parkpay: "",
        parktype: "",
        parkstatus: "",
        id: ""
      },
      rules: {
        parkname: [
          { required: true, message: "车位名称不能为空", trigger: "blur" }
        ],
        parkpay: [
          { required: true, message: "车位金额不能为空", trigger: "blur" }
        ],
        parktype: [
          { required: true, message: "车位类型不能为空", trigger: "blur" }
        ]
      },
      title: "",
      dialogFormVisible: false,
      loading: true,
      input: "",
      tableData: [],
      obj: {
        parkname: "",
        parkpay: "",
        parktype: "",
        parkstatus: "",
        currPage: 0,
        pageNum: 9,
        total: 0,
        total2: 0,
        currentPage: 1,

        currentPage2: 1,
        currPage2: 0,
        pageNum2: 10,
        id: ""
      }
    };
  },
  methods: {
    // 重置
    handleReset() {
      this.obj.parkname = "";
      this.obj.parkpay = "";
      this.obj.parktype = "";
      this.obj.parkstatus = "";
      this.obj.currPage = 0;
      this.obj.pageNum = 9;
      this.handleSearch();
    },
    // 查询
    handleSearch() {
      this.loading = true;
      this.$http({
        url: "/parking/getParkData",
        method: "get",
        params: {
          parkname: this.obj.parkname,
          parkpay: this.obj.parkpay,
          parktype: this.obj.parktype,
          parkstatus: this.obj.parkstatus,
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

      this.$http({
        url: "/users/getUsersData",
        method: "get",
        params: {
          currPage: this.obj.currPage2,
          pageNum: this.obj.pageNum2
        }
      }).then(res => {
        console.log(res, "user");
        this.gridData = res.data.data; // 1. 记录数据
        this.obj.total2 = res.data.total; // 2. 记录总数
      });
    },
    // 更新
    handleUpdate1(val) {
      this.$http({
        url: "/parking/editParkData",
        method: "POST",
        data: {
          u_id: val.id,
          parkname: val.parkname,
          parkpay: val.parkpay,
          parktype: val.parktype,
          parkstatus: val.parkstatus,
          token: sessionStorage.getItem("token")
        }
      }).then(res => {
        this.$message({
          type: "success",
          message: "更新状态成功"
        });
        this.handleSearch();
      });
    },
    handleUpdate2(val) {
      this.$http({
        url: "/parking/editParkData",
        method: "POST",
        data: {
          u_id: val.id,
          parkname: val.parkname,
          parkpay: val.parkpay,
          parktype: val.parktype,
          parkstatus: val.parkstatus,
          token: sessionStorage.getItem("token")
        }
      }).then(res => {
        this.$message({
          type: "success",
          message: "更新状态成功"
        });
        this.handleSearch();
      });
    },
    // 条件查询
    handleFind() {
      this.loading = true;
      this.$http({
        url: "/parking/getParkData",
        method: "get",
        params: {
          parkname: this.obj.parkname,
          parkpay: this.obj.parkpay,
          parktype: this.obj.parktype,
          parkstatus: this.obj.parkstatus,
          currPage: this.obj.currPage,
          pageNum: this.obj.pageNum
        }
      }).then(res => {
        this.tableData = res.data.data; // 1. 记录数据
        this.obj.total = res.data.total; // 2. 记录总数
        setTimeout(() => {
          this.loading = false;
        }, 500);
      });
    },
    //删除
    handleDel(val) {
      this.$confirm("确定删除该车位", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.loading = true;
        this.$http({
          url: "/parking/delParkData",
          method: "get",
          params: {
            id: val.id,
            token: sessionStorage.getItem("token")
          }
        }).then(res => {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          this.handleReset();
          setTimeout(() => {
            this.loading = false;
          }, 500);
        });
      });
    },
    //编辑
    handleEdit(val, num) {
      if (num == 2) {
        this.ruleForm.parkname = val.parkname;
        this.ruleForm.parkpay = val.parkpay;
        this.ruleForm.parktype = val.parktype == 1 ? "地上" : "地下";
        this.ruleForm.parkstatus = val.parkstatus == 1 ? "已有车" : "未有车";
        this.ruleForm.id = val.id;
        this.title = "车位修改";
        this.dialogFormVisible = true;
      } else {
        this.title = "新增车位";
        this.dialogFormVisible = true;
        this.ruleForm.id = "";
        this.ruleForm.parkname = "";
        this.ruleForm.parkpay = "";
        this.ruleForm.parktype = "";
        this.ruleForm.parkstatus = "";
      }
    },
    // 重置表单
    handleResetForm() {
      this.ruleForm.id = "";
      this.ruleForm.parkname = "";
      this.ruleForm.parkpay = "";
      this.ruleForm.parktype = "";
      this.ruleForm.parkstatus = "";
    },
    //添加
    handleAdd() {
      if (
        this.ruleForm.parkname == "" &&
        this.ruleForm.parkpay == "" &&
        this.ruleForm.parktype == "" &&
        this.ruleForm.parkstatus == ""
      ) {
        this.$message({
          type: "error",
          message: "必填项不能为空"
        });
      } else {
        this.$http({
          url: "/parking/addParkData",
          method: "post",
          data: {
            parkname: this.ruleForm.parkname,
            parkpay: this.ruleForm.parkpay,
            parktype: this.ruleForm.parktype == "已有车" ? 1 : 2,
            parkstatus: this.ruleForm.parkstatus == "地上" ? 1 : 2,
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
    //车位修改
    handleEditPark() {
      this.$http({
        url: "/parking/editParkData",
        method: "post",
        data: {
          u_id: this.ruleForm.id,
          parkname: this.ruleForm.parkname,
          parkpay: this.ruleForm.parkpay,
          parktype: this.ruleForm.parktype == "已有车" ? 1 : 2,
          parkstatus: this.ruleForm.parkstatus == "地上" ? 1 : 2,
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
    },
    //车位分配
    handleDeliver(val) {
      this.table = true;
      this.obj.id = val.id;
      this.obj.parkstatus = val.parkstatus;
      this.obj.parkname = val.parkname;
      this.obj.parkpay = val.parkpay;
      this.obj.parktype = val.parktype;
    },
    //分页
    handleSizeChange(val) {
      this.obj.pageNum = val;
      if (
        this.obj.parkname == "" &&
        this.obj.parkpay == "" &&
        this.obj.parktype == "" &&
        this.obj.parkstatus == ""
      ) {
        this.handleSearch();
      } else {
        this.handleFind();
      }
    },
    handleCurrentChange(val) {
      if (
        this.obj.parkname == "" &&
        this.obj.parkpay == "" &&
        this.obj.parktype == "" &&
        this.obj.parkstatus == ""
      ) {
        this.obj.currPage = val - 1;
        this.handleSearch();
      } else {
        this.obj.currPage = val - 1;
        this.handleFind();
      }
    },
    //用户分页
    handleSizeChange2(val) {
      this.obj.pageNum2 = val;
      this.handleSearch();
    },
    handleCurrentChange2(val) {
      this.obj.currPage2 = val - 1;
      this.handleSearch();
    },
    //用户上传
    handlePost() {
      console.log(this.singleSelection,"select")
      this.$confirm("确定分配该车位？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {

         this.$http({
            url: "/users/updateParkStatus",
            method: "post",
            data: {
              u_id: this.singleSelection.id,
              parkId: this.singleSelection. parkId,
             parkname: encodeURI(this.singleSelection.parkname),
              parkstatus: this.singleSelection.parkstatus ==1? 1 : 2,
              token: sessionStorage.getItem("token")
            }
          })

        if (this.obj.parkstatus !== 1) {
          this.$http({
            url: "/parking/editParkData",
            method: "post",
            data: {
              u_id: this.obj.id,
              parkname: this.obj.parkname,
              parkpay: this.obj.parkpay,
              parktype: this.obj.parktype,
              parkstatus: 1,
              token: sessionStorage.getItem("token")
            }
          }).then(() => {
            this.table = false;
            this.$message({
              type: "success",
              message: "分配车位成功"
            });
            this.handleReset();
          });
        }
      });
    },
    //批量操作
    handleSelectionChange(selection) {
      // 这个方法确保最多只有一个被选中
      if (selection.length > 1) {
        // 获取最后一个选中的项
        const lastSelectedItem = selection[selection.length - 1];
        // 清空所有选择
        this.$refs.multipleTable.clearSelection();
        // 重新选择最后一个项
        this.$nextTick(() => {
          this.$refs.multipleTable.toggleRowSelection(lastSelectedItem, true);
          this.singleSelection = lastSelectedItem;
        });
      } else if (selection.length === 1) {
        this.singleSelection = selection[0];
        // console.log(this.singleSelection,"select")
      } else {
        this.singleSelection = null;
      }
    },
    selectable(row, index) {
      return true;
    }
  },
  mounted() {
    this.handleSearch();
  }
};
</script>

<style lang="scss" scoped>
.park ::v-deep {
  display: flex;
  .left {
    margin-top: 2%;
    width: 22%;
    > span {
      text-align: right;
      vertical-align: middle;
      float: left;
      font-size: 14px;
      color: #606266;
      line-height: 40px;
      padding: 0 12px 0 0;
      box-sizing: border-box;
    }
    .el-button {
      margin-left: 18px;
      width: 120px;
    }
    .el-input {
      margin-bottom: 9%;
    }
    .el-select {
      width: 100%;
    }
  }
  .right {
    overflow: hidden;

    margin-left: 20px;
    width: 79%;
    .r-top {
      height: 8%;
      h2 {
        float: left;
      }
      button {
        width: 80px;
        height: 30px;
        float: right;
      }
    }
    .pagination {
      text-align: right;
      margin: 50px;
    }
    .table {
      .el-table {
        .el-button--small {
          padding: 5px 12px;
          font-size: 10px;
          border-radius: 3px;
        }
        .el-button {
          width: 85px;
          height: 25px;
        }
        .has-gutter {
          color: rgb(31, 45, 61);
          border-color: rgb(223, 230, 236);
          th {
            background: rgb(238, 241, 246);
            color: #1f2d3d;
            border-color: #dfe6ec;
            font-size: 14px;
            font-weight: 700;
          }
        }
      }
      .el-drawer__body {
        position: relative;
        // overflow-x：hidden
        .demo-drawer__footer {
          position: absolute;
          bottom: 10%;
          left: 10%;

          .el-button {
            width: 200px;
            margin: 0 50px;
          }
        }
        .pagination2 {
          text-align: right;
          margin-top: 20px;
        }
      }
    }
    .el-select {
      width: 100%;
    }
  }
}
</style>