import { apiHttp } from "@/utils/http";

/** 系统管理-用户路由获取 */
export const getRouterAsync = () => {
  return apiHttp.request<any>("get", "router/noManage/getRouterAsync");
};

/** 上传文件 */
export const fetchUploadFile = (data: any) => {
  return apiHttp.request<any>(
    "post",
    "/files/upload",
    { data },
    { headers: { "Content-Type": "multipart/form-data" } }
  );
};
