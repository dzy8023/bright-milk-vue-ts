import { apiHttp, http } from "@/utils/http";
import type { PureHttpResponse } from "@/utils/http/types";

/** 获取营销数据 */
export const fetchRevenueData = (data: { start: string; end: string }) => {
  return apiHttp.request<any>("get", `statistics/revenueData`, {
    params: data
  });
};

/** 获取用户数据 */
export const fetchMemberData = (data: { start: string; end: string }) => {
  return apiHttp.request<any>("get", `statistics/userData`, {
    params: data
  });
};

/** 获取订单数据 */
export const fetchOrderData = (data: { start: string; end: string }) => {
  return apiHttp.request<any>("get", `statistics/orderData`, {
    params: data
  });
};

/** 获取商品数据 */
export const fetchSaleData = (data: { start: string; end: string }) => {
  return apiHttp.request<any>("get", `statistics/saleData`, {
    params: data
  });
};
/**获取spu销售数据 */
export const fetchSpuSaleData = (
  id: string,
  data: { start: string; end: string }
) => {
  return apiHttp.request<any>("get", `statistics/spuSaleData/${id}`, {
    params: data
  });
};
export const fetchDownloadData = (
  data: any,
  cb: (response: PureHttpResponse) => void
) => {
  return http.request<any>(
    "post",
    `statistics/export`,
    {
      data
    },
    {
      responseType: "blob",
      beforeResponseCallback: cb
    }
  );
};
export const fetchExportData = (data: any) => {
  return http.request<any>("post", `statistics/exportToSystem`, {
    data
  });
};
