<template>
  <div>
    <a-row>
      <a-col :span="24">
        <a-card title="项目列表" :bordered="false" style="height:100%" id="linuxTable">
          <a-button type="primary" size="small" slot="extra" @click="taskList">任务列表</a-button>
          <div class="tableContent">
            <a-row>
              <a-col :span="24">
                <TopTools @getSearchCondition="getSearchVal"
                          :dataSource="dataSource"
                          :tHeader="tHeader"
                          :filterVal="filterVal"
                          :downLoadTitle="downLoadTitle">
                  <router-link :to="{ path: '/sourceCode/add' }">
                    <a-button type="primary" size="small">添加项目</a-button>
                  </router-link>
                </TopTools>
              </a-col>
              <a-col :span="24">
                <a-table :columns="columns" :dataSource="TableData" :pagination="pagination" :loading="loading" :rowKey="record => record.id">

                  <!--检测状态-->
                  <span slot="status" slot-scope="text">
                  <a-tag color="#2db7f5" v-if="text === '正在检测'">{{text}}</a-tag>
                  <a-tag color="#108ee9" v-if="text === '成功'">{{text}}</a-tag>
                  <a-tag color="#87d068" v-if="text === '取消'">{{text}}</a-tag>
                  <a-tag color="#f50" v-if="text === '异常'">{{text}}</a-tag>
                  <a-tag color="#EDAE67" v-if="text === '超时'">{{text}}</a-tag>
                  <a-tag color="#D3DADD" v-if="text === '不存在'">{{text}}</a-tag>
                </span>

                  <!--克隆状态-->
                  <span slot="cloned" slot-scope="text">
                  <a-tag color="#2db7f5" v-if="text === 'cloning'">正在克隆</a-tag>
                  <a-tag color="#108ee9" v-if="text === 'cloned'">成功</a-tag>
                </span>
                  <!--定时检测-->
                  <span slot="schedule" slot-scope="text, record">
                  <a-switch v-if="text === 0" @change="onChange(record,text)"/>
                  <a-switch v-if="text === 1" defaultChecked @change="onChange(record,text)"/>
                </span>

                  <!--详细信息展示-->
                  <div slot="expandedRowRender" slot-scope="record" style="margin: 0;">
                    <a-row>
                      <a-col :span="6">jdk版本 ：{{record.jdkVersion}}</a-col>
                      <!--<a-col :span="6">创建时间：{{record.createDate}}</a-col>-->
                      <a-col :span="6">仓库类型：{{record.repoType}}</a-col>
                      <a-col :span="6">定时检测周期：{{record.cron || "非定时检测"}}</a-col>
                      <a-col :span="6">检测次数：{{record.detectNum || 0}}</a-col>
                    </a-row>
                    <a-row>
                      <a-col :span="24">项目描述 ：{{record.desc}}</a-col>
                    </a-row>
                  </div>

                  <!--操作列-->
                  <span slot="action" slot-scope="text, record">
                    <!--编辑-->
                     <router-link :to="{ path: '/sourceCode/edit/' + record.hcode }">
                      <a-button size="small" type="primary" title="编辑">
                        <span class="yyIcon iconedit"></span>
                      </a-button>
                    </router-link>&nbsp;
                    <!--删除-->
                    <a-popconfirm v-if="dataSource.length" title="确定删除?" @confirm="() => deleteSingleProject(record.id)" okText="确定" cancelText="取消">
                      <a-button size="small" style="background-color: #DC6068; color: #fff" title="删除">
                        <span class="yyIcon icondelete"></span>
                      </a-button>
                    </a-popconfirm>&nbsp;
                    <!--扫描-->
                    <a-popconfirm v-if="dataSource.length" @confirm="() => scan(record)" okText="确定" cancelText="取消">
                       <template slot="title">
                        <p>确定扫描?</p>
                        <a-checkbox @change="dependenceCheck">依赖检测</a-checkbox>
                      </template>
                       <a-button size="small" style="background-color: #2db7f5; color: #fff" title="扫描">
                        <span class="yyIcon iconscan"></span>
                      </a-button>
                    </a-popconfirm>&nbsp;
                    <!--统计-->
                     <router-link :to="{ path: '/sourceCode/summary/' + record.hcode }">
                     <a-button size="small" style="background-color: #EDAE67; color: #fff" title="统计">
                        <span class="yyIcon iconchart-area"></span></a-button>
                    </router-link>&nbsp;
                    <!--缺陷详情-->
                    <router-link :to="{ path: '/sourceCode/analyzeCode/' + record.hcode }">
                      <a-button size="small" style="background-color: #f50; color: #fff" title="缺陷详情">
                        <span class="yyIcon iconbug-report"></span></a-button>
                    </router-link>
                  </span>
                </a-table>
              </a-col>
            </a-row>
          </div>
        </a-card>
      </a-col>
    </a-row>
    <div class="taskList">
      <taskList :taskVisible="taskVisible"
                @changeDataVisible="changeDataVisible($event)"
                @refreshTable="getData"
      />
    </div>
  </div>
