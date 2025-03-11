import { apiHttp } from "@/utils/http";

/** 获取修改前端配置文件 */
export const fetchGetWebConfig = () => {
  return apiHttp.request<any>("get", "/config/getWebConfig");
};

/** 更新web配置文件 */
export const fetchUpdateWebConfiguration = (data: any) => {
  return apiHttp.request<any>("put", "/config/updateWebConfiguration", {
    data
  });
};
