<template>
  <a-row>
    <a-col :span="24">
      <a-card title="基本信息" :bordered="false" style="height:100%">
        <a-form :form="form" @submit="handleSubmit">
          <a-row>
            <a-col :span="12">
              <a-form-item label="用户名称" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
                <a-input placeholder="请输入用户名称"
                         v-decorator="['userName',{ rules: [{ required: true, message: '用户名不能为空！' }, {max:30,message:'最大长度不能超过30'},],validateTrigger: 'blur'}]"/>
              </a-form-item>
              <a-form-item label="手机号码" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
                <a-input placeholder="请输入手机号码"
                         v-decorator="['phonenumber',{rules: [{ required: true, message: '手机号码不能为空!' },
                                                              { validator:checkPonenumber},
                         ],validateTrigger: 'blur'
                         },
                         ]"/>
              </a-form-item>
              <a-form-item label="登录账号" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
                <a-input placeholder="请输入登录账号"
                         v-decorator="['loginName',{rules: [{ required: true, message: '登录账号不能为空!' },
                                                            {min:2,message:'最小长度不能低于2'},
                                                            {max:20,message:'最大长度不能超过20'},
                                                            { validator:checkLoginName}],
                                                    validateTrigger: 'blur'}
                         ]"/>
              </a-form-item>
              <a-form-item label="用户性别" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
                <a-select placeholder="请选择性别" v-decorator="['sex',{rules: [{ required: true, message: '性别不能为空!' }]}]">
                  <a-select-option v-for="item in SexDicts" :key="item.dictCode" :value="item.dictValue">{{ item.dictLabel }}
                  </a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item label="岗位" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
                <a-select mode="multiple" placeholder="请选择岗位" style="width: 100%" v-decorator="['post', {rules: [{ required: true, message: '岗位不能为空!' }]}]">
                  <template v-for="item in postData">
                    <a-select-option  v-if="item.status ==='0'"  :key="item.postId">{{ item.postName }}</a-select-option>
                    <a-select-option  v-if="item.status ==='1'" disabled :key="item.postId">{{ item.postName }}</a-select-option>
                  </template>
                </a-select>
              </a-form-item>
              <a-form-item label="角色" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
                <!--<a-checkbox-group :options="plainOptions"   @change="onChange"  v-decorator="['role']"/>-->
                <a-checkbox-group v-decorator="['role',{rules: [{ required: true, message: '角色不能为空!' }]}]" style="width: 100%;">
                  <a-checkbox v-for="item in roleData" :value="item.roleId" :key="item.roleId">
                    {{item.roleName}}
                  </a-checkbox>
                </a-checkbox-group>

              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="归属部门" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
                <a-tree-select :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }" :treeData="departmentData"
                               placeholder="请选择归属部门" treeDefaultExpandAll
                               v-decorator="['dept',
                                             {rules: [{ required: true, message: '部门不能为空!' }]}
                               ]">
                </a-tree-select>
              </a-form-item>
              <a-form-item label="邮箱" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
                <a-input placeholder="请输入邮箱"
                         v-decorator="[
                           'email',
                           {
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
              <a-form-item label="登录密码" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
                <a-input placeholder="请输入密码" type="password"
                         v-decorator="[
                           'password',
                           {
                             initialValue:configValue,
                             rules: [
                               { required: true, message: '密码不能为空!' }
                             ],
                             validateTrigger: 'blur'
                           }
                         ]"
                />
              </a-form-item>
              <a-form-item label="用户状态" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
                <!--<a-switch defaultChecked @change="onSwitchChange"  v-decorator="['status']"/>-->
                <a-switch v-decorator="['status', { valuePropName: 'checked',initialValue:'checked' }]"/>
              </a-form-item>
              <a-form-item label="备注" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
                <a-textarea placeholder="备注信息（选填）" :rows="4" v-decorator="['remark']"/>
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
import initConfig from "@/mixins/initConfig";
import {checkLoginNameUnique, checkPhonenumberUnique, checkEmailUnique, addUser} from "@/api/system/system";
import {getPostList} from "@/api/system/post";
import {getRoleList} from "@/api/system/role";
import {getDepartmentTreeData} from "@/api/system/dept";

export default {
  name: "addUser",
  mixins: [initDict,initConfig],
  data() {
    return {
      postData: [],
      //角色复选框
      roleData: [],
      //Form
      form: this.$form.createForm(this),
      //treeiInput
      departmentValue: undefined,
      departmentData: []
    };
  },
  created() {
    this.$nextTick(() => {
      this.getDict();
      this.getConfig();
      this.getPostList();
      this.getRoleList();
      this.getDepartmentList();
    });
  },
  methods: {
    //校验loginName
    checkLoginName(rule, value, callback) {
      let formData = new FormData();
      formData.append("loginName", value);
      checkLoginNameUnique(formData).then(res => {
        if (res === 0) {
          callback();
        } else {
          return callback(new Error('登录名称已存在！'));
        }
      });
    },
    //验证手机号
    checkPonenumber(rule, value, callback) {
      const reg = "^1(3|4|5|7|8)\\d{9}$";
      const re = new RegExp(reg);
      if (re.test(value)) {
        let formData = new FormData();
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
          console.log("Received values of form: ", values);
          let postIds = values.post.join(",");
          let roleIds = values.role.join(",");
          let dept = values.dept.split(",");
          let status = values.status === "checked" ? "0" : "1";
          let formData = new FormData();
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
          formData.append("password", values.password);
          formData.append("status", status);
          formData.append("remark", values.remark);

          //console.log(values.password);
          addUser(formData).then(() => {
            this.$message.success('添加成功');
            this.$router.push('/system/user/index');
          })
        }
      });
    },
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
  }
};
</script>

<style scoped></style>
