<template>
  <div class="taskList">
    <a-modal title="任务列表"
             :visible="taskVisible"
             :destroyOnClose="true"
             :confirmLoading="confirmLoading"
             @cancel="handleCancel"
             width="70%"
             :centered=true
             style="left: 100px;">
      <!--底部按钮的自定义-->
      <template slot="footer">
        <a-button key="back" type="primary" @click="handleCancel">关闭</a-button>
      </template>
      <div class="tableContent">
        <a-tabs type="card">
          <a-tab-pane tab="正在检测的任务" key="1">
            <a-row>
              <a-col :span="24">
                <a-table :rowSelection="rowSelection" :columns="columns" :dataSource="runningData" :loading="loading" :pagination="pagination"
                         :rowKey="record => record.id">
                  <!--检测状态-->
                  <span slot="progress" slot-scope="text">
                  <a-tag color="#2db7f5">{{text}}</a-tag>
                </span>
                  <!--操作列-->
                  <span slot="action" slot-scope="text, record">
                    <a-popconfirm v-if="runningData.length" title="确定删除?" @confirm="() => deleteTask(record.id)" okText="确定" cancelText="取消">
                      <a-button size="small" style="background-color: #DC6068; color: #fff" icon="delete" title="删除">
                      </a-button>
                    </a-popconfirm>
                  </span>
                </a-table>
              </a-col>
            </a-row>
          </a-tab-pane>
          <a-tab-pane tab="全部任务" key="2">
            <a-row>
              <a-col :span="24">
                <a-table :rowSelection="rowSelection" :columns="columns" :dataSource="allData" :loading="loading" :pagination="pagination"
                         :rowKey="record => record.id">

                  <!--检测状态-->
                  <span slot="progress" slot-scope="text">
                  <a-tag color="#2db7f5" v-if="text === '正在检测'">{{text}}</a-tag>
                  <a-tag color="#108ee9" v-if="text === '成功'">{{text}}</a-tag>
                  <a-tag color="#87d068" v-if="text === '取消'">{{text}}</a-tag>
                  <a-tag color="#f50" v-if="text === '异常'">{{text}}</a-tag>
                  <a-tag color="#EDAE67" v-if="text === '超时'">{{text}}</a-tag>
                  <a-tag color="#D3DADD" v-if="text === '不存在'">{{text}}</a-tag>
                </span>

                  <!--操作列-->
                  <span slot="action" slot-scope="text, record">
                    <a-popconfirm v-if="allData.length" title="确定删除?" @confirm="() => deleteTask(record.id)" okText="确定" cancelText="取消">
                      <a-button size="small" style="background-color: #DC6068; color: #fff" icon="delete" title="删除">
                      </a-button>
                    </a-popconfirm>
                  </span>
                </a-table>
              </a-col>
            </a-row>
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-modal>
  </div>
</template>

<script>
  import {getTasksList} from '@/api/sourceCode/list';
  import {getColumn, timeToDateString} from "@/utils/myUtils";
  import config from '@/utils/config'
  //import initDict from "@/mixins/initDict";
  export default {
    name: "taskList",
    //mixins: [initDict],
    props: {
      taskVisible: {
        type: Boolean,
        required: true
      },
    },
    data() {
      return {
        confirmLoading: false,
        loading: false,
        runningData: [],
        allData: [],
        pagination: config.pagination,
        taskIds: '',
        intervalFlag: '',
      }
    },
    computed: {
      columns() {
        const columns = [
          getColumn("序号", "index", (a, b) => a.index - b.index),
          getColumn("任务名称", "project.name", (a, b) => a.name.localeCompare(b.name)),
          getColumn("检测状态", "progress", (a, b) => a.progress.localeCompare(b.progress)),
          getColumn("开始时间", "startTime", (a, b) => (a.startTime < b.startTime ? 1 : -1)),
          {
            title: "操作",
            key: "action",
            scopedSlots: {customRender: "action"}
          }
        ];
        return columns;
      },
      rowSelection() {
        const {selectedRowKeys} = this;
        return {
          onChange: (selectedRowKeys) => {
            this.taskIds = selectedRowKeys;
          },
          getCheckboxProps: record => ({
            props: {
              disabled: record.name === 'Disabled User', // Column configuration not to be checked
              name: record.name,
            }
          }),
        }
      }
    },
    mounted() {
      this.$nextTick(() => {
        //判断是否有正在检测的状态，为true时，为定时刷新
        this.getData().then(()=>{
          if(this.runningData.length !== 0){
            this.intervalFlag = setInterval(()=>{ this.getData() },5000);
          }
        })
      });
    },
   /* created() {
      this.$nextTick(() => {
        this.getData();
      });
    },*/
    methods: {
      changeDataVisible(visible) {
        this.$emit("changeDataVisible", visible)
      },
      refreshTable() {
        this.$emit("refreshTable")
      },
      /*获取任务列表*/
      getData() {
       return getTasksList().then(res => {
          if (res.status === 200) {
            res.data.forEach((item, index) => {
              item.index = index + 1;
              item.startTime = timeToDateString(item.startTime);
            });
            this.allData = res.data;
            this.runningData = res.data.filter(item => item.progress === "正在检测"); //筛选出正在检测的任务
            if(this.runningData.length === 0) clearInterval(this.intervalFlag);      //没有检测任务的时候清除定时器
          }
        });
      },
      /*点击取消*/
      handleCancel() {
        this.changeDataVisible(false);
      },
      deleteTask(id) {

      }
    }
  }
</script>

<style lang="less" type="text/less" scoped>
</style>