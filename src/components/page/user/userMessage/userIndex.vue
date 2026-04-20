<template>
    <div class="content">
        <div class="top">
            <el-select v-model="value" clearable placeholder="请选择查询类型" style="width: 30%">
                <el-option
                        v-for="item in valueList"
                        :key="item.value"
                        :label="item.text"
                        :value="item.value">
                </el-option>
            </el-select>
            <el-input v-model="context" placeholder="请输入查询内容"></el-input>
            <el-button type="primary" icon="el-icon-search" @click="search" style="margin-left: 20px" class="button1">查询</el-button>
            <el-button type="success" icon="el-icon-plus" @click="add()" class="button2">新增</el-button>
            <el-button type="primary" icon="el-icon-refresh-right" @click="reset" class="button3">重置</el-button>
        </div>
        <div class="list">
            <el-table
                    ref="multipleTable"
                    :data="tableData"
                    border
                    stripe
                    align="center"
                    tooltip-effect="dark"
                    :header-cell-style="{'background':'#eef1f6','color':'#1f2d3d','border-color':'#dfe6ec'}"
                    style="width: 100%;font-size: 14px;color: #1f2d3d"
                    v-loading="loading">
                <el-table-column
                        type="index"
                        label="序号"
                        align="center"
                        width="60">
                </el-table-column>
                <el-table-column
                        prop="username"
                        label="用户账号"
                        align="center"
                        width="190">
                </el-table-column>
                <el-table-column
                        prop="nickname"
                        label="用户名称"
                        align="center"
                        width="160"
                        show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                        prop="sex"
                        label="性别"
                        width="70"
                        align="center">
                </el-table-column>
                <el-table-column
                        prop="homeaddress"
                        label="家庭住址"
                        show-overflow-tooltip
                        :formatter="showFormatter"
                        width="210"
                        align="center">
                </el-table-column>
                <el-table-column
                        prop="email"
                        label="邮箱"
                        width="220"
                        show-overflow-tooltip
                        align="center">
                </el-table-column>
                <el-table-column
                        prop="note"
                        label="描述"
                        width="234"
                        :show-overflow-tooltip="true"
                        align="center">
                </el-table-column>
                <el-table-column
                        prop="type"
                        label="类型"
                        width="130"
                        :formatter="typeFormatter"
                        align="center">
                </el-table-column>
                <el-table-column prop=""
                                 label="操作"
                                 width="206"
                                 align="center">
                    <template slot-scope="scope">
                        <div style="display: flex;margin-left: 13px">
                            <el-button :plain="true"
                                       size="mini"
                                       style="background-color: #fff;font-size: 12px"
                                       @click="edit(scope.row, scope.$index)"
                            >编辑</el-button>
                            <el-button :plain="true"
                                       size="mini"
                                       style="color: #62a8ea;background-color: #fff;font-size: 12px"
                                       @click="detail(scope.row)"
                            >详情</el-button>
                            <el-button :plain="true"
                                       size="mini"
                                       style="font-size: 12px;color: black;background-color: #fff"
                                       @click="deleteData(scope.row, scope.$index)"
                                       type="danger">删除
                            </el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination @current-change="handleCurrentChange"
                               layout="total, sizes,prev, pager, next, jumper"
                               :page-size='pageSize'
                               :current-page="cur_page"
                               :page-sizes="[5, 10, 20, 50]"
                               :total="total" background
                               @size-change="handleSizeChange">
                </el-pagination>
            </div>
        </div>
        <add-dialog ref="addDialog"></add-dialog>
    </div>
</template>

<script>
    import addDialog from "./addDialog"
    export default {
        name: "userIndex",
        components:{
          addDialog
        },
        data(){
            return{
                nickname: '',
                homeaddress: '',
                context: '',
                dialogTableVisible:false,
                value: '',
                valueList: [
                    {
                        text: '用户账号',
                        value: 'username'
                    },
                    {
                        text: '用户名称',
                        value: 'nickname'
                    },
                    {
                        text: '家庭住址',
                        value: 'homeaddress'
                    },
                    {
                        text: '性别',
                        value: 'sex'
                    },
                    {
                        text: '邮箱',
                        value: 'email'
                    },
                ],
                tableData: [],
                loading: false,
                loaded: false,
                total: 0,
                cur_page: 1,
                pageSize: 10,
                pageNo: 1
            }
        },
        created(){
            this.getData()
        },
        mounted(){

        },
        methods:{
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData()
                this.search()
            },
            handleSizeChange(val) {
                this.cur_page = 1
                this.pageSize = val;
                this.getData()
                this.search()
            },
            // 获取用户表信息
            getData(){
                this.loading = true;
                this.$Axios({
                    url: '/users/getUsersByTypePage',
                    method: 'get',
                    data:{
                        type: 2,
                        pageNum: this.pageSize,
                        currPage: this.cur_page - 1
                    },
                    success:(result)=>{
                        this.tableData = result.data
                        this.total = result.total;
                        setTimeout(() => {
                            this.loading = false;
                        }, 200);
                    }
                })
            },
            // 查询
            search(){
                this.loading = true;
                this.$axiosToken({
                    url: '/admin/getUserByTypeChar',
                    method: 'get',
                    data:{
                        type: 2,
                        inputText:this.context,
                        CharType:this.value,
                        pageNum: this.pageSize,
                        currPage: this.cur_page - 1
                    },
                    success: (result)=>{
                        this.tableData = result.data
                        this.total = result.total
                        setTimeout(() => {
                            this.loading = false;
                        }, 200);
                    }
                })
            },
            // 新增
            add(){
                this.$nextTick(() => {
                    this.$refs.addDialog.actionType = "add";
                    this.$refs.addDialog.dialogTableVisible = true;
                    this.$refs.addDialog.formData = Object.assign({})
                });
            },
            // 重置
            reset(){
                this.getData();
                this.value = '';
                this.context = '';
            },
            // 编辑
            edit(row,index){
                // this.$nextTick(() => {
                //     this.$refs.addDialog.dialogTableVisible = true;
                //     this.$refs.addDialog.actionType = "edit";
                //     console.log(row,'行')
                //     this.$refs.addDialog.formData = Object.assign({},row)
                // });
                console.log(row,'行')
                this.$refs.addDialog.actionType = "edit";
                this.$refs.addDialog.dialogTableVisible = true;
                this.$refs.addDialog.init(row)

            },
            // 详情
            detail(row){
                this.$refs.addDialog.dialogTableVisible = true;
                this.$refs.addDialog.actionType = "detail";
                this.$refs.addDialog.formData = Object.assign(row)
            },
            // 删除
            deleteData(row, index){
                this.$confirm('确定删除该用户？', '提示', {
                    type: 'warning',
                }).then(()=>{
                    const u_id = row.id;
                    this.$axiosToken({
                        url: '/users/delUserData',
                        method: 'get',
                        data:{u_id},
                        success: (result) =>{
                            this.getData()
                            this.$message({
                                showClose: true,
                                message: '删除用户成功',
                                type: 'warning'
                            })
                        }
                    }).catch((reason)=>{
                        alert('删除失败'+reason)
                    })
                })
            },
            // 类型转文字
            typeFormatter(row,column){
                const type = row.type
                if (type == 1){
                    return '管理员'
                }else {
                    return '普通用户'
                }
            },
            // 显示数据状态
            showFormatter(row,column){
                if (row.homeaddress == undefined || row.homeaddress == ''){
                    return '暂无'
                }else {
                    return row.homeaddress
                }
            },
        }
    }
</script>

<style scoped>
    .top {
        width: 100%;
        display: flex;
    }
    /deep/ .el-input__inner{
        font-size: 14px;
        height: 36px;
    }
    .el-input:nth-child(1) {
        width: 30%;
        border-radius: 4px;
    }
    .el-input:nth-child(2) {
        width: 30%;
        margin-left: 10px;
        border-radius: 4px;
    }
    .el-input:nth-child(3) {
        width: 22%;
        margin-left: 10px;
        border-radius: 4px;
    }
    .button1,.button2,.button3{
        border-radius: 4px;
        margin-left: 15px;
        color: #fff;
        font-size: 14px;
        width: 9%;
    }
    /deep/ .el-button--mini, .el-button--mini.is-round{
        padding: 6px 10px;
    }
    /deep/ .el-button--mini, .el-button--small{
        border-radius: 5px;
    }

    .list {
        margin-top: 25px;
    }
    .pagination{
        text-align: right;
        margin: 20px 0;
    }
    /deep/ .el-input.el-input--mini.el-input--suffix>.el-input__inner{
        height: 28px;
    }

</style>