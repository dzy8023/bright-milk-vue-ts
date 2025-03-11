import type { PageResult } from "@/types/result";
import { apiHttp } from "@/utils/http";
/** 角色---获取角色列表 */
export const fetchGetRoleList = (data: any) => {
  return apiHttp.request<PageResult<any>>(
    "get",
    `role/getRoleList/${data.currentPage}/${data.pageSize}`,
    { params: data }
  );
};

/** 角色---获取所有角色 */
export const fetchGetAllRoles = () => {
  return apiHttp.request<any>("get", `role/noManage/getAllRoles`);
};

/** 角色---根据用户id获取所有角色 */
export const fetchGetRoleListByUserId = data => {
  return apiHttp.request<any>("get", `userRole/getRoleListByUserId`, {
    params: data
  });
};

/** 角色---添加角色 */
export const fetchAddRole = (data: any) => {
  return apiHttp.request<object>("post", "role/addRole", { data });
};

/** 角色---为角色分配权限 */
export const fetchAssignPowersToRole = (data: any) => {
  return apiHttp.request<object>("post", "rolePower/assignPowersToRole", {
    data
  });
};

/** 角色---更新角色 */
export const fetchUpdateRole = (data: any) => {
  return apiHttp.request<object>("put", "role/updateRole", { data });
};

/** 角色---删除角色 */
export const fetchDeleteRole = (data: any) => {
  return apiHttp.request<object>("delete", "role/deleteRole", { data });
};
