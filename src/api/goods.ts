import type { GoodItem } from "@/types/item";
import type { PageQuery, PageResult } from "@/types/pageQuery";
import { http } from "@/utils/http";

type PageParam = PageQuery & {
  status?: string;
  name?: string;
  catId?: string;
};

/**
// params传参
export const textRequest = (params?: object) => {
  return http.request("put", "/xxx", { params });
};
// data传参
export const textRequest = (data?: object) => {
  return http.request("put", "/xxx", { data });
};
 */
/** 获取商品列表 */
export const getGoodsListApi = (
  data: PageParam = {
    page: 1,
    pageSize: 10
  }
) => {
  return http.request<PageResult<GoodItem>>("get", "/goods/page", { data });
};

/**根据spuId获取商品详细信息  */
export const getGoodDetailApi = (id: string) => {
  return http.request<GoodItem>("get", `/goods/${id}`);
};
