import {post} from "@/utils/request";
import config from '@/utils/config'

/**
 * 配置管理
 */
/*获取配置信息列表*/
export function getConfigList(
  params = {
    pageNum: 1,
    pageSize: 9999,
    orderByColumn: "configSort",
    isAsc: "asc"
  }
) {
  return post(`${config.adminPrefix}/system/config/list`, params);
}

/*添加配置*/
export function addConfig(data = {}) {
  return post(`${config.adminPrefix}/system/config/add`, data);
}

/*编辑配置*/
export function editConfig(data = {}) {
  return post(`${config.adminPrefix}/system/config/edit`, data);
}

/*删除配置*/
export function deleteConfig(data = {}) {
  return post(`${config.adminPrefix}/system/config/remove`, data);
}

/*校验参数键名*/
export function checkConfigKeyUnique(data = {}) {
  return post(`${config.adminPrefix}/system/config/checkConfigKeyUnique`, data);
}
