import type { PageResult } from "@/types/result";
import { apiHttp } from "@/utils/http";

/** 获取订奶信息 */
export const fetchQueryOrderMilk = (id: number) => {
  return apiHttp.request<any>("get", `orderMilk/${id}`);
};

/** 订奶信息---分页查询订奶信息 */
export const fetchGetOrderMilkPage = (data: any) => {
  return apiHttp.request<PageResult<any>>("get", "orderMilk/page", {
    params: data
  });
};

/** 订奶信息---删除订奶信息 */
export const fetchDeleteOrderMilk = (data: any) => {
  return apiHttp.request<object>("delete", "orderMilk/delete", { data });
};

/** 订奶管理--- 启用/禁用订奶*/
export const fetchChangeOrderMilkStatus = (data: string) => {
  return apiHttp.request<any>("put", "orderMilk/changeStatus", {
    data
  });
};

/** 订奶管理--- 新增订奶*/
export const fetchAddOrderMilk = (data: any) => {
  return apiHttp.request<any>("post", "orderMilk/add", {
    data
  });
};
/** 订奶管理--- 更新订奶*/
export const fetchUpdateOrderMilk = (data: any) => {
  return apiHttp.request<any>("put", "orderMilk/update", {
    data
  });
};

/** 订奶管理--- 根据orderMilkId获取分类ids */
export const fetchCatIdsByOrderMilkId = (data: number) => {
  return apiHttp.request<any>("get", `orderMilk/catIds/${data}`);
};
