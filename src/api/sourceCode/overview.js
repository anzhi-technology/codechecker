import { get } from '@/utils/request';
import config from '@/utils/config'

/**
 * 项目概览的所有请求
 * */

/*获取缺陷检测统计信息*/
export function getDefectCount(data = {}) {
  return get(`${config.adminPrefix}/project/scanResult`, data);
}

/*获取依赖检测统计信息*/
export function getDependencyCount(data = {}) {
  return get(`${config.adminPrefix}/projectDependency/scan_result`, data);
}

/*获取单个项目缺陷检测统计信息*/
export function getSingleProjectCount(hocde,data = {}) {
  return get(`${config.adminPrefix}/project/scanResult/${hocde}`, data);
}



