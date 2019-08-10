import { post, get } from "@/utils/request";
import config from '@/utils/config'
/**
 * 用户管理的所有请求
 * */
//获取所有用户请求
export function getUserList(params = {
  pageNum: 1,
  pageSize: 9999,
  orderByColumn: "createTime",
  isAsc: "desc",
}) {
  return post(`${config.adminPrefix}/system/user/list`, params);
}
//获取单个用户信息
export function getSingleUser(userId,data = {}) {
  return get(`${config.adminPrefix}/system/user/baseInfo/`+userId, data);
}
//验证loginName请求
export function checkLoginNameUnique(data = {}) {
    return post(`${config.adminPrefix}/system/user/checkLoginNameUnique`, data);
}
//验证phonenumber请求
export function checkPhonenumberUnique(data = {}) {
    return post(`${config.adminPrefix}/system/user/checkPhoneUnique`, data);
}
//验证email请求
export function checkEmailUnique(data = {}) {
    return post(`${config.adminPrefix}/system/user/checkEmailUnique`, data);
}
//添加用户请求
export function addUser(data = {}) {
    return post(`${config.adminPrefix}/system/user/add`, data);
}
//改变用户状态请求
export function changeUserStatus(data = {}) {
    return post(`${config.adminPrefix}/system/user/changeStatus`, data);
}
//编辑用户的请求
export function editUser(data = {}) {
  return post(`${config.adminPrefix}/system/user/edit`, data);
}
//删除用户的请求
export function deleteUser(data = {}) {
    return post(`${config.adminPrefix}/system/user/remove`, data);
}
//重置密码的请求
export function resetPassword(data = {}) {
    return post(`${config.adminPrefix}/system/user/resetPwd`, data);
}

//获取字典列表
export function getDicts(data = {}) {
  return post(`${config.adminPrefix}/system/dict/list`, data);
}

//获取字典数据
export function getDictData(data = {}) {
  return post(`${config.adminPrefix}/system/dict/data/list`, data);
}

//获取参数数据
export function getConfigData(data = {}) {
  return post(`${config.adminPrefix}/system/config/list`, data);
}
