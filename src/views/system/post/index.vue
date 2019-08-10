<template>
  <div>
    <a-row>
      <a-col :span="24">
        <a-card title="岗位管理" :bordered="false" style="height:100%">
          <div slot="extra">
            <a-button type="primary" @click="updatePost()">添加岗位</a-button>
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
                         :rowKey="record => record.postId">

                  <span slot="status" slot-scope="text, record">
                    <template v-for="item in postStatusDicts">
                      <a-tag :color="record.status === '0' ? 'blue' : 'red'" v-if="item.dictValue === record.status" :key="item.dictCode">{{item.dictLabel}}</a-tag>
                    </template>
                  </span>

                  <!--操作列-->
                  <span slot="action" slot-scope="text, record">
                    <a-button size="small" type="primary" icon="edit" title="修改"
                              @click="updatePost(record)"></a-button>
                    <a-divider type="vertical"/>

                    <a-popconfirm v-if="dataSource.length" title="确定删除?" @confirm="() => deletePost(record.postId)" okText="确定" cancelText="取消">
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
    <div class="post-form">
      <aForm :postStatusDicts="postStatusDicts"
             :isAdd=isAdd
             :visible="visible"
             :updateRecord="updateRecord"
             @changeVisible="changeVisible($event)"
             @refreshTable="getData"/>
    </div>
  </div>
</template>

<script>
import {getPostList, deletePost} from "@/api/system/post";
import initDict from "@/mixins/initDict";
import TopTools from "@/components/Table/TopTools";
import aForm from "./components/form";
import {filterData, getColumn} from "@/utils/myUtils";

export default {
  name: "postManagement",
  components: {TopTools,aForm},
  mixins: [initDict],
  data() {
    return {
      isAdd: true,
      visible: false,
      loading: false,
      updateRecord: null,
      dataSource: [],
      tHeader: ["岗位编号", "岗位编码", "岗位名称", "显示顺序", "状态","创建时间",],
      filterVal: ["postId", "postCode", "postName", "postSort","status", "createTime"],
      downLoadTitle: '岗位列表',
      pagination: {pageSize: 10},
      searchCondition: "",

    };
  },
  computed: {
    columns() {
      const columns = [
        getColumn("岗位编号","postId", (a, b) => a.postId - b.postId),
        getColumn("岗位编码","postCode", (a, b) => a.postCode.localeCompare(b.postCode)),
        getColumn("岗位名称","postName", (a, b) => a.postName.localeCompare(b.postName)),
        getColumn("显示顺序","postSort", (a, b) => a.postSort - b.postSort),
        getColumn("状态","status", (a, b) => a.status - b.status),
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
    updatePost(record) {
      if (record) {
        this.isAdd = false;
        this.updateRecord = record;
      } else {
        this.isAdd = true;
        this.updateRecord = null;
      }
      this.changeVisible(true);
    },
    deletePost(id) {
      let formData = new FormData();
      formData.append("ids", id);
      deletePost(formData).then(value => {
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
      getPostList().then(res => {
        if (res.code === 0) {
          this.loading = false;
          this.dataSource = res.rows;
        }
      });
    },
  }
};
</script>

<style lang="less" type="text/less" scoped>

</style>
