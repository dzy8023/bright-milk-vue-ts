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
export const fetchCreateSpuInfo = (data: any) => {
  return apiHttp.request<any>("post", "spuInfo/create", {
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
export const fetchGetAttrListBySpuId = (data: string) => {
  return apiHttp.request<any>("get", `spuAttr/attrList/${data}`);
};
/**根据spuId与catId获取商品属性带有选项值列表 */
export const fetchGetAttrWithOptionsList = (data: any) => {
  return apiHttp.request<any>("get", `spuAttr/attrWithOptionsList`, {
    params: data
  });
};
/**根据spuId获取商品图集 */
export const fetchGetSpuInfoMainImage = (data: string) => {
  return apiHttp.request<any>("get", `spuImage/list/${data}`);
};

/**修改spu图片 */
export const fetchUpdateSpuInfoImage = (data: {
  deleted: any[];
  new: File[];
  spuId: string;
}) => {
  const formData = new FormData();
  formData.append(
    "deleted",
    new Blob([JSON.stringify(data.deleted)], { type: "application/json" })
  );
  data.new.forEach(item => {
    formData.append("images", item);
  });
  return apiHttp.request<any>(
    "put",
    `spuImage/update/${data.spuId}`,
    {
      data: formData
    },
    {
      headers: { "Content-Type": "multipart/form-data" }
    }
  );
};
/**修改spuAttrs */
export const fetchUpdateSpuInfoAttr = (data: {
  spuId: string;
  deleted: any[];
  added: any[];
  updated: any[];
}) => {
  return apiHttp.request<any>("put", `spuAttr/update/${data.spuId}`, {
    data
  });
};
