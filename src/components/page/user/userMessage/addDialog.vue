<template>
    <el-dialog custom-class="add-dialog"
               :visible.sync="dialogTableVisible"
               :title="titleMsg"
               :close-on-click-modal="false">
        <el-form ref="form"
                 :rules="rules"
                 :model="formData"
                 label-width="110px"
                 class="box_acct_form">
            <el-row :gutter="24">
                <el-col :span="12">
                    <el-form-item label="用户账号:"
                                  prop="username">
                        <el-input size="medium"
                                  v-model="formData.username"
                                  :disabled="isNotEdit"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="用户密码:"
                                  prop="password">
                        <el-input size="medium"
                                  v-model="formData.password"
                                  show-password
                                  :disabled="isNotEdit"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="24">
                <el-col :span="12">
                    <el-form-item label="用户名称:"
                                  prop="nickname">
                        <el-input size="medium"
                                  v-model="formData.nickname"
                                  :disabled="isNotEdit"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="性别:"
                                  prop="sex">
                        <el-input size="medium"
                                  v-model="formData.sex"
                                  :disabled="isNotEdit"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="24">
                <el-col :span="12">
                    <el-form-item label="类型:"
                                  prop="type">
                        <el-select size="medium"
                                   clearable
                                   v-model="formData.type"
                                   :disabled="isNotEdit">
                            <el-option
                                    v-for="item in typeList"
                                    :key="item.value"
                                    :label="item.text"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="家庭住址:">
                        <el-input size="medium"
                                  v-model="formData.homeaddress"
                                  :disabled="isNotEdit"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="24">
                <el-col :span="24">
                    <el-form-item label="邮箱:"
                                  prop="email">
                        <el-input v-model="formData.email"
                                  :disabled="isNotEdit"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="24">
                <el-col :span="24">
                    <el-form-item label="用户描述:">
                        <el-input type="textarea"
                                  :rows="5"
                                  v-model="formData.note"
                                  :disabled="isNotEdit"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
<!--            <el-row :gutter="24">-->
<!--                <el-col :span="12">-->
<!--                    <el-form-item label="是否启用">-->
<!--                        <el-checkbox v-model="checked"></el-checkbox>-->
<!--                    </el-form-item>-->
<!--                </el-col>-->
<!--            </el-row>-->
        </el-form>
        <span slot="footer"
              class="dialog-footer">
            <el-button v-if="!isNotEdit"
                       type="primary"
                       class="full-width"
                       @click="close">取消</el-button>
            <el-button v-if="this.actionType == 'add'"
                       type="primary"
                       class="full-width"
                       @click="submit">提交</el-button>
      <el-button v-if="this.actionType == 'edit'"
                 type="primary"
                 class="full-width"
                 @click="save">保存</el-button>
      <el-button v-if="!isNotEdit"
                 type="primary"
                 class="full-width"
                 @click="reset">重置</el-button>
      <el-button v-else
                 type="primary"
                 class="full-width"
                 @click="dialogTableVisible=false">关闭</el-button>
    </span>
    </el-dialog>
</template>

