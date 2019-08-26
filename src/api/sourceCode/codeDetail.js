import { post ,get } from '@/utils/request';
import config from '@/utils/config'

/**
 * 缺陷详情页面的所有请求
 * */

/*获取漏洞列表*/
export function getVulnerabilities(projectId,data = {}) {
  return get(`${config.huntLeakPrefix}/vulnerabilities?projectId=${projectId}`, data);
}

/*获取文件源代码*/
export function getFileContent(data = {}) {
  return post(`${config.adminPrefix}/content`, data);
}

/*修复建议,解释说明,参考文献,缺陷审计*/
export function getRuleInfos(ruldIDs,lang,data = {}) {
  return get(`${config.huntLeakPrefix}/ruleInfos?ruleIDs=${ruldIDs}&localization=${lang}`, data);
}



