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
      width="70%"
      :centered=true
      style="left: 100px;"
    >
      <a-form :form="form">
        <a-row>
          <a-col>
            <a-form-item label="公告标题" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
              <a-input placeholder="请输入公告标题"
                       v-decorator="['noticeTitle', {initialValue: updateRecord?updateRecord.noticeTitle:'',
                                                    rules: [{ required: true, message: '公告标题不能为空！' }]}]"/>
            </a-form-item>

            <a-form-item label="公告类型" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
              <a-select placeholder="请选择公告类型" v-decorator="['noticeType',{initialValue: updateRecord?updateRecord.noticeType:'2',}]">
                <a-select-option v-for="item in noticeDict" :key="item.dictCode" :value="item.dictValue">{{ item.dictLabel }}
                </a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item  label="公告内容" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }" >
              <div class="quill-editor-example">
                <!-- quill-editor -->
                <quill-editor  ref="myTextEditor"
                              v-model="content"
                               :options="editorOption"
                >
                </quill-editor>
              </div>
            </a-form-item>

            <a-form-item :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }" label="公告状态">
              <a-radio-group v-decorator="['status',{initialValue: updateRecord?updateRecord.status:'0'}]">
                <a-radio :value="item.dictValue" v-for="item in noticeStatusDict" :key="item.dictCode">
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
  import {addNotice, editNotice} from "@/api/system/notice";
  // require styles
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'
  import {quillEditor} from 'vue-quill-editor'

  export default {
    components: {
      quillEditor
    },
    props: {
      isAdd: {
        type: Boolean,
        required: true
      },
      visible: {
        type: Boolean,
        required: true
      },
      noticeStatusDict: {
        type: Array,
        required: true
      },
      noticeDict: {
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
        content: '',
        editorOption: {
          placeholder: "请输入公告内容！",
        }
      }
    },
    computed: {
      title() {
        if (this.isAdd) {
          return "添加公告"
        } else {
          return "编辑公告"
        }
      },
      editor() {
        return this.$refs.myTextEditor.quill
      },
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
            formData.append("noticeTitle", values.noticeTitle);
            formData.append("noticeType", values.noticeType);
            //formData.append("noticeContent",values.noticeContent);
            formData.append("noticeContent", 'test');
            formData.append("status", values.status);

            if (this.updateRecord) {
              formData.append("noticeId", this.updateRecord.noticeId);
              editNotice(formData).then(value => {
                if (value.code === 0) {
                  this.$message.success(value.msg);
                  this.refreshTable();
                } else {
                  this.$message.error(value.msg);
                }
              })
            } else {
              addNotice(formData).then(value => {
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

<style  scoped>
  @import "../../../../assets/css/editor.css";
</style>