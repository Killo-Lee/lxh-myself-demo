<template>
    <div>
        <div class="form_div">
            <el-tabs v-model="tabName"
                     type="border-card"
                     style="width:100%;padding: 0px">
                <el-tab-pane label="密码修改"
                             name="tabName"
                             style='padding:1em;background-color:white'>
                    <div class="box">
                        <div class="box_content">
                            <el-form :rules="rules"
                                     ref="form"
                                     :model="form"
                                     class="ps_form">
                                <el-row v-show="false">
                                    <el-col :span="12">
                                        <el-form-item label="主键id:"
                                                      prop="id"
                                                      label-width="130px">
                                            <el-input type="password"
                                                      size="medium"
                                                      v-model="form.id"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="12">
                                        <el-form-item label="旧密码:"
                                                      prop="oldPwd"
                                                      label-width="130px">
                                            <el-input type="password"
                                                      size="medium"
                                                      show-password
                                                      v-model="form.oldPwd"></el-input>
                                        </el-form-item>

                                    </el-col>
                                    <el-col :span="12" v-show="userType === '2'">
                                        <el-form-item>
                                            <span @click="goFeedback()">忘记密码？请联系管理员修改密码</span>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row style="margin-top: 20px">
                                    <el-col :span="12">
                                        <el-form-item label="新密码:"
                                                      prop="newPwd"
                                                      label-width="130px">
                                            <el-input type="password"
                                                      size="medium"
                                                      show-password
                                                      v-model="form.newPwd"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row style="margin-top: 20px">
                                    <el-col :span="12">
                                        <el-form-item label="确认新密码:"
                                                      prop="conPwd"
                                                      label-width="130px">
                                            <el-input type="password"
                                                      size="medium"
                                                      show-password
                                                      v-model="form.conPwd"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row style="margin-top: 20px">
                                    <el-col :span="12">
                                        <el-form-item label-width="130px" style="margin-left: 15%">
                                            <el-button type="primary"
                                                       class="button"
                                                       size="medium"
                                                       @click="submit">保 存</el-button>
                                            <el-button type="primary"
                                                       style="margin-left:12%;"
                                                       class="button"
                                                       size="medium"
                                                       @click="reset">重 置</el-button>

                                        </el-form-item>

                                    </el-col>
                                </el-row>
                            </el-form>
                        </div>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>

    </div>
</template>

<script>
    export default {
        name: "pwdChange",
        data(){
            var repasswordValidator = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.form.newPwd) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            var psValidator = (rule, value, callback) => {
                //还分中文英文字符
                var series = [
                    "`1234567890-=",
                    "~!@#$%^&*()_+",
                    "qwertyuiop[]\\",
                    "QWERTYUIOP{}|",
                    "asdfghjkl;\'",
                    "ASDFGHJKL:\"",
                    "zxcvbnm,./",
                    "ZXCVGBNM<>?",
                    "=-0987654321·",
                    "+_)(*&^%$#@!~",
                    "\][poiuytrewq",
                    "|}{POIUYTREWQ",
                    "';lkjhgfdsa",
                    "\":LKJHGFDSA",
                    "/.,mnbvcxz",
                    "?><MNBVCXZ",
                    "~！@#￥%……&*（）——+"];
                let issame = false;
                let len = value.length;
                if (len.length < 3) {
                    return false;
                }
                for (let i = 0; i <= value.length - 3; i++) {
                    var str = value.substring(i, i + 3);
                    for (let j = 0; j < series.length; j++) {
                        if (series[j].indexOf(str) != -1) {
                            //包含就返回
                            issame = true;
                            break;
                        }
                    }
                    if (issame) {
                        callback(new Error('不容出现123，qwe，!@#等具有连续性的字符！'));
                        break;
                    } else {
                        callback();
                    }
                }

            };
            return{
                tabName: 'tabName',
                rules: {
                    oldPwd: [
                        { required: true, message: '请输入旧密码', trigger: 'blur' },
                    ],
                    newPwd: [
                        { required: true, pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[$@$!%*?#&])[A-Za-z\\d$@$!%*?#&]{8,}', message: '不能少于8位，必须包含数字、特殊字符、小写字母及大写字母！', trigger: 'blur' },
                        { required: true, validator: psValidator, message: '', trigger: 'blur' }

                    ],
                    conPwd: [
                        { required: true, validator: repasswordValidator,message: '', trigger: 'blur' },
                    ]
                },
                form:{
                    oldPwd: '',
                    newPwd: '',
                    conPwd: '',
                },
                userType: '',
            }
        },
        created(){
            /**
             * this.icon头像路径
             * this.username用户名
             */
            let token = sessionStorage.token;
            this.$axiosToken({
                url: '/users/getUserByToken',
                method: 'get',
                data: {},
                success:(result=>{
                    this.form.id = result.id;
                    this.userType = result.type
                })
            })

        },
        methods:{
            submit(){
                this.$refs['form'].validate((valid)=>{
                    if (!valid){
                        this.$message.error({
                            message: "error submit!!",
                            duration: 2000
                        });
                    }else {
                            this.$confirm('确认修改密码？','提示',{
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning'
                            }).then(()=>{
                                this.$axiosToken({
                                    url: '/users/updatePwd',
                                    method: 'post',
                                    data:{
                                        id: this.form.id,
                                        oldPwd: this.form.oldPwd,
                                        newPwd: this.form.newPwd,
                                    },
                                    success: (result) => {
                                        console.log(result,222);
                                        if (result == "密码修改成功") {
                                            this.$message({
                                                showClose: true,
                                                message: '密码修改成功，请重新登录',
                                                type: 'success'
                                            });
                                            this.$router.push('/logout')
                                        } else {
                                            this.$message({
                                                showClose: true,
                                                message: '密码修改失败,确认旧密码是否正确',
                                                type: 'error'
                                            })
                                        }
                                    }
                                })
                            })


                    }
                })
            },
            reset(){
                this.form={
                    oldPwd: '',
                    newPwd: '',
                    conPwd: '',
                }
            },
            // 去反馈联系管理员修改密码
            goFeedback(){
                this.$router.push({
                    name: 'feedback'
                })
            }
        }
    }
</script>

<style scoped>
    .form_div{
        width: 99%;
        margin: auto;
    }
    .box_content {
        padding: 20px 0;
        padding-left: 50px;
    }
    .button {
        width: 120px;
    }
    span{
        margin-left: 20px;
        font-size: 12px;
        color: #253af9;
        cursor: pointer;
        font-style:oblique;
    }
</style>