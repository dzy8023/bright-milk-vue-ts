import type { PageResult } from "@/types/result";
import { apiHttp } from "@/utils/http";

/** 用户登录日志---获取用户登录日志列表 */
export const fetchGetUserLoginLogList = (data: any) => {
  return apiHttp.request<PageResult<any>>(
    "get",
    `userLoginLog/getUserLoginLogList`,
    { params: data }
  );
};

/** 用户登录日志---获取用户登录日志列表 */
export const fetchGetUserLoginLogListByLocalUser = (data: any) => {
  return apiHttp.request<PageResult<any>>(
    "get",
    "userLoginLog/noManage/getUserLoginLogPageByLocalUser",
    { params: data }
  );
};

/** 用户登录日志---删除用户登录日志 */
export const fetchDeleteUserLoginLog = (data: any) => {
  return apiHttp.request<object>("delete", "userLoginLog/deleteUserLoginLog", {
    data
  });
};
