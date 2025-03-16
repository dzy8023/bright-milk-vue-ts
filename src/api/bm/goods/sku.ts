import type { PageResult } from "@/types/result";
import { apiHttp } from "@/utils/http";

/** 获取商品信息 */
export const fetchQuerySkuInfo = (id: number) => {
  return apiHttp.request<any>("get", `skuInfo/${id}`);
};

/** 商品信息---分页查询商品信息 */
export const fetchGetSkuInfoPage = (data: any) => {
  return apiHttp.request<PageResult<any>>("get", "skuInfo/page", {
    params: data
  });
};

/** 商品信息---删除商品信息 */
export const fetchDeleteSkuInfo = (data: any) => {
  return apiHttp.request<object>("delete", "skuInfo/delete", { data });
};

/** 商品管理--- 启用/禁用商品*/
export const fetchChangeSkuInfoStatus = (data: string) => {
  return apiHttp.request<any>("put", "skuInfo/changeStatus", {
    data
  });
};

/** 商品管理--- 新增商品*/
export const fetchAddSkuInfo = (data: any) => {
  return apiHttp.request<any>("post", "skuInfo/add", {
    data
  });
};
/** 商品管理--- 更新商品*/
export const fetchUpdateSkuInfo = (data: any) => {
  return apiHttp.request<any>("put", "skuInfo/update", {
    data
  });
};

/** 商品管理--- 根据skuInfoId获取分类ids */
export const fetchCatIdsBySkuInfoId = (data: number) => {
  return apiHttp.request<any>("get", `skuInfo/catIds/${data}`);
};
/** 商品管理--- 根据skuId获取属性列表 */
export const fetchGetAttrListBySkuId = (data: any) => {
  return apiHttp.request<any>("get", `skuAttr/attrList`, {
    params: data
  });
};
