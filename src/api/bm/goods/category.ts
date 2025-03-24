import type { CategoryTreeNode } from "@/types/category";
import type { PageResult } from "@/types/result";
import { apiHttp } from "@/utils/http";

/** 获取分类信息 */
export const fetchQueryCategory = (id: number) => {
  return apiHttp.request<any>("get", `category/${id}`);
};

/** 分类信息---分页查询分类信息 */
export const fetchGetCategoryPage = (data: any) => {
  return apiHttp.request<PageResult<any>>("get", "category/page", {
    params: data
  });
};

/** 分类信息---获取分类树 */
export const fetchGetCategoryTree = () => {
  return apiHttp.request<CategoryTreeNode>("get", "category/tree");
};

/** 分类信息---删除分类信息 */
export const fetchDeleteCategory = (data: any) => {
  return apiHttp.request<object>("delete", "category/delete", { data });
};

/** 分类管理--- 启用/禁用分类*/
export const fetchChangeCategoryStatus = (data: string) => {
  return apiHttp.request<any>("put", "category/updateStatus", {
    data
  });
};

/** 分类管理--- 新增分类*/
export const fetchAddCategory = (data: any) => {
  return apiHttp.request<any>("post", "category/add", {
    data
  });
};
/** 分类管理--- 更新分类*/
export const fetchUpdateCategory = (data: any) => {
  return apiHttp.request<any>("put", "category/update", {
    data
  });
};
/**批量更新分类 */
export const fetchBatchUpdateCategory = (data: any) => {
  return apiHttp.request<any>("put", "category/updateBatch", {
    data
  });
};
/**分类关联属性 */
export const fetchCategoryRelateAttr = (data: any) => {
  return apiHttp.request<any>("post", "categoryAttr/categoryRelateAttr", {
    data
  });
};
