import type { PageResult } from "@/types/result";
import { apiHttp } from "@/utils/http";
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
