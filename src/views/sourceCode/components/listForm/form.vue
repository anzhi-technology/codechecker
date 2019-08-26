<template>
  <div>
    <a-card title="添加项目">
      <a-form :form="form" @submit="handleSubmit">
        <a-row>
          <a-col>
            <!--项目名称-->
            <a-form-item label="项目名称" v-bind="formItemLayout">
              <a-input placeholder="请输入项目名称"
                       v-decorator="['name',{
                       initialValue:sid ? projectData.name : '',
                       rules: [{ required: true, message: '项目名称不能为空!' }] }]"/>
            </a-form-item>
            <!--开发语言-->
            <a-form-item v-bind="formItemLayout" label="开发语言" extra="C++、PHP等语言检测敬请期待！">
              <a-radio-group v-decorator="['lang',{initialValue:sid ? projectData.lang : 'Java',}]">
                <template v-for="item in projectConfig.lang">
                  <a-radio v-if="item.value === 'Java'" :value="item.value">
                    {{item.language}}
                  </a-radio>
                  <a-radio else :value="item.value" disabled>
                    {{item.language}}
                  </a-radio>
                </template>
              </a-radio-group>
            </a-form-item>
            <!--描述-->
            <a-form-item v-bind="formItemLayout" label="描述">
              <a-textarea placeholder="项目简介"
                          :rows="4"
                          v-decorator="['desc',{initialValue:sid ? projectData.desc : ''}]"/>
            </a-form-item>
            <!--JDk版本-->
            <a-form-item v-bind="formItemLayout" label="JDK版本" extra="jdk8以下的版本选择8；jdk8以上的版本选择10;">
              <a-radio-group v-decorator="['jdkVersion',{initialValue:sid ? projectData.jdkVersion : '8',}]">
                <a-radio v-for="item in projectConfig.jdkVersion" :value="item.value">
                  {{item.version}}
                </a-radio>
              </a-radio-group>
            </a-form-item>
            <!--工程类型-->
            <a-form-item v-bind="formItemLayout" label="工程类型">
              <a-radio-group v-decorator="['projectType',{initialValue:sid ? projectData.isMaven : 1}]"
                             @change="changeProjectType">
                <a-radio :value="1">Maven工程</a-radio>
                <a-radio :value="0">普通工程</a-radio>
              </a-radio-group>
            </a-form-item>
            <!--代码源-->
            <a-form-item v-bind="formItemLayout" label="代码源">
              <a-radio-group v-decorator="['codeSource',{initialValue:sid ? projectData.repoType : 'GitHub'}]">
                <a-radio v-for="item in projectConfig.codeSource" :value="item.value">
                  {{item.source}}
                </a-radio>
              </a-radio-group>
            </a-form-item>
            <!--自动检测-->
            <a-form-item v-bind="formItemLayout" label="自动检测">
              <a-switch v-decorator="['switch', { valuePropName: 'checked',initialValue:projectData.schedule === 1  ? 'checked' : null}]"
                        @change='autoCheckChange'/>
            </a-form-item>
            <!--检测周期-->
            <a-form-item v-bind="formItemLayout" label="检测周期" v-if="autoCheck" extra="提示：周期间隔大于1小时；">
              <a-input placeholder="请输入Cron表达式；例：0 0 0-2 * * ？"
                       v-decorator="['cronPeriod',{
                              initialValue:sid ? projectData.cron : '',
                              rules: [{ required: true, message: '检测周期不能为空!' },{ validator:analysis}],validateTrigger: 'blur' }]">
              </a-input>
            </a-form-item>
            <!--验证方式-->
            <a-form-item v-bind="formItemLayout" label="验证方式">
              <a-radio-group v-decorator="['tokenTypeChoose',{initialValue:token === ''?'account':'token'}]"
                             @change="changeValidateType">
                <a-radio value="account">账号密码</a-radio>
                <a-radio value="token">Token</a-radio>
              </a-radio-group>
            </a-form-item>
            <!--地址-->
            <a-form-item label="仓库地址" v-bind="formItemLayout">
              <a-input placeholder="请输入仓库地址"
                       v-decorator="['url',{
                       initialValue:sid ? projectData.url : '',
                       rules: [{ required: true, message: '仓库地址不能为空!' }] }]"/>
            </a-form-item>
            <!--账号-->
            <a-form-item label="账号" v-bind="formItemLayout" v-if="validateType === 'account'">
              <a-input placeholder="请输入账号"
                       v-decorator="['userName',{initialValue:userName}]"/>
            </a-form-item>
            <!--密码-->
            <a-form-item label="密码" v-bind="formItemLayout" v-if="validateType === 'account'">
              <a-input placeholder="请输入密码"
                       v-decorator="['password',{initialValue:password}]"/>
            </a-form-item>
            <!--Token-->
            <a-form-item v-if="validateType === 'token'" label="Token" v-bind="formItemLayout">
              <a-input placeholder="请输入Token"
                       v-decorator="['token',{
                       initialValue:token,
                       rules: [{ required: true, message: 'Token不能为空！' }]
                       }]"/>
            </a-form-item>
            <!--Jar路径-->
            <a-form-item
              v-bind="formItemLayout"
              label="jar路径"
              v-if="projectType === 0"
            >
              <a-input-search placeholder="请输入jar路径" v-decorator="['classPath',{
                                                         initialValue:sid ? projectData.classpath : '',
                                                         rules: [{ required: true, message: 'jar路径不能为空!' }] }]"
                              @search="checkPath">
                <a-button slot="enterButton">检测路径</a-button>
              </a-input-search>
            </a-form-item>
            <a-form-item :wrapper-col="{ span: 12, offset: 4 }">
              <a-button type="primary" html-type="submit">保存</a-button>
              <a-button style="margin-left: 8px" @click="()=>form.resetFields() ">重置</a-button>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
  </div>
