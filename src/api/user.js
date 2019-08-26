import { post ,get } from '@/utils/request';
import config from '@/utils/config'
// 登入请求
export function login(data = {}) {
  return post(`${config.adminPrefix}/login`, data);
}

// 退出请求
export function logout(data = {}) {
  return get(`${config.adminPrefix}/logout`, data);
}