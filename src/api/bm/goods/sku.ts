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
export const fetchDeleteSkuInfo = (data: string[]) => {
  return apiHttp.request<object>("delete", "skuInfo/delete", { data });
};

/** 商品管理--- 启用/禁用商品*/
export const fetchChangeSkuInfoStatus = (data: string) => {
  return apiHttp.request<any>("put", "skuInfo/changeStatus", {
    data
  });
};
/**添加商品 */
export const fetchCreateSkuInfo = (data: { skuInfo: any; image: File }) => {
  const formData = new FormData();
  formData.append(
    "skuInfo",
    new Blob([JSON.stringify(data.skuInfo)], { type: "application/json" })
  );
  formData.append("image", data.image);
  return apiHttp.request<any>(
    "post",
    "skuInfo/create",
    {
      data: formData
    },
    {
      headers: { "Content-Type": "multipart/form-data" }
    }
  );
};

/**批量添加sku */
export const fetchCreateSkuInfoBatch = (data: any) => {
  const formData = new FormData();

  // JSON 数据直接上传，不用 Blob
  formData.append(
    "skuInfoList",
    new Blob([JSON.stringify(data)], { type: "application/json" })
  );

  // 处理图片
  data.forEach(item => {
    if (item.image) {
      formData.append("images", item.image);
    }
  });

  return apiHttp.request(
    "post",
    "skuInfo/createBatch",
    {
      data: formData
    },
    { headers: { "Content-Type": "multipart/form-data" } }
  );
};

/** 商品管理--- 更新商品*/
export const fetchUpdateSkuInfo = (data: { skuInfo: any; image?: File }) => {
  const formData = new FormData();
  formData.append(
    "skuInfo",
    new Blob([JSON.stringify(data.skuInfo)], { type: "application/json" })
  );
  if (data.image) {
    formData.append("image", data.image);
  }
  return apiHttp.request<any>(
    "put",
    "skuInfo/update",
    {
      data: formData
    },
    {
      headers: { "Content-Type": "multipart/form-data" }
    }
  );
};

/** 商品管理--- 根据skuInfoId获取分类ids */
export const fetchCatIdsBySkuInfoId = (data: number) => {
  return apiHttp.request<any>("get", `skuInfo/catIds/${data}`);
};

/** 商品管理--- 根据skuId获取属性列表 */
export const fetchGetAttrListBySkuId = (data: string) => {
  return apiHttp.request<any>("get", `skuAttr/attrList`, {
    params: { skuId: data }
  });
};
/**根据spuId获取skuAttr带options的列表 */
export const fetchGetSkuAttrWithOptionsListBySpuId = (data: any) => {
  return apiHttp.request<any>("get", `skuAttr/attrWithOptionsList`, {
    params: data
  });
};
