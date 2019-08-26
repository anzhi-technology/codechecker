import { get } from '@/utils/request';
import config from '@/utils/config'

/**
 * 项目统计的所有请求
 * */

/*获取项目基本信息*/
// 在list.js => getSingleProject



/*获取缺陷统计信息*/
export function getVulnerabilityCount(projectId,data = {}) {
  return get(`${config.huntLeakPrefix}/vulnerabilities?projectId=${projectId}`, data);
}

