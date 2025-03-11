import type { PageResult } from "@/types/result";
import { apiHttp } from "@/utils/http";
/** 用户系统消息---用户获取系统消息列表 */
export const fetchGetUserMessageList = (data: any) => {
  return apiHttp.request<PageResult<any>>(
    "get",
    `messageReceived/noManage/getUserMessageList/${data.currentPage}/${data.pageSize}`,
    { params: data }
  );
};

/** 用户系统消息---根据消息id查询消息详情 */
export const fetchGetMessageDetailById = (data: any) => {
  return apiHttp.request<any>("get", `message/noManage/getMessageDetailById`, {
    params: data
  });
};

/** 系统消息---用户将消息标为已读 */
export const fetchUpdateUserMarkAsRead = (data: any) => {
  return apiHttp.request<object>(
    "put",
    "messageReceived/noManage/userMarkAsRead",
    { data }
  );
};

/** 系统消息---用户删除系统消息 */
export const fetchDeleteUserMessageByIds = (data: any) => {
  return apiHttp.request<object>(
    "delete",
    "messageReceived/noManage/deleteUserMessageByIds",
    { data }
  );
};
