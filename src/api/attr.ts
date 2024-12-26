import { apiHttp } from "@/utils/http";
import type { SpuAttr } from "@/types/attr";

/**根据spuId获取属性列表 */
export const getAttrListBySpuIdApi = (spuId: string) => {
  return apiHttp.request<SpuAttr[]>("get", `/attr/list`, { params: { spuId } });
};
