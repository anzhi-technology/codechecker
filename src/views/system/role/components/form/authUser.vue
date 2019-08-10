<template>
  <div>
    <a-modal title="选择用户"
             :visible="authUserVisible"
             @ok="handleOk"
             okText="确定"
             :confirmLoading="confirmLoading"
             @cancel="handleCancel"
             cancelText="取消"
             width="70%"
             :centered=true
             style="left: 100px;">
      <div class="tableContent">
        <a-row>
          <a-col :span="24">
            <div class="right-tool">
              <a-input placeholder="请输入关键字" style="width: 200px" v-model="searchCondition" >
                <a-icon slot="suffix" type="search" />
              </a-input>&nbsp;
              <br/>&nbsp;
            </div>
          </a-col>
          <a-col :span="24">
            <a-table :rowSelection="rowSelection" :columns="columns" :dataSource="TableData"  :loading="loading"
                     :rowKey="record => record.userId">
              <!--用户状态-->
              <span slot="status" slot-scope="text, record">
                    <template v-for="item in userStatusDicts">
                      <a-tag :color="record.status === '0' ? 'blue' : 'red'" v-if="item.dictValue === record.status" :key="item.dictCode">
                        {{item.dictLabel}}
                      </a-tag>
                    </template>
                  </span>
            </a-table>
          </a-col>
        </a-row>
      </div>
    </a-modal>
  </div>
</template>

<script>
  import {addNoRoleUsers} from "@/api/system/role";
  import {getColumn,filterData} from "@/utils/myUtils";
  import initDict from "@/mixins/initDict";
  export default {
    name: "authUser",
    mixins: [initDict],
    props: {
      authUserVisible: {
        type: Boolean,
        required: true
      },
      unallocatedUserData: {
        type: Array,
        required: true
      }
    },
    data() {
      return {
        confirmLoading: false,
        loading: false,
        dataSource: [],
        searchCondition: "",
        userIds:''
      }
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
        ];
        return columns;
      },
      TableData() {
        return filterData(this.searchCondition, this.unallocatedUserData);
      },
      rowSelection() {
        const {selectedRowKeys} = this;
        return {
          onChange: (selectedRowKeys) => {
            this.userIds = selectedRowKeys;
          },
          getCheckboxProps: record => ({
            props: {
              disabled: record.name === 'Disabled User', // Column configuration not to be checked
              name: record.name,
            }
          }),
        }
      }
    },
    created() {
      this.$nextTick(() => {
        //this.getData();
        this.getDict();
      });
    },
    methods: {
      changeDataVisible(visible) {
        this.$emit("changeDataVisible", visible)
      },
      refreshTable() {
        this.$emit("refreshTable")
      },
      /*点击确定*/
      handleOk() {
        this.confirmLoading = true;
        const roleId = this.$route.params.parameter;
        let formData = new FormData();
        formData.append("roleId", roleId);
        formData.append("userIds", this.userIds);
        addNoRoleUsers(formData).then(res => {
          if (res.code === 0) {
            this.confirmLoading = false;
            this.changeDataVisible(false);
            this.refreshTable();
            this.$message.success(res.msg)
          }else{
            this.$message.error(res.msg)
          }
        });
      },
      /*点击取消*/
      handleCancel() {
        this.changeDataVisible(false);
      },
    }
  }
</script>

<style lang="less" type="text/less" scoped>
  .tableContent {
    .right-tool {
      float: right;
    }
  }
</style>