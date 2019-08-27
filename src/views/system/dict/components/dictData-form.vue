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
            <a-form-item label="字典标签" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
              <a-input placeholder="请输入字典标签"
                       v-decorator="['dictLabel', {initialValue: updateRecord?updateRecord.dictLabel:'',
                                                   rules: [{ required: true, message: '字典标签不能为空！' }],
                                                   validateTrigger: 'blur'}]"/>
            </a-form-item>

            <a-form-item label="字典键值" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
              <a-input placeholder="请输入字典键值"
                       v-decorator="['dictValue',{initialValue: updateRecord?updateRecord.dictValue:'',
                                                  rules: [{ required: true, message: '字典键值不能为空！' }],
                                                  validateTrigger: 'blur'}]"/>
            </a-form-item>

            <a-form-item label="字典类型" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
              <a-input placeholder="请输入字典类型" disabled
                       v-decorator="['dictType',{initialValue: updateRecord?updateRecord.dictType:defaultDictType,
                                                 rules: [{ required: true, message: '字典类型不能为空！' }],
                                                 validateTrigger: 'blur'}]"/>
            </a-form-item>

            <a-form-item label="字典排序" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
              <a-input-number placeholder="请输入显示顺序" :min="0" :max="999999" style="width: 100%"
                              v-decorator="['dictSort',{initialValue: updateRecord?updateRecord.dictSort:'0',rules: [{ required: true, message: '输入内容不能为空或为数字！' }]}]"/>
            </a-form-item>

            <a-form-item :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }" label="系统默认">
              <a-radio-group v-decorator="['isDefault',{initialValue: updateRecord?updateRecord.isDefault:'Y'}]">
                <a-radio :value="item.dictValue" v-for="item in configStatusDicts" :key="item.dictCode">
                  {{item.dictLabel}}
                </a-radio>
              </a-radio-group>
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
import {addDictData, editDictData} from "@/api/system/dict";

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
    statusDicts: {
      type: Array,
      required: true
    },
    updateRecord: {
      type: Object,
      required: false
    },
    defaultDictType: {
      type: String,
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
    title() {
      if (this.isAdd) {
        return "添加数据"
      } else {
        return "编辑数据"
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
    /*点击确定*/
    handleOk() {
      this.confirmLoading = true;
      this.form.validateFields((err, values) => {
        if (!err) {
          let formData = new FormData();
          formData.append("dictLabel", values.dictLabel);
          formData.append("dictValue", values.dictValue);
          formData.append("dictType", values.dictType);
          formData.append("cssClass", '');
          formData.append("dictSort", values.dictSort);
          formData.append("listClass", '');
          formData.append("isDefault", values.isDefault);
          formData.append("status", values.status);
          formData.append("remark", values.remark);
          if (this.updateRecord) {
            formData.append("dictCode", this.updateRecord.dictCode);
            editDictData(formData).then(value => {
              if (value.code === 0) {
                this.$message.success(value.msg);
                this.refreshTable();
              } else {
                this.$message.error(value.msg);
              }
            })
          } else {
            addDictData(formData).then(value => {
              if (value.code === 0) {
                this.$message.success(value.msg);
                this.refreshTable();
              } else {
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