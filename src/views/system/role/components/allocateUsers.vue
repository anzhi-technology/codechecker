<template>
  <div>
    <a-row>
      <a-col :span="24">
        <a-card title="分配用户" :bordered="false" style="height:100%">
          <div slot="extra">
            <a-button type="primary" @click="addUnAllocatedUsers">添加用户</a-button>
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
                         :rowKey="record => record.userId">
                  <!--用户状态-->
                  <span slot="status" slot-scope="text, record">
                    <template v-for="item in userStatusDicts">
                      <a-tag :color="record.status === '0' ? 'blue' : 'red'" v-if="item.dictValue === record.status" :key="item.dictCode">
                        {{item.dictLabel}}
                      </a-tag>
                    </template>
                  </span>
                  <!--操作列-->
                  <span slot="action" slot-scope="text, record">
                    <a-divider type="vertical"/>
                    <a-popconfirm v-if="dataSource.length" title="确定取消授权?" @confirm="() => cancelRoleUser(record.userId)" okText="确定" cancelText="取消">
                      <a-button size="small" style="background-color: #DC6068; color: #fff" icon="user-delete"
                                title="取消授权">
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
    <div class="add-unAllocated-users">
      <authUser :authUserVisible="authUserVisible"
                @changeDataVisible="changeDataVisible($event)"
                :unallocatedUserData="unallocatedUserData"
                @refreshTable="getData"
      />
    </div>
  </div>
</template>

<script>
import {getRoleUsers, getNoRoleUsers, cancelRoleUsers} from "@/api/system/role";
import TopTools from "@/components/Table/TopTools";
import {getColumn,filterData} from "@/utils/myUtils";
import initDict from "@/mixins/initDict";
import authUser from "@/views/system/role/components/form/authUser"

export default {
  name: "allocateUsers",
  mixins: [initDict],
  components: {
    TopTools,
    authUser
  },
  data() {
    return {
      loading: false,
      authUserVisible: false,
      unallocatedUserData: [],
      //columns:[],
      dataSource: [],
      tHeader: [
        "登录名称",
        "用户名称",
        "邮箱",
        "手机",
        "用户状态",
        "创建时间"
      ],
      filterVal: [
        "loginName",
        "userName",
        "email",
        "phonenumber",
        "status",
        "createTime"
      ],
      downLoadTitle: '',
      pagination: {
        pageSize: 10
      },
      searchCondition: "",
    };
  },
  computed: {
    columns() {
      const columns = [
        getColumn("登录名称", "loginName", (a, b) => a.loginName.localeCompare(b.loginName)),
        getColumn("用户名称", "userName", (a, b) => a.userName.localeCompare(b.userName)),
        getColumn("邮箱", "email"),
        getColumn("手机", "phonenumber"),
        getColumn("用户状态", "status"),
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
  watch: {
    //监听相同路由下参数变化的时候，从而实现异步刷新
    '$route'(to, from) {
      //做一些路由变化的响应
      //重新获取数据
      this.getData();
    },
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
    //获取数据
    getData() {
      this.loading = true;
      const roleId = this.$route.params.parameter;
      let formData = new FormData();
      formData.append("pageSize", '9999');
      formData.append("pageNum", '1');
      formData.append("orderByColumn", 'createTime');
      formData.append("isAsc", 'desc');
      formData.append("roleId", roleId);
      getRoleUsers(formData).then(res => {
        if (res.code === 0) {
          this.loading = false;
          this.dataSource = res.rows;
        }
      });
    },
    cancelRoleUser(userId) {
      const roleId = this.$route.params.parameter;
      let formData = new FormData();
      formData.append("roleId", roleId);
      formData.append("userId", userId);
      cancelRoleUsers(formData).then(res => {
        if (res.code === 0) {
          this.getData();
          this.$message.success(res.msg)
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    /*改变data-permission modal的可见*/
    changeDataVisible(visible) {
      this.authUserVisible = visible
    },
    /*打开添加用户的modal*/
    addUnAllocatedUsers() {
      this.changeDataVisible(true);
      const roleId = this.$route.params.parameter;
      let formData = new FormData();
      formData.append("pageSize", '9999');
      formData.append("pageNum", '1');
      formData.append("orderByColumn", 'createTime');
      formData.append("isAsc", 'desc');
      formData.append("roleId", roleId);
      getNoRoleUsers(formData).then(res => {
        if (res.code === 0) {
          this.unallocatedUserData = res.rows;
        }
      });
    }
  }
};
</script>

<style lang="less" type="text/less" scoped>

</style>