</template>

<script>
  import {getProjectsList, editProject, getSingleProject, deleteProject,scanProject} from '@/api/sourceCode/list';
  import TopTools from "@/components/Table/TopTools";
  import taskList from "./components/taskList"
  import {getWidthColumn, filterData, timeToDateString, isNull} from "@/utils/myUtils";
  import config from '@/utils/config'

  export default {
    name: 'projectList',
    components: {
      TopTools,
      taskList
    },
    data() {
      return {
        loading: false,
        taskVisible: false,
        dataSource: [],
        tHeader: ["项目名称", "开发语言", "创建时间", "克隆状态", "最新检测时间", "检测状态", "定时检测", "jdk版本", "定时检测周期", "检测次数", "仓库类型", "项目描述"],
        filterVal: ["name", "lang", "createDate", "cloned", "lastUpdate", "status", "schedule", "jdkVersion", "cron", "detectNum", "repoType", "desc"],
        downLoadTitle: '项目列表',
        pagination: config.pagination,
        searchCondition: "",
        isRefresh: false,
        intervalFlag: '',
        isDependenceCheck: "0"
      };
    },
    computed: {
      columns() {
        const columns = [
          getWidthColumn("项目名称", "name", (a, b) => a.name.localeCompare(b.name)),
          getWidthColumn("开发语言", "lang", "10%", (a, b) => a.lang.localeCompare(b.lang)),
          getWidthColumn("创建时间", "createDate", (a, b) => (a.createDate < b.createDate ? 1 : -1)),
          getWidthColumn("克隆状态", "cloned", "10%", (a, b) => a.cloned.localeCompare(b.cloned)),
          getWidthColumn("检测时间", "lastUpdate", (a, b) => (a.lastUpdate < b.lastUpdate ? 1 : -1)),
          getWidthColumn("检测状态", "status", "10%", (a, b) => a.status.localeCompare(b.status)),
          getWidthColumn("定时检测", "schedule", "10%",),
          {
            title: "操作",
            key: "action",
            width: "210px",
            align: 'center',
            scopedSlots: {customRender: "action"}
          }
        ];
        return columns;
      },
      TableData() {
        return filterData(this.searchCondition, this.dataSource);
      }
    },
    mounted() {
      this.$nextTick(() => {
        //判断是否有正在检测的状态，为true时，为定时刷新
        this.getData().then(() => {
          if (this.isRefresh) {
            this.intervalFlag = setInterval(() => {
              this.getData()
            }, 5000);
          }
        });
      });
    },
    methods: {
      //子组件传过来的值
      getSearchVal(msg) {
        this.searchCondition = msg;
      },
      // 获取数据
      getData() {
        this.loading = true;
        //请求检测列表数据
        return getProjectsList().then(res => {
          this.loading = false;
          if (res.status === 200) {
            //字段的格式化 如：创建时间createData
            res.data.forEach(obj => {
              obj.createDate = timeToDateString(obj.createDate);
              obj.lastUpdate = timeToDateString(obj.lastUpdate);
            });
            //按照创建时间排序
            res.data.sort((a, b) => (a.createDate < b.createDate ? 1 : -1));
            this.dataSource = res.data;
            this.isRefresh = this.dataSource.some(item => item.status === "正在检测");
            if (!this.isRefresh) clearInterval(this.intervalFlag);
          }
        });
      },
      /*改变data-permission modal的可见*/
      changeDataVisible(visible) {
        this.taskVisible = visible
      },
      /*点击按钮 弹出任务列表*/
      taskList() {
        this.changeDataVisible(true);
      },
      /*定时检测开关的按钮*/
      onChange(record, text) {
        getSingleProject(record.hcode).then(res => {
          if (text === 1) {
            res.data.schedule = 0;
            editProject(res.data).then(edit_res => {
              if (edit_res.status === 200) {
                this.$message.success('定时检测关闭！');
                this.getData();
              }
            });
          } else if (text === 0) {
            if (isNull(res.data.cron)) {
              this.$message.error('没有检测周期;请到编辑页面编辑！');
            } else {
              res.data.schedule = 1;
              editProject(res.data).then(edit_res => {
                if (edit_res.status === 200) {
                  this.$message.success('定时检测开启！');
                  this.getData();
                }
              });
            }
          }
        });
      },
      /*删除项目*/
      deleteSingleProject(id) {
        deleteProject(id).then(res => {
          if (res.data === 1) {
            this.$message.success('删除成功！');
            this.getData();
          } else {
            this.$message.error(res.msg);
          }
        })
      },
      /*扫描项目*/
      scan(record) {
        let data = {hcode:record.hcode,dependencyScan:this.isDependenceCheck};
        scanProject(data).then(res=>{

        })
      },
      /*判断是否有依赖检测*/
      dependenceCheck(e) {
        this.isDependenceCheck = e.target.checked ? "1" : "0";
      }
    },
    destroyed() {
      clearInterval(this.intervalFlag);
    }
  };
</script>

<style lang="less" type="text/less" scoped>
</style>
