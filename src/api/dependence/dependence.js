import { get,post } from '@/utils/request';
import config from '@/utils/config'

/**
 * 依赖检测的所有请求
 * */

/*获取漏洞列表*/
export function getDependenciesReport(projectId,data = {}) {
  return get(`${config.huntLeakPrefix}/dependencies?projectId=${projectId}`, data);
}

/*扫描项目*/
export function scanDependence(hcode,data = {}) {
  return post(`${config.adminPrefix}/projectDependency/scan/${hcode}`, data);
}