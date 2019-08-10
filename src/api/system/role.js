import { post, get } from "@/utils/request";
import config from '@/utils/config'
/**
 * 角色管理
 */

/*获取角色请求*/
export function getRoleList(
  params = {
    pageNum: 1,
    pageSize: 9999,
    orderByColumn: "createTime",
    isAsc: "desc"
  }
) {
  return post(`${config.adminPrefix}/system/role/list`, params);
}
/*改变角色状态请求*/
export function changeRoleStatus(data = {}) {
  return post(`${config.adminPrefix}/system/role/changeStatus`, data);
}


/*新增角色*/
export function addRole(data = {}) {
  return post(`${config.adminPrefix}/system/role/add`, data);
}

/*删除角色*/
export function removeRole(data = {}) {
  return post(`${config.adminPrefix}/system/role/remove`, data);
}

/*校验角色名称*/
export function checkRoleNameUnique(data = {}) {
  return post(`${config.adminPrefix}/system/role/checkRoleNameUnique`, data);
}

/*校验权限字符*/
export function checkRoleKeyUnique(data = {}) {
  return post(`${config.adminPrefix}/system/role/checkRoleKeyUnique`, data);
}

/*编辑角色*/
export function editRole(data = {}) {
  return post(`${config.adminPrefix}/system/role/edit`, data);
}

/*获取相关角色的用户*/
export function getRoleUsers(params = {}) {
  return post(`${config.adminPrefix}/system/role/authUser/allocatedList`, params);
}

/*获取没有授权相关角色的用户*/
export function getNoRoleUsers(params = {}) {
  return post(`${config.adminPrefix}/system/role/authUser/unallocatedList`, params);
}

/*添加没有授权相关角色的用户*/
export function addNoRoleUsers(params = {}) {
  return post(`${config.adminPrefix}/system/role/authUser/selectAll`, params);
}

/*取消授权相关角色的用户*/
export function cancelRoleUsers(params = {}) {
  return post(`${config.adminPrefix}/system/role/authUser/cancel`, params);
}

/*数据权限*/
export function authDataScope(params = {}) {
  return post(`${config.adminPrefix}/system/role/authDataScope`, params);
}