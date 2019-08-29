<template>
  <a-row>
    <a-col :span="24">
      <a-card title="基本信息" :bordered="false" style="height:100%">
        <a-form :form="form" @submit="handleSubmit">
          <a-row>
            <a-col :span="12">
              <a-form-item label="用户名称" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
                <a-input placeholder="请输入用户名称"
                         v-decorator="['userName',
                                       {
                                         initialValue:SingleData.userName,
                                         rules: [{ required: true, message: '用户名不能为空！' }, {max:30,message:'最大长度不能超过30'}],
                                         validateTrigger: 'blur'
                                       }]"/>
              </a-form-item>
              <a-form-item label="手机号码" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
                <a-input placeholder="请输入手机号码"
                         v-decorator="['phonenumber',
                                       {
                                         initialValue:SingleData.phonenumber,
                                         rules: [{ required: true, message: '手机号码不能为空!' },
                                                 { validator:checkPonenumber}],
                                         validateTrigger: 'blur'},
                         ]"/>
              </a-form-item>
              <a-form-item label="登录账号" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
                <a-input placeholder="请输入登录账号" disabled
                         v-decorator="['loginName',
                                       {initialValue:SingleData.loginName,
                                        rules: [{ required: true, message: '登录账号不能为空！' }],
                                       }]"/>
              </a-form-item>
              <a-form-item label="用户性别" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
                <a-select placeholder="请选择性别" v-decorator="['sex', {initialValue:SingleData.sex,
                                                                    rules: [{ required: true, message: ' 请选择用户性别！' }],}]">
                  <a-select-option v-for="item in SexDicts" :value="item.dictValue" :key="item.dictCode">{{ item.dictLabel }}
                  </a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item label="岗位" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
                <a-select mode="multiple" placeholder="请选择岗位" style="width: 100%" v-decorator="['post', {initialValue:SingleData.posts,
                                                                                                         rules: [{ required: true, message: '请选择岗位！' }],
                }]">
                  <template v-for="item in postData">
                    <a-select-option  v-if="item.status ==='0'" :key="item.postId">{{ item.postName }}</a-select-option>
                    <a-select-option  v-if="item.status ==='1'" disabled :key="item.postId">{{ item.postName }}</a-select-option>
                  </template>
                </a-select>
              </a-form-item>
              <a-form-item label="角色" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
                <!--<a-checkbox-group :options="plainOptions"   @change="onChange"  v-decorator="['role']"/>-->
                <a-checkbox-group v-decorator="['role',{initialValue:SingleData.roles,
                                                        rules: [{ required: true, message: '角色不能为空！' }],}]" style="width: 100%;">
                  <a-checkbox v-for="item in roleData" :value="item.roleId" :key="item.roleId">
                    {{item.roleName}}
                  </a-checkbox>
                </a-checkbox-group>

              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="归属部门" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
                <a-tree-select :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }" :treeData="departmentData"
                               placeholder="请选择归属部门" treeDefaultExpandAll v-decorator="['dept',{initialValue:SingleData.dept,
                                                                                                rules: [{ required: true, message: '请选择归属部门！' }],}]">
                </a-tree-select>
              </a-form-item>
              <a-form-item label="邮箱" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
                <a-input placeholder="请输入邮箱"
                         v-decorator="[
                           'email',
                           {
                             initialValue:SingleData.email,
                             rules: [
                               { type: 'email', message: '请输入正确的邮箱!' },
                               { required: true, message: '邮箱不能为空!' },
                               { validator:checkEmail},
                             ],
                             validateTrigger: 'blur'
                           }
                         ]"
                />
              </a-form-item>
              <a-form-item label="用户状态" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
                <!--<a-switch defaultChecked @change="onSwitchChange"  v-decorator="['status']"/>-->
                <a-switch v-decorator="['status', { valuePropName: 'checked',initialValue:SingleData.switchStatus}]"/>
              </a-form-item>
              <a-form-item label="备注" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
                <a-textarea placeholder="备注信息（选填）" :rows="4" v-decorator="['remark',{initialValue:SingleData.remark}]"/>
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item :wrapperCol="{ span: 10, offset: 10 }">
                <a-button type="primary" html-type="submit">保存</a-button>
                <a-button style="margin-left: 8px" @click="()=>form.resetFields() ">重置</a-button>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-card>
    </a-col>
  </a-row>
</template>

<script>
import initDict from "@/mixins/initDict";
//import Bus from '@/utils/bus';
import {getSingleUser, checkPhonenumberUnique, checkEmailUnique, editUser} from "@/api/system/system";
import {getPostList} from "@/api/system/post";
import {getRoleList} from "@/api/system/role";
import {getDepartmentTreeData} from "@/api/system/dept";

