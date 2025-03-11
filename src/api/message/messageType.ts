import type { PageResult } from "@/types/result";
import { apiHttp } from "@/utils/http";
/** 系统消息类型---获取系统消息类型列表 */
export const fetchGetMessageTypeList = (data: any) => {
  return apiHttp.request<PageResult<any>>(
    "get",
    `messageType/getMessageTypeList/${data.currentPage}/${data.pageSize}`,
    { params: data }
  );
};

/** 系统消息类型---获取系统消息类型列表 */
export const fetchGetAllMessageTypes = () => {
  return apiHttp.request<PageResult<any>>(
    "get",
    "/messageType/noManage/getAllMessageTypes"
  );
};

/** 系统消息类型---添加系统消息类型 */
export const fetchAddMessageType = (data: any) => {
  return apiHttp.request<object>("post", "messageType/addMessageType", {
    data
  });
};

/** 系统消息类型---更新系统消息类型 */
export const fetchUpdateMessageType = (data: any) => {
  return apiHttp.request<object>("put", "messageType/updateMessageType", {
    data
  });
};

/** 系统消息类型---删除系统消息类型 */
export const fetchDeleteMessageType = (data: any) => {
  return apiHttp.request<object>("delete", "messageType/deleteMessageType", {
    data
  });
};
