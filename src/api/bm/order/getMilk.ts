import type { PageResult } from "@/types/result";
import { apiHttp } from "@/utils/http";

/** 获取取奶信息 */
export const fetchQueryGetMilk = (id: number) => {
  return apiHttp.request<any>("get", `getMilk/${id}`);
};

/** 取奶信息---分页查询取奶信息 */
export const fetchGetGetMilkPage = (data: any) => {
  return apiHttp.request<PageResult<any>>("get", "getMilk/page", {
    params: data
  });
};

/** 取奶信息---删除取奶信息 */
export const fetchDeleteGetMilk = (data: any) => {
  return apiHttp.request<object>("delete", "getMilk/delete", { data });
};

/** 取奶管理--- 启用/禁用取奶*/
export const fetchChangeGetMilkStatus = (data: string) => {
  return apiHttp.request<any>("put", "getMilk/changeStatus", {
    data
  });
};

/** 取奶管理--- 新增取奶*/
export const fetchAddGetMilk = (data: any) => {
  return apiHttp.request<any>("post", "getMilk/add", {
    data
  });
};
/** 取奶管理--- 更新取奶*/
export const fetchUpdateGetMilk = (data: any) => {
  return apiHttp.request<any>("put", "getMilk/update", {
    data
  });
};

/** 取奶管理--- 根据getMilkId获取分类ids */
export const fetchCatIdsByGetMilkId = (data: number) => {
  return apiHttp.request<any>("get", `getMilk/catIds/${data}`);
};
