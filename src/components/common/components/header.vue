<template>
    <div class="header">
        <div class="nav_bar">
            <div class="nav_text">
                <span class="nav_text_title">金泰小区物业管理系统</span>
            </div>
            <div class="nav_menu">
<!--                管理员-->
                <div v-if="this.type == '1'">
                    <el-menu default-active="1" class="el-menu-demo" :collapse="isCollapse" mode="horizontal" @select="handleSelect">
                        <div v-for="(item,index) in menuList" :key="index">
                            <el-menu-item v-if="!item.children"
                                          :index="item.id"
                                          @click="dealNavLink(item._key, item.id)">
                                <span slot="title" style="color: white">{{ item.title }}</span>
                            </el-menu-item>

                        <el-submenu v-else :index="item.id">
                            <template slot="title">
                                <span class="span1" v-show="!isCollapse" slot="title" style="color: white;">{{ item.title }}</span>
                            </template>
                            <el-menu-item-group>
                            <el-menu-item class="submenu_item"
                                    v-for="(subItem,index) in item.children"
                                    :key="subItem.id"
                                    :index="subItem.id"
                                    @click="dealNavLink(subItem._key, item.id)">
                                <template>
                                    <span slot="title" style="color: black">{{ subItem.title }}</span>
                                </template>
                            </el-menu-item>
                            </el-menu-item-group>
                        </el-submenu>
                        </div>
                    </el-menu>
                </div>

<!--                普通用户-->
                <div v-else>
                    <el-menu default-active="1" class="el-menu-demo" :collapse="isCollapse" mode="horizontal" @select="handleSelect">
                        <div v-for="(item,index) in userMenu" :key="index">
                            <el-menu-item v-if="!item.children"
                                          :index="item.id"
                                          @click="dealNavLink(item._key, item.id)">
                                <span slot="title" style="color: white">{{ item.title }}</span>
                            </el-menu-item>

                            <el-submenu v-else :index="item.id">
                                <template slot="title">
                                    <span class="span1" v-show="!isCollapse" slot="title" style="color: white;">{{ item.title }}</span>
                                </template>
                                <el-menu-item-group>
                                    <el-menu-item class="submenu_item"
                                                  v-for="(subItem,index) in item.children"
                                                  :key="subItem.id"
                                                  :index="subItem.id"
                                                  @click="dealNavLink(subItem._key, item.id)">
                                        <template>
                                            <span slot="title" style="color: black">{{ subItem.title }}</span>
                                        </template>
                                    </el-menu-item>
                                </el-menu-item-group>
                            </el-submenu>
                        </div>
                    </el-menu>
                </div>
            </div>
        </div>
        <div class="nav_right">
            <div style="margin-top: 17px;margin-right: 10px;cursor: pointer;">

<!--                //指令使用-->
                <div class="imgDiv" v-viewer="{movable: true}">
                    <img :src="icon"  style="width: 34px;height: 34px;border-radius: 50%">
                </div>
