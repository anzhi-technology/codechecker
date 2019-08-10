<template>
  <div>
    <a-row>
      <a-col :span="24">
        <a-card title="字典管理" :bordered="false" style="height:100%">
          <div slot="extra">
            <a-button type="primary" size="small" @click="updateDict()">添加字典</a-button>
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
                         :rowKey="record => record.dictId">
                  <!--字典类型-->
                  <span slot="dictType" slot-scope="text, record">
                     <router-link :to="{ path: '/system/dictData/' + record.dictType }">{{text}}</router-link>
                  </span>
                  <!--状态-->
                  <span slot="status" slot-scope="text, record">
                    <template v-for="item in statusDicts">
                      <a-tag :color="record.status === '0' ? 'blue' : 'red'" v-if="item.dictValue === record.status" :key="item.dictCode">{{item.dictLabel}}</a-tag>
                    </template>
                  </span>
                  <!--操作列-->
                  <span slot="action" slot-scope="text, record">
                    <a-button size="small" type="primary" icon="edit" title="修改" @click="updateDict(record)"></a-button>
                    <a-divider type="vertical"/>
                     <router-link :to="{ path: '/system/dictData/' + record.dictType }">
                    <a-button size="small" style="background-color: #5EC3C6; color: #fff" icon="bars" title="列表">
                    </a-button>
                     </router-link>
                    <a-divider type="vertical"/>
                    <a-popconfirm v-if="dataSource.length" title="确定删除?" @confirm="() => deleteDict(record.dictId)" okText="确定" cancelText="取消">
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
    <div class="dict-form">
      <dictForm :statusDicts="statusDicts"
             :isAdd=isAdd
             :visible="visible"
             :updateRecord="updateRecord"
             @changeVisible="changeVisible($event)"
             @refreshTable="getData"/>
    </div>
  </div>
</template>

<script>
  import {getDicts,removeDict} from "@/api/system/dict";
  import TopTools from "@/components/Table/TopTools";
  import {filterData, getColumn} from "@/utils/myUtils";
  import initDict from "@/mixins/initDict";
  import dictForm from "./components/dict-form"
  export default {
    name: "dictManagement",
    mixins: [initDict],
    components: {
      TopTools,
      dictForm
    },
    data() {
      return {
        isAdd: true,
        visible: false,
        loading: false,
        updateRecord: null,
        dataSource: [],
        tHeader: ["字典主键", "字典名称", "字典类型", "状态", "备注", "创建时间",],
        filterVal: ["dictId", "dictName", "dictType", "status", "remark", "createTime"],
        downLoadTitle: '字典列表',
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
          getColumn("字典主键", "dictId", (a, b) => a.dictId - b.dictId),
          getColumn("字典名称", "dictName", (a, b) => a.dictName.localeCompare(b.dictName)),
          getColumn("字典类型", "dictType", (a, b) => a.dictType.localeCompare(b.dictType)),
          getColumn("状态", "status", (a, b) => a.status - b.status),
          getColumn("备注", "remark"),
          getColumn("创建时间", "createTime", (a, b) => a.createTime < b.createTime ? 1 : -1),
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
      //获取数据
      getData() {
        this.loading = true;
        getDicts().then(res => {
          if (res.code === 0) {
            this.loading = false;
            this.dataSource = res.rows;
          }
        });
      },
      changeVisible(visible) {
        this.visible = visible
      },
      updateDict(record) {
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
      deleteDict(dictId) {
        let formData = new FormData();
        formData.append("ids", dictId);
        removeDict(formData).then(res => {
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
