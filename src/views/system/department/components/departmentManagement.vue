<template>
  <div>
    <a-row>
      <a-col :span="24">
        <a-card title="岗位管理" :bordered="false" style="height:100%">
          <div slot="extra">
            <a-button type="primary" size="small" @click="updateDept()">添加岗位</a-button>
          </div>
          <!--顶部工具栏-->
          <div class="tableContent">
            <a-row>
              <a-col :span="24">
                <a-table :columns="columns" :dataSource="dataSource" :loading="loading" :rowKey="record => record.deptId">
                  <span slot="status" slot-scope="text, record">
                    <template v-for="item in deptStatusDicts">
                      <a-tag :color="record.status === '0' ? 'blue' : 'red'" v-if="item.dictValue === record.status" :key="item.dictCode">{{item.dictLabel}}</a-tag>
                    </template>
                  </span>
                  <!--操作列-->
                  <span slot="action" slot-scope="text, record">

                    <a-button size="small" type="primary" icon="edit" title="修改" @click="updateDept(record)"></a-button>
                    <a-divider type="vertical"/>
                    <a-button size="small" style="background-color: #5EC3C6; color: #fff" icon="plus" title="添加子部门"
                              @click="addSubDept({'parentId':record.deptId,'parentName':record.deptName})">
                    </a-button>
                    <a-divider type="vertical"/>
                    <a-popconfirm v-if="dataSource.length" title="确定删除?" @confirm="() => deleteDepartment(record.deptId)" okText="确定" cancelText="取消">
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
    <div class="department-form">
      <deptForm :isAdd=isAdd
                :deptStatusDicts="deptStatusDicts"
                :visible="visible"
                :updateRecord="updateRecord"
                @changeVisible="changeVisible($event)"
                @refreshTable="getData"
                :deptTreeData="deptTreeData"
      />
    </div>
  </div>
</template>

<script>
  import {getDepartmentList, getDepartmentTreeData, removeDepartment} from "@/api/system/dept";
  import initDict from "@/mixins/initDict";
  import {getColumn, transData, recursionMenu} from "@/utils/myUtils";
  import deptForm from "./form/form";

  export default {
    name: "departmentManagement",
    mixins: [initDict],
    components: {
      deptForm
    },
    data() {
      return {
        isAdd: true,
        visible: false,
        updateRecord: null,
        deptTreeData: [],
        loading: false,
        //columns:[],
        dataSource: [],
      };
    },
    computed: {
      columns() {
        const columns = [
          getColumn("部门名称", "deptName"),
          getColumn("排序", "orderNum"),
          getColumn("状态", "status"),
          getColumn("创建时间", "createTime"),
          {title: "操作", key: "action", scopedSlots: {customRender: "action"}}
        ];
        return columns;
      },
    },
    beforeCreate() {
      this.form = this.$form.createForm(this);
    },
    created() {
      this.$nextTick(() => {
        this.getDict();
        this.getData();
      });
    },
    methods: {
      //获取数据
      getData() {
        this.loading = true;
        getDepartmentList().then(res => {
          this.loading = false;
          this.dataSource = transData(res, "deptId", "parentId");
        });
      },
      //删除部门
      deleteDepartment(deptId) {
        removeDepartment(deptId).then(res => {
          if (res.code === 0) {
            this.$message.success(res.msg);
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
      /*打开添加和修改的form表单*/
      updateDept(record) {
        if (record) {
          this.isAdd = false;
          this.updateRecord = record;

        } else {
          this.isAdd = true;
          this.updateRecord = null;
        }
        //获取部门treeSelect
        getDepartmentTreeData().then(res => {
          if (res.code === 0) {
            this.deptTreeData = recursionMenu(res.data);
          }
        });
        this.changeVisible(true);
      },
      addSubDept(record) {
        this.isAdd = true;
        this.updateRecord = record;
        //获取部门treeSelect
        getDepartmentTreeData().then(res => {
          if (res.code === 0) {
            this.deptTreeData = recursionMenu(res.data);
          }
        });
        this.changeVisible(true);
      }
    }
  };
</script>

<style lang="less" type="text/less" scoped>

</style>
