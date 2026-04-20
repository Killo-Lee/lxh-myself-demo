<template>
    <div class="confirm">
        <el-tabs v-model="activeTabName"
                 type="border-card"
                 style="width:99%;padding: 0px;height: 98%">
            <el-tab-pane label="加入小区群聊"
                         name="templatePage"
                         style='padding:1em;background-color:white'>
<!--                <ul class="content">-->
<!--                    <li><img src="../../../../assets/images/c5.jpg" alt=""></li>-->
<!--                    <li><img src="../../../../assets/images/tx1.jpg" alt=""></li>-->
<!--                    <li><img src="../../../../assets/images/1.jpg" alt=""></li>-->
<!--                    <li><img src="../../../../assets/images/tx2.png" alt=""></li>-->
<!--                    <li><img src="../../../../assets/images/c4.jpg" alt=""></li>-->
<!--                    <li><img src="../../../../assets/images/c6.jpg" alt=""></li>-->
<!--                    <li><img src="../../../../assets/images/c2.jpg" alt=""></li>-->
<!--                    <li><img src="../../../../assets/images/c3.jpg" alt=""></li>-->
<!--                    <li><img src="../../../../assets/images/c1.jpg" alt=""></li>-->
<!--                </ul>-->
                <div class="content">
                    <el-image v-for="url in urls"
                              :key="url"
                              :src="url"
                              :preview-src-list="srcList">
                    </el-image>
                </div>

                <el-button type="primary" class="button" @click="join">加入群聊</el-button>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    export default {
        name: "joinChat",
        data(){
            return{
                activeTabName: 'templatePage',
                name: '',
                u_id: '',
                urls:[require('../../../../assets/images/c5.jpg'),
                    require("../../../../assets/images/tx1.jpg"),
                    require("../../../../assets/images/1.jpg"),
                    require("../../../../assets/images/tx2.png"),
                    require("../../../../assets/images/c4.jpg"),
                    require("../../../../assets/images/c6.jpg"),
                    require("../../../../assets/images/c2.jpg"),
                    require("../../../../assets/images/c3.jpg"),
                    require("../../../../assets/images/c1.jpg")
                ],
                srcList:[
                    require("../../../../assets/images/c5.jpg"),
                    require("../../../../assets/images/tx1.jpg"),
                    require("../../../../assets/images/1.jpg"),
                    require("../../../../assets/images/tx2.png"),
                    require("../../../../assets/images/c4.jpg"),
                    require("../../../../assets/images/c6.jpg"),
                    require("../../../../assets/images/c2.jpg"),
                    require("../../../../assets/images/c3.jpg"),
                    require("../../../../assets/images/c1.jpg")
                ]
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
                    // this.u_id = result.id;
                })
            })
        },
        methods:{
            join(){
                // this.$store.commit('asyncUpdateUser',this.name);
                this.$router.push({
                    name: 'chat',
                    query:{
                        // u_id: this.u_id,
                        name: this.name,
                    }
                });
                this.$message({
                    message: '欢迎'+this.name+'加入滨江壹号群聊',
                    type: 'success',
                    showClose: true
                })
            }
        }
    }
</script>

<style scoped>
    .confirm{
        width: 100%;
        height: 500px;
    }
    .content{
        margin: auto;
        height: 300px;
        width: 300px;
        /*border: 1px solid grey;*/
        box-shadow: 0 0 10px grey;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-content: space-between;

    }
    /*li{*/
    /*    width: 96px;*/
    /*    height: 96px;*/
    /*    list-style: none;*/
    /*    cursor: pointer;*/

    /*}*/
    /*li>img{*/
    /*    width: 100%;*/
    /*    height: 100%;*/
    /*    background-size: cover;*/
    /*}*/
    /deep/.el-image__preview {
        cursor: pointer;
        width: 96px;
        height: 96px;
    }
    .button{
        width: 200px;
        height: 40px;
        margin-top: 30px;
        margin-left: 43%;
        font-size: 14px;
    }
</style>