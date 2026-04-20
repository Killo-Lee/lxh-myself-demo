<template>
  <div class="message">
    <el-tabs v-model="wdxx" type="border-card">
      <el-tab-pane label="我的信息" name="wdxx">
        <el-form ref="formwdxx" :model="formwdxx" label-width="100px">
          <el-form-item label="*用户账号">
            <el-input v-model="formwdxx.username" readonly></el-input>
          </el-form-item>
          <el-form-item label="*用户名称">
            <el-input v-model="formwdxx.nickname" readonly></el-input>
          </el-form-item>
          <el-form-item label="*性别">
            <el-input v-model="formwdxx.sex" disabled></el-input>
          </el-form-item>
          <el-form-item label="*类型">
            <el-input :value="formwdxx.type === '1' ? '管理员' : '普通用户'" disabled></el-input>
          </el-form-item>
          <el-form-item label="联系电话">
            <el-input v-model="formwdxx.phone" readonly></el-input>
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="formwdxx.email" readonly></el-input>
          </el-form-item>
          <el-form-item label="生效时间">
            <el-date-picker v-model="formwdxx.createtime" disabled></el-date-picker>
          </el-form-item>
          <el-form-item label="详细住址">
            <el-input v-model="formwdxx.homeaddress" disabled></el-input>
          </el-form-item>
          <el-form-item label="我的车位">
            <el-input v-model="formwdxx.parkname" readonly></el-input>
          </el-form-item>
          <el-form-item label="计费状态">
            <el-input :value="formwdxx.coststatus === '1' ? '已缴费' : '未缴费'" readonly></el-input>
          </el-form-item>
          <el-form-item label="我的描述">
            <el-input type="textarea" v-model="formwdxx.note" readonly></el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <div class="tx">
      <p>头像信息/更换</p>
      <el-form ref="formwdxx" :model="formwdxx">
        <img :src="'http://community.byesame.com/file/' + formwdxx.icon" alt="">
        <el-upload
          class="avatar-uploader"
          action="https://jsonplaceholder.typicode.com/posts/"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form>
    </div>
  </div>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      imageUrl: '',
      wdxx:"wdxx",
      formwdxx: {
        username: "",
        nickname: "",
        sex: "",
        type: "",
        phone: "",
        email: "",
        createtime: "",
        homeaddress: "",
        parkname: "",
        coststatus: "",
        note: "",
        icon: ""
      },
    };
  },
  methods: {
    // 加载数据
    handlewdxx() {
      axios({
        method: "post",
        url: "/users/getMyId",
        data: {
          id:"",
          token:sessionStorage.getItem('token'),
        }
      }).then(res => {
        this.formwdxx.username = res.data[0].username;
        this.formwdxx.nickname = res.data[0].nickname;
        this.formwdxx.sex = res.data[0].sex;
        this.formwdxx.type = res.data[0].type;
        this.formwdxx.phone = res.data[0].phone;
        this.formwdxx.email = res.data[0].email;
        this.formwdxx.createtime = res.data[0].createtime;
        this.formwdxx.homeaddress = res.data[0].homeaddress;
        this.formwdxx.parkname = res.data[0].parkname;
        this.formwdxx.coststatus = res.data[0].coststatus;
        this.formwdxx.note = res.data[0].note;
        this.formwdxx.icon = res.data[0].icon;
      });
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
  },
  mounted() {
    this.handlewdxx();
  }
};
</script>
<style lang="scss" scoped>
.message::v-deep{
  .el-form{
    display: flex;
    flex-wrap: wrap;
    .el-form-item{
      width: 48%;
      margin-right: 2%;
      height: 50px;
    }
    .el-form-item:nth-child(11){
      width: 98%;
      margin-right: 2%;
    }
  }
  .tx{
    margin-top: 20px;
    .el-form{
      padding: 20px;
      margin-top: 10px;
      margin-bottom: 5px;
      background: #fff;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
      .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
      }
      .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
      }
      .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
      }
      .avatar {
        width: 178px;
        height: 178px;
        display: block;
      }
    }
  }
}
</style>