<template>
    <div>
        <el-row class="box">
            <template v-if="false">
                <el-button :plain="true"></el-button>
            </template>
            <el-col :span="24" style="">
                <el-card class="group">
                    <div class="group_head">
                        <el-page-header  class="title" title="退出群聊" @back="goBack" content="滨江壹号小区聊天群">
                        </el-page-header>
                        <div class="group_head_online">
                            <el-button @click="drawer = true" type="primary"
                                       style="margin-left: 16px;background: none;border: none;color: dodgerblue">
<!--                                <span v-text="'在线'+online+'人'"> </span>-->
                            </el-button>
                        </div>
                    </div>
                    <div class="comment" id="divDetail">
                        <ul>
                            <div style="width: 20%;height: 15px;margin: auto;font-size: 12px;color: grey">
                                {{tip}}
                            </div>
                            <li v-for='item in commlist' style=" list-style-type:none;">
                                <div class="msgOther" v-if="!item.if">
                                    <div class="head_img">
                                        <viewer>
                                            <img :src="imgpath+item.msgData.icon" alt="">
                                        </viewer>
                                    </div>
                                    <div class="left_angle"></div>
                                    <div class="msg">
                                        <div class="msg_title"><span v-text="item.msgData.name"></span> <i
                                                v-text="timeDetia(item.date)"></i>
                                        </div>
                                        <div>
                                            <pre>{{item.msgData.msg}}</pre>
                                        </div>
                                    </div>
                                </div>
                                <div class="msgMy" v-if="item.if">
                                    <div class="msg">
                                        <div class="msg_title"><i v-text="timeDetia(item.date)"></i><span
                                                v-text="item.msgData.name"></span>
                                        </div>
                                        <div>
                                            <pre>{{item.msgData.msg}}</pre>
                                        </div>

                                    </div>
                                    <div class="right_angle"></div>
                                    <div class="head_img">
                                        <viewer>
                                            <img :src="imgpath+item.msgData.icon" alt="">
                                        </viewer>
                                    </div>

                                </div>

                            </li>
                        </ul>
                    </div>
                    <div class="send">
                        <div style="margin-top: 15px;">
                            <el-input
                                    class="input"
                                    @keyup.enter.native="send"
                                    type="textarea"
                                    :rows="4"
                                    placeholder="请输入聊天内容"
                                    v-model="comm"
                                    size="medium">
                            </el-input>
