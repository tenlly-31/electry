<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像 -->
      <div class="avator_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- 登录表单 -->
      <el-form
        class="loginForm"
        :model="loginForm"
        :rules="loginRules"
        ref="loginFormRef"
      >
        <!-- 输入框 -->
        <el-form-item prop="username">
          <el-input
            type="text"
            prefix-icon="iconfont icon-yonghu"
            v-model="loginForm.username"
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            prefix-icon="iconfont icon-mima"
            v-model="loginForm.password"
          >
          </el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="loginBtn">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLogin">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        username: "admin",
        password: "123456",
      },
      // 表单验证规则
      loginRules: {
        username: [
          { required: true, message: "请输入用户名称", trigger: "change" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "change",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "change" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "change",
          },
        ],
      },
    };
  },
  methods: {
    // 重置表单
    resetLogin(){
      this.$refs.loginFormRef.resetFields()
    },
    login(){
      // 表单预验证
      this.$refs.loginFormRef.validate(async valid=>{
        if(!valid) return
        // 数据请求
        const {data: res} = await this.$http.post('login',this.loginForm)
        if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        // 保存token到sessionStorage(缓存)中
        window.sessionStorage.setItem('token', res.data.token)
        // 跳转页面
        this.$router.push('/home')
      })
    }
  }
};
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .avator_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    // overflow: hidden;
    padding: 10px;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
  .loginForm {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 40px;
    box-sizing: border-box;
  }
  .loginBtn {
    display: flex;
    justify-content: flex-end;
  }
}
</style>>