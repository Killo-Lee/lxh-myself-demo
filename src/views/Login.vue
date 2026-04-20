<template>
    <div class="content">
<!--        粒子特效插件-->
        <vue-particles
                color="#fff"
                :particleOpacity="0.7"
                :particlesNumber="100"
                shapeType="circle"
                :particleSize="4"
                linesColor="#fff"
                :linesWidth="1"
                :lineLinked="true"
                :lineOpacity="0.4"
                :linesDistance="150"
                :moveSpeed="2"
                :hoverEffect="true"
                hoverMode="grab"
                :clickEffect="true"
                clickMode="push"
                class="lizi"
        >
        </vue-particles>
        <el-form :model="loginForm" :rules="rules" ref="loginForm" label-width="80px" class="login-box">
            <h3 class="login-title" style="font-size: 32px">
                欢迎登录小区物业管理系统
            </h3>
            <el-form-item label="账号" prop="username">
                <el-input prefix-icon="el-icon-user" v-model="loginForm.username" autocomplete="off" placeholder="请输入账号" ></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password" style="margin-top: 30px">
                <el-input prefix-icon="el-icon-lock" :type="flag?'text':'password'" v-model="loginForm.password" autocomplete="off" placeholder="请输入密码">
                    <i slot="suffix"
                       :class="flag?'fa fa-eye':'fa fa-eye-slash'"
                       style="margin-top:12px;font-size:16px;color: #515151;cursor: pointer"
                       autocomplete="auto"
                       @click="flag=!flag" />
                </el-input>
            </el-form-item>
            <el-form-item label="验证码" prop="verifyCode" class="verifyCodeItemCss" style="margin-top: 30px">
                <el-row :span="24">
                    <el-col :span="14">
                        <el-input
                                prefix-icon="el-icon-key"
                                class="verify_css"
                                placeholder="请输入4位验证码"
                                v-model="loginForm.verifyCode"
                                @keyup.enter.native="submitForm('ruleForm')"
                        ></el-input>
                    </el-col>
                    <!--关键 ↓-->
                    <el-col :span="10">
                        <div id="v_container" style="margin-left: 42px"></div>
                    </el-col>
                </el-row>
            </el-form-item>
            <div class="button-box" style="margin-top: 32px;margin-left: 150px">
                <el-button type="primary" @click="login" @keyup.enter="login" style="margin-left: -25px">登录</el-button>
                <el-button type="danger" @click="reset" style="margin-left: 25px">重置</el-button>
            </div>

        </el-form>
    </div>
</template>

<script>
    import { GVerify } from "./verifyCode";
    export default {
        name: "Login",
        data(){
            return{
                flag: false,
                loginForm:{
                    username:'',
                    password:'',
                    verifyCode: '',
                    id:'',
                    type:'',
                    email:''
                },
                rules:{
                    username:{ required: true, message: "账号不能为空", trigger: "blur" },
                    password:{ required: true, message: "密码不能为空", trigger: "blur" },
                    verifyCode:{ required: true, message: "请输入验证码", trigger: "blur" },
                },
            }
        },
        created(){
            let token = sessionStorage.token;

        },
        mounted(){
            this.verifyCode = new GVerify("v_container");
            // 绑定监听事件
            window.addEventListener("keydown", this.keyDown);
        },
        destroyed() {
            // 销毁事件
            window.removeEventListener("keydown", this.keyDown, false);
        },
        components:{},
        methods:{
            // 登录
            login(){
                this.$refs['loginForm'].validate((valid)=>{
                    if (!valid){
                        this.$message.error({
                            message: "请填写账号密码或验证码",
                            duration: 2000
                        });
                    }else {
                        this.$Axios({
                            url:'/users/login',
                            method:'post',
                            data:{
                                username:this.loginForm.username,
                                password:this.loginForm.password
                            },
                            success:(result)=>{
                                if (result == "用户名账号或密码错误"){
                                    this.$message.error({
                                        message: "用户名账号或密码错误",
                                        duration: 2000
                                    });
                                } else {
                                    // 获取验证码
                                    let verifyCode = this.loginForm.verifyCode;
                                    let verifyFlag = this.verifyCode.validate(verifyCode);
                                    if (!verifyFlag){
                                        this.$message.error("验证码错误！");
                                        this.verifyCode.refresh();
                                        return;
                                    }
                                    console.log(result);
                                    sessionStorage.setItem('token', result.jwt_token);
                                    this.$message({
                                        duration: 2000,
                                        type: 'success',
                                        message: '登录成功!'
                                    });
                                    // 含有异步操作，使用vuex向平行页面传值
                                    this.$store.dispatch('asyncUpdateUser',{name:this.loginForm.username});
                                    this.$router.push({
                                        name: 'Index',
                                        params:{
                                            name:this.loginForm.username
                                        }
                                    });

                                    // 根据token登录日志
                                    this.$axiosToken({
                                        url: '/users/getUserByToken',
                                        method: 'get',
                                        data: {},
                                        success:(result=>{
                                            this.loginForm.type = result.type;
                                            this.loginForm.email = result.email;
                                            // 登录日志
                                            this.$axiosToken({
                                                url: '/users/addloginData',
                                                method: 'post',
                                                data:{
                                                    username: this.loginForm.username,
                                                    type: this.loginForm.type,
                                                    email: this.loginForm.email
                                                },
                                                success: (result)=>{
                                                }
                                            });

                                        })
                                    });




                                }
                            }
                        })

                    }
                })

            },
            // 点击回车键登录
            keyDown(e) {
                // 回车则执行登录方法 enter键的ASCII是13
                if (e.keyCode === 13) {
                    this.login(); // 定义的登录方法
                }
            },

            // 重置
            reset(){
                this.loginForm = {
                    username:'',
                    password:'',
                }
            }
        },
    }
</script>

<style scoped>
    .content{
        width: 100%;
        height: 100%;
        /*background: linear-gradient(rgb(51, 153, 255), rgb(144, 201, 243));*/
        position: absolute;
        background-image: url("../assets/images/bg2.jpg");
        background-size: cover;
    }
    .lizi {
        position: absolute;
        width: 100%;
        height: calc(100% - 50px);
    }
    .login-box {
        position: absolute;
        border: 1px solid #dcdfe6;
        width: 470px;
        height: 350px;
        /*margin: 180px auto;*/
        background-color: rgba(255, 255, 255, 0.85);
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 35px 85px 15px 35px;
        border-radius: 5px;
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        box-shadow: 0 0 25px #909399;
        /*opacity: 0.9;*/
    }
    .login-title {
        text-align: center;
        margin: 0 auto 40px auto;
        color: #303133;
        margin-left: 52px;
    }
    /deep/ .el-form-item__label{
        line-height: 40px;
        font-size: 16px;
    }
    /deep/ .el-input__inner{
        height: 40px;
    }
    .verify_css{
        width: 270px;
    }
    .button-box{
        margin: auto;
    }
    /deep/ .el-button{
        width: 40%;
        height: 35px;
        font-size: 14px;
    }
</style>