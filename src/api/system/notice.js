import { post, get } from "@/utils/request";
import config from '@/utils/config'
/**
 * 公告的所有请求
 * */

/*获取公告信息列表*/
export function getNoticeList(params = {
  pageNum: 1,
  pageSize: 9999,
  orderByColumn: "",
  isAsc: "asc",
  noticeTitle:'',
  createBy:'',
  noticeType:'',
}) {
  return post(`${config.adminPrefix}/system/notice/list`, params);
}

/*添加公告*/
export function addNotice(data = {}) {
  return post(`${config.adminPrefix}/system/notice/add`, data);
}

/*编辑公告*/
export function editNotice(data = {}) {
  return post(`${config.adminPrefix}/system/notice/edit`, data);
}

/*删除公告*/
export function removeNotice(data = {}) {
  return post(`${config.adminPrefix}/system/notice/remove`, data);
}
