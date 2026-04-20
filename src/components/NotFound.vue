<template>
    <div class="content">
        <el-col :span="12">
            <img :src="img_404" alt="" class="img-style">
        </el-col>
        <el-col :span="12">
            <div style="margin-left: 60%; margin-top: 200px;position: absolute">
                <h1>oh! no~</h1>
                <h2>很抱歉，你的页面走丢了！</h2>
                <div>请检查你输入的网址是否正确，或点击返回按钮！</div>
                <el-button type="danger round" style="margin-top: 20px" @click="goMainPage">返回上一页</el-button>
            </div>
        </el-col>
    </div>
</template>
<script>
    import img_404 from "@/assets/images/gif_404.gif"
    export default {
        name: "NotFound",
        data(){
            return{
                img_404
            }
        },
        methods:{
            goMainPage(){
                this.$router.go(-1)
            }
        }
    }
</script>

<style scoped>
    .content{
        width: 100%;
        margin:  auto;
    }
    .img-style{
        position: absolute;
        width: 100%;
        height: 100%;
    }
</style>