<script>
    export default {
        name: "addDialog",
        data() {
            return {
                actionType: '',
                // typeInfo: '',
                dialogTableVisible: false,
                loading: false,
                formData:{
                    username: '',
                    password: '',
                    nickname: '',
                    sex: '',
                    homeaddress: '',
                    email: '',
                    note: '',
                    type: ''
                },
                typeList: [
                    {
                        text: '管理员',
                        value: '1'
                    },
                    {
                        text: '普通用户',
                        value: '2'
                    }
                ],
                // 校验规则
                rules:{
                    username:[
                        {required: true, message: '用户账号不能为空', trigger: 'blur'}
                    ],
                    password:[
                        {required: true, message: '用户密码不能为空', trigger: 'blur'}
                    ],
                    nickname:[
                        {required: true, message: '用户名称不能为空', trigger: 'blur'}
                    ],
                    sex:[
                        {required: true, message: '用户性别不能为空', trigger: 'blur'}
                    ],
                    // homeaddress:[
                    //     {required: true, message: '家庭住址不能为空', trigger: 'blur'}
                    // ],
                    email:[
                        {required: true, message: '邮箱不能为空', trigger: 'blur'}
                    ],
                    type:[
                        {required: true, message: '用户类型不能为空', trigger: 'change'}
                    ],
                }

            }
        },
        mounted(){

        },
        computed: {
            titleMsg () {
                if (this.actionType == "edit") {
                    return "用户信息编辑";
                } else if (this.actionType == "detail") {
                    return "用户信息查看";
                } else if (this.actionType == "add") {
                    return "新增用户";
                }
            },
            isNotEdit () {
                if (this.actionType == "detail") {
                    return true;
                } else {
                    return false;
                }
            },
        },
        methods:{
            // 获取父组件传的行数据
            init(row){
                this.formData = row
            },
            // 取消
            close(){
              this.dialogTableVisible = false
            },
            // 新增提交
            submit(){
                this.$refs['form'].validate((valid)=>{
                    if (!valid){
                        this.$message.error({
                            message: "必填项不能为空",
                            duration: 2000
                        });
                    } else {
                        this.$axiosToken({
                            url: '/users/addUserData',
                            method: 'post',
                            data:{
                                id: this.formData.id,
                                username: this.formData.username,
                                password: this.formData.password,
                                nickname: this.formData.nickname,
                                sex: this.formData.sex,
                                homeaddress: this.formData.homeaddress,
                                type: this.formData.type,
                                email: this.formData.email,
                                note: this.formData.note,
                            },
                            success: (result)=>{
                                this.$parent.getData()
                                this.$message({
                                    showClose: true,
                                    message: '用户添加成功',
                                    type: 'success'
                                })
                            }
                        })
                        this.dialogTableVisible = false
                    }
                })
            },
            // 编辑保存
            save(){
                this.$refs['form'].validate((valid)=>{
                    if (!valid){
                        this.$message.error({
                            message: "必填项不能为空",
                            duration: 2000
                        });
                    } else {
                        this.$axiosToken({
                            url: '/users/upUserData',
                            method: 'post',
                            data:{
                                u_id: this.formData.id,
                                username: this.formData.username,
                                password: this.formData.password,
                                nickname: this.formData.nickname,
                                sex: this.formData.sex,
                                homeaddress: this.formData.homeaddress,
                                type: this.formData.type,
                                email: this.formData.email,
                                note: this.formData.note,
                            },
                            success: (result)=>{
                                this.$parent.getData()
                                this.$message({
                                    showClose: true,
                                    message: '用户修改成功',
                                    type: 'success'
                                })
                            }
                        });
                        this.dialogTableVisible = false
                    }
                })
            },
            // 重置
            reset(){
                this.formData={
                    username: '',
                    password: '',
                    nickname: '',
                    sex: '',
                    homeaddress: '',
                    email: '',
                    note: '',
                    type: ''
                }
            }

        }
    }
</script>

<style scoped>
    /deep/.el-dialog__title{
        line-height: 24px;
        font-size: 20px;
        color: #303133;
        font-weight: bolder
    }
    .box_acct_form .el-row .el-col .el-form-item .el-form-item__content .el-input {
        width: 100%;
    }
    .box_acct_form .el-row .el-col .el-form-item .el-form-item__content .el-select {
        width: 100%;
    }
    textarea
    .box_acct_form
    .el-row
    .el-col
    .el-form-item
    .el-form-item__content
    .el-textarea {
        width: 100%;
    }

    .box_acct_form .el-row {
        margin-bottom: 0px;
    }
    /deep/ .add-dialog{
        width: 900px;
        margin: auto;
        overflow: auto;
    }
    .msg_form {
        margin: 7px 15px;
    }

    .msg_form .msg_title {
        clear: both;
        display: block;
        font-weight: bold;
        height: 30px;
        line-height: 30px;
        margin: 0 0 14px;
        position: relative;
        font-weight: bold;
    //color: #327501;
        color: #20a0ff;
        font-size: 16px;
    }

    /deep/ .msg_form .msg_title .msg_title_tips {
        color: #797979;
        font-weight: normal;
        font-size: 12px;
    }

    .msg_box {
        position: relative;
        width: 100%;
    }

    .btn_div {
        text-align: center;
    }
    .btn_div button {
        height: 32px;
        width: 107px;
    }

    .box_content {
        background: #f9f9f9;
        border: 1px solid #d1d1d1;
        padding: 15px;
        margin: 0px 10px;
        position: relative;
    }
    .el-button{
        width: 60px;
        height: 36px;
        font-size: 14px;
    }
</style>