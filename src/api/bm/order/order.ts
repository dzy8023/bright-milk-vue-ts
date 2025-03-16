import type { PageResult } from "@/types/result";
import { apiHttp } from "@/utils/http";

/** 获取订单信息 */
export const fetchQueryOrder = (id: number) => {
  return apiHttp.request<any>("get", `order/${id}`);
};

/** 订单信息---分页查询订单信息 */
export const fetchGetOrderPage = (data: any) => {
  return apiHttp.request<PageResult<any>>("get", "order/page", {
    params: data
  });
};

/** 订单信息---删除订单信息 */
export const fetchDeleteOrder = (data: any) => {
  return apiHttp.request<object>("delete", "order/delete", { data });
};

/** 订单管理--- 启用/禁用订单*/
export const fetchChangeOrderStatus = (data: string) => {
  return apiHttp.request<any>("put", "order/changeStatus", {
    data
  });
};

/** 订单管理--- 新增订单*/
export const fetchAddOrder = (data: any) => {
  return apiHttp.request<any>("post", "order/add", {
    data
  });
};
/** 订单管理--- 更新订单*/
export const fetchUpdateOrder = (data: any) => {
  return apiHttp.request<any>("put", "order/update", {
    data
  });
};

/** 订单管理--- 根据orderId获取分类ids */
export const fetchCatIdsByOrderId = (data: number) => {
  return apiHttp.request<any>("get", `order/catIds/${data}`);
};
