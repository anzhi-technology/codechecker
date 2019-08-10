<template>
  <div>
    <a-row>
      <a-col :span="24">
        <a-card title="角色管理" :bordered="false" style="height:100%">
          <div slot="extra">
            <a-button type="primary" size="small" @click="updateRole()">添加角色</a-button>
            <addOrEditForm :isAdd=isAdd
                           :visible="visible"
                           :updateRecord="updateRecord"
                           @changeVisible="changeVisible($event)"
                           @refreshTable="getData"
                           :treeData="treeData"
                           :menuCheckedKeys="menuCheckedKeys"
            />
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
                         :rowKey="record => record.roleId">
                  <span slot="status" slot-scope="text, record">
                    <a-switch v-if="record.status === '0'" defaultChecked
                              @click="changeStatus(record.status,record.roleId)"/>
                    <a-switch v-if="record.status === '1'"
                              @click="changeStatus(record.status,record.roleId)"/>
                  </span>
                  <!--操作列-->
                  <span slot="action" slot-scope="text, record">
                   <a-button size="small" type="primary" icon="edit" title="修改"
                             @click="updateRole(record)"></a-button>
                    <a-divider type="vertical"/>
                    <a-button size="small" style="background-color: #53B095; color: #fff" icon="key" title="数据权限" @click="updatePermission(record)">
                    </a-button>
                    <a-divider type="vertical"/>
                    <router-link :to="{ path: '/system/allocate-users/' + record.roleId }">
                    <a-button size="small" style="background-color: #5EC3C6; color: #fff" icon="user"
                              title="分配任务"
                    >
                    </a-button>
                      </router-link>
                      <a-divider type="vertical"/>
                    <a-popconfirm v-if="dataSource.length" title="确定删除?" @confirm="() => deleteRole(record.roleId)" okText="确定" cancelText="取消">
                      <a-button size="small" style="background-color: #DC6068; color: #fff" icon="delete"
                                title="删除">
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
    <div class="data-permission">
      <dataPermission :dataPermissionVisible="dataPermissionVisible"
                      :dataRecord="dataRecord"
                      @changeDataVisible="changeDataVisible($event)"
                      @refreshTable="getData"
                      :departmentTree="departmentTree"
      />
    </div>
  </div>
</template>

<script>
  import {getRoleList, changeRoleStatus, removeRole} from "@/api/system/role";
  import {getMenuByRoleId} from "@/api/system/menu";
  import {getDeptByRoleId} from '@/api/system/dept'
  import TopTools from "@/components/Table/TopTools";
  import {getColumn, filterData, transData, recursion} from "@/utils/myUtils";
  import addOrEditForm from "./form/addOrEdit";
  import dataPermission from "./form/dataPermission"

  export default {
    name: "roleManagement",
    data() {
      return {
        isAdd: true,
        visible: false,
        dataPermissionVisible: false,
        loading: false,
        updateRecord: null,
        dataRecord: null,
        treeData: [],
        menuCheckedKeys: [],
        departmentTree: [],
        //columns:[],
        dataSource: [],
        tHeader: ["角色编号", "角色名称", "权限字符", "显示顺序", "角色状态", "创建时间"],
        filterVal: ["roleId", "roleName", "roleKey", "roleSort", "status", "createTime"],
        downLoadTitle: '角色列表',
        pagination: {
          pageSize: 10
        },
        searchCondition: "",
      };
    },
    components: {
      TopTools,
      addOrEditForm,
      dataPermission
    },
    computed: {
      columns() {
        const columns = [
          getColumn("角色编号", "roleId", (a, b) => a.roleId - b.roleId),
          getColumn("角色名称", "roleName", (a, b) => a.roleName.localeCompare(b.roleName)),
          getColumn("权限字符", "roleKey", (a, b) => a.roleKey.localeCompare(b.roleKey)),
          getColumn("显示顺序", "roleSort", (a, b) => a.roleSort - b.roleSort),
          getColumn("角色状态", "status"),
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
    watch:{

    },
    created() {
      this.$nextTick(() => {
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
        getRoleList().then(res => {
          if (res.code === 0) {
            this.loading = false;
            this.dataSource = res.rows;
          }
        });
      },
      /*改变角色的状态*/
      changeStatus(status, roleId) {
        let newStatus = status === "0" ? "1" : "0";
        let formData = new FormData();
        formData.append("status", newStatus);
        formData.append("roleId", roleId);
        changeRoleStatus(formData).then(res => {
          if (res.code === 0) {
            if (newStatus === "1") this.$message.success('停用成功！');
            if (newStatus === "0") this.$message.success('启用成功！');
            this.getData();
          } else {
            this.$message.error(res.msg);
          }
        });
      },
      /*改变添加或修改modal的可见*/
      changeVisible(visible) {
        this.visible = visible
      },
      /*改变data-permission modal的可见*/
      changeDataVisible(visible) {
        this.dataPermissionVisible = visible
      },
      /*打开添加和修改的form表单*/
      updateRole(record) {
        if (record) {
          this.isAdd = false;
          this.updateRecord = record;
          this.updateRecord.newstatus = this.updateRecord.status === "0" ? "checked" : null;
        } else {
          this.isAdd = true;
          this.updateRecord = null;
        }
        this.menuCheckedKeys = [];
        //获取菜单树
        let roleId = record ? record.roleId : '';
        getMenuByRoleId(roleId).then(res => {
          let data = transData(res, "id", "pId");
          this.treeData = recursion(data);
          const checkedArray = res.filter(item => item.checked === true);
          let pIdArray = [];
          checkedArray.forEach( obj => pIdArray.push(obj.pId));
          let newPIdArray = Array.from(new Set(pIdArray));//去重
          checkedArray.forEach( obj => this.menuCheckedKeys.push(obj.id));
          //删除pId,返回新的数组
          for(let i = 0;i < newPIdArray.length; i++) {
            for(let j = 0; j < this.menuCheckedKeys.length; j++) {
              if(this.menuCheckedKeys[j] === newPIdArray[i]) {
                this.menuCheckedKeys.splice(j,1);
                j--;
              }
            }
          }
          this.changeVisible(true);
        });
      },

      /*打开数据权限的modal*/
      updatePermission(record) {
        this.dataRecord = record;
        //获取部门树
        getDeptByRoleId(record.roleId).then(res => {
          let data = transData(res, "id", "pId");
          this.departmentTree = recursion(data);
          this.changeDataVisible(true);
        });
      },
      /*删除记录*/
      deleteRole(roleId) {
        let formData = new FormData();
        formData.append("ids", roleId);
        removeRole(formData).then(res => {
          if (res.code === 0) {
            this.$message.success('删除成功！');
            this.getData();
          } else {
            this.$message.error('删除失败！');
          }
        });
      }
    }
  };
</script>

<style lang="less" type="text/less" scoped>

</style>
