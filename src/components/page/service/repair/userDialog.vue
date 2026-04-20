<template>
    <el-dialog title="维修申请" :visible.sync="dialogTableVisible" class="detail-dialog">
        <el-form ref="form"
                 :model="formData"
                 label-width="100px"
                 class="box_acct_form">
            <el-row :gutter="24">
                <el-col :span="12">
                    <el-form-item label="发布人员:" >
                        <el-input size="medium"
                                  v-model="formData.homename"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="房屋信息:" >
                        <el-input size="medium"
                                  v-model="formData.housename"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="24">
                <el-col style="width: 100%">
                    <el-form-item label="维修类型:" >
                        <el-select v-model="formData.repairtype" placeholder="维修类型" clearable style="width: 100%">
                            <el-option
                                    v-for="item in typeList"
                                    :key="item.value"
                                    :label="item.text"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="24">
                <el-col :span="12" style="width: 100%">
                    <el-form-item label="维修内容:">
                        <el-input type="textarea"
                                  :rows="8"
                                  v-model="formData.repaircontent"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
<!--            <el-row :gutter="24">-->
<!--                <el-col :span="24">-->
<!--                    <el-form-item label="处理结果:">-->
<!--                        <el-input type="textarea"-->
<!--                                  :rows="5"-->
<!--                                  v-model="formData.resultcontent"></el-input>-->
<!--                    </el-form-item>-->
<!--                </el-col>-->
<!--            </el-row>-->
            <el-row :gutter="24">s
                <el-col :span="12" style="width: 100%">
                    <el-button type="primary" size="medium" style="margin-left: 520px;text-align: center;width: 100px" @click="submit">提交</el-button>
                    <el-button type="primary" size="medium" style="float: right;text-align: center;width: 100px"
                               @click="close()">关闭</el-button>
                </el-col>
            </el-row>
        </el-form>
    </el-dialog>
</template>

<script>
    export default {
        name: "userDialog",
        data(){
            return{
                h_id: '',
                smartId: '',
                accentType: '',
                dialogTableVisible: false,
                formData: {
                    homename: '',
                    housename: '',
                    repairtype: '',
                    repaircontent: '',
                },
                typeList:[
                    {
                        value: 1,
                        text: '智能维修'
                    },
                    {
                      value: 2,
                      text: '家居维修'
                    }
                ]
            }
        },
        created(){
            this.$axiosToken({
                url: '/users/getUserByToken',
                method: 'get',
                data: {},
                success:(result=>{
                    this.h_id = result.id;
                })
            });
            this.$axiosToken({
                url: '/users/getMyId',
                method: 'post',
                data: {
                    id: this.h_id
                },
                success: (result=>{
                    this.formData.homename = result[0].username;
                    this.formData.housename = result[0].homeaddress;
                    this.smartId = result[0].h_id
                })
            })
        },
        methods:{
            // 关闭
            close() {
                this.dialogTableVisible = false
                this.$parent.getSmartData()
            },
            // 提交申请
            submit(){
                this.$axiosToken({
                    url: '/poster/addRepair',
                    method: 'post',
                    data: {
                        h_id: this.smartId,
                        homename: this.formData.homename,
                        housename: this.formData.housename,
                        repairtype: this.formData.repairtype,
                        repaircontent: this.formData.repaircontent
                    },
                    success: (result=>{
                        this.$message({
                            type: 'success',
                            message: '申请维修成功',
                            duration: 2000
                        });
                        if (this.formData.repairtype == '1'){
                            this.$axiosToken({
                                url: '/house/updatesmartStatus',
                                method: 'post',
                                data:{
                                    id: this.smartId,
                                    smartstatus: '2'
                                },
                                success: (result) =>{
                                }
                            })
                        } else if (this.formData.repairtype == '2') {
                            this.$axiosToken({
                                url: '/house/updatefamilyStatus',
                                method: 'post',
                                data:{
                                    id: this.smartId,
                                    familystatus: '2'
                                },
                                success: (result) =>{
                                }
                            })
                        }
                        this.close();
                        this.$parent.getSmartData()
                    })
                });


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