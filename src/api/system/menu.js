import { post, get } from "@/utils/request";
import config from '@/utils/config'
/**
* 菜单的所有请求
* */

/*获取所有菜单*/
export function getAllMenu(data = {}) {
  return get(`${config.adminPrefix}/system/menu/list`, data);
}

/*获取角色菜单列表树*/
export function getRoleMenu(data = {}) {
  return get(`${config.adminPrefix}/system/menu/roleMenuTreeData2`, data);
}

/*获取菜单列表树*/
export function getMenuTree(data = {}) {
  return get(`${config.adminPrefix}/system/menu/menuTreeData`, data);
}

/*通过roleId获取相应的菜单*/
export function getMenuByRoleId(roleId,data = {}) {
  return get(`${config.adminPrefix}/system/menu/roleMenuTreeData?roleId=` + roleId , data);
}

/*验证菜单名称*/
export function checkMenuNameUnique(data = {}) {
  return post(`${config.adminPrefix}/system/menu/checkMenuNameUnique`, data);
}

/*添加菜单*/
export function addMenu(data = {}) {
  return post(`${config.adminPrefix}/system/menu/add`, data);
}

/*编辑菜单*/
export function editMenu(data = {}) {
  return post(`${config.adminPrefix}/system/menu/edit`, data);
}

/*删除菜单*/
export function removeMenu(menuId,data = {}) {
  return get(`${config.adminPrefix}/system/menu/remove/`+menuId, data);
}