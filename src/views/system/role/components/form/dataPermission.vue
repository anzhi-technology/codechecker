<template>
  <div>
    <a-modal
      title="分配数据权限"
      :visible="dataPermissionVisible"
      :destroyOnClose="true"
      @ok="handleOk"
      okText="确定"
      :confirmLoading="confirmLoading"
      @cancel="handleCancel"
      cancelText="取消"
      width="50%"
      :centered="true"
      style="left: 100px;"
    >
      <a-form :form="form">
        <a-row>
          <a-col>
            <a-form-item label="角色名称" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
              <a-input placeholder="请输入角色名称" disabled
                       v-decorator="['roleName', {initialValue: dataRecord?dataRecord.roleName:'', rules: [{ required: true, message: '角色名不能为空！' }] }]"/>
            </a-form-item>

            <a-form-item label="权限字符" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
              <a-input placeholder="请输入权限字符" disabled
                       v-decorator="['roleKey',{initialValue: dataRecord?dataRecord.roleKey:'', rules: [{ required: true, message: '权限字符不能为空！' }] }]"/>
            </a-form-item>

            <a-form-item label="数据范围" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
              <a-select v-decorator="['dataScope',{initialValue:dataRecord?dataRecord.dataScope:''}]" @change="handleChange">
                <a-select-option value="1">全部数据权限</a-select-option>
                <a-select-option value="2">自定数据权限</a-select-option>
                <a-select-option value="3">部门数据权限</a-select-option>
                <a-select-option value="4">部门及以下数据权限</a-select-option>
                <a-select-option value="5">仅本人数据权限</a-select-option>
              </a-select>
              <a-icon type="exclamation-circle" /> 特殊情况下，设置为“自定数据权限”
            </a-form-item>

            <a-form-item v-if="dataRecord" v-show="dataRecord.dataScope ==='2'" label="菜单权限" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
              <a-tree
                showLine
                checkable
                :defaultExpandedKeys="deptCheckedKeys"
                @check="this.onCheck"
                :defaultCheckedKeys="deptCheckedKeys"
                :treeData="departmentTree"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>

    </a-modal>
  </div>
</template>
<script>
import {authDataScope} from "@/api/system/role";

export default {
  props: {
    dataPermissionVisible: {
      type: Boolean,
      required: true
    },
    dataRecord: {
      type: Object,
      required: false
    },
    departmentTree: {
      type: Array,
      required: true
    },
    deptCheckedKeys: {
      type: Array,
      required: true
    },
  },
  data() {
    return {
      //ModalText: 'Content of the modal',
      confirmLoading: false,
      form: this.$form.createForm(this),
    }
  },
  methods: {
    changeDataVisible(visible) {
      this.$emit("changeDataVisible", visible)
    },
    refreshTable() {
      this.$emit("refreshTable")
    },
    onCheck(checkedKeys) {
      // console.log('onCheck', checkedKeys, info)
      this.deptIds = checkedKeys;

    },
    /*点击确定*/
    handleOk() {
      this.confirmLoading = true;
      this.form.validateFields((err, values) => {
        if (!err) {
          let formData = new FormData();
          formData.append("roleId",this.dataRecord.roleId);
          formData.append("roleName",values.roleName);
          formData.append("roleKey",values.roleKey);
          formData.append("dataScope",values.dataScope);
          formData.append("deptIds",this.deptIds || "");
          authDataScope(formData).then(res =>{
            if(res.code === 0){
              this.$message.success(res.msg);
            }else{
              this.$message.error(res.msg);
            }
          })
        }
      });
      this.confirmLoading = false;
      this.changeDataVisible(false);
      setTimeout(() => {
        this.form.resetFields()
      }, 500);
    },
    /*点击取消*/
    handleCancel() {
      this.changeDataVisible(false);
      this.form.resetFields();
    },
    handleChange(value){
      this.dataRecord.dataScope = value ;
    }
  }
}
</script>