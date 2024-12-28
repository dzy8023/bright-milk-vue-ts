import { apiHttp } from "@/utils/http";
import type { AttrItem, SpuAttr } from "@/types/attr";
import type { PageResult } from "@/types/pageQuery";

/**根据spuId获取属性列表 */
export const getAttrListBySpuIdApi = (spuId: string) => {
  return apiHttp.request<SpuAttr[]>("get", `/attr/list`, { params: { spuId } });
};

export const getAttrPageApi = (params: any) => {
  return apiHttp.request<PageResult<AttrItem>>("get", `/attr/page`, { params });
};
