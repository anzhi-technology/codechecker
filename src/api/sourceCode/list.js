import { post ,get } from '@/utils/request';
import config from '@/utils/config'

/**
* 项目列表页面的所有请求
* */

/*获取项目列表*/
export function getProjectsList(data = {}) {
  return get(`${config.adminPrefix}/projects`, data);
}

/*获取任务列表*/
export function getTasksList(data = {}) {
  return get(`${config.adminPrefix}/tasks`, data);
}
