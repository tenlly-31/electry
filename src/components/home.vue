<template>
  <el-container class="home-container">
    <!-- 头部 -->
    <el-header>
      <div class="logo">
        <img src="../assets/logo.png" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button @click="exist">退出</el-button>
    </el-header>
    <!-- 主体 -->
    <el-container>
      <el-aside :width="isCollapse?'64px':'200px'">
        <div class="toggle-button" @click="toggle">|||</div>
        <!-- 侧边栏菜单 -->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="$route.path"
        >
          <el-submenu
            v-for="info in menuList"
            :key="info.id"
            :index="info.id + ''"
          >
            <!-- 一级菜单模板区 -->
            <template slot="title">
              <i :class="'iconfont ' + icon[info.id]"></i>
              <span>{{ info.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/'+child.path"
              v-for="child in info.children"
              :key="child.id"
            >
              <i class="el-icon-menu"></i>
              <span slot="title">{{ child.authName }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <!-- 路由 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menuList: [],
      icon: {
        '125': 'icon-yonghuguanli_huaban',
        '103': 'icon-quanxian',
        '101': 'icon-shangpin',
        '102': 'icon-31dingdan',
        '145': 'icon-shuju',
      },
      isCollapse: false,
    };
  },
  // 生命周期函数
  created() {
    this.getMenuList();
  },
  methods: {
    exist(){
      this.$router.push('login')
    },
    logout() {
      // 清除token缓存
      window.sessionStorage.clear();
      //   跳转
      this.$router.push("/login");
    },
    // 获取菜单
    async getMenuList() {
      const { data: res } = await this.$http.get("menus");
      if (res.meta.status !== 200) return this.$message.error(res.meta.message);
      this.menuList = res.data;
    },
    // 切换菜单的折叠与展开
    toggle(){
      this.isCollapse = !this.isCollapse
    }
  },
};
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  // 居中对齐
  align-items: center;
  color: white;
  font-size: 20px;
  padding-left: 0px;
  .logo {
    display: flex;
    align-items: center;
    img {
      height: 50px;
    }
    span {
      margin-left: 15px;
    }
  }
  .el-button{
    opacity: .7;
  }
}
.el-aside {
  background-color: #333744;
  transition: width 0.5s;
  .iconfont{
    margin-right: 10px;
    font-size: 20px;
  }
  .el-menu{
    border-right: 0px;
  }
  .toggle-button{
    background-color: #4a5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
}
.el-main {
  background-color: #eaedf1;
}
</style>