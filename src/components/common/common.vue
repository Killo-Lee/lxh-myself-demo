<template>
<!--    <el-contaiinner class="app-wrapper">-->
<!--        &lt;!&ndash;头部区域&ndash;&gt;-->
<!--        <v-Head></v-Head>-->

<!--        <el-container>-->
<!--                &lt;!&ndash;中心主体&ndash;&gt;-->
<!--                <v-Main></v-Main>-->
<!--            </el-container>-->
<!--    </el-contaiinner>-->
    <el-container style="background-color: #f0f0f0;">
        <el-header>
            <v-Head></v-Head>
        </el-header>
        <el-main>
            <v-Main></v-Main>
        </el-main>
    </el-container>
</template>

<script>
    import vHead from "./components/header"
    import vMain from "./components/main"
    export default {
        name: "common",
        components:{
            vHead,
            vMain
        }
    }
</script>

<style scoped>
    *{
        margin: 0;
        padding: 0;
    }
    /deep/.el-container.is-vertical{
        background-color: #f0f0f0;
    }
    /deep/ .el-header{
        width: 100%;
        padding: 0;
        margin: 0;
    }
    /deep/ .el-main{
        margin: 1.3% 1%;
        padding: 0 0;
        background-color: #fff;
        /*box-shadow: 0 2px 4px 0 rgb(0 0 0 / 12%), 0 0 6px 0 rgb(0 0 0 / 4%);*/
    }


</style>