export default {
  name: "",
  mixins: [initDict],
  data() {
    return {
      postData: [],
      //角色复选框
      roleData: [],
      //Form
      form: this.$form.createForm(this),
      SingleData: {},
      projectId:this.$route.params.parameter,
      //treeiInput
      departmentValue: undefined,
      departmentData: []
    };
  },
  watch: {
    //监听相同路由下参数变化的时候，从而实现异步刷新
    '$route'(to, from) {
      //做一些路由变化的响应
      //重新获取数据
      this.getSingleData();
    },
  },
  created() {
    this.$nextTick(() => {
      this.getSingleData();
      this.getDict();
      this.getPostList();
      this.getRoleList();
      this.getDepartmentList();
    });
  },
  /*mounted() {
    Bus.$on('getSingleUser', (data) => {
      this.SingleData = data;
      console.log(this.SingleData.userName);
    })
  },*/
  methods: {
    //获取单个用户信息
    getSingleData() {
      return getSingleUser(this.projectId).then(res => {
        if (res.code === 0) {
          const data = res.data.user;
          const posts = [];
          const roles = [];
          data.posts.forEach(obj => posts.push(obj.postId));
          data.roles.forEach(obj => roles.push(obj.roleId));
          const dept = data.dept.deptId.toString() + "," + data.dept.deptName;
          let switchStatus = 'checked';
          if (data.status === "1") {
            switchStatus = null;
          }
          this.SingleData = {
            'userName': data.userName,
            'phonenumber': data.phonenumber,
            'loginName': data.loginName,
            'sex': data.sex,
            'posts': posts,
            'roles': roles,
            'dept': dept,
            'email': data.email,
            'switchStatus': switchStatus,
            'remark': data.remark || ''
          };
        }
      });
    },
    //验证手机号
    checkPonenumber(rule, value, callback) {
      const reg = "^1(3|4|5|7|8)\\d{9}$";
      const re = new RegExp(reg);
      if (re.test(value)) {
        let formData = new FormData();
        formData.append("userId", this.projectId);
        formData.append("phonenumber", value);
        checkPhonenumberUnique(formData).then(res => {
          if (res === 0) {
            callback();
          } else {
            return callback(new Error('手机号已存在'));
          }
        });
      } else {
        return callback(new Error('请输入正确的手机号'));
      }
    },
    //验证email
    checkEmail(rule, value, callback) {
      let formData = new FormData();
      formData.append("userId", this.projectId);
      formData.append("email", value);
      checkEmailUnique(formData).then(res => {
        if (res === 0) {
          callback();
        } else {
          return callback(new Error('邮箱已存在！'));
        }
      });
    },
    //提交保存
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          let postIds = values.post.join(",");
          let roleIds = values.role.join(",");
          let dept = values.dept.split(",");
          let status = values.status === "checked" ? "0" : "1";
          let formData = new FormData();
          formData.append("userId", this.projectId);
          formData.append("userName", values.userName);
          formData.append("phonenumber", values.phonenumber);
          formData.append("loginName", values.loginName);
          formData.append("sex", values.sex);
          formData.append("postIds", postIds);
          formData.append("roleIds", roleIds);
          values.role.forEach(obj => formData.append("role", obj));
          formData.append("deptId", dept[0]);
          formData.append("deptName", dept[1]);
          formData.append("email", values.email);
          formData.append("status", status);
          formData.append("remark", values.remark);

          editUser(formData).then(res => {
            if (res.code === 0) {
              this.$message.success('编辑成功');
              this.$router.push('/system/user/index');
            } else {
              this.$message.warning(res.msg);
            }
          })
        }
      });
    },
    //获取单个用户信息

    //获取岗位信息
    getPostList() {
      getPostList().then(res => {
        if (res.code === 0) {
          this.postData = res.rows;
        }
      });
    },
    //获取角色信息
    getRoleList() {
      getRoleList().then(res => {
        if (res.code === 0) {
          this.roleData = res.rows;
        }
      });
    },
    //获取岗位信息
    getDepartmentList() {
      getDepartmentTreeData().then(res => {
        if (res.code === 0) {
          this.departmentData = this.transData(res.data);
        }
      });
    },
    transData(list) {
      let treeData = [];
      list.forEach(item => {
        let data = {
          title: item.title,
          value: item.id.toString() + "," + item.name,
          selectable: false,
          key: item.id,
          children: []
        };
        if (item.children) {
          data.children = this.transData(item.children);
        } else {
          data.selectable = true;
        }
        treeData.push(data);

      });
      return treeData
    }
  },

};
</script>

<style scoped></style>
