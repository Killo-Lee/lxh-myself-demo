<template>
  <div class="fee-management">
    <!-- 左右布局容器 -->
    <el-container style="height: 100vh;">
      <!-- 左侧：树形菜单 -->
      <el-aside width="35%" style=" background: #fff;">
        <div style="padding: 15px 0; font-weight: bold; ">计费管理 / 缴费类性管理</div>
        <div style="width:100%" class="input-box">
          <el-input v-model="obj.paymoney" placeholder="项目价格" class="el-input1"></el-input>
          <el-select v-model="obj.paystatus" clearable placeholder="通知状态">
            <el-option label="已通知" value="1"></el-option>
            <el-option label="未通知" value="2"></el-option>
          </el-select>
        </div>

        <el-tree
          class="filter-tree"
          :data="data"
          :props="defaultProps"
          default-expand-all
          :filter-node-method="filterNode"
          ref="tree"
          @node-click="handleNodeClick"
        ></el-tree>
      </el-aside>

      <!-- 右侧：表格区域 -->
      <el-container direction="vertical">
        <!-- 表格 -->
        <div class="r-top">
          <h2>{{title}}</h2>
          <div>
            <el-button type="primary" icon="el-icon-search" @click="handleFind">查询</el-button>
            <el-button type="success" icon="el-icon-plus" @click="handAdd">新增</el-button>
            <el-button type="primary" icon="el-icon-refresh" @click="handleReflash">刷新</el-button>
            <el-button type="primary" icon="el-icon-upload2" @click="handleExport">导出</el-button>
          </div>
        </div>
        <el-main style="padding: 20px; background: #fff; margin: 0">
          <el-table
            height="500"
            :data="tableData"
            style="width: 100%;"
            border
            :empty-text="emptyText"
            stripe
            v-loading="loading"
          >
            <el-table-column prop="payname" label="缴费项目名称" width="100" align="center"></el-table-column>
            <el-table-column prop="paylevel" label="缴费项目优先级" width="100" align="center"></el-table-column>
            <el-table-column prop="coststatus" label="项目用量/时长" width="100" align="center"></el-table-column>
            <el-table-column prop="paymoney" label="项目价格" width="100" align="center" sortable></el-table-column>
            <el-table-column prop="paytime" label="创建时间" width="100" align="center" sortable>
              <template slot-scope="scope">{{scope.row.paytime.substring(0,10)}}</template>
            </el-table-column>
            <el-table-column prop="username" label="通知人" width="100" align="center">
              <template slot-scope="scope">{{scope.row.username==null?'暂无':scope.row.username}}</template>
            </el-table-column>
            <el-table-column prop="paystatus" label="状态" width="100" align="center">
              <template #default="{row}">{{ row.paystatus == '1' ? '已通知' : '未通知' }}</template>
            </el-table-column>
            <el-table-column label="操作" width="153" align="center">
              <template slot-scope="scope">
                <el-button @click="handleClick(scope.row)" plain size="small">通知</el-button>
                <el-button
                  @click="handleLook(scope.row)"
                  plain
                  size="small"
                  style="color:rgb(98, 168, 234);"
                >查看</el-button>
                <el-button
                  type="danger"
                  size="small"
                  style=" color: black; background-color: rgb(255, 255, 255);"
                  @click="handleDel(scope.row)"
                >作废</el-button>
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
              :current-page.sync="obj.currentPage"
              :page-sizes="[9, 10, 20, 50]"
              :page-size="obj.pageNum"
            ></el-pagination>
          </div>

          <el-dialog :visible.sync="dialogVisible" width="60%" :before-close="handleClose">
            <h2>计费通知</h2>
            <div style="display:flex;margin:10px 0;">
              <el-input
                v-model="obj.username"
                placeholder="请输入用户账号"
                style="width:400px;margin-right:20px;"
              ></el-input>
              <el-button type="warning" icon="el-icon-search" @click="handleFind2"></el-button>
              <el-button type="primary" icon="el-icon-refresh" @click="handleReflash">重置</el-button>
            </div>
            <el-table
              highlight-current-row
              @current-change="handleTableChange"
              :data="tableDta"
              style="width: 100%;"
              border
              :empty-text="emptyText"
              stripe
              v-loading="loading"
            >
              <el-table-column label="序号" type="index" width="100" align="center"></el-table-column>
              <el-table-column prop="username" label="用户账号" width="200" align="center"></el-table-column>
              <el-table-column
                prop="homeaddress"
                show-overflow-tooltip
                label="家庭住址"
                width="200"
                align="center"
              ></el-table-column>
              <el-table-column prop="type" label="类型" width="157" align="center">
                <template #default="{row}">{{ row.type == '1' ? '管理员' : '普通用户' }}</template>
              </el-table-column>
              <el-table-column prop="coststatus" label="缴费状态" width="160" align="center">
                <template #default="{row}">{{ row.coststatus == '1' ? '已缴费' : '未缴费' }}</template>
              </el-table-column>
            </el-table>
            <div class="pagination">
              <el-pagination
                layout="total, sizes, prev, pager, next, jumper"
                :total="obj.total2"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange2"
                :current-page.sync="obj.currentPage22"
                :page-sizes="[7, 10, 20, 50]"
                :page-size="obj.pageNum2"
              ></el-pagination>
            </div>
            <div style="text-align:right">
              <el-button type="primary" @click="dialogVisible=false">取消</el-button>
              <el-button type="primary" @click="handleNotice">通知</el-button>
            </div>
          </el-dialog>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
