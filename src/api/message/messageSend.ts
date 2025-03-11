import type { PageResult } from "@/types/result";
import { apiHttp } from "@/utils/http";

/** 系统消息---获取系统管理消息列表 */
export const fetchGetMessageList = (data: any) => {
  return apiHttp.request<PageResult<any>>(
    "get",
    `message/getMessageList/${data.currentPage}/${data.pageSize}`,
    { params: data }
  );
};

/** 系统消息---根据消息id获取接收人信息 */
export const fetchGetReceivedUserinfoByMessageId = (data: any) => {
  return apiHttp.request<any>(
    "get",
    `message/noManage/getReceivedUserinfoByMessageId`,
    { params: data }
  );
};

/** 系统消息---添加系统消息 */
export const fetchAddMessage = (data: any) => {
  return apiHttp.request<object>("post", "message/addMessage", { data });
};

/** 系统消息---更新系统消息 */
export const fetchUpdateMessage = (data: any) => {
  return apiHttp.request<object>("put", "message/updateMessage", { data });
};

/** 系统消息---删除系统消息 */
export const fetchDeleteMessage = (data: any) => {
  return apiHttp.request<object>("delete", "message/deleteMessage", { data });
};
