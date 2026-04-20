<template>
    <el-dialog title="家居处理" :visible.sync="dialogFormVisible" class="detail-dialog">
        <el-form ref="form"
                 :model="formData"
                 label-width="100px"
                 class="box_acct_form">
            <el-row :gutter="24">
                <el-col :span="12">
                    <el-form-item label="发布人员:" >
                        <el-input size="medium"
                                  readonly
                                  v-model="formData.homename"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="房屋信息:" >
                        <el-input size="medium"
                                  readonly
                                  v-model="formData.housename"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="24">
                <el-col :span="12" style="width: 100%">
                    <el-form-item label="维修内容:">
                        <el-input size="medium"
                                  readonly
                                  v-model="formData.repaircontent"></el-input>
                    </el-form-item>
                </el-col>
                <!--                <el-col :span="12" style="width: 100%">-->
                <!--                    <el-form-item label="处理状态:">-->
                <!--                        <el-select v-model="formData.resultstatus" placeholder="维修状态" clearable>-->
                <!--                            <el-option-->
                <!--                                    v-for="item in statusList"-->
                <!--                                    :key="item.value"-->
                <!--                                    :label="item.text"-->
                <!--                                    :value="item.value">-->
                <!--                            </el-option>-->
                <!--                        </el-select>-->
                <!--                    </el-form-item>-->
                <!--                </el-col>-->
            </el-row>
            <el-row :gutter="24">
                <el-col :span="24">
                    <el-form-item label="处理结果:">
                        <el-input type="textarea"
                                  :rows="5"
                                  :readonly="this.type == '2'"
                                  v-model="formData.resultcontent"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="24">
                <el-col :span="12">
                    <el-form-item label="处理状态:">
                        <el-switch
                                v-model="formData.resultstatus"
                                :disabled="this.type == '2'"
                                active-text="已修复"
                                inactive-text="待处理"
                                :active-value="1"
                                :inactive-value="2">
                        </el-switch>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="24">
                <el-col :span="12" style="width: 100%">
                    <el-button v-show="this.type == '1'" type="primary" size="medium" style="margin-left: 520px;text-align: center;width: 100px" @click="submit">处理提交</el-button>
                    <el-button type="primary" size="medium" style="float: right;text-align: center;width: 100px"
                               @click="close()">关闭</el-button>
                </el-col>
            </el-row>
        </el-form>
    </el-dialog>
</template>

<script>
    export default {
        name: "houseDialog",
        data(){
            return{
                dialogFormVisible: false,
                formData: {
                    homename: '',
                    housename: '',
                    repaircontent: '',
                    resultcontent: '',
                    resultstatus: '',
                    h_id: '',
                },
                type: '',
            }
        },
        created(){
            this.$axiosToken({
                url: '/users/getUserByToken',
                method: 'get',
                data: {},
                success:(result=>{
                    this.type = result.type;
                })
            });
        },
        methods:{
            init(row){
                this.formData = row;
            },
            submit(){
                this.$axiosToken({
                    url: '/poster/updateSmartRepair',
                    method: 'post',
                    data:{
                        r_id: this.formData.r_id,
                        homename: this.formData.homename,
                        housename: this.formData.housename,
                        repaircontent: this.formData.repaircontent,
                        resultcontent: this.formData.resultcontent,
                        resultstatus: this.formData.resultstatus,
                    },
                    success: (result)=>{
                        this.$parent.getSmartData()
                        this.$message({
                            showClose: true,
                            message: '家居处理提交成功',
                            type: 'success'
                        });
                        // 家居状态改变
                        this.$axiosToken({
                            url: '/house/updatefamilyStatus',
                            method: 'post',
                            data:{
                                id: this.formData.h_id,
                                familystatus: this.formData.resultstatus,
                            },
                            success: (result) =>{
                            }
                        })
                    }
                });
                this.dialogFormVisible = false
            },
            close(){
                this.dialogFormVisible = false
                this.$parent.getHouseData()
            }
        }
    }
</script>

<style scoped>
    /deep/.el-dialog__title {
        font-size: 24px;
        line-height: 24px;
        font-weight: bold;
        color: #303133;
    }
    /deep/.el-textarea__inner{
        font-family: 微软雅黑;
        font-size: 14px;
    }

</style>