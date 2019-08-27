<template>
  <div>
    <a-modal
      :title="title"
      :visible="visible"
      :destroyOnClose="true"
      @ok="handleOk"
      okText="确定"
      :confirmLoading="confirmLoading"
      @cancel="handleCancel"
      cancelText="取消"
      width="50%"
      :centered=true
      style="left: 100px;"
    >
      <a-form :form="form">
        <a-row>
          <a-col>
            <a-form-item label="角色名称" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
              <a-input placeholder="请输入角色名称"
                       v-decorator="['roleName', {initialValue: updateRecord?updateRecord.roleName:'',
                                                  rules: [
                                                    { required: true, message: '角色名不能为空！' },
                                                    { validator:checkRoleName},
                                                  ], validateTrigger: 'blur' }]"/>
            </a-form-item>

            <a-form-item label="权限字符" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
              <a-input placeholder="请输入权限字符"
                       v-decorator="['roleKey',{initialValue: updateRecord?updateRecord.roleKey:'',
                                                rules: [
                                                  { required: true, message: '权限字符不能为空！' },
                                                  { validator:checkRoleKey},
                                                ], validateTrigger: 'blur' }]"/>
            </a-form-item>

            <a-form-item label="显示顺序" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
              <a-input-number placeholder="请输入显示顺序" :min="0" :max="999999" style="width: 100%"
                              v-decorator="['roleSort',{
                                initialValue: updateRecord?updateRecord.roleSort:'0',
                                rules: [{ required: true, message: '输入内容不能为空或为数字！' }], validateTrigger: 'blur'}]"/>
            </a-form-item>

            <a-form-item :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }" label="状态">
              <a-switch v-decorator="['status', { valuePropName: 'checked',initialValue:updateRecord?updateRecord.newstatus:''}]"/>
            </a-form-item>

            <a-form-item label="备注" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
              <a-textarea placeholder="备注信息（选填）" :rows="4" v-decorator="['remark',{initialValue: updateRecord?updateRecord.remark:''}]"/>
            </a-form-item>

            <a-form-item label="菜单权限" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
              <a-tree
                showLine
                checkable
                :autoExpandParent=false
                :treeData="treeData"
                @check="this.onCheck"
                :defaultCheckedKeys="menuCheckedKeys"
                ref="menuIds"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>

    </a-modal>
  </div>
</template>
<script>
import {addRole, editRole,checkRoleNameUnique,checkRoleKeyUnique} from "@/api/system/role";



export default {
  props: {
    isAdd: {
      type: Boolean,
      required: true
    },
    visible: {
      type: Boolean,
      required: true
    },
    updateRecord: {
      type: Object,
      required: false
    },
    treeData: {
      type: Array,
      required: true
    },
    menuCheckedKeys: {
      type: Array,
      required: true
    },
  },
  data() {
    return {
      confirmLoading: false,
      form: this.$form.createForm(this),
      menuIds:''
    }
  },
  computed: {
    title(){
      if (this.isAdd) {
        return "添加角色"
      }else {
        return "修改角色"
      }
    }
  },
  methods: {
    /*校验roleName*/
    checkRoleName(rule, value, callback) {
      let formData = new FormData();
      if(this.updateRecord) formData.append("roleId", this.updateRecord.roleId);
      formData.append("roleName", value);
      checkRoleNameUnique(formData).then(res => {
        if (res === 0) {
          callback();
        } else {
          return callback(new Error('角色名称已存在！'));
        }
      });
    },
    /*校验RoleKey*/
    checkRoleKey(rule, value, callback) {
      let formData = new FormData();
      if(this.updateRecord) formData.append("roleId", this.updateRecord.roleId);
      formData.append("roleKey", value);
      checkRoleKeyUnique(formData).then(res => {
        if (res === 0) {
          callback();
        } else {
          return callback(new Error('角色权限已经存在！'));
        }
      });
    },
    onCheck(checkedKeys, info) {
      this.menuIds = [...checkedKeys,...info.halfCheckedKeys];
    },
    changeVisible(visible) {
      this.$emit("changeVisible",visible)
    },
    refreshTable(){
      this.$emit("refreshTable")
    },
    /*点击确定*/
    handleOk() {
      this.confirmLoading = true;
      this.form.validateFields((err, values) => {
        if (!err){
          let status = values.status === "checked" ? "0" : "1";
          let formData = new FormData();
          formData.append("roleName",values.roleName);
          formData.append("roleKey",values.roleKey);
          formData.append("roleSort",values.roleSort);
          formData.append("status",status);
          formData.append("remark",values.remark);
          formData.append("menuIds",this.menuIds);
          if (this.updateRecord){
            formData.append("roleId",this.updateRecord.roleId);
            editRole(formData).then(res => {
              if (res.code === 0){
                this.$message.success(res.msg);
                this.refreshTable();
              }else{
                this.$message.error(res.msg);
              }
            })
          }else {
            addRole(formData).then(res => {
              if (res.code === 0){
                this.$message.success(res.msg);
                this.refreshTable();
              }else {
                this.$message.error(res.msg);
              }
            })
          }
        }
      });

      this.confirmLoading = false;
      this.changeVisible(false);
      setTimeout(() => {
        this.form.resetFields();
      }, 500);
    },
    /*点击取消*/
    handleCancel() {
      this.changeVisible(false);
      this.form.resetFields();
    },
  }
}
</script>