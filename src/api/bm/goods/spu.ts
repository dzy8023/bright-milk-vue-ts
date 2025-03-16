import type { PageResult } from "@/types/result";
import { apiHttp } from "@/utils/http";

/** 获取商品信息 */
export const fetchQuerySpuInfo = (id: number) => {
  return apiHttp.request<any>("get", `spuInfo/${id}`);
};

/** 商品信息---分页查询商品信息 */
export const fetchGetSpuInfoPage = (data: any) => {
  return apiHttp.request<PageResult<any>>("get", "spuInfo/page", {
    params: data
  });
};

/** 商品信息---删除商品信息 */
export const fetchDeleteSpuInfo = (data: any) => {
  return apiHttp.request<object>("delete", "spuInfo/delete", { data });
};

/** 商品管理--- 启用/禁用商品*/
export const fetchChangeSpuInfoStatus = (data: string) => {
  return apiHttp.request<any>("put", "spuInfo/changeStatus", {
    data
  });
};

/** 商品管理--- 新增商品*/
export const fetchAddSpuInfo = (data: any) => {
  return apiHttp.request<any>("post", "spuInfo/add", {
    data
  });
};
/** 商品管理--- 更新商品*/
export const fetchUpdateSpuInfo = (data: any) => {
  return apiHttp.request<any>("put", "spuInfo/update", {
    data
  });
};

/** 商品管理--- 根据spuInfoId获取分类ids */
export const fetchCatIdsBySpuInfoId = (data: number) => {
  return apiHttp.request<any>("get", `spuInfo/catIds/${data}`);
};
/** 商品管理--- 根据spuInfoId获取规格ids */
export const fetchGetAttrListBySpuId = (data: any) => {
  return apiHttp.request<any>("get", `spuAttr/attrList`, {
    params: data
  });
};
