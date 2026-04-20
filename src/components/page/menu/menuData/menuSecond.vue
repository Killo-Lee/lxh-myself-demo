<template>
    <div class="contain">
        <el-page-header @back="goBack"></el-page-header>
        <div class="tab">
            <el-tabs type="border-card"  v-model="activeName">
                <el-tab-pane label="二级菜单" name="menu" style='background-color:white'>
                    <div class="down-form">
                        <div class="table">
                            <el-table
                                    ref="logTable"
                                    :data="tableData"
                                    v-loading="loading"
                                    stripe
                                    border
                                    :header-cell-style="{'background':'#eef1f6','color':'#1f2d3d','border-color':'#dfe6ec'}"
                                    style="width: 100%;font-size: 14px;color: #1f2d3d">
                                <el-table-column
                                        type="index"
                                        label="编码"
                                        align="center"
                                        width="150">
                                </el-table-column>
                                <el-table-column
                                        prop="title"
                                        label="菜单名称"
                                        min-width="13%"
                                        show-overflow-tooltip
                                        align="center">
                                </el-table-column>
                                <el-table-column
                                        prop="prentId"
                                        label="菜单级别"
                                        :formatter="typeFormatter"
                                        min-width="13%"
                                        align="center">
                                </el-table-column>
                                <el-table-column
                                        prop="desc"
                                        label="菜单描述"
                                        min-width="18%"
                                        show-overflow-tooltip
                                        align="center">
                                </el-table-column>
                                <el-table-column prop=""
                                                 label="操作"
                                                 min-width="19%"
                                                 align="center">
                                    <template slot-scope="scope">
                                        <div style="display: flex;margin-left: 3px">
                                            <el-button :plain="true"
                                                       size="mini"
                                                       type="primary"
                                                       disabled
                                                       @click="detail(scope.row)"
                                            ><i class="el-icon-zoom-in"></i>查看下一级</el-button>
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
                                           @size-change="handleSizeChange">
                            </el-pagination>
                        </div>
                        <poster-dialog ref="posterDialog"></poster-dialog>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
    export default {
        name: "menuSecond",
        data(){
            return{
                activeName: 'menu',
                tableData:[],
                iPagination: {
                    current: 1,
                    pageSize: 10,
                    pageSizeOptions: [7, 10, 20, 50],
                    total: 0,
                    "page": 0,
                    "pageSize": 10,
                },
                loading: false,
            }
        },
        mounted(){
            this.getSecondMenu()
        },
        methods:{
            // 分页导航
            handleSizeChange(val) {
                this.iPagination.pageSize = val;
                this.getSecondMenu()
            },
            handleCurrentChange(val) {
                this.iPagination.current = val;
                this.getSecondMenu()
            },
            // 获取上一级传来的id
            getParams(){
                this.prentId = this.$route.query.prentId;
                let data = {
                    prentId: this.prentId,
                    currPage: this.iPagination.current - 1,
                    pageNum: this.iPagination.pageSize
                }
                return data
            },

            // 获取二级菜单列表
            getSecondMenu(){
                this.loading = true;
                this.$Axios({
                    url: '/admin/getMenuData',
                    method: 'get',
                    data: this.getParams(),
                    success:(result)=>{
                        this.tableData = result.data;
                        this.iPagination.total = result.total;
                        this.$message({
                            message: '获取菜单信息成功',
                            type: 'success',
                            duration: 2000
                        });
                        setTimeout(() => {
                            this.loading = false;
                        }, 200);
                    }
                })
            },
            // 返回
            goBack(){
                this.$router.go(-1)
            },

            // 级别转文字
            typeFormatter(row,column){
                const prentId = row.prentId
                if (prentId == 0){
                    return '一级'
                }else {
                    return '二级'
                }
            }
        }
    }
</script>

<style scoped>
    .tab{
        margin-top: 15px;
    }
    .block{
        float: right;
        margin-top: 10px;
    }
    .el-button{
        width: 32%;
        margin-left: 34%;
    }
    /deep/.el-page-header__left::after {
        content: "";
        position: absolute;
        width: 0;
        height: 0;
    }
    /deep/.el-icon-back{
        font-weight: bold;
    }
    /deep/.el-page-header__title {
        font-size: 14px;
        font-weight: bold;
    }

</style>