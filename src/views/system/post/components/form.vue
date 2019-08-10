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
            <a-form-item label="岗位名称" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
              <a-input placeholder="请输入岗位名称"
                       v-decorator="['postName', {initialValue: updateRecord?updateRecord.postName:'',
                                                  rules: [{ required: true, message: '岗位名不能为空！' },{ validator:checkPostName}],
                                                  validateTrigger: 'blur'}]"/>
            </a-form-item>

            <a-form-item label="岗位编码" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
              <a-input placeholder="请输入岗位编码"
                       v-decorator="['postCode',{initialValue: updateRecord?updateRecord.postCode:'',
                                                 rules: [{ required: true, message: '岗位编码不能为空！' },{ validator:checkPostCodeUnique}],
                                                 validateTrigger: 'blur'}]"/>
            </a-form-item>

            <a-form-item label="显示顺序" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
              <a-input-number placeholder="请输入显示顺序" :min="0" :max="999999" style="width: 100%"
                              v-decorator="['postSort',{initialValue: updateRecord?updateRecord.postSort:'0',rules: [{ required: true, message: '输入内容不能为空或为数字！' }]}]"/>
            </a-form-item>

            <a-form-item :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }" label="岗位状态">
              <a-radio-group v-decorator="['status',{initialValue: updateRecord?updateRecord.status:'0'}]">
                <a-radio :value="item.dictValue" v-for="item in postStatusDicts" :key="item.dictCode">
                  {{item.dictLabel}}
                </a-radio>
              </a-radio-group>
            </a-form-item>

            <a-form-item label="备注" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
              <a-textarea placeholder="备注信息（选填）" :rows="4" v-decorator="['remark',{initialValue: updateRecord?updateRecord.remark:''}]"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>

    </a-modal>
  </div>
</template>
<script>
import {addPost, editPost, checkPostNameUnique, checkPostCodeUnique} from "@/api/system/post";

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
    postStatusDicts: {
      type: Array,
      required: true
    },
    updateRecord: {
      type: Object,
      required: false
    }
  },
  data() {
    return {
      ModalText: 'Content of the modal',
      confirmLoading: false,
      form: this.$form.createForm(this),
    }
  },
  computed: {
    title(){
      if (this.isAdd) {
        return "新增岗位"
      }else {
        return "编辑岗位"
      }
    }
  },
  methods: {
    changeVisible(visible) {
      this.$emit("changeVisible",visible)
    },
    refreshTable(){
      this.$emit("refreshTable")
    },
    /*验证岗位名称*/
    checkPostName(rule, value, callback) {
      let formData = new FormData();
      formData.append("postName", value);
      if (this.updateRecord) {
        formData.append("postId", this.updateRecord.postId);
      }
      checkPostNameUnique(formData).then(res => {
        if (res === 0) {
          callback();
        } else {
          return callback(new Error('岗位名称已存在'));
        }
      });

    },
    /*验证岗位编码*/
    checkPostCodeUnique(rule, value, callback) {
      let formData = new FormData();
      formData.append("postCode", value);
      if (this.updateRecord) {
        formData.append("postId", this.updateRecord.postId);
      }
      checkPostCodeUnique(formData).then(res => {
        if (res === 0) {
          callback();
        } else {
          return callback(new Error('岗位编码已存在'));
        }
      });
    },

    /*点击确定*/
    handleOk() {
      this.confirmLoading = true;

      this.form.validateFields((err, values) => {
        if (!err){
          let formData = new FormData();
          formData.append("postName",values.postName);
          formData.append("postCode",values.postCode);
          formData.append("postSort",values.postSort);
          formData.append("status",values.status);
          formData.append("remark",values.remark);

          if (this.updateRecord) {
            formData.append("postId",this.updateRecord.postId);
            editPost(formData).then(value => {
              if (value.code === 0){
                this.$message.success(value.msg);
                this.refreshTable();
              }else {
                this.$message.error(value.msg);
              }
            })
          }else {
            addPost(formData).then(value => {
              if (value.code === 0){
                this.$message.success(value.msg);
                this.refreshTable();
              }else {
                this.$message.error(value.msg);
              }
            })
          }
        }
      });
      this.confirmLoading = false;
      this.changeVisible(false);
      setTimeout(() => {
        this.form.resetFields()
      }, 500);
    },
    /*点击取消*/
    handleCancel() {
      this.changeVisible(false);
      this.form.resetFields()
    },
  }
}
</script>