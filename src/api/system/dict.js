import { post, get } from "@/utils/request";
import config from '@/utils/config'
/**
 * 字典的所有请求
 * */

//获取字典列表
export function getDicts(data = {}) {
  return post(`${config.adminPrefix}/system/dict/list`, data);
}

//获取字典数据
export function getDictData(data = {}) {
  return post(`${config.adminPrefix}/system/dict/data/list`, data);
}

//删除字典
export function removeDict(data = {}) {
  return post(`${config.adminPrefix}/system/dict/remove`, data);
}

//添加字典
export function addDict(data = {}) {
  return post(`${config.adminPrefix}/system/dict/add`, data);
}

//修改字典
export function editDict(data = {}) {
  return post(`${config.adminPrefix}/system/dict/edit`, data);
}

//校验字典类型
export function checkDictTypeUnique(data = {}) {
  return post(`${config.adminPrefix}/system/dict/checkDictTypeUnique`, data);
}

//删除字典数据
export function removeDictData(data = {}) {
  return post(`${config.adminPrefix}/system/dict/data/remove`, data);
}

//添加字典数据
export function addDictData(data = {}) {
  return post(`${config.adminPrefix}/system/dict/data/add`, data);
}

//修改字典数据
export function editDictData(data = {}) {
  return post(`${config.adminPrefix}/system/dict/data/edit`, data);
}