<template>
  <div class="nav-theme-dark nav-layout-left">
    <a-layout style="min-height: 100vh">
      <a-layout-sider theme="dark" :trigger="null" collapsible breakpoint="lg" v-model="collapsed" width="256px">
        <div class="logo">
          <img width="32" src="../assets/images/code-logo.png" />
          <h1>源码检测审计系统</h1>
        </div>
        <SiderMenu theme="dark" />
      </a-layout-sider>
      <a-layout>
        <!-- layout header -->
        <a-layout-header style="background: #fff; padding: 0;border-bottom:1px solid #f0f0f0">
          <a-icon
            class="trigger"
            :type="collapsed ? 'menu-unfold' : 'menu-fold'"
            @click="()=> collapsed = !collapsed"
          />
          <Header />
        </a-layout-header>

        <!-- layout content -->
        <multi-tab></multi-tab>
        <a-layout-content :style="{ margin: '24px 16px 0', overflow: 'initial'}">
          <router-view></router-view>
        </a-layout-content>

        <!-- layout footer -->
        <a-layout-footer style="text-align: center">
          <Footer/>
        </a-layout-footer>
      </a-layout>
    </a-layout>
  </div>
</template>

<script>
import Header from './Header';
import Footer from './Footer';
import SiderMenu from './SiderMenu';
import MultiTab from './MultiTab';
export default {
  components: {
    Header,
    Footer,
    SiderMenu,
    MultiTab
  },
  data() {
    return {
      collapsed: false,
    };
  }
};
</script>

<style lang="less" type="text/less" scoped>
  .trigger {
    padding: 0 20px;
    line-height: 64px;
    font-size: 20px;
    &:hover {
      background: #eeeeee;
    }
  }
  .logo {
    position: relative;
    height: 64px;
    padding-left: 24px;
    overflow: hidden;
    line-height: 64px;
    background: #002140;
    svg {
      width: 32px;
      height: 32px;
      display: inline-block;
      vertical-align: middle;
    }
    h1 {
      display: inline-block;
      margin: 0 0 0 12px;
      font-size: 18px;
      font-family: Avenir, "Helvetica Neue", Arial, Helvetica, sans-serif;
      font-weight: 600;
      vertical-align: middle;
    }
  }
  .nav-theme-dark {
    /deep/ .logo {
      h1 {
        color: #ffffff;
      }
    }
  }
</style>
