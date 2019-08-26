<template>
  <div>
    <a-tree
      :treeData="treeData"
      showLine
      :defaultExpandAll=false
      @select="onSelect"
      @expand="onExpand"
      :expandedKeys="newExpandedKeys"
      :autoExpandParent="newAutoExpandParent"
    >
      <template slot="title" slot-scope="{title}">
        <span v-if="title.indexOf(searchValue) > -1">
          {{title.substr(0, title.indexOf(searchValue))}}
          <span style="color: #f50">{{searchValue}}</span>
          {{title.substr(title.indexOf(searchValue) + searchValue.length)}}
        </span>
        <span v-else>{{title}}</span>
      </template>
    </a-tree>
  </div>
</template>

<script>
  import Bus from '@/utils/bus';

  export default {
    name: "treeList",
    props: {
      treeData: {
        type: Array,
        required: true
      },
      expandedKeys: {
        type: Array,
        required: true
      },
      autoExpandParent: {
        type: Boolean,
        required: true
      },
    },
    data() {
      return {
        dataList: [],
        newExpandedKeys: this.expandedKeys,
        newAutoExpandParent: this.autoExpandParent,
        searchValue: "",
        filePath: '',
      }
    },
    methods: {
      onSelect(key, e) {
        console.log(e);
        if(e.selected){
          let detail = e.selectedNodes[0].data.props.detail;
          let ruleID =detail[0].ruleID;
          let newFunctionNamespaces = detail[0].functionNamespaces.split('.').join('/');
          let sourceFilePath = detail[0].sourceFilePath;
          if (sourceFilePath.indexOf(newFunctionNamespaces) > 0) {
            this.filePath = sourceFilePath;
          } else {
            this.filePath = newFunctionNamespaces + e.selectedNodes[0].data.props.title;
          }
          //调用传参方法
          let dataArray = {filePath:this.filePath,ruleID:ruleID};
          this.setData(dataArray);
        }
      },
      /*公共组件的传文件路径*/
      setData(data) {
        Bus.$emit('getData', data);
      },
      onExpand(expandedKeys) {
        this.newExpandedKeys = expandedKeys;
        this.newAutoExpandParent = false;
      },
      /*搜索节点*/
      searchNode(value) {
        this.generateList(this.treeData);
        const expandedKeys = this.dataList.map((item) => {
          if (item.key.indexOf(value) > -1) {
            return this.getParentKey(item.key, this.treeData)
          }
          return null
        }).filter((item, i, self) => item && self.indexOf(item) === i);
        Object.assign(this, {
          newExpandedKeys: expandedKeys,
          searchValue: value,
          newAutoExpandParent: true,
        });
      },
      /*生成Tree List*/
      generateList(data) {
        for (let i = 0; i < data.length; i++) {
          const node = data[i];
          const key = node.key;
          this.dataList.push({title: node.title, key});
          if (node.children) {
            this.generateList(node.children);
          }
        }
      },
      /*获取ParentKey*/
      getParentKey(key, tree) {
        let parentKey;
        for (let i = 0; i < tree.length; i++) {
          const node = tree[i];
          if (node.children) {
            if (node.children.some(item => item.key === key)) {
              parentKey = node.key
            } else if (this.getParentKey(key, node.children)) {
              parentKey = this.getParentKey(key, node.children)
            }
          }
        }
        return parentKey
      }
    }
  }
</script>

<style scoped>

</style>