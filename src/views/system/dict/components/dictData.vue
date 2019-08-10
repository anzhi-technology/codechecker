<template>
  <div>
    <a-row>
      <a-col :span="24">
        <a-card title="字典数据" :bordered="false" style="height:100%">
          <div slot="extra">
            <a-button type="primary" size="small" @click="updateDictData()">添加</a-button>
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
                         :rowKey="record => record.dictCode">
                  <span slot="status" slot-scope="text, record">
                    <template v-for="item in statusDicts">
                      <a-tag :color="record.status === '0' ? 'blue' : 'red'" v-if="item.dictValue === record.status" :key="item.dictCode">{{item.dictLabel}}</a-tag>
                    </template>
                  </span>
                  <!--操作列-->
                  <span slot="action" slot-scope="text, record">
                    <a-button size="small" type="primary" icon="edit" title="修改" @click="updateDictData(record)"></a-button>
                    <a-divider type="vertical"/>
                    <a-popconfirm v-if="dataSource.length" title="确定删除?" @confirm="() => deleteDictData(record.dictCode)" okText="确定" cancelText="取消">
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
    <div class="dictData-form">
      <dictDataForm :statusDicts="statusDicts"
                    :configStatusDicts="configStatusDicts"
                    :defaultDictType="defaultDictType"
                    :isAdd=isAdd
                    :visible="visible"
                    :updateRecord="updateRecord"
                    @changeVisible="changeVisible($event)"
                    @refreshTable="getData"/>
    </div>
  </div>
</template>

<script>
  import {getDictData, removeDictData} from "@/api/system/dict";
  import TopTools from "@/components/Table/TopTools";
  import {filterData, getColumn} from "@/utils/myUtils";
  import initDict from "@/mixins/initDict";
  import dictDataForm from "./dictData-form"

  export default {
    name: "dictDataManagement",
    mixins: [initDict],
    components: {
      TopTools,
      dictDataForm
    },
    data() {
      return {
        isAdd: true,
        visible: false,
        loading: false,
        updateRecord: null,
        defaultDictType: this.$route.params.parameter,
        dataSource: [],
        tHeader: ["字典编码", "字典标签", "字典键值", "字典排序", "状态", "备注", "创建时间",],
        filterVal: ["dictCode", "dictLabel", "dictValue", "dictSort", "status", "remark", "createTime"],
        downLoadTitle: '字典数据列表',
        pagination: {pageSize: 10},
        searchCondition: "",
      };
    },
    beforeCreate() {
      this.form = this.$form.createForm(this);
    },
    computed: {
      columns() {
        const columns = [
          getColumn("字典编码", "dictCode", (a, b) => a.dictCode - b.dictCode),
          getColumn("字典标签", "dictLabel", (a, b) => a.dictLabel.localeCompare(b.dictLabel)),
          getColumn("字典键值", "dictValue", (a, b) => a.dictValue.localeCompare(b.dictValue)),
          getColumn("字典排序", "dictSort", (a, b) => a.dictSort - b.dictSort),
          getColumn("状态", "status", (a, b) => a.status - b.status),
          getColumn("备注", "remark"),
          getColumn("创建时间", "createTime", (a, b) => a.createTime < b.createTime ? 1 : -1),
          {title: "操作", key: "action", scopedSlots: {customRender: "action"}}
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
      //获取数据
      getData() {
        this.loading = true;
        let formData = new FormData();
        formData.append("dictType", this.$route.params.parameter);
        getDictData(formData).then(res => {
          if (res.code === 0) {
            this.loading = false;
            this.dataSource = res.rows;
          }
        });
      },
      changeVisible(visible) {
        this.visible = visible
      },
      updateDictData(record) {
        if (record) {
          this.isAdd = false;
          this.updateRecord = record;
        } else {
          this.isAdd = true;
          this.updateRecord = null;
        }
        this.changeVisible(true);
      },
      //删除用户
      deleteDictData(dictCode) {
        let formData = new FormData();
        formData.append("ids", dictCode);
        removeDictData(formData).then(res => {
          if (res.code === 0) {
            this.$message.success(res.msg);
            this.getData();
          } else {
            this.$message.error(res.msg);
          }
        });
      },
    }
  };
</script>

<style lang="less" type="text/less" scoped>

</style>
