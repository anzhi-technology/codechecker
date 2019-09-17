<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">源码检测审计系统</div>
      <a-form id="components-form-demo-normal-login" :form="form" class="login-form" @submit="handleSubmit">
        <a-form-item>
          <a-input v-decorator="['userName', { rules: [{ required: true, message: '请输入用户名!' }] }]" placeholder="Username">
            <a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)"/>
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-input v-decorator="['password',{ rules: [{ required: true, message: '请输入密码!' }] }]" type="password" placeholder="Password"
          >
            <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)"/>
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-button :loading="logging" type="primary" html-type="submit" class="login-form-button">登陆</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>


<script>
import {login} from '@/api/user';
import {setObjArr} from '@/utils/auth'
export default {
  name: 'Login',
  data() {
    return {
      logging: false
    };
  },
  beforeCreate() {
    this.form = this.$form.createForm(this);
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          this.logging = true;
          let formData = new FormData();
          formData.append('username', values.userName);
          formData.append('password', values.password);
          formData.append('rememberMe', "true");
          return login(formData).then(res => {
            this.logging = false;
            // 判断是否登录成功
            this.loading = false;
            setObjArr("userName",res.data.username);
            //this.$router.push('/sourceCode/overview');
            window.location.href = "/sourceCode/overview";
          });
        }
      });
    }
  }
};
</script>

<style scoped>
  @import "../../assets/css/main.less";

  .login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url(../../assets/images/login-bg.jpg);
    background-size: 100%;
  }

  .ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 350px;
    margin: -190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(63, 140, 206, 0.3);
    overflow: hidden;
  }

  .ms-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: #fff;
    border-bottom: 1px solid #ddd;
  }

  #components-form-demo-normal-login {
    padding: 10px 10px;
  }

  #components-form-demo-normal-login .login-form-button {
    width: 100%;
  }
</style>
