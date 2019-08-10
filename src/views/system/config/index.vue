<template>
  <div>
    <a-row>
      <a-col :span="24">
        <a-card title="参数设置" :bordered="false" style="height:100%">
          <div slot="extra">
            <a-button type="primary" @click="updateConfig()">添加</a-button>
          </div>
          <!--顶部工具栏-->
          <div class="tableContent">
            <a-row>
              <a-col :span="24">
                <TopTools @getSearchCondition="getSearchVal" :dataSource="dataSource" :tHeader="tHeader" :filterVal="filterVal"
                          :pagination="pagination" :downLoadTitle="downLoadTitle"/>
              </a-col>
              <a-col :span="24">
                <a-table :columns="columns" :dataSource="TableData" :pagination="pagination" :loading="loading"
                         :rowKey="record => record.configId">

                  <span slot="configName" slot-scope="text, record">
                    <a-tooltip :title="record.configName" >
                      {{record.configName|lengthLimit}}
                    </a-tooltip>
                  </span>

                  <span slot="configType" slot-scope="text, record">
                    <template v-for="item in configStatusDicts">
                      <a-tag color='blue' v-if="item.dictValue === record.configType" :key="item.dictCode">{{item.dictLabel}}</a-tag>
                    </template>
                  </span>

                  <span slot="remark" slot-scope="text, record">
                    <a-tooltip :title="record.remark" >
                      {{record.remark|lengthLimit}}
                    </a-tooltip>
                  </span>

                  <!--操作列-->
                  <span slot="action" slot-scope="text, record">
                    <a-button size="small" type="primary" icon="edit" title="修改"
                              @click="updateConfig(record)"></a-button>
                    <a-divider type="vertical"/>

                    <a-popconfirm v-if="dataSource.length" title="确定删除?" @confirm="() => deleteConfig(record.configId)" okText="确定" cancelText="取消">
                      <a-button size="small" style="background-color: #DC6068; color: #fff" icon="delete" title="删除">
                      </a-button>
                    </a-popconfirm>

                  </span>
                </a-table>
              </a-col>
            </a-row>
          </div>
        </a-card>
      </a-col>
    </a-row>
    <div class="config-form">
      <aForm :configStatusDicts="configStatusDicts"
             :isAdd=isAdd
             :visible="visible"
             :updateRecord="updateRecord"
             @changeVisible="changeVisible($event)"
             @refreshTable="getData"/>
    </div>
  </div>
</template>

<script>
import {getConfigList, deleteConfig} from "@/api/system/config";
import initDict from "@/mixins/initDict";
import TopTools from "@/components/Table/TopTools";
import aForm from "./components/form";
import {filterData, getColumn} from "@/utils/myUtils";

export default {
  name: "configManagement",
  mixins: [initDict],
  components: {
    TopTools,
    aForm
  },
  data() {
    return {
      isAdd: true,
      visible: false,
      loading: false,
      updateRecord: null,
      dataSource: [],
      tHeader: ["参数主键", "参数名称", "参数键名", "参数键值", "系统内置","备注", "创建时间",],
      filterVal: ["configId", "configName", "configKey", "configValue", "configType","remark", "createTime"],
      downLoadTitle: '参数列表',
      pagination: {pageSize: 10},
      searchCondition: "",

    };
  },
  computed: {
    columns() {
      const columns = [
        getColumn("参数主键","configId", (a, b) => a.configId - b.configId),
        getColumn("参数名称","configName", (a, b) => a.configName.localeCompare(b.configName)),
        getColumn("参数键名","configKey", (a, b) => a.configKey.localeCompare(b.configKey)),
        getColumn("参数键值","configValue", (a, b) => a.configValue.localeCompare(b.configValue)),
        getColumn("系统内置","configType", (a, b) => a.configType.localeCompare(b.configType)),
        getColumn("备注","remark", (a, b) => a.remark.localeCompare(b.remark)),
        getColumn("创建时间","createTime", (a, b) => (a.createTime < b.createTime ? 1 : -1)),
        {
          title: "操作",
          key: "action",
          scopedSlots: {customRender: "action"}
        }
      ];
      return columns;
    },
    TableData() {
      return filterData(this.searchCondition, this.dataSource);
    }
  },
  created() {
    this.$nextTick(() => {
      this.getDict();
      this.getData();
    });
  },
  methods: {
    //子组件传过来的值
    getSearchVal(msg) {
      this.searchCondition = msg;
    },
    changeVisible(visible) {
      this.visible = visible
    },
    updateConfig(record) {
      if (record) {
        this.isAdd = false;
        this.updateRecord = record;
      } else {
        this.isAdd = true;
        this.updateRecord = null;
      }
      this.changeVisible(true);
    },
    deleteConfig(id) {
      let formData = new FormData();
      formData.append("ids", id);
      deleteConfig(formData).then(value => {
        if (value.code === 0) {
          this.$message.success(value.msg);
          this.getData();
        } else {
          this.$message.error(value.msg);
        }
      })
    },
    //获取数据
    getData() {
      this.loading = true;
      getConfigList().then(res => {
        if (res.code === 0) {
          this.loading = false;
          this.dataSource = res.rows;
        }
      });
    },
  },
  filters: {
    lengthLimit(value){
      if (value.length>8){
        return value.substr(0,8)+"..."
      } else {
        return value
      }
    }
  }
};
</script>

<style lang="less" type="text/less" scoped>

</style>
