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
            <a-form-item label="参数名称" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
              <a-input placeholder="请输入参数名称"
                       v-decorator="['configName', {initialValue: updateRecord?updateRecord.configName:'',
                                                    rules: [{ required: true, message: '参数名称不能为空！' }]}]"/>
            </a-form-item>

            <a-form-item label="参数键名" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
              <a-input placeholder="请输入参数键名"
                       v-decorator="['configKey',{initialValue: updateRecord?updateRecord.configKey:'',
                                                  rules: [{ required: true, message: '参数键名不能为空！' },{ validator:checkConfigKey}],
                                                  validateTrigger: 'blur'}]"/>
            </a-form-item>

            <a-form-item label="参数键值" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
              <a-input placeholder="请输入参数键值"
                       v-decorator="['configValue',{initialValue: updateRecord?updateRecord.configValue:'',
                                                    rules: [{ required: true, message: '参数键值不能为空！' }]}]"/>
            </a-form-item>

            <a-form-item :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }" label="系统内置">
              <a-radio-group v-decorator="['configType',{initialValue: updateRecord?updateRecord.configType:'Y'}]">
                <a-radio :value="item.dictValue" v-for="item in configStatusDicts" :key="item.dictCode">
                  {{item.dictLabel}}
                </a-radio>
              </a-radio-group>
            </a-form-item>

            <a-form-item label="备注" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
              <a-textarea placeholder="备注信息" :rows="4" v-decorator="['remark',{initialValue: updateRecord?updateRecord.remark:''}]"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>

    </a-modal>
  </div>
</template>
<script>
import {addConfig, editConfig, checkConfigKeyUnique} from "@/api/system/config";

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
    configStatusDicts: {
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
        return "新增配置"
      }else {
        return "编辑配置"
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
    /*验证参数键名唯一性*/
    checkConfigKey(rule, value, callback) {
      let formData = new FormData();
      formData.append("configKey", value);
      if (this.updateRecord) {
        formData.append("configId", this.updateRecord.configId);
      }
      checkConfigKeyUnique(formData).then(res => {
        if (res === 0) {
          callback();
        } else {
          return callback(new Error('参数键名已存在'));
        }
      });

    },

    /*点击确定*/
    handleOk() {
      this.confirmLoading = true;

      this.form.validateFields((err, values) => {
        if (!err){
          let formData = new FormData();
          formData.append("configName",values.configName);
          formData.append("configKey",values.configKey);
          formData.append("configValue",values.configValue);
          formData.append("configType",values.configType);
          formData.append("remark",values.remark);

          if (this.updateRecord) {
            formData.append("configId",this.updateRecord.configId);
            editConfig(formData).then(value => {
              if (value.code === 0){
                this.$message.success(value.msg);
                this.refreshTable();
              }else {
                this.$message.error(value.msg);
              }
            })
          }else {
            addConfig(formData).then(value => {
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