</template>
<script>
  import projectConfig from "@/utils/config/projectConfig"
  import {getSingleProject, analyzeCron, checkClassPath, addProject, editProject} from "@/api/sourceCode/list";
  import {isNull, timeToDateString} from "@/utils/myUtils";

  export default {
    data() {
      return {
        formItemLayout: {
          labelCol: {span: 4},
          wrapperCol: {span: 18},
        },
        projectConfig,
        form: this.$form.createForm(this),
        projectType: 1,
        autoCheck: false,
        validateType: "account",
        sid: null,
        projectData: {},
        userName: '',
        password: '',
        token: '',
        timeArray: [],//cron解析出的时间
      }
    },
    watch: {
      //监听相同路由下参数变化的时候，从而实现异步刷新
      '$route'(to, from) {
        //做一些路由变化的响应
        //重新获取数据
        this.getData();
      },
    },
    created() {
      this.$nextTick(() => {
        this.sid = this.$route.params.parameter;
        if (!isNull(this.sid)) {
          this.getData();
        }
      });
    },
    methods: {
      //编辑状态时获取单个项目的数据
      getData() {
        this.sid = this.$route.params.parameter;
        this.userName = '';
        this.password = '';
        this.token = '';
        return getSingleProject(this.sid).then(res => {
          this.projectData = res.data;
          let auth = res.data.auth.split(":");
          if (res.data.auth.indexOf(":") >= 0 || isNull(auth)) {
            this.userName = auth[0];
            this.password = auth[1];
          } else {
            this.token = res.data.auth;
          }
          //初始话时，文本框的显示与隐藏
          if (!isNull(this.token)) this.validateType = 'token';
          if (res.data.schedule === 1) this.autoCheck = true;
          this.projectType = res.data.isMaven;
        })
      },
      //提交保存
      handleSubmit(e) {
        e.preventDefault();
        this.form.validateFields((err, values) => {
          if (!err) {
            let projectJson = this.initProjectDataJson(values);
            if (isNull(this.sid)) {
              addProject(projectJson).then(res => {
                if (res.status === 200) {
                  this.$router.push("/sourceCode/list");
                }
              });
            } else {
              console.log(projectJson);
              editProject(projectJson).then(res => {
                if (res.status === 200) {
                  this.$router.push("/sourceCode/list");
                }
              })
            }
          }
        });
      },
      //改变项目类型 判断是否隐藏jar路径输入框
      changeProjectType(e) {
        this.projectType = e.target.value;
      },
      //改变验证方式
      changeValidateType(e) {
        this.validateType = e.target.value;
      },
      //改变自动检测
      autoCheckChange(checked) {
        this.autoCheck = checked;
      },
      //解析Cron表达式
      analysis(rule, value, callback) {
        analyzeCron(value).then(res => {
          if (res.code === 0) {
            let data = res.data;
            let dataDiff;
            //计算时间差
            if (!isNull(data)) {
              let secondData = new Date(timeToDateString(data[1]).replace(/-/g, "/"));
              let fristData = new Date(timeToDateString(data[0]).replace(/-/g, "/"));
              dataDiff = secondData.getTime() - fristData.getTime();
            }
            if (!isNull(dataDiff) && dataDiff >= 3600000) {
              let newData = [];
              data.forEach(item => {
                newData.push(timeToDateString(item));
              });
              this.timeArray = newData;
              callback();
            } else {
              callback(new Error('周期间隔小于一小时！'));
            }
          } else {
            return callback(new Error('cron表达式不正确！'));
          }
        })
      },
      //检测classPath
      checkPath(value) {
        this.form.validateFields((err, values) => {
          if (!err) {
            let projectJson = this.initProjectDataJson(values);
            checkClassPath(projectJson).then(res => {
              let fileContent = res.data.join(`;\n`);
              this.$info({
                title: '该路径下的所有文件',
                content: h('div',{}, [
                  h('p', 'some messages...some messages...'),
                  h('p', 'some messages...some messages...'),
                ]),
              });
            })
          }
        });
      },
      //封装参数
      initProjectDataJson(values) {
        let projectJson = this.projectData;
        projectJson.name = values.name;
        projectJson.lang = values.lang;
        projectJson.desc = values.desc;
        projectJson.jdkVersion = values.jdkVersion;
        projectJson.isMaven = values.projectType;
        projectJson.repoType = values.codeSource;
        projectJson.schedule = values.switch ? 1 : 0;
        projectJson.cron = values.cronPeriod;
        projectJson.url = values.url;
        if (values.tokenTypeChoose === 'account') {
          projectJson.auth = isNull(values.userName) ? '' : `${values.userName}:${values.password}`
        } else {
          projectJson.auth = values.token;
        }
        projectJson.classPath = values.classPath;

        return projectJson;
      }
    }
  }
</script>