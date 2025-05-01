import type { PageResult } from "@/types/result";
import { apiHttp, http } from "@/utils/http";
/** 权限---获取权限列表 */
export const fetchGetPowerList = (data: any) => {
  return apiHttp.request<PageResult<any>>("get", "power/getPowerList", {
    params: data
  });
};

/** 权限---根据角色id获取权限内容 */
export const fetchGetPowerListByRoleId = (data: any) => {
  return apiHttp.request<object>(
    "get",
    "rolePower/noManage/getPowerListByRoleId",
    { params: data }
  );
};

/** 权限---获取所有权限 */
export const fetchGetAllPowers = () => {
  return apiHttp.request<any>("get", `power/getAllPowers`);
};

/** 权限---添加权限 */
export const fetchAddPower = (data: any) => {
  return apiHttp.request<object>("post", "power/addPower", { data });
};

/** 权限---更新权限 */
export const fetchUpdatePower = (data: any) => {
  return apiHttp.request<object>("put", "power/updatePower", { data });
};

/** 权限---更新权限 */
export const fetchUpdateBatchByPowerWithParentId = (data: any) => {
  return apiHttp.request<object>(
    "put",
    "power/updateBatchByPowerWithParentId",
    { data }
  );
};

/** 权限---删除权限 */
export const fetchDeletePower = (data: any) => {
  return apiHttp.request<object>("delete", "power/deletePower", { data });
};

/* 权限---获取系统API信息 */
export const getSystemApiInfoList = () => {
  return apiHttp.request<any>("get", "permission/private/getSystemApiInfoList");
};
/** 权限---导出权限 */
export const exportPermission = (data: any) => {
  return http.request<any>(
    "get",
    "permission/file/export",
    { params: data },
    { responseType: "blob" }
  );
};

/** 权限---导入权限权限 */
export const importPermission = (data: any) => {
  return apiHttp.request<any>(
    "put",
    "permission/file/import",
    { data },
    { headers: { "Content-Type": "multipart/form-data" } }
  );
};
