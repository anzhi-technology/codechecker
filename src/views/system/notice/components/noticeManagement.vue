<template>
  <div>
    <a-row>
      <a-col :span="24">
        <a-card title="公告管理" :bordered="false" style="height:100%">
          <div slot="extra">
            <a-button type="primary" @click="updateNotice()">添加公告</a-button>
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
                         :rowKey="record => record.noticeId">

                  <!--公告类型-->
                  <span slot="noticeType" slot-scope="text, record">
                    <template v-for="item in noticeDict">
                      <a-tag :color="record.noticeType === '1' ? '#87d068' : '#108ee9'" v-if="item.dictValue === record.noticeType" :key="item.dictCode">{{item.dictLabel}}</a-tag>
                    </template>
                  </span>
                  <!--状态-->
                  <span slot="status" slot-scope="text, record">
                    <template v-for="item in noticeStatusDict">
                      <a-tag :color="record.status === '0' ? '#2db7f5' : '#f50'" v-if="item.dictValue === record.status" :key="item.dictCode">{{item.dictLabel}}</a-tag>
                    </template>
                  </span>
                  <!--公告标题-->
                  <span slot="noticeTitle" slot-scope="text, record">
                    <a-tooltip :title="record.noticeTitle">
                      {{record.noticeTitle|lengthLimit}}
                    </a-tooltip>
                  </span>

                  <!--操作列-->
                  <span slot="action" slot-scope="text, record">
                    <a-button size="small" type="primary" icon="edit" title="修改"
                              @click="updateNotice(record)"></a-button>
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
    <div class="notice-form">
      <aForm :noticeDict="noticeDict"
             :noticeStatusDict="noticeStatusDict"
             :isAdd=isAdd
             :visible="visible"
             :updateRecord="updateRecord"
             @changeVisible="changeVisible($event)"
             @refreshTable="getData"/>
    </div>
  </div>
</template>

<script>
  import {getNoticeList} from "@/api/system/notice";
  import initDict from "@/mixins/initDict";
  import TopTools from "@/components/Table/TopTools";
  import {getColumn, filterData} from "@/utils/myUtils";
  import aForm from "./form";

  export default {
    name: "userManagement",
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
        //columns:[],
        dataSource: [],
        tHeader: ["序号", "公告标题", "公告类型", "状态", "创建者", "创建时间"],
        filterVal: ["noticeId", "noticeTitle", "noticeType", "status", "createBy", "createTime"],
        downLoadTitle: '公告列表',
        pagination: {
          pageSize: 10
        },
        searchCondition: "",
      };
    },
    computed: {
      columns() {
        const columns = [
          getColumn("序号", "noticeId", (a, b) => a.noticeId - b.noticeId),
          getColumn("公告标题", "noticeTitle", (a, b) => a.noticeTitle.localeCompare(b.noticeTitle)),
          getColumn("公告类型", "noticeType"),
          getColumn("状态", "status"),
          getColumn("创建者", "createBy", (a, b) => a.dept.createBy.localeCompare(b.dept.createBy)),
          getColumn("创建时间", "createTime", (a, b) => (a.createTime < b.createTime ? 1 : -1)),
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
        this.getData();
        this.getDict();
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
      updateNotice(record) {
        if (record) {
          this.isAdd = false;
          this.updateRecord = record;
        } else {
          this.isAdd = true;
          this.updateRecord = null;
        }
        this.changeVisible(true);
      },
      //获取数据
      getData() {
        this.loading = true;
        getNoticeList().then(res => {
          if (res.code === 0) {
            this.loading = false;
            this.dataSource = res.rows;
          }
        });
      },
    },
    filters: {
      lengthLimit(value) {
        if (value.length > 20) {
          return value.substr(0, 20) + "..."
        } else {
          return value
        }
      }
    }
  };
</script>

<style lang="less" type="text/less" scoped>

</style>
