import axios from 'axios';
import router from '@/router/router';
import { message } from 'ant-design-vue';

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  // timeout: 5000 // request timeout
});

// http request 拦截器
service.interceptors.request.use(
  config => {
    // do something before request is sent
    return config;
  },
  error => {
    // do something with request error
    message.error('请求超时!');
    return Promise.reject(error);
  }
);

// http response 拦截器
service.interceptors.response.use(
  response => {
    const code = response.status;
    if (code < 200 || code > 300) {
      return Promise.reject('response error: ' + code);
    } else {
      if (response.data.status === 401) {
        message.error('登陆过期，请重新登录！');
        router.push({
          path: '/login'
        });
        return Promise.reject(response.data.msg);
      }else if(response.data.status === 500){
        message.error(response.data.msg);
      } else {
        return response.data;
      }
    }
  },
  error => {
    //console.log(error);
    if (error.response.status === 504 || error.response.status === 404) {
      message.error('服务器被吃了⊙﹏⊙∥');
    } else if (error.response.status === 302) {
      message.error('登陆过期，请重新登录！');
      router.push({
        path: '/login'
      });
    } else {
      message.error('权限不足,请联系管理员!');
    }

    return Promise.resolve(error);
  }
);

/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */

export function get(url, data = {}) {
  return service.request({
    url: url,
    method: 'get',
    data
  });
}

/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function post(url, data = {}) {
  return service.request({
    url: url,
    method: 'post',
    data
  });
}

/**
 * 封装delete请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function del(url, data = {}) {
  return service.request({
    url: url,
    method: 'delete',
    data
  });
}

/**
 * 封装put请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function put(url, data = {}) {
  return service.request({
    url: url,
    method: 'put',
    data
  });
}

export default service;