<!--                            <button @click="quit">推出</button>-->
                        </div>
                    </div>

                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        name: "chat",
        data() {
            return {
                drawer: false,
                online: '',
                comm: '',
                name: '',
                icon: '',
                id: '',
                tip: '',
                // u_id: 0,
                imgpath: this.socketpath+'/file/',
                commlist: [
                    {
                        msgData: {
                            msg: '系统提示:欢迎加入滨江壹号交流群，保护好自己隐私安全哦！！！',
                            name: '系统提示',
                            id: '',
                            icon: 'qq.jpg',
                            tip: ''
                        },
                        date:0
                    }
                ]

            }
        },

        sockets: {
            connect(socket) {
                console.log('[SYSTERM]握手成功')
            },
            getmsgo(data) {
                if (data.msgData.id == this.id) data.if = true;
                else data.if = false;
                this.commlist.push(data);
                this.goDivbo("divDetail")
            },
            welcome(users) {
                this.online=users.length
                // this.open("欢迎" + users[users.length - 1].name + "加入群聊", 1000, "success")
            },
            disconnects(users){
                this.online=users.length
                // this.open( users[users.length - 1].name + "离开了群聊", 1000, "info")
            },


        },
        created() {
            // sessionStorage.setItem('user', "sss");
            // this.u_id= window.localStorage.getItem("id")
            this.name = this.$route.query.name;

            this.join();
            this.quit();
            this.$axiosToken({
                url: '/users/getUserByToken',
                method: 'get',
                data: {},
                success:(result=>{
                    this.type = result.type;
                    this.name = result.username;
                    this.icon = result.head
                    this.id = result.id;
                    this.tip = '欢迎'+this.name+'加入群聊'
                })
            })
        },
        methods: {
            goBack(){
                this.$router.go(-1);
                this.$message({
                    message: ''+this.name+'退出了群聊',
                    type: 'info',
                    duration: 2000
                })
            },

            //退出群提醒
            quit(){
                //获取即时信息渲染
                this.socket.emit('quit',this.getItem() )
                this.socket.on('quit', (data) => {
                    // this.open( data.data.name + "离开了群聊", 1000, "info")
                })
            },


            //获取浏览器的用户信息
            getItem(){
                let msgData = {
                    name: this.name,
                    id: this.id,
                    icon: this.icon,
                };
                // let name = this.name
                // let id = this.id
                // let icon = this.icon
                // let msgData=[]
                // msgData.name = name
                // msgData.id = id
                // msgData.icon = icon
                return msgData
            },

            goDivbo(id) {
                let div = document.getElementById(id);
                div.scrollTop = div.scrollHeight;
            },
            send(e) {
                if (e.keyCode==13&&e.shiftKey) {
                    return
                }
                else if (this.comm.length == 1) {
                    this.open('聊天内容不能为空', 500, "info")
                    this.comm = "";
                    return
                }

                this.goDivbo("divDetail");

                if (this.comm.length > 0) {
                    let msgData = this.getItem();
                    msgData.msg = this.comm;
                    this.socket.emit('messageo', msgData);
                    this.comm = ""
                }
            },
            //加入群聊
            join() {
                if (this.id) {
                    let joinData = {};
                    joinData.name = this.name;
                    joinData.id = this.id;
                    joinData.icon = this.icon;
                    this.socket.emit('join', joinData);
                }

            },

            timeDetia: function (date) {
                var time;
                var d = new Date(date);
                var n = new Date();
                //获取时间戳
                var dd = d.getTime();
                var h = d.getHours();
                var m = d.getMinutes();
                var Y = d.getFullYear();
                var M = d.getMonth() + 1;
                var D = d.getDate();
                //现在时间
                var nn = n.getTime();
                var hh = n.getHours();
                var mm = n.getMinutes();
                var YY = n.getFullYear();
                var MM = n.getMonth() + 1;
                var DD = n.getDate();

                if (D == DD && M == MM && Y == YY) {
                    if (h < 10) {
                        h = '0' + h;
                    }
                    if (m < 10) {
                        m = '0' + m;
                    }
                    time = h + ':' + m;
                    return time;
                } else if (D + 1 == DD && M == MM && Y == YY) {
                    if (h < 10) {
                        h = '0' + h;
                    }
                    if (m < 10) {
                        m = '0' + m;
                    }
                    time = '昨天' + ' ' + h + ':' + m;
                    return time;
                } else {
                    if (M < 10) {
                        M = '0' + M;
                    }
                    if (D < 10) {
                        D = '0' + D;
                    }
                    if (h < 10) {
                        h = '0' + h;
                    }
                    if (m < 10) {
                        m = '0' + m;
                    }
                    time = Y + '年' + M + '月' + D + '日' + ' ' + h + ':' + m;
                    return time;
                }
            }
            , open(message, duration, type) {
                this.$message({
                    // showClose: true,
                    message: message,
                    duration: duration,
                    type: type
                });
            },

        }
    }
</script>

