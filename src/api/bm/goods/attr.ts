import type { PageResult } from "@/types/result";
import { apiHttp } from "@/utils/http";

/** 获取属性信息 */
export const fetchQueryAttr = (id: number) => {
  return apiHttp.request<any>("get", `attr/${id}`);
};

/** 属性信息---分页查询属性信息 */
export const fetchGetAttrPage = (data: any) => {
  return apiHttp.request<PageResult<any>>("get", "attr/page", {
    params: data
  });
};

/** 属性信息---删除属性信息 */
export const fetchDeleteAttr = (data: any) => {
  return apiHttp.request<object>("delete", "attr/delete", { data });
};

/** 属性管理--- 启用/禁用属性*/
export const fetchChangeAttrStatus = (data: string) => {
  return apiHttp.request<any>("put", "attr/changeStatus", {
    data
  });
};

/** 属性管理--- 新增属性*/
export const fetchAddAttr = (data: any) => {
  return apiHttp.request<any>("post", "attr/add", {
    data
  });
};
/** 属性管理--- 更新属性*/
export const fetchUpdateAttr = (data: any) => {
  return apiHttp.request<any>("put", "attr/update", {
    data
  });
};

/** 属性管理--- 根据attrId获取分类ids */
export const fetchCatIdsByAttrId = (data: number) => {
  return apiHttp.request<any>("get", `attr/catIds/${data}`);
};
/** 属性管理--- 获取属性列表 */
export const fetchGetAttrList = (data: any) => {
  return apiHttp.request<any>("get", `attr/list`, {
    params: data
  });
};
/** 属性管理--- 根据spuId获取属性列表 */
export const fetchGetAttrListBySpuId = (data: any) => {
  return apiHttp.request<any>("get", `spuAttr/list`, {
    params: data
  });
};
/** 属性管理--- 根据catId获取属性列表 */
export const fetchGetAttrListByCatId = (data: any) => {
  return apiHttp.request<any>("get", `categoryAttr/list`, {
    params: data
  });
};
/** 属性管理--- 根据attrId获取属性值列表 */
export const fetchGetAttrValueListByAttrId = (data: any) => {
  return apiHttp.request<any>("get", `attr/list`, {
    params: data
  });
};
/** 属性管理---获取未关联未关联分类的属性列表 */
export const fetchAttrNotRelateList = (data: any) => {
  return apiHttp.request<any>("get", `categoryAttr/listNotRelated`, {
    params: data
  });
};
