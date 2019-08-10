<template>
  <div>
    <a-row>
      <a-col :span="24">
        <a-card title="用户管理" :bordered="false" style="height:100%">
          <router-link :to="{ path: '/system/user/add' }" slot="extra">
            <a-button type="primary" size="small" >添加用户</a-button>
          </router-link>
          <!--顶部工具栏-->
          <div class="tableContent">
            <a-row>
              <a-col :span="24">
                <TopTools @getSearchCondition="getSearchVal" :dataSource="dataSource" :tHeader="tHeader" :filterVal="filterVal" :pagination="pagination" :downLoadTitle="downLoadTitle"/>
              </a-col>
              <a-col :span="24">
                <a-table :columns="columns" :dataSource="TableData" :pagination="pagination" :loading="loading"
                         :rowKey="record => record.userId">
                  <span slot="status" slot-scope="text, record">
                    <a-switch v-if="record.status === '0'" defaultChecked
                              @click="changeStatus(record.status,record.userId)"/>
                    <a-switch v-if="record.status === '1'"
                              @click="changeStatus(record.status,record.userId)"/>
                  </span>
                  <!--操作列-->
                  <span slot="action" slot-scope="text, record">
                    <router-link :to="{ path: '/system/user/edit/' + record.userId }">
                      <a-button size="small" type="primary" icon="edit" title="修改"></a-button>
                    </router-link>
                    <a-divider type="vertical"/>
                    <a-popconfirm v-if="dataSource.length" title="确定删除?" @confirm="() => deleteUsers(record.userId)" okText="确定" cancelText="取消">
                      <a-button size="small" style="background-color: #DC6068; color: #fff" icon="delete"
                                title="删除">
                      </a-button>
                    </a-popconfirm>
                    <a-divider type="vertical"/>
                    <a-button size="small" style="background-color: #5EC3C6; color: #fff" icon="key"
                              title="重置"
                              @click="resetPwd(record)">
                    </a-button>
                  </span>
                </a-table>
              </a-col>
            </a-row>
          </div>
        </a-card>
      </a-col>
    </a-row>
    <!--modal-->
    <a-modal title="重置密码" centered v-model="visible" @ok="handleOk" okText="确认" cancelText="取消">
      <a-form :form="form">
        <a-form-item label="登录账号" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
          <a-input placeholder="请输入登录账号"
                   v-decorator="['loginName',{
                     initialValue:modalData.loginName,
                     rules: [{required: true, message: '登录账号不能为空!' },
                             {min:2,message:'最小长度不能低于2'},
                             {max:20,message:'最大长度不能超过20'},
                     ]}
                   ]"/>
        </a-form-item>
        <a-form-item label="登录密码" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
          <a-input placeholder="请输入密码" type="password"
                   v-decorator="[
                     'password',
                     {
                       initialValue:configValue,
                       rules: [
                         { required: true, message: '密码不能为空!' }
                       ]
                     }
                   ]"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import {getUserList, changeUserStatus, deleteUser, resetPassword} from "@/api/system/system";
import initConfig from "@/mixins/initConfig";
import TopTools from "@/components/Table/TopTools";
import {getColumn,filterData} from "@/utils/myUtils";


export default {
  name: "userManagement",
  mixins: [initConfig],
  components: {
    TopTools
  },
  data() {
    return {
      loading: false,
      //columns:[],
      dataSource: [],
      tHeader: ["用户ID", "登陆名称", "用户名称", "部门", "手机", "用户状态", "创建时间"],
      filterVal: ["userId", "loginName", "userName", "dept.deptName", "phonenumber", "status", "createTime"],
      downLoadTitle:'用户列表',
      pagination: {
        pageSize: 10
      },
      searchCondition: "",
      visible: false,
      modalData: []

    };
  },
  beforeCreate() {
    this.form = this.$form.createForm(this);
  },
  computed: {
    columns() {
      const columns = [
        getColumn("用户ID", "userId", (a, b) => a.userId - b.userId),
        getColumn("登陆名称", "loginName", (a, b) => a.loginName.localeCompare(b.loginName)),
        getColumn("用户名称", "userName", (a, b) => a.userName.localeCompare(b.userName)),
        getColumn("部门", "dept.deptName", (a, b) => a.dept.deptName.localeCompare(b.dept.deptName)),
        getColumn("手机", "phonenumber"),
        getColumn("用户状态", "status"),
        getColumn("创建时间", "createTime", (a, b) => (a.createTime < b.createTime ? 1 : -1) ),
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
      this.getConfig();
    });
  },
  methods: {
    //子组件传过来的值
    getSearchVal(msg) {
      this.searchCondition = msg;
    },
    /*//公共组件的传单个用户信息
    setSingleUser(record){
      this.modalData = record;
      Bus.$emit('getSingleUser',this.modalData);
    },*/
    //获取数据
    getData() {
      this.loading = true;
      getUserList().then(res => {
        if (res.code === 0) {
          this.loading = false;
          this.dataSource = res.rows;
        }
      });
    },
    //删除用户
    deleteUsers(userId) {
      let formData = new FormData();
      formData.append("ids", userId);
      deleteUser(formData).then(res => {
        if (res.code === 0) {
          this.$message.success(res.msg);
          this.getData();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    //用户重置
    resetPwd(modalData) {
      this.modalData = modalData;
      this.visible = true;
    },
    //重置保存
    handleOk(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          let formData = new FormData();
          formData.append("userId", this.modalData.userId);
          formData.append("loginName", values.loginName);
          formData.append("password", values.password);
          resetPassword(formData).then(res => {
            //判断是否保存成功
            if (res.code === 0) {
              this.$message.success(res.msg);
              this.visible = false;
            } else {
              this.$message.error(res.msg);
            }
          });
        }
      });
    },
    changeStatus(status, userId) {
      let newStatus = "";
      if (status === "0") newStatus = "1";
      if (status === "1") newStatus = "0";
      let formData = new FormData();
      formData.append("status", newStatus);
      formData.append("userId", userId);
      changeUserStatus(formData).then(res => {
        if (res.code === 0) {
          if (newStatus === "1") this.$message.success('停用成功！');
          if (newStatus === "0") this.$message.success('启用成功！');
          this.getData();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
  },
};
</script>

<style lang="less" type="text/less" scoped>
  .tableContent {
    .right-tool {
      float: right;
    }
  }
</style>
