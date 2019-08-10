import {post} from "@/utils/request";
import config from '@/utils/config'
/**
 * 岗位管理
 */
/*获取岗位信息列表*/
export function getPostList(
  params = {
    pageNum: 1,
    pageSize: 9999,
    orderByColumn: "postSort",
    isAsc: "asc"
  }
) {
  return post(`${config.adminPrefix}/system/post/list`, params);
}

/*添加岗位*/
export function addPost(data = {}) {
  return post(`${config.adminPrefix}/system/post/add`, data);
}

/*编辑岗位*/
export function editPost(data = {}) {
  return post(`${config.adminPrefix}/system/post/edit`, data);
}

/*删除岗位*/
export function deletePost(data = {}) {
  return post(`${config.adminPrefix}/system/post/remove`, data);
}

/*校验岗位名称*/
export function checkPostNameUnique(data = {}) {
  return post(`${config.adminPrefix}/system/post/checkPostNameUnique`, data);
}

/*校验岗位编码*/
export function checkPostCodeUnique(data = {}) {
  return post(`${config.adminPrefix}/system/post/checkPostCodeUnique`, data);
}