<!--                图片预览插件-->
<!--                <viewer :images="icon">-->
<!--                    <img :src="icon" style="width: 34px;height: 34px;border-radius: 50%">-->
<!--                </viewer>-->
            </div>
            <div class="inline-block" style="align-items: center">
                <span>{{user}}，你好！</span>
            </div>
            <div class="back">
                <i class="fa fa-sign-out line-height-56" @click="logout" style="font-size: 25px;font-weight: 600;position: relative;top: 3px;cursor: pointer"></i>
            </div>
        </div>
        <el-dialog :visible.sync="dialogVisible" size="tiny" width="35%" append-to-body>
            <div class="logout-center">
                <i class="el-icon-warning-outline" style="color: #f8bb86;font-size: 100px;"></i>
                <div class="logout-title">提示</div>
                <div class="logout-text">即将退出系统, 是否继续? </div>
            </div>
            <div slot="footer" class="dialog-footer logout-center">
                <el-button @click="dialogVisible = false" style="width: 16%;height: 40px;font-size: 16px;font-weight: bold">取 消</el-button>
                <el-button type="danger" @click="handleConfirm" style="width: 16%;height: 40px;font-size: 16px;font-weight: bold">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import menuConfig from "../config/menuConfig"
    import userMenu from "../config/userMenu"
    export default {
        name: "vHead",
        data(){
            return{
                // photo: [],
                type: '',
                icon: '',
                // username:{},
                menuList: menuConfig,
                userMenu: userMenu,
                isCollapse: false,
                dialogVisible:false
            }
        },
        created(){
            /**
             * this.icon头像路径
             * this.username用户名
             */
            this.$axiosToken({
                url: '/users/getUserByToken',
                method: 'get',
                data: {},
                success:(result=>{
                    if (result.type == 1) {
                        this.icon = this.basePath+"/file/"+result.head
                    }else if (result.type == 2) {
                        this.icon = this.basePath+"/file/"+result.head
                    }
                    this.type = result.type
                })
            })
            
        },
        computed:{
            // 定义变量，利用computed获取变量的值(Vuex)
            user:function () {
                return this.$store.getters.getUser.name
            }
        },
        mounted(){
          // this.getParams()
        },
        methods:{
            // getParams(){
            //   this.username = this.$route.query
            // },
            //退出显示弹框
            logout(){
              this.dialogVisible = true
            },
            handleConfirm(){
                this.$router.push('/logout')
                this.dialogVisible = false
            },
            handleSelect(key, keyPath){
                console.log(key, keyPath);
            },
            // 保存链接的激活状态
            // 在页面被创建时，立即从sessionStorage中取出来，并且传递给activepath（参数地址）
            dealNavLink(activepath) {
                // 将获取点击的地址保存在sessionstrong中
                this.$router.push(activepath);
                // this.$router.resolve(activepath);
                // window.open(route.href, '_blank');
            },
        }
    }
</script>

<style scoped>
    .header{
        position: fixed;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-sizing: border-box;
        width: 100%;
        height: 56px;
        background: #389af9;
        z-index: 999;
    }
    .nav_bar{
        display: flex;
        width: 80%;
    }
    .nav_text_title{
        margin-left: 25px;
        line-height: 56px;
        color: #fff;
        cursor: pointer;
        font-weight: 600;
        text-align: center;
        font-size: 24px;
    }
    .nav_right{
        display: flex;
        align-items: center;
        color: rgb(255, 255, 255);
        margin-right: 25px;
        font-size: 16px;
        line-height: 50px;
    }
    .logout-center {
        text-align: center;
    }
    .logout-title {
        color: rgba(0, 0, 0, .65);
        font-weight: 600;
        text-transform: none;
        position: relative;
        display: block;
        padding: 13px 16px;
        font-size: 27px;
        line-height: normal;
        text-align: center;
        margin-bottom: 0;
    }
    .logout-text {
        font-size: 16px;
        position: relative;
        float: none;
        line-height: normal;
        vertical-align: top;
        text-align: left;
        display: inline-block;
        margin: 0;
        padding: 0 10px;
        font-weight: 400;
        color: rgba(0,0,0,.64);
        max-width: calc(100% - 20px);
        overflow-wrap: break-word;
        box-sizing: border-box;
    }
    .dialog-footer{
        background-color: rgb(245, 248, 250);
        text-align: center;
        border-radius: 3px;
        margin-top: 13px;
        padding: 13px 16px;
    }
    .nav_menu{
        position: absolute;
        margin-left: 15%;
    }
    .el-menu-demo{
        margin-top: 2px;
        margin-left: 6%;
        height: 50px;
        display: flex;
        align-items: center;
        text-align: center;
        background-color:transparent;
        border: 0!important;
    }
    /deep/ .el-submenu{
        padding-left: 22px;

    }
    /deep/ .el-submenu__title{
        width: 100%;
    }
    /deep/ .el-menu-item.is-active:hover{
        background-color: rgb(50, 65, 87);
    }
    /deep/ .el-submenu__title:hover{
        background-color: rgb(50, 65, 87);
    }
    /deep/ .el-menu-item-group__title{
        width: 600px;
        margin-top: 0px;
        position: fixed;
        /*width: 100%;*/
        z-index: 1100;
    }
    /deep/ .el-menu-item.submenu_item{
        display: inline-block;
        text-align: center;
        margin-bottom: 10px;
    }
    /deep/ .el-submenu__icon-arrow{
        display: none;
    }
    /deep/ .el-menu-item.submenu_item{
        width: 100px;
    }

</style>