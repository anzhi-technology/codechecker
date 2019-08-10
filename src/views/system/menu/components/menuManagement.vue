<template>
  <div>
    <a-row>
      <a-col :span="24">
        <a-card title="菜单管理" :bordered="false" style="height:100%">
          <div slot="extra">
            <a-button type="primary" size="small" @click="updateMenu()">添加菜单</a-button>
          </div>
          <!--顶部工具栏-->
          <div class="tableContent">
            <a-row>
              <a-col :span="24">
                <a-table :columns="columns" :dataSource="dataSource"  :loading="loading" :rowKey="record => record.menuId">
                  <!--类型-->
                  <span slot="menuType" slot-scope="text, record">
                    <a-tag v-if="record.menuType === 'M'" color="#108ee9">目录</a-tag>
                    <a-tag v-if="record.menuType === 'C'" color="#87d068">菜单</a-tag>
                    <a-tag v-if="record.menuType === 'F'" color="#2db7f5">按钮</a-tag>
                  </span>
                  <!--可见-->
                  <span slot="visible" slot-scope="text, record">
                    <template v-for="item in menuStatusDicts">
                      <a-tag :color="record.visible === '0' ? 'blue' : 'red'" v-if="item.dictValue === record.visible" :key="item.dictCode">
                        {{item.dictLabel}}
                      </a-tag>
                    </template>
                  </span>
                  <!--操作列-->
                  <span slot="action" slot-scope="text, record">
                    <a-button size="small" type="primary" icon="edit" title="修改" @click="updateMenu(record)"></a-button>
                    <a-divider type="vertical"/>
                    <a-button size="small" style="background-color: #5EC3C6; color: #fff" icon="plus" @click="addSubMenu({'parentId':record.menuId,'parentName':record.menuName})"
                              title="添加子菜单"
                    >
                    </a-button>
                    <a-divider type="vertical"/>
                    <a-popconfirm v-if="dataSource.length" title="确定删除?" @confirm="() => deleteMenu(record.menuId)" okText="确定" cancelText="取消">
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
    <div class="menu-form">
      <menuForm :isAdd=isAdd
                :menuStatusDicts="menuStatusDicts"
                :visible="visible"
                :updateRecord="updateRecord"
                @changeVisible="changeVisible($event)"
                @refreshTable="getData"
                :menuTreeData="menuTreeData"
      />
    </div>
  </div>
</template>

<script>
  import {getAllMenu,getMenuTree,removeMenu} from "@/api/system/menu";
  import initDict from "@/mixins/initDict";
  import {getColumn,filterData, transData,recursionMenu} from "@/utils/myUtils";
  import menuForm from "./form/menu-form";

  export default {
    name: "menuManagement",
    mixins: [initDict],
    components: {
      menuForm
    },
    data() {
      return {
        isAdd: true,
        visible: false,
        updateRecord: null,
        menuTreeData: [],
        loading: false,
        //columns:[],
        dataSource: [],
      };
    },
    beforeCreate() {
      this.form = this.$form.createForm(this);
    },
    computed: {
      columns() {
        const columns = [
          getColumn("菜单名称", "menuName"),
          getColumn("排序", "orderNum"),
          getColumn("请求地址", "url"),
          getColumn("类型", "menuType"),
          getColumn("可见", "visible"),
          getColumn("权限标识", "perms"),
          {
            title: "操作",
            key: "action",
            scopedSlots: {customRender: "action"}
          }
        ];
        return columns;
      },
    },
    created() {
      this.$nextTick(() => {
        this.getData();
        this.getDict();
      });
    },
    methods: {

      //获取数据
      getData() {
        this.loading = true;
        getAllMenu().then(res => {
          this.loading = false;
          this.dataSource = transData(res, "menuId", "parentId");
        });
      },
      //删除菜单
      deleteMenu(menuId) {
        removeMenu(menuId).then(res => {
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
      updateMenu(record) {
        console.log(record);
        if (record) {
          this.isAdd = false;
          this.updateRecord = record;
        } else {
          this.isAdd = true;
          this.updateRecord = null;
        }
        //获取菜单树
        getMenuTree().then(res => {
          let data = transData(res, "id", "pId");
          this.menuTreeData = recursionMenu(data);
        });
        this.changeVisible(true);
      },
      addSubMenu(record){
        this.isAdd = true;
        this.updateRecord = record;
        //获取菜单树
        getMenuTree().then(res => {
          let data = transData(res, "id", "pId");
          this.menuTreeData = recursionMenu(data);
        });
        this.changeVisible(true);
      }
    }
  };
</script>

<style lang="less" type="text/less" scoped>
</style>
