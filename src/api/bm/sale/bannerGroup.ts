import type { PageResult } from "@/types/result";
import { apiHttp } from "@/utils/http";

/** 分页查询轮播图组信息 */
export const fetchGetBannerGroupPage = (data: any) => {
  return apiHttp.request<PageResult<any>>("get", "bannerGroup/page", {
    params: data
  });
};

/**  新增轮播图组*/
export const fetchAddBannerGroup = (data: any) => {
  return apiHttp.request<any>("post", "bannerGroup/add", {
    data
  });
};
/**  更新轮播图组*/
export const fetchUpdateBannerGroup = (data: any) => {
  return apiHttp.request<any>("put", "bannerGroup/update", {
    data
  });
};
/** 删除轮播图组信息 */
export const fetchDeleteBannerGroup = (data: any) => {
  return apiHttp.request<object>("delete", "bannerGroup/delete", { data });
};
/**  启用/禁用轮播图组*/
export const fetchChangeBannerGroupStatus = (data: string) => {
  return apiHttp.request<any>("put", "bannerGroup/changeStatus", {
    data
  });
};
