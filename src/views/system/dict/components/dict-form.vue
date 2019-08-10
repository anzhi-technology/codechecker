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
            <a-form-item label="字典名称" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
              <a-input placeholder="请输入字典名称"
                       v-decorator="['dictName', {initialValue: updateRecord?updateRecord.dictName:'',
                                                  rules: [{ required: true, message: '字典名称不能为空！' }],
                                                  validateTrigger: 'blur'}]"/>
            </a-form-item>

            <a-form-item label="字典类型" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
              <a-input placeholder="请输入字典类型"
                       v-decorator="['dictType',{initialValue: updateRecord?updateRecord.dictType:'',
                                                 rules: [{ required: true, message: '字典类型不能为空！' },{ validator:checkDictType}],
                                                 validateTrigger: 'blur'}]"/>
            </a-form-item>

            <a-form-item :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }" label="状态">
              <a-radio-group v-decorator="['status',{initialValue: updateRecord?updateRecord.status:'0'}]">
                <a-radio :value="item.dictValue" v-for="item in statusDicts" :key="item.dictCode">
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
  import {addDict,editDict,checkDictTypeUnique} from "@/api/system/dict";

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
      statusDicts: {
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
        confirmLoading: false,
        form: this.$form.createForm(this),
      }
    },
    computed: {
      title(){
        if (this.isAdd) {
          return "添加字典"
        }else {
          return "编辑字典"
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
      /*验证字典类型*/
      checkDictType(rule, value, callback) {
        let formData = new FormData();
        formData.append("dictType", value);
        if (this.updateRecord) formData.append("dictId", this.updateRecord.dictId);
        checkDictTypeUnique(formData).then(res => {
          if (res === 0) {
            callback();
          } else {
            return callback(new Error('该字典类型已经存在'));
          }
        });
      },
      /*点击确定*/
      handleOk() {
        this.confirmLoading = true;
        this.form.validateFields((err, values) => {
          if (!err){
            let formData = new FormData();
            formData.append("dictName",values.dictName);
            formData.append("dictType",values.dictType);
            formData.append("status",values.status);
            formData.append("remark",values.remark);
            if (this.updateRecord) {
              formData.append("dictId",this.updateRecord.dictId);
              editDict(formData).then(value => {
                if (value.code === 0){
                  this.$message.success(value.msg);
                  this.refreshTable();
                }else {
                  this.$message.error(value.msg);
                }
              })
            }else {
              addDict(formData).then(value => {
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