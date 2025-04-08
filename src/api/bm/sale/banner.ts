import type { PageResult } from "@/types/result";
import { apiHttp } from "@/utils/http";

/** 分页查询轮播图信息 */
export const fetchGetBannerPage = (data: any) => {
  return apiHttp.request<PageResult<any>>("get", "banner/page", {
    params: data
  });
};
/**获取轮播图列表 */
export const fetchGetBannerList = () => {
  return apiHttp.request<any>("get", "banner/list");
};
const preDoFormData = (data: any) => {
  const formData = new FormData();
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const element = data[key];
      if (element) {
        if (element instanceof File) {
          formData.append(key, element);
        } else {
          formData.append(
            key,
            new Blob([JSON.stringify(data[key])], { type: "application/json" })
          );
        }
      }
    }
  }
  return formData;
};
/**  新增轮播图*/
export const fetchAddBanner = (data: { banner: any; image: File }) => {
  return apiHttp.request<any>(
    "post",
    "banner/add",
    {
      data: preDoFormData(data)
    },
    { headers: { "Content-Type": "multipart/form-data" } }
  );
};
/**  更新轮播图*/
export const fetchUpdateBanner = (data: { banner: any; image?: File }) => {
  return apiHttp.request<any>(
    "put",
    "banner/update",
    {
      data: preDoFormData(data)
    },
    { headers: { "Content-Type": "multipart/form-data" } }
  );
};
/** 删除轮播图信息 */
export const fetchDeleteBanner = (data: any) => {
  return apiHttp.request<object>("delete", "banner/delete", { data });
};
