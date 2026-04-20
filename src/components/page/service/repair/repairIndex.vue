<template>
    <div>
        <el-tabs v-model="activeTabName"
                 type="border-card"
                 style="width:99%;padding: 0px">

            <el-tab-pane label="维修处理"
                         name="templatePage"
                         style='padding:1em;background-color:white'>

                <div class='view-content'>
                    <el-row>
                        <el-col style="width: 15%">
                            <div class="message-block-item b1"
                                 @click="smartDevice">
                                <i class="el-icon-service"></i>
                                <p>智能设备维修</p>
                            </div>

                        </el-col>
                        <el-col style="width: 15%;margin-left: 3%">
                            <div class="message-block-item b2"
                                 @click="houseDevice">
                                <i class="el-icon-office-building"></i>
                                <p>家居设备维修</p>
                            </div>
                        </el-col>
                    </el-row>

                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    export default {
        name: "repairIndex",
        data(){
            return{
                activeTabName: 'templatePage',
                menuList: []
            }
        },
        methods:{
            smartDevice(){
                this.$router.push({
                    name: 'smartRepair'
                })
            },
            houseDevice(){
                this.$router.push({
                    name: 'houseRepair'
                })
            },
        }
    }
</script>

<style scoped>
    /deep/.devops-manage .el-upload--text {
        width: auto;
        height: auto;
        border: 0px dashed;
    }

    /deep/.devops-manage .el-tabs .el-tabs__content {
        padding: 0;
    }

    /deep/.el-select__tags {
        white-space: nowrap;
        overflow: hidden;
    }
    .message-block-item {
        text-align: center;
        font-size: 16px;
        color: #fff;
        padding: 25px 0;
        cursor: pointer;
        border-radius: 8px;
        margin: 0 5px 15px 5px;

    }
    i {
        font-size: 60px;
    }
    p {
        margin-top: 10px;
        font-size: 20px;
    }
    .b1 {
        background: #20a0ff;
        height: 112px;
    }
    .b2 {
        background: #13ce66;
        height: 112px;
    }
    .b3 {
        background: #f7ba2a;
    }
    .b4 {
        background: #ff4949;
    }

</style>