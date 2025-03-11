import type { PageResult } from "@/types/result";
import { apiHttp, http } from "@/utils/http";

/** 系统文件管理---获取系统文件管理列表 */
export const fetchGetFilesList = (data: any) => {
  return apiHttp.request<PageResult<any>>(
    "get",
    `files/getFilesList/${data.currentPage}/${data.pageSize}`,
    { params: data }
  );
};

/** 系统文件管理---根据Id下载系统文件 */
export const downloadFilesByFileId = (data: any) => {
  return http.request<any>("get", `files/downloadFilesByFileId/${data.id}`, {
    responseType: "blob"
  });
};

/** 系统文件管理---批量下载系统文件 */
export const downloadFilesByFilepath = (data: any) => {
  return http.request<any>("get", `files/downloadFilesByFilepath`, {
    params: data,
    responseType: "blob"
  });
};

/** 系统文件管理---获取所有文件类型 */
export const fetchGetAllMediaTypes = () => {
  return apiHttp.request<any>("get", `files/noManage/getAllMediaTypes`);
};

/** 系统文件管理---获取所有文件存储基础路径 */
export const fetchGetAllFilesStoragePath = () => {
  return apiHttp.request<any>("get", `files/noManage/getAllFilesStoragePath`);
};

/** 系统文件管理---添加系统文件管理 */
export const fetchAddFiles = (data: any) => {
  return apiHttp.request<any>(
    "post",
    "files/addFiles",
    { data },
    { headers: { "Content-Type": "multipart/form-data" } }
  );
};

/** 系统文件管理---更新系统文件管理 */
export const fetchUpdateFiles = (data: any) => {
  return apiHttp.request<object>(
    "put",
    "files/updateFiles",
    { data },
    { headers: { "Content-Type": "multipart/form-data" } }
  );
};

/** 系统文件管理---删除系统文件管理 */
export const fetchDeleteFiles = (data: any) => {
  return apiHttp.request<any>("delete", "files/deleteFiles", { data });
};
