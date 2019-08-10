<template>
  <div>
    <a-modal
      :title="title"
      :visible="visible"
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
            <a-form-item label="上级部门" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
              <a-tree-select :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }" :treeData="deptTreeData" @change="onDeptChange"
                             placeholder="请选择上级部门" treeDefaultExpandAll
                             v-decorator="['parentName',{initialValue: updateRecord?updateRecord.parentName:''}]">
              </a-tree-select>
            </a-form-item>

            <a-form-item label="部门名称" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
              <a-input placeholder="请输入部门名称"
                       v-decorator="['deptName', {
                       initialValue: updateRecord?updateRecord.deptName:'',
                       rules: [
                       { required: true, message: '部门名称不能为空！' },
                       { validator:checkDepartment}
                       ], validateTrigger: 'blur' }]"/>
            </a-form-item>

            <a-form-item label="显示排序" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
              <a-input-number placeholder="请输入显示顺序" :min="0" :max="999999" style="width: 100%"
                              v-decorator="['orderNum',{initialValue: updateRecord?updateRecord.orderNum:'0',rules: [{ required: true, message: '输入内容不能为空或为数字！' }]}]"/>
            </a-form-item>

            <a-form-item label="负责人" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
              <a-input placeholder="请输入负责人"
                       v-decorator="['leader', {
                       initialValue: updateRecord?updateRecord.leader:'',
                       rules: [
                       { required: true, message: '菜单名称不能为空！' },]}]"/>
            </a-form-item>

            <a-form-item label="联系电话" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
              <a-input placeholder="请输入联系电话"
                       v-decorator="['phone',{initialValue: updateRecord?updateRecord.phone:'',
                                              rules: [{ required: true, message: '手机号码不能为空!' },
                                                      { validator:checkPonenumber}], validateTrigger: 'blur'}]"/>
            </a-form-item>

            <a-form-item label="邮箱" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
              <a-input placeholder="请输入邮箱"
                       v-decorator="['email',{initialValue: updateRecord?updateRecord.email:'',
                                              rules: [ { type: 'email', message: '请输入正确的邮箱!' },
                                                       { required: true, message: '邮箱不能为空!' }], validateTrigger: 'blur'}]"/>
            </a-form-item>

            <a-form-item label="部门状态：" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
              <a-radio-group v-decorator="['status',{initialValue: updateRecord?updateRecord.status:'0'}]">
                <a-radio :value="item.dictValue" v-for="item in deptStatusDicts" :key="item.dictCode">
                  {{item.dictLabel}}
                </a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>

    </a-modal>
  </div>
</template>
<script>
  import {addDepartment, editDepartment, checkDeptNameUnique} from "@/api/system/dept";

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
      deptStatusDicts: {
        type: Array,
        required: true
      },
      updateRecord: {
        type: Object,
        required: false
      },
      deptTreeData: {
        type: Array,
        required: true
      },
    },
    data() {
      return {
        form: this.$form.createForm(this),
        confirmLoading: false,
        deptValue: ''
      }
    },
    computed: {
      title() {
        if (this.isAdd) {
          return "添加部门"
        } else {
          return "编辑部门"
        }
      }
    },
    methods: {
      changeVisible(visible) {
        this.$emit("changeVisible", visible)
      },
      refreshTable() {
        this.$emit("refreshTable")
      },
      /*树形选择框*/
      onDeptChange(value) {
        this.deptValue = value;
      },
      /*手机号的正则表达式*/
      checkPonenumber(rule, value, callback){
        const reg = "^1(3|4|5|7|8)\\d{9}$";
        const re = new RegExp(reg);
        if (re.test(value)) {
          callback();
        } else {
          return callback(new Error('请输入正确的手机号'));
        }
      },
      //校验菜单名称
      checkDepartment(rule, value, callback) {
        let formData = new FormData();
        let parentId = this.updateRecord?this.updateRecord.parentId:this.deptValue;
        formData.append("parentId", parentId);
        if(!this.isAdd) formData.append("deptId",this.updateRecord.deptId);
        formData.append("deptName", value);
        checkDeptNameUnique(formData).then(res => {
          if (res === 0) {
            callback();
          } else {
            return callback(new Error('菜单已经存在！'));
          }
        });
      },
      /*点击确定*/
      handleOk() {
        this.confirmLoading = true;
        this.form.validateFields((err, values) => {
          if (!err) {

            let formData = new FormData();
            formData.append("deptName", values.deptName);
            formData.append("orderNum", values.orderNum);
            formData.append("leader", values.leader);
            formData.append("phone", values.phone || '');
            formData.append("email", values.email || '');
            formData.append("status", values.status);

            if (this.isAdd) {
              if (this.updateRecord) {
                formData.append("parentId", this.updateRecord.parentId);
              } else {
                formData.append("parentId", values.parentName);
              }
              addDepartment(formData).then(res => {
                if (res.code === 0) {
                  this.$message.success(res.msg);
                  this.refreshTable();
                  this.changeVisible(false);
                } else {
                  this.$message.error(res.msg);
                  this.changeVisible(true);
                }
              })
            } else {
              formData.append("deptId", this.updateRecord.deptId);
              formData.append("parentId", this.updateRecord.parentId);
              formData.append("parentName", this.updateRecord.parentName);
              editDepartment(formData).then(res => {
                if (res.code === 0) {
                  this.$message.success(res.msg);
                  this.refreshTable();
                  this.changeVisible(false);
                } else {
                  this.$message.error(res.msg);
                  this.changeVisible(true);
                }
              })
            }
          }
        });
        this.confirmLoading = false;
        this.form.resetFields();
      },
      /*点击取消*/
      handleCancel() {
        this.changeVisible(false);
        this.form.resetFields()
      },
    }
  }
</script>