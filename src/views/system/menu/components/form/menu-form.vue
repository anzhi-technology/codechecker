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
            <a-form-item label="上级菜单" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
              <a-tree-select :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }" :treeData="menuTreeData"
                             placeholder="请选择上级菜单" treeDefaultExpandAll v-decorator="['parentName',{initialValue: updateRecord?updateRecord.parentName:''}]">
              </a-tree-select>
            </a-form-item>

            <a-form-item label="菜单类型" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
              <a-radio-group @change="onMenuTypeChange" v-decorator="['menuType',{initialValue: updateRecord?updateRecord.menuType:''}]">
                <a-radio value="M">目录</a-radio>
                <a-radio value="C">菜单</a-radio>
                <a-radio value="F">按钮</a-radio>
              </a-radio-group>
            </a-form-item>

            <a-form-item label="菜单名称" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
              <a-input placeholder="菜单名称"
                       v-decorator="['menuName', {
                       initialValue: updateRecord?updateRecord.menuName:'',
                       rules: [
                       { required: true, message: '菜单名称不能为空！' },
                       { validator:checkMenuName}
                       ], validateTrigger: 'blur' }]"/>
            </a-form-item>

            <a-form-item v-show="this.menuTypes !== 'F'" label="请求地址" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }" >
              <a-input placeholder="请求地址"
                       v-decorator="['url', {initialValue: updateRecord?updateRecord.url:''}]"/>
            </a-form-item>

            <a-form-item v-show="this.menuTypes !== 'M'"  label="权限标识" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }" >
              <a-input placeholder="权限标识"
                       v-decorator="['perms', {initialValue: updateRecord?updateRecord.perms:'' }]"/>
              <a-icon type="exclamation-circle" /> 控制器中定义的权限标识，如：@RequiresPermissions("")
            </a-form-item>

            <a-form-item label="显示排序" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }" >
              <a-input-number placeholder="请输入显示顺序" :min="0" :max="999999" style="width: 100%"
                              v-decorator="['orderNum',{initialValue: updateRecord?updateRecord.orderNum:'0',rules: [{ required: true, message: '输入内容不能为空或为数字！' }]}]"/>
            </a-form-item>

            <a-form-item v-show="this.menuTypes === 'M'" label="图标" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
              <a-input placeholder="请选择图标"
                       v-decorator="['icon', {initialValue: updateRecord?updateRecord.icon:''}]"/>
            </a-form-item>

            <a-form-item label="菜单状态：" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }" >
              <a-radio-group v-decorator="['visible',{initialValue: updateRecord?updateRecord.visible:'0'}]">
                <a-radio :value="item.dictValue" v-for="item in menuStatusDicts" :key="item.dictCode">
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
  import {addMenu, editMenu,checkMenuNameUnique} from "@/api/system/menu";
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
      menuStatusDicts: {
        type: Array,
        required: true
      },
      updateRecord: {
        type: Object,
        required: false
      },
      menuTreeData: {
        type: Array,
        required: true
      },
    },
    data() {
      return {
        form: this.$form.createForm(this),
        confirmLoading: false,
        menuTypes:''
      }
    },
    computed: {
      title(){
        if (this.isAdd) {
          return "添加菜单"
        }else {
          return "编辑菜单"
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
      //校验菜单名称
      checkMenuName(rule, value, callback){
        let formData = new FormData();
        let parentId = this.updateRecord?this.updateRecord.parentId:'0';
        if(!this.isAdd) formData.append("menuId",this.updateRecord.menuId);
        formData.append("parentId",parentId);
        formData.append("menuName",value);
        checkMenuNameUnique(formData).then(res => {
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
          if (!err){
            let parentId = values.parentName?values.parentName:0;
            let formData = new FormData();
            formData.append("menuType",values.menuType);
            formData.append("menuName",values.menuName);
            formData.append("url",values.url || '');
            formData.append("target","menuItem");
            formData.append("perms",values.perms || '');
            formData.append("orderNum",values.orderNum);
            formData.append("icon",values.icon || '');
            formData.append("visible",values.visible);
            if (this.isAdd) {
              if(this.updateRecord){
                formData.append("parentId",this.updateRecord.parentId);
                console.log(this.updateRecord.parentId);
              }else{
                formData.append("parentId",parentId);
              }
              addMenu(formData).then(res => {
                if (res.code === 0){
                  this.$message.success(res.msg);
                  this.refreshTable();
                }else {
                  this.$message.error(res.msg);
                }
              })
            }else {
              formData.append("menuId",this.updateRecord.menuId);
              formData.append("parentId",this.updateRecord.parentId);
              editMenu(formData).then(res => {
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
          this.form.resetFields()
        }, 500);
      },
      /*点击取消*/
      handleCancel() {
        this.changeVisible(false);
        this.form.resetFields()
      },
      //菜单类型的转换
      onMenuTypeChange(e){
        this.menuTypes = e.target.value;
      }
    }
  }
</script>