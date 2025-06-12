import type { PageResult } from "@/types/result";
import { apiHttp } from "@/utils/http";

/** 获取会员信息 */
export const fetchQueryMember = (id: number) => {
  return apiHttp.request<any>("get", `member/${id}`);
};

/** 会员信息---分页查询会员信息 */
export const fetchGetMemberPage = (data: any) => {
  return apiHttp.request<PageResult<any>>("get", "member/page", {
    params: data
  });
};

/** 会员信息---删除会员信息 */
export const fetchDeleteMember = (data: any) => {
  return apiHttp.request<object>("delete", "member/delete", { data });
};

/** 会员管理--- 启用/禁用会员*/
export const fetchChangeMemberStatus = (data: string) => {
  return apiHttp.request<any>("put", "member/changeStatus", {
    data
  });
};
/** 会员管理--- 重置密码*/
export const fetchResetPassword = (data: any) => {
  return apiHttp.request<any>("put", `member/resetPassword`, { data });
};
/**充值 */
export const fetchCharge = (data: any) => {
  return apiHttp.request<any>("put", `member/charge`, { data });
};
