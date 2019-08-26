<template>
  <div>
    <a-card title="基本信息">
      <a-tag slot="extra" color="#108ee9">检测时间：{{listData.lastUpdate}}</a-tag>
      <a-list size="small">
        <a-list-item >
          <a-list-item-meta >
            <span slot="title"><a-tag color="#108ee9">1</a-tag> 项目名称：</span>
          </a-list-item-meta>
          <div>{{listData.name}}</div>
        </a-list-item>
        <a-list-item >
          <a-list-item-meta >
            <span slot="title"><a-tag color="#108ee9">2</a-tag> 开发语言：</span>
          </a-list-item-meta>
          <div>{{listData.lang}}</div>
        </a-list-item>
        <a-list-item >
          <a-list-item-meta >
            <span slot="title"><a-tag color="#108ee9">3</a-tag> 工程类型：</span>
          </a-list-item-meta>
          <div>{{listData.projectType}}</div>
        </a-list-item>
        <a-list-item >
          <a-list-item-meta >
            <span slot="title"><a-tag color="#108ee9">4</a-tag> 创建时间：</span>
          </a-list-item-meta>
          <div>{{listData.createDate}}</div>
        </a-list-item>
        <a-list-item >
          <a-list-item-meta >
            <span slot="title"><a-tag color="#108ee9">5</a-tag> 检测状态：</span>
          </a-list-item-meta>
          <div>{{listData.status}}</div>
        </a-list-item>
      </a-list>
    </a-card>
  </div>
</template>

<script>
  import {getSingleProject} from "@/api/sourceCode/list";
  import {timeToDateString} from "@/utils/myUtils"
  export default {
    name: "projectInformation",
    data() {
      return {
        listData: {}
      }
    },
    watch: {
      //监听相同路由下参数变化的时候，从而实现异步刷新
      '$route'(to, from) {
        //做一些路由变化的响应
        //重新获取数据
        this.getData();
      },
    },
    beforeMount() {
      this.$nextTick(() => {
        this.getData();
      });
    },
    methods: {
      /*获取信息*/
      getData() {
        let sid = this.$route.params.parameter;
        getSingleProject(sid).then(res => {
          let data = res.data;
          let newData = {};
          newData.name = data.name;
          newData.lang = data.lang;
          newData.projectType = data.isMaven === 1 ? "Maven工程":"普通工程";
          newData.createDate = timeToDateString(data.createDate);
          newData.status = data.status;
          newData.lastUpdate = timeToDateString(data.lastUpdate);
          this.listData = newData;
        })
      }
    }
  }
</script>

<style scoped>

</style>