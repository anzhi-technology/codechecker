import { post, get } from "@/utils/request";
import config from '@/utils/config'

/**
* 部门的所有请求
* */

/*获取部门信息列表*/
export function getDepartmentList(params = {}) {
  return get(`${config.adminPrefix}/system/dept/list`, params);
}

/*获取部门TreeData*/
export function getDepartmentTreeData(params = {}) {
  return get(`${config.adminPrefix}/system/dept/treeData2`, params);
}

/*通过roleId获取相应的部门*/
export function getDeptByRoleId(roleId,data = {}) {
  return get(`${config.adminPrefix}/system/dept/roleDeptTreeData?roleId=` + roleId , data);
}

/*校验部门名称*/
export function checkDeptNameUnique(data = {}) {
  return post(`${config.adminPrefix}/system/dept/checkDeptNameUnique`, data);
}

/*新增保存部门*/
export function addDepartment(data = {}) {
  return post(`${config.adminPrefix}/system/dept/add`, data);
}

/*新增保存部门*/
export function editDepartment(data = {}) {
  return post(`${config.adminPrefix}/system/dept/edit`, data);
}

/*新增保存部门*/
export function removeDepartment(deptId,data = {}) {
  return get(`${config.adminPrefix}/system/dept/remove/` + deptId, data);
}