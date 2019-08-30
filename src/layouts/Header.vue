<template>
  <div class="header-right">
    <div class="header-user-con">
      <!--<div class="welcomeText">-->
      <!--<span style="color:#A9A9A9;font-size: 13px">欢迎来到源码审计系统...</span>-->
      <!--</div>-->

      <!-- 用户头像 -->
      <a-dropdown class="user-name">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="LogOut">退出登录</a-menu-item>
        </a-menu>
        <div>
          <a-avatar style="backgroundColor:#108ee9" size="small" icon="user"/>&nbsp;
          <span style="color:#000000;font-size: 15px">{{username}}</span>
        </div>
      </a-dropdown>
    </div>
  </div>
</template>

<script>
import {getObjArr,removeObjArr} from '@/utils/auth'
import {logout} from '@/api/user'
//import fullScreen from "@/components/fullScreen/index"

export default {
  name: 'Header',
  data() {
    return {
      username:getObjArr("userName")
      //fullscreen: false
    };
  },
  // components: {
  //   fullScreen
  // },
  methods: {
    LogOut() {
      logout().then(() => {
        removeObjArr();
        // window.location.href = "/login";
        this.$router.push({path: '/login'});
      });
    }
  }
};
</script>

<style lang="less" type="text/less" scoped>
  .header {
    position: absolute;
    left: 250px;
    right: 0;
    padding-bottom: 30px;
    -webkit-transition: left 0.3s ease-in-out;
    transition: left 0.3s ease-in-out;
    background: #fff;
  }

  .header-right {
    float: right;
    padding-right: 50px;
  }

  .header-user-con {
    display: flex;
    height: 70px;
    align-items: center;
  }

  .user-name {
    margin-left: 10px;
  }

  .user-avator {
    margin-left: 20px;
  }

  .user-avator img {
    display: block;
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
</style>