<style lang="scss" scoped>
    .box {
        ::-webkit-scrollbar {
            /*display: none; !* Chrome Safari *!*/
            width: 4px
        }
        /*::-webkit-scrollbar-thumb{*/
        /*    border-radius:3px;*/
        /*    background-color: #ccc//滚动条的颜色*/
        /*}*/

        margin: auto;
        width: 99%;
        .group {
            background: rgba(200, 200, 169, 0.05);
            height: 39rem;
            width: 99%;
            .group_head {
                .title {
                    height: 4rem;
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    span {
                        font-family: "Helvetica Neue", Arial, sans-serif;
                        font-size: 1.8rem;
                    }

                }
                position: relative;
                display: flex;
                /*justify-content: center;*/
                align-items: center;
                /*border-bottom:1px solid grey ;*/
                box-shadow: 0px 20px 10px -20px grey;
                width: 100%;
                font-family: "Helvetica Neue", Arial, sans-serif;
                /*,Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑"*/
                .group_head_online {
                    position: absolute;
                    right: 1.5rem;
                    top: -1rem;
                    color: dodgerblue;
                }

            }
            .comment {
                background: rgba(219, 235, 235, 0.44);
                padding-bottom: 5rem;
                border: 1px solid rgba(189, 172, 156, 0.5);
                overflow-y: scroll;
                width: 100%;
                height: 22rem;
                /*border-bottom: 1px solid  rgba(189, 172, 156, 0.5);;*/
                ul {
                    li {
                        //我的列表
                        .msgMy {
                            margin-right: 1.5rem;
                            .msg_title {
                                display: flex;
                                justify-content: flex-end;

                                span {
                                    margin-right: 1rem;
                                    margin-left: 0.5rem;
                                }

                            }

                            display: flex;
                            justify-content: flex-end;
                            pre {
                                color: white;
                                box-shadow: 0 2px 2px rgba(10, 16, 20, .24), 0 0 2px rgba(10, 16, 20, .12);
                                /*background: rgba(107, 194, 53, 0.5);*/
                                background: #95ec69;
                                border-top-left-radius: 5px;
                                border-bottom-right-radius: 5px;
                                border-bottom-left-radius: 5px;
                            }
                        }
                        .msgOther {
                            display: flex;
                            pre {
                                padding-left: 0.3rem;
                                padding-right: 0.3rem;
                                box-shadow: 0 2px 2px rgba(10, 16, 20, 0.1), 0 0 2px rgba(10, 16, 20, 0.1);
                                background: rgba(200, 200, 169, 0.1);
                                border-bottom-left-radius: 5px;
                                border-top-right-radius: 5px;
                                border-bottom-right-radius: 5px;

                            }
                        }
                        /*消息框三角*/
                        .left_angle{
                            width: 0;
                            height: 0;
                            border: 8px solid rgba(200, 200, 169, 0.1);
                            border-top-color: transparent;
                            border-bottom-color: transparent;
                            border-left-color: transparent;
                            margin-top: 26px;
                            margin-right: -8px;
                        }

                        //共有部分
                        .head_img {
                            width: 3rem;
                            height: 3rem;
                            min-height: 3rem;
                            min-width: 3rem;
                            border-radius: 50%;
                            overflow: hidden;
                            margin-left: 0.5rem;
                            cursor: pointer;
                            img {
                                object-fit: cover;
                                width: 100%;
                                height: 100%;
                            }
                        }
                        .msg {
                            max-width: 50rem;
                            pre {
                                /*Line-height:2px;*/

                                line-height: 1.5em;
                                letter-spacing: 2px;
                                padding-left: 1rem;
                                padding-right: 1rem;
                                display: flex;
                                align-items: center;
                                min-height: 3rem;
                                min-width: 1rem;
                                margin-top: 0.2rem;
                                white-space: pre-wrap;
                                word-wrap: break-word;
                                font-size: 1.5rem;
                            }

                            margin-right: 0.5rem;
                            margin-left: 0.5rem;
                            display: flex;
                            flex-flow: column;
                            .msg_title {
                                span {
                                    font-size: 0.6rem;
                                }
                                i {
                                    font-size: 0.6rem;
                                    color: grey;
                                }
                            }


                        }
                        /*消息框三角*/
                        .right_angle{
                            width: 0;
                            height: 0;
                            border: 8px solid #95ec69;
                            border-top-color: transparent;
                            border-bottom-color: transparent;
                            border-right-color: transparent;
                            margin-top: 25px;
                            margin-left: -9px;
                        }

                    }
                }

            }

            .send {
                .el-textarea__inner {
                    height: 50px;
                    min-height: 50px;
                    line-height: 0.5;
                }
                width: 100%;
                height: 5rem;
                .el-input {
                    min-height: 10rem;
                }

            }

        }

    }

</style>
<style scoped>
    /deep/.el-textarea__inner{
        font-family: 楷体;
        font-size: 15px;
        background: #fff;
    }
    /deep/.el-card__body {
        padding: 0 22px;
    }
</style>