// 导入插件
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
export default {
  name: "FeeManagement",
  data() {
    return {
      currentRow: null,
      dialogVisible: false,
      title: "电费目录",
      input: "",
      loading: true,
      data: [
        {
          id: 1,
          label: "缴费项目",
          children: [
            {
              id: 2,
              label: "电费项目",
              children: [
                {
                  title: "电费目录",
                  id: 7,
                  label: "电费目录表"
                }
              ]
            },
            {
              id: 3,
              label: "水费项目",
              children: [
                {
                  title: "水费固定月目录",
                  id: 8,
                  label: "水费固定月目录表"
                },
                {
                  title: "水费按量目录",
                  id: 9,
                  label: "水费按量计价目录表"
                }
              ]
            },
            {
              id: 4,
              label: "天然气项目",
              children: [
                {
                  title: "天然气目录",
                  id: 10,
                  label: "天然气目录表"
                }
              ]
            },
            {
              id: 5,
              label: "物业项目",
              children: [
                {
                  title: "物业费目录",
                  id: 11,
                  label: "物业费目录表"
                }
              ]
            },
            {
              id: 6,
              label: "宽带费项目",
              children: [
                {
                  title: "宽带费目录",
                  id: 12,
                  label: "宽带费目录表"
                }
              ]
            }
          ]
        }
      ],
      defaultProps: {
        children: "children",
        label: "label"
      },
      // 表格数据
      tableData: [],
      tableDta: [],
      emptyText: "暂无数据",
      obj: {
        username: "",

        c_id: 7,
        paymoney: "",
        paystatus: "",
        currPage: 0,
        currPage2: 0,
        pageNum: 9,
        pageNum2: 7,
        total: 0,
        total2: 0,
        currentPage: 1,
        currentPage2: 1
      }
    };
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    handleNodeClick(data) {
      console.log("节点点击:", data);
      this.obj.c_id = data.id;
      this.title = data.title;
      this.handleSearch();
    },
    //查询
    handleSearch(val) {
      this.loading = true;
      this.$http({
        url: "/cost/getCostData",
        method: "get",
        params: {
          c_id: this.obj.c_id,
          paymoney: this.obj.paymoney,
          paystatus: this.obj.paystatus,
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
      //用户查询
      this.$http({
        url: "/users/getUserList",
        method: "get",
        params: {
          username: this.obj.username,
          currPage: this.obj.currPage2,
          pageNum: this.obj.pageNum2
        }
      }).then(res => {
        console.log(res, "user");
        this.tableDta = res.data.data; // 1. 记录数据
        this.obj.total2 = res.data.total; // 2. 记录总数
      });
    },
    //刷新
    handleReflash() {
      this.obj.paymoney = "";
      this.obj.paystatus = "";
      this.obj.username = "";
      this.obj.currPage = 0;
      this.obj.currPage2 = 0;
      this.obj.pageNum = 9;
      this.obj.pageNum2 = 7;
      this.obj.currentPage = 1;
      this.obj.currentPage2 = 1;
      this.handleSearch();
    },
    // 条件查询
    handleFind() {
      this.loading = true;
      this.$http({
        url: "/cost/getCostData",
        method: "get",
        params: {
          c_id: this.obj.c_id,
          paymoney: this.obj.paymoney,
          paystatus: this.obj.paystatus,
          currPage: 0,
          pageNum: 9
        }
      }).then(res => {
        this.tableData = res.data.data; // 1. 记录数据
        this.obj.total = res.data.total; // 2. 记录总数
        setTimeout(() => {
          this.loading = false;
        }, 500);
      });
    },
    //用户查询
    handleFind2() {
      this.handleSearch();
    },
    //单选表格
    handleTableChange(val) {
      this.currentRow = val;
      console.log(this.currentRow, "row");
    },
    //通知
    handleNotice() {
      this.$confirm("确定通知改用用户缴费?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$http({
          url: "/cost/updateCostData",
          method: "POST",
          data: {
            u_id: this.currentRow.id,
            c_id: this.currentRow.c_id,
            coststatus: this.currentRow.coststatus,
            paystatus: this.currentRow.parkstatus,
            username: this.currentRow.username,
            token: sessionStorage.getItem("token")
          }
        }).then(() => {
            this.dialogVisible=false;
          this.$message({
            type: "success",
            message: "通知成功!"
          });
        });
      });
    },
    // 添加
    handAdd() {
      this.$router.push({
        path: "payAdd",
        query: {
          type: "ADD",
          paystatus: "2"
        }
      });
    },
    //导出
    handleExport() {
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
    },
    //删除节点
    handleDel(val) {
      this.$confirm("确定永久作废这条计费项目?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http({
            url: "/cost/delCostData",
            method: "get",
            params: {
              id: val.id
            }
          }).then(() => {
            this.handleReflash();
            this.$message({
              type: "success",
              message: "成功删除该条计费项目!"
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消作废该条计费项目"
          });
        });
    },
   
    handleClick() {
      this.dialogVisible = true;
    },
    // 查看
    handleLook(val){
      this.$router.push({
        path: "payAdd",
        query: {
          type: "DETAIL",
         detailId: val.id
        }
      });
    },
    //分页
    handleSizeChange(val) {
      this.obj.pageNum = val;
      if (this.obj.paymoney == "" && this.obj.paystatus == "") {
        this.handleSearch();
      } else {
        this.handleFind();
      }
    },
    handleCurrentChange(val) {
      if (this.obj.paymoney == "" && this.obj.paystatus == "") {
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
      if (this.obj.uesrname == "") {
        this.handleSearch();
      } else {
        this.handleFind2();
      }
    },
    handleCurrentChange2(val) {
      if (this.obj.username == "") {
        this.obj.currPage2 = val - 1;
        this.handleSearch();
      } else {
        this.obj.currPage2 = val - 1;
        this.handleFind2();
      }
    },
    //关闭模态框
    handleClose() {
      this.dialogVisible = false;
    }
  },
  mounted() {
    this.handleSearch();
  }
};
</script>

<style scoped lang="scss">
.fee-management ::v-deep {
  height: 100%;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    Arial, sans-serif;
  .input-box {
    margin-bottom: 50px;
    display: flex;
    .el-input1 {
      width: 45%;
    }
    .el-select {
      width: 45%;
      margin-left: 20px;
    }
  }
  .r-top {
    padding-top: 5%;
    background: rgb(255, 255, 255);
    display: flex;
    justify-content: space-between;
  }
  .el-table {
    .el-button {
      width: 39px;
      font-size: 11px;
      height: 26px;
      margin-left: 5px;
    }
    .el-button--small {
      padding: 0 !important;
    }
  }
  .pagination {
    text-align: right;
    margin: 20px;
  }
  .el-dialog {
    .el-dialog__header {
      padding: 0;
    }
    .el-dialog__body {
      padding: 15;
    }
  }
}

.tree {
  border: none;
  padding: 0 5px;
  margin: 0;
}

.tree >>> .el-tree-node__content {
  height: 36px;
  line-height: 36px;
}

.tree >>> .el-tree-node__expand-icon {
  margin-right: 5px;
}
</style>