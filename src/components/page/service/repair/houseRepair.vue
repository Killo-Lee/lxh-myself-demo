<template>
    <div class="content">
        <div class="contain">
            <div class="tab">
                <el-tabs type="border-card"  v-model="activeName">
                    <el-tab-pane label="家居设备维修" name="houseRepair" style='background-color:white'>
                        <div class="top">
                            <div class="top-form">
                                <el-input v-model="form.homename" placeholder="维修房主" style="margin-left: 0"></el-input>
                                <el-select v-model="form.resultstatus" placeholder="维修状态" clearable style="margin-left: 10px">
                                    <el-option
                                            v-for="item in statusList"
                                            :key="item.value"
                                            :label="item.text"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                                <el-date-picker
                                        v-model="form.createtime"
                                        type="daterange"
                                        align="right"
                                        start-placeholder="开始日期"
                                        range-separator="至"
                                        end-placeholder="结束日期"
                                        style="margin-left: 10px;width: 21%"
                                        class="width-full">
                                </el-date-picker>
                                <!--                                <el-button type="success" @click="add" class="postButton" icon="el-icon-plus">通知维修</el-button>-->
                                <el-button type="primary" @click="search" class="postButton" icon="el-icon-search">查询维修</el-button>
                                <el-button type="primary" @click="reset" class="postButton">重置</el-button>
                                <el-button type="success" @click="add" class="postButton" icon="el-icon-plus" v-show="this.type == 2">申请维修</el-button>
                            </div>
                        </div>
                        <div class="down-form">
                            <div class="table">
                                <el-table
                                        ref="logTable"
                                        :data="tableData"
                                        v-loading="loading"
                                        border
                                        :header-cell-style="{'background':'#eef1f6','color':'#1f2d3d','border-color':'#dfe6ec'}"
                                        style="width: 100%;font-size: 14px;color: #1f2d3d">
                                    <el-table-column
                                            type="index"
                                            label="序号"
                                            align="center"
                                            width="60">
                                    </el-table-column>
                                    <el-table-column
                                            prop="homename"
                                            label="发布人员"
                                            min-width="10%"
                                            show-overflow-tooltip
                                            align="center">
                                    </el-table-column>
                                    <el-table-column
                                            prop="housename"
                                            label="房屋信息"
                                            min-width="13%"
                                            show-overflow-tooltip
                                            align="center">
                                    </el-table-column>
                                    <el-table-column
                                            prop="repaircontent"
                                            label="维修内容"
                                            min-width="20%"
                                            show-overflow-tooltip
                                            align="center">
                                    </el-table-column>
                                    <el-table-column
                                            prop="createtime"
                                            label="发布时间"
                                            min-width="15%"
                                            show-overflow-tooltip
                                            :formatter="dateFormat"
                                            align="center">
                                    </el-table-column>
                                    <el-table-column
                                            prop="resultcontent"
                                            label="处理结果"
                                            min-width="15%"
                                            show-overflow-tooltip
                                            :formatter="showFormatter"
                                            align="center">
                                    </el-table-column>
                                    <el-table-column
                                            prop="resultstatus"
                                            label="处理状态"
                                            min-width="9%"
                                            :formatter="typeFormatter"
                                            align="center">
                                    </el-table-column>
                                    <el-table-column v-if="this.type == '1'"
                                                     label="操作"
                                                     min-width="15%"
                                                     align="center">
                                        <template slot-scope="scope">
                                            <div style="display: flex;margin-left: 15px">
                                                <el-button :plain="true"
                                                           type="primary"
                                                           size="mini"
                                                           icon="el-icon-s-tools"
                                                           style="background-color: #fff;color: #20a0ff;font-size: 12px"
                                                           @click="handle(scope.row, scope.$index)"
                                                >处理</el-button>
                                                <el-button :plain="true"
                                                           size="mini"
                                                           icon="el-icon-delete-solid"
                                                           style="font-size: 12px;color: black;background-color: #fff"
                                                           @click="deleteData(scope.row, scope.$index)"
                                                           type="danger">归档
                                                </el-button>
                                            </div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column v-else
                                                     label="操作"
                                                     min-width="15%"
                                                     align="center">
                                        <template slot-scope="scope">
                                            <div style="display: flex;margin-left: 15px">
                                                <el-button :plain="true"
                                                           type="primary"
                                                           size="mini"
                                                           icon="el-icon-view"
                                                           style="background-color: #fff;color: #20a0ff;font-size: 12px"
                                                           @click="handle(scope.row, scope.$index)"
                                                >查看</el-button>
                                                <el-button :plain="true"
                                                           size="mini"
                                                           :disabled="scope.row.homename == name? false:true"
                                                           icon="el-icon-delete-solid"
                                                           style="font-size: 12px;color: black;background-color: #fff"
                                                           @click="deleteData(scope.row, scope.$index)"
                                                           type="danger">删除
                                                </el-button>
                                            </div>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                            <div class="block">
                                <el-pagination @current-change="handleCurrentChange"
                                               layout="total, sizes,prev, pager, next, jumper"
                                               :current-page.sync="iPagination.current"
                                               :page-size='iPagination.pageSize'
                                               :page-sizes="iPagination.pageSizeOptions"
                                               :total="iPagination.total"
                                               background
                                               @size-change="handleSizeChange">
                                </el-pagination>
                            </div>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
        <house-dialog ref="houseDialog"></house-dialog>
        <user-dialog ref="userDialog"></user-dialog>
    </div>
</template>

<script>
    import moment from 'moment'
    import dateFunc from '@/utils/dateFunc'
    import houseDialog from './houseDialog'
    import userDialog from './userDialog'
    export default {
        name: "houseRepair",
        components:{
            houseDialog,
            userDialog
        },
        data(){
            return{
                type: '',
                name: '',
                activeName: 'houseRepair',
                form:{
                    homename: '',
                    createtime: '',
                    resultstatus: ''
                },
                statusList: [
                    {
                        text: '已修复',
                        value: '1'
                    },
                    {
                        text: '待处理',
                        value: '2'
                    }
                ],
                tableData: [],
                iPagination: {
                    current: 1,
                    pageSize: 10,
                    pageSizeOptions: [5, 10, 20, 50, 100],
                    total: 0,
                    "page": 0,
                    "pageSize": 10,
                },
                loading:false,
                dialogFormVisible: false
            }
        },
        created(){
            this.$axiosToken({
                url: '/users/getUserByToken',
                method: 'get',
                data: {},
                success:(result=>{
                    this.type = result.type;
                    this.name = result.username;
                })
            });
        },
        mounted(){
            this.getSmartData()
        },
        methods:{
            handleCurrentChange (val) {
                this.iPagination.current = val;
                this.getSmartData()

            },
            handleSizeChange (val) {
                this.iPagination.current = 1;
                this.iPagination.pageSize = val;
                this.getSmartData()
            },
            // 查询
            search(){
                this.iPagination.current = 1;
                this.getSmartData()
            },
            getSmartData(){
                this.loading = true;
                const params = {...this.form.createtime};
                console.log(params,33)
                params.startDate = dateFunc.format(params[0],'YYYY-MM-DD');
                params.endDate = dateFunc.format(params[1],'YYYY-MM-DD');
                this.$delete(params, 'createtime')
                this.$axiosToken({
                    url: '/poster/getRepairData',
                    method: 'get',
                    data:{
                        repairtype: 2,
                        homename: this.form.homename,
                        resultstatus: this.form.resultstatus,
                        startDate: params.startDate,
                        endDate: params.endDate,
                        currPage: this.iPagination.current - 1,
                        pageNum: this.iPagination.pageSize,
                    },
                    success: (result)=>{
                        this.tableData = result.data;
                        this.iPagination.total = result.total;
                        setTimeout(() => {
                            this.loading = false;
                        }, 200);
                    }
                })
            },
            // 录入维修
            add(){
                this.$refs.userDialog.dialogTableVisible = true
                this.$refs.userDialog.accentType = 'house'
            },
            // 删除维修信息
            deleteData(row,index){
                if (row.resultstatus != '1'){
                    this.$message({
                        message: '该条维修内容还未进行处理，不着急删除哦！',
                        type: 'warning',
                        duration: 2000
                    });
                }else {
                    this.$confirm('确定删除该条维修信息？','提示',{
                        type: 'warning',
                    }).then(()=>{
                        this.$axiosToken({
                            url: '/poster/delRepair',
                            method: 'get',
                            data:{r_id: row.r_id},
                            success: (result) =>{
                                this.$message({
                                    message: '删除该条维修信息成功',
                                    type: 'success',
                                    duration: 2000
                                });
                                this.getSmartData()
                            }
                        })
                    })
                }
            },
            // 处理
            handle(row,index){
                this.$refs.houseDialog.init(row);
                this.$refs.houseDialog.dialogFormVisible = true
            },

            // 状态转为文字
            typeFormatter(row,column){
                const resultstatus = row.resultstatus
                if (resultstatus == 1){
                    return '已修复'
                }else {
                    return '待处理'
                }
            },
            // 重置
            reset(){
              this.form={
                  homename: '',
                  devicetime: '',
                  repairstatus: ''
              }
              this.search()
            },
            // 时间格式转化
            dateFormat(row,column) {
                var date = row[column.property];
                if(date == undefined){
                    return ''
                }else {
                    return moment(date).format("YYYY-MM-DD HH:mm:ss")

                }
            },

            showFormatter(row,column){
                const resultcontent = row.resultcontent
                if (resultcontent == undefined || resultcontent == ''){
                    return '暂无结果'
                }else {
                    return row.resultcontent
                }
            },
        },
    }
</script>

<style scoped>
    /deep/ .el-input__inner{
        font-size: 14px;
        height: 36px;
    }
    .el-input{
        width: 21%;
        margin-left: 10px;
    }
    /deep/ .el-input__icon.el-range__icon.el-icon-date {
        line-height: 27px;
    }
    .el-select{
        width: 21%
    }
    .postButton{
        margin-left: 15px;
        width: 8%;
        font-size: 14px;
        color: #fff;
    }
    .tab{
        margin-top: 10px;
    }
    .block{
        float: right;
        margin-top: 8px;
    }
    /deep/ .el-input.el-input--mini.el-input--suffix>.el-input__inner{
        height: 28px;
    }
    /deep/ .el-button--mini, .el-button--small{
        border-radius: 5px;
    }
    .down-form{
        margin-top: 15px;
    }
</style>