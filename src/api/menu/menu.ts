import { apiHttp } from "@/utils/http";
/** 菜单管理-列表 */
export const fetchGetMenusList = (data?: any) => {
  return apiHttp.request<any>("get", `router/getMenusList`, { params: data });
};

/**
 * 根据路由id获取所有角色
 */
export const fetchGetRoleListByRouterId = data => {
  return apiHttp.request<any>("get", `routerRole/getRoleListByRouterId`, {
    params: data
  });
};

/** 菜单管理-添加菜单 */
export const fetchAddMenu = (data?: any) => {
  return apiHttp.request<any>("post", `router/addMenu`, { data });
};

/** 菜单管理-为菜单分配角色 */
export const fetchAssignRolesToRouter = (data: any) => {
  return apiHttp.request<any>("post", `routerRole/assignRolesToRouter`, {
    data
  });
};

/** 菜单管理-批量为菜单添加角色 */
export const fetchAssignAddBatchRolesToRouter = (data: any) => {
  return apiHttp.request<any>(
    "post",
    `routerRole/assignAddBatchRolesToRouter`,
    { data }
  );
};

/** 菜单管理-清除选中菜单所有角色 */
export const fetchClearAllRolesSelect = (data: any) => {
  return apiHttp.request<any>("delete", `routerRole/clearAllRolesSelect`, {
    data
  });
};

/** 菜单管理-更新菜单 */
export const fetchUpdateMenu = (data?: any) => {
  return apiHttp.request<any>("put", `router/updateMenu`, { data });
};

/** 菜单管理-快速更新菜单排序 */
export const fetchUpdateMenuByIdWithRank = (data?: any) => {
  return apiHttp.request<any>("put", `router/updateMenuByIdWithRank`, { data });
};

/** 菜单管理-删除菜单 */
export const fetchDeletedMenuByIds = (data?: any) => {
  return apiHttp.request<any>("delete", `router/deletedMenuByIds`, { data });
};
