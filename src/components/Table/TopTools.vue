<template>
  <div class="tableTools">
    <a-row>
      <a-col :span="24">
        <!--<a-button type="primary" style="height:29px" @click="add">新增</a-button>-->
        <slot></slot>
        <div class="right-tool">
          <a-input placeholder="请输入关键字" style="width: 200px" v-model="searchCondition"/>&nbsp;
          <a-button type="primary" style="height:29px" @click="exportData">导出数据</a-button>
          <br/>&nbsp;
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>

export default {
  name: "topTools",
  props: {
    dataSource: {
      type: Array,
      required: true
    },
    tHeader: {
      type: Array,
      required: true
    },
    filterVal: {
      type: Array,
      required: true
    },
    downLoadTitle: {
      type: String,
      required: true
    },
  },
  data() {
    return {
      searchCondition: null,
    }
  },
  watch: {
    'searchCondition': function() {
      this.$emit("getSearchCondition", this.searchCondition)
    }
  },
  methods: {
    //导出报告
    exportData() {
        //this.downloadLoading = true;
        import("@/vendor/Export2Excel").then(excel => {
          const tHeader = this.tHeader;
          const filterVal = this.filterVal;
          const list = this.dataSource;
          const data = this.formatJson(filterVal, list);
          excel.export_json_to_excel(tHeader, data, this.downLoadTitle);
          //this.downloadLoading = false
        });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    }
  }
}
</script>

<style lang="less" type="text/less" scoped>
  .tableTools {
    .right-tool {
      float: right;
    }
  }
</style>
