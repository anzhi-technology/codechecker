<template>
  <div id="app">
    <a-locale-provider :locale="locale">
      <router-view style="height:100%"/>
    </a-locale-provider>
  </div>
</template>


<script>
import zhCN from "ant-design-vue/lib/locale-provider/zh_CN"
import enUS from "ant-design-vue/lib/locale-provider/en_US"

export default {
  name: 'App',
  data() {
    return {
      locale: zhCN
    }
  },
  watch: {
    "$route.query.locale": function(val) {
      this.locale = val === "enUS" ? enUS : zhCN;
    }
  }
};
</script>

<style lang="less" type="text/less">
  #app {
    height: 100%;
  }
</style>
