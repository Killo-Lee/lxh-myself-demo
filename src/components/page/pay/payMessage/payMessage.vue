<template>
    <div class="payMessage">
      <div class="payMessagel">
        <el-form ref="formjfxx" :model="formjfxx">
          <el-form-item label="缴费人员">
            <el-input v-model="formjfxx.username" placeholder="输入缴费人员"></el-input>
          </el-form-item>
          <el-form-item label="缴费名称">
            <el-input v-model="formjfxx.payname" placeholder="输入缴费项目/名称"></el-input>
          </el-form-item>
          <el-form-item label="支付类型">
            <el-select v-model="formjfxx.costtype" placeholder="输入支付类型" clearable>
              <el-option label="支付宝支付" value="1"></el-option>
              <el-option label="微信支付" value="2"></el-option>
              <el-option label="银联支付" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="支付状态">
            <el-select v-model="formjfxx.coststatus" placeholder="选择支付状态" clearable>
              <el-option label="已支付" value="1"></el-option>
              <el-option label="未支付" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="支付时间">
            <el-date-picker v-model="daterange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" @change="handleDateChange">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="缴费金额">
            <el-input v-model="formjfxx.paymoney" placeholder="输入缴费金额"></el-input>
          </el-form-item>
          <!-- “更多”控制的表单项 -->
          <el-form-item label="缴费优先级" v-if="showMore">
            <el-input v-model="formjfxx.paylevel" placeholder="缴费优先级"></el-input>
          </el-form-item>
          <!-- “更多/收起”按钮 -->
          <el-form-item style="font-size: 14px; text-align: center; cursor: pointer; color: #89bceb;">
            <el-button type="text" @click="toggleMore" v-html="showMore ? '<i class=\'iconfont color\'>&#xe6c7;</i>收起' : '<i class=\'iconfont color\'>&#xe6c6;</i>更多'"></el-button>
          </el-form-item>
          <div class="payMessagelx">
            <el-button @click="handlejfxxcz">重置</el-button>
            <el-button type="primary" @click="handlejfxxljcc">立即查询</el-button>
          </div>
        </el-form>
      </div>
      <div class="payMessager">
        <div class="payMessagert">
          <h1>缴费列表</h1>
          <el-button type="primary" class="el-icon-download" @click="handlejfxxdcqb">导出</el-button>
        </div>
        <div class="payMessagerc">
          <el-table :data="jfxxtable" border stripe style="width: 100%; font-size: 14px; color: rgb(31, 45, 61); height: 559px;">
            <el-table-column prop="payname" label="缴费产品">
              <template #default="{row}">
                {{ row.payname ? row.payname : '暂无'  }}
              </template>
            </el-table-column>
            <el-table-column  prop="username" label="缴费人员">
              <template #default="{row}">
                {{ row.username ? row.username : '暂无'  }}
              </template>
            </el-table-column>
            <el-table-column prop="costtype" label="支付类型">
              <template #default="scope">
                {{ scope.row.costtype === 1 ? '支付宝支付' : scope.row.costtype === 2 ? '微信支付' : scope.row.costtype === 3 ? '银联支付' : '暂无' }}
              </template>
            </el-table-column>
            <el-table-column prop="paymoney" label="缴费金额">
              <template #default="{row}">
                {{ row.paymoney ? row.paymoney : '暂无'  }}
              </template>
            </el-table-column>
            <el-table-column prop="paylevel" label="缴费优先级">
              <template #default="{row}">
                {{ row.paylevel ? row.paylevel : '暂无'  }}
              </template>
            </el-table-column>
            <el-table-column prop="costtime" label="支付时间">
              <template #default="{row}">
                {{ row.costtime ? formatIsoDate(row.costtime) : '暂无'  }}
              </template>
            </el-table-column>
            <el-table-column prop="coststatus" label="支付状态">
              <template #default="scope">
                {{ scope.row.coststatus === 1 ? '已支付' : '未支付' }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="230%">
              <template slot-scope="scope"> 
                <div style="white-space: nowrap;">
                  <el-button @click="handlejfxxzf(scope.row)">支付</el-button>
                  <el-button @click="handlejfxxck(scope.row)">查看</el-button>
                  <el-button @click="handlejfxxdc(scope.row)">导出</el-button>
                </div> 
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="obj.currentPage"
          :page-sizes="[5, 10, 20, 50, 100]"
          :page-size="obj.rows"
          background
          layout="total, sizes, prev, pager, next"
          :total="obj.total" class="payMessagerb">
        </el-pagination>
      </div>
    </div>
</template>
<script>
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import '../../../../assets/albbslt/iconfont.css';
export default {
  data() {
    return {
      daterange: [],// 日期范围绑定变量
      showMore: false, // 更多/收起
      formjfxx: {
        username: "",
        payname: "",
        costtype: "",
        coststatus: "",
        startDate: "",
        endDate: "",
        paymoney: "",
        paylevel: "",
      },
      jfxxtable:[],
      obj:{
        // 默认查询第一页的数据
        page: 1,
        // 每页默认是10条数据
        rows: 10,
        // 默认选中的是第一页
        currentPage: 1,
        // 总条数
        total: 0,
      },
    };
  },
  methods: {
    // 加载设备数据
    handlejfxxzjsj() {
      axios({
        method: "get",
        url: "/cost/getPayMessage",
        params: {
          currPage: this.obj.page - 1,
          pageNum:this.obj.rows,
        }
      }).then(res => {
        this.jfxxtable = res.data.data
        this.obj.total = res.data.total;
      });
    },
    // 更多/收起
    toggleMore() {
      this.showMore = !this.showMore;
    },
    // 重置
    handlejfxxcz(){
      this.formjfxx={
        username: "",
        payname: "",
        costtype: "",
        coststatus: "",
        startDate: "",
        endDate: "",
        paymoney: "",
        paylevel: "",
      };
      this.daterange = [];
      this.handlejfxxzjsj();
    },
    // 立即查询
    handlejfxxljcc() {
      const params = {
        currPage: this.obj.page - 1,
        pageNum: this.obj.rows,
        // 只保留有值的参数
        ...(this.formjfxx.username && { username: this.formjfxx.username }),
        ...(this.formjfxx.payname && { payname: this.formjfxx.payname }),
        ...(this.formjfxx.costtype && { costtype: this.formjfxx.costtype }),
        ...(this.formjfxx.coststatus && { coststatus: this.formjfxx.coststatus }),
        ...(this.formjfxx.startDate && { startDate: this.formjfxx.startDate }),
        ...(this.formjfxx.endDate && { endDate: this.formjfxx.endDate }),
        ...(this.formjfxx.paymoney && { paymoney: this.formjfxx.paymoney }),
        ...(this.formjfxx.paylevel && { paylevel: this.formjfxx.paylevel }),
      };

      axios({
        method: "get",
        url: "/cost/getPayMessage",
        params: params  // 传递过滤后的参数
      }).then(res => {
        this.jfxxtable = res.data.data
        this.obj.total = res.data.total;
      });
    },
    // 处理日期
    formatIsoDate(isoString) {
      if (!isoString) return '';
      const date = new Date(isoString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },
    // 处理日期变化
    handleDateChange(val) {
      if (val && val.length === 2) {
        // 当选择了日期范围时，分别赋值给startDate和endDate
        this.formjfxx.startDate = val[0];
        this.formjfxx.endDate = val[1];
      } else {
        // 未选择或清除选择时清空
        this.formjfxx.startDate = "";
        this.formjfxx.endDate = "";
      }
    },
    // 导出全部
    handlejfxxdcqb(){
      this.$confirm("确认导出缴费列表?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
      .then(() => {
          let selectedData = JSON.parse(JSON.stringify(this.jfxxtable));
          let exportData = selectedData.map((el, index) => {
            return {
              缴费产品:el.payname,
              缴费人员:el.username,
              支付类型:el.costtype,
              缴费金额:el.paymoney,
              缴费优先级:el.paylevel,
              支付时间:el.costtime,
              支付状态:el.coststatus,
            };
          });
          // 导出数据
          const workbook = XLSX.utils.book_new();
          const worksheet = XLSX.utils.json_to_sheet(exportData);
          XLSX.utils.book_append_sheet(workbook, worksheet, "选中房号数据");
          // 将workbook转为二进制数据
          const excelData = XLSX.write(workbook, {
            type: "array",
            bookType: "xlsx",
          });
          // 创建blob对象并保存excel文件
          const blob = new Blob([excelData], { 
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          // 设置导出文件名字
          saveAs(blob, "data.xlsx");
        })
    },
    // 支付
    handlejfxxzf(row){
      let zf = {
        id: row.id,
        token: sessionStorage.getItem('token'),
      };
      axios({
        method: "get",
        url: "/cost/getCostDetail",
        params: zf, 
      }).then((res) => {
        console.log(res);
        this.$router.push({
          path: '/pay/userPay',
          query: { 
            payId: row.id 
          }
        });
      });
    },
    // 查看
    handlejfxxck(row){
      let ck = {
        id: row.id,
        token: sessionStorage.getItem('token'),
      };
      axios({
        method: "get",
        url: "/cost/getCostDetail",
        params: ck, 
      }).then((res) => {
        console.log(res);
        this.$router.push({
          path: '/pay/payDetail',
          query: { 
            payId: row.id 
          }
        });
      });
    },
    // 导出
    handlejfxxdc(row) {
      let exportData = [{
        缴费产品: row.payname || '暂无',
        缴费人员: row.username || '暂无',
        // 转换支付类型为中文显示
        支付类型: row.costtype === 1 ? '支付宝支付' : 
                row.costtype === 2 ? '微信支付' : 
                row.costtype === 3 ? '银联支付' : '暂无',
        缴费金额: row.paymoney || '暂无',
        缴费优先级: row.paylevel || '暂无',
        // 格式化时间显示（使用已有的日期格式化方法）
        支付时间: row.costtime ? this.formatIsoDate(row.costtime) : '暂无',
        // 转换支付状态为中文显示
        支付状态: row.coststatus === 1 ? '已支付' : '未支付'
      }];
      
      // 导出数据
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      XLSX.utils.book_append_sheet(workbook, worksheet, "缴费详情");
      
      // 将workbook转为二进制数据
      const excelData = XLSX.write(workbook, {
        type: "array",
        bookType: "xlsx",
      });
      
      // 创建blob对象并保存excel文件
      const blob = new Blob([excelData], { 
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      });
      
      // 优化文件名（使用缴费人员和产品名称，更具辨识度）
      const fileName = `${row.username || '未知人员'}_${row.payname || '未知产品'}_缴费详情.xlsx`;
      saveAs(blob, fileName);
    },
    // 当每页条数改变时
    handleSizeChange(val) {
      this.obj.rows = val;
      this.obj.currentPage = 1;  // 重置为第一页
      this.obj.page = 1;         // 后端页码从0开始
      this.handlejfxxzjsj();
    },
    // 当页码改变时
    handleCurrentChange(val) {
      this.obj.currentPage = val;
      this.obj.page = val;
      this.handlejfxxzjsj();   
    },
  },
  mounted() {
    this.handlejfxxzjsj();
  }
};
</script>
<style lang="scss" scoped>
.payMessage::v-deep{
  display:flex;
  .payMessagel{
    width: 25%;
    height: 600px;
    overflow-y: scroll;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
    border: 1px solid #ebeef5;
    background-color: #fff;
    color: #303133;
    transition: .3s;
    .el-form{
      padding: 20px;
      .el-form-item{
        width: 100%;
        margin: 10px 0 10px 0;
        .el-form-item__label{
          line-height: 32px;
        }
        .el-select,
        .el-date-editor{
          width: 100%;
        }
        .el-form-item__content{
          line-height: 32px;
          .el-input__inner {
            font-size: 14px;
            height: 36px;
          }
        }
      }
    }
    .payMessagelx{
      margin: 10px 0 10px 0;
      text-align: center;
      .el-button{
        width: 45%;
        font-size: 14px;
      }
    }
  }
  .payMessager{
    width: 75%;
    margin-left: 20px;
    padding: 20px;
    overflow-y: scroll;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
    border: 1px solid #ebeef5;
    background-color: #fff;
    color: #303133;
    transition: .3s;
    .payMessagert{
      display:flex;
      justify-content:space-between;
      h1{
        font-size: 1.5em;
        font-weight: 700;
      }
      .el-button{
        cursor: pointer;
        transition: .1s;
        font-weight: 500;
        padding: 10px 16px;
        font-size: 14px;
        border-radius: 4px;
      }
    }
    .payMessagerc{
      margin: 15px 0 0 0;
      height: 464px; 
      overflow-y: auto; 
      overflow-x: auto;
      width: 100%;
      box-sizing: border-box;
      th{
        background: rgb(238, 241, 246);
        color: rgb(31, 45, 61);
        border-color: rgb(223, 230, 236);
        text-align: center;
      }
      td{
        text-align: center;
        .cell {
          white-space: nowrap;
        }
        .el-button:nth-child(1){
          color: #f56c6c;
          background: #fef0f0;
          border-color: #fbc4c4;
        }
        .el-button:nth-child(2){
          color: rgb(98, 168, 234);
          background-color: rgb(255, 255, 255);
          font-size: 12px;
        }
        .el-button:nth-child(3){
          font-size: 12px;
          color: black;
        }
      }
    }
    .payMessagerb{    
      margin-top: 15px;
      text-align: right;
    }
  }  
}
</style>