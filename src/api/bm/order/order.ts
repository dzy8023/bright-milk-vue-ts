import type { PageResult } from "@/types/result";
import { apiHttp } from "@/utils/http";

/** 获取订单信息 */
export const fetchQueryOrderDetail = (id: string) => {
  return apiHttp.request<any>("get", `order/${id}`);
};

/** 订单信息---分页查询订单信息 */
export const fetchGetOrderPage = (data: any) => {
  return apiHttp.request<PageResult<any>>("get", "order/page", {
    params: data
  });
};
/**催单 */
export const fetchRemindOrder = (data: string[]) => {
  return apiHttp.request<object>("put", "order/remind", { data });
};

/** 发货 */
export const fetchConsignOrder = (data: string[]) => {
  return apiHttp.request<object>("put", "order/consign", { data });
};

/** 取消订单 */
export const fetchCancelOrder = (data: string[]) => {
  return apiHttp.request<object>("put", "order/cancel", { data });
};

/** 退款 */
export const fetchRefundOrder = (data: string[]) => {
  return apiHttp.request<object>("put", "order/refund", { data });
};

/** 订单信息---删除订单信息 */
export const fetchDeleteOrder = (data: string[]) => {
  return apiHttp.request<object>("delete", "order/delete", { data });
};
