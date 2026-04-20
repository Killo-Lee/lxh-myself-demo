<template>
  <div class="main-x-r">
    <el-table :data="wxnr" style="width: 100%">
      <el-table-column prop="repaircontent" label="维修内容">
        <template slot-scope="scope">
          <el-tooltip effect="dark" :content="scope.row.repaircontent" placement="top">
            <div>{{ scope.row.repaircontent }}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="createtime" label="报修时间" :formatter="formatTime">
      </el-table-column>
      <el-table-column prop="resultstatus" label="状态">
        <template slot-scope="scope">
          <el-tooltip effect="dark" :content="`状态：${scope.row.resultstatus}`" placement="top">
            <span>
              <el-tag type="success" v-if="scope.row.resultstatus == 1">已修复</el-tag>
              <el-tag type="warning" v-else>待处理</el-tag>
            </span>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="obj.currentPage"
      :page-size="obj.rows"
      layout="prev, pager, next"
      :total="obj.total">
    </el-pagination>
  </div>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      wxnr:[],
      obj:{
        // 默认查询第一页的数据
        page: 0,
        // 每页默认是10条数据
        rows: 4,
        // 默认选中的是第一页
        currentPage: 1,
        // 总条数
        total: 0,
      }
    };
  },
  methods: {
    handlemxr() {
      return axios({
        method: "get",
        url: `/poster/getRepairData`,
        params: {
          currPage:this.obj.page,
          pageNum:this.obj.rows,
        },
      }).then(res => {
        this.wxnr = res.data.data;
        this.obj.total = res.data.total;  // 设置总条数
      });
    },
    formatTime(row) {
      if (!row.createtime) return "";
      const date = new Date(row.createtime);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); 
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },
    handleSizeChange(val) {
      // 当每页条数改变时
      this.obj.rows = val;
      this.obj.currentPage = 1;  // 重置为第一页
      this.obj.page = 0;         // 后端页码从0开始
      this.handlemxr();   
    },
    handleCurrentChange(val) {
      // 当页码改变时
      this.obj.currentPage = val;       // 更新显示的页码
      this.obj.page = val - 1;          // 转换为后端需要的页码（从0开始）
      this.handlemxr();         
    },
  },
  mounted() {
    this.handlemxr();
  },
};
</script>
<style lang="scss" scoped>
@import "style.scss";
</style>