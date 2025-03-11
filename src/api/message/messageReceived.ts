import type { PageResult } from "@/types/result";
import { apiHttp } from "@/utils/http";

/** 管理员操作用户消息---获取系统管理消息列表 */
export const fetchGetMessageReceivedList = (data: any) => {
  return apiHttp.request<PageResult<any>>(
    "get",
    `messageReceived/getMessageReceivedList/${data.currentPage}/${data.pageSize}`,
    { params: data }
  );
};

/** 管理员操作用户消息---将用户消息标为已读 */
export const fetchUpdateMarkMessageReceived = (data: any) => {
  return apiHttp.request<object>(
    "put",
    "messageReceived/updateMarkMessageReceived",
    { data }
  );
};

/** 管理员操作用户消息---管理删除用户消息 */
export const fetchDeleteMessageReceivedByIds = (data: any) => {
  return apiHttp.request<object>(
    "delete",
    "messageReceived/deleteMessageReceivedByIds",
    { data }
  );
};
