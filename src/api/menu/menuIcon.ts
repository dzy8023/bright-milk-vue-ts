import type { PageResult } from "@/types/result";
import { apiHttp } from "@/utils/http";

/** 系统菜单图标---获取多语言列表 */
export const fetchGetMenuIconList = (data: any) => {
  return apiHttp.request<PageResult<object>>(
    "get",
    `menuIcon/getMenuIconList/${data.currentPage}/${data.pageSize}`,
    { params: data }
  );
};

/** 系统菜单图标---添加多语言 */
export const fetchAddMenuIcon = (data: any) => {
  return apiHttp.request<object>("post", "menuIcon/addMenuIcon", { data });
};

/** 系统菜单图标---更新多语言 */
export const fetchUpdateMenuIcon = (data: any) => {
  return apiHttp.request<object>("put", "menuIcon/updateMenuIcon", { data });
};

/** 系统菜单图标---删除多语言 */
export const fetchDeleteMenuIcon = (data: any) => {
  return apiHttp.request<object>("delete", "menuIcon/deleteMenuIcon", { data });
};

/** 系统菜单图标---根据iconName搜索menuIcon */
export const fetchGetIconNameList = (data: any) => {
  return apiHttp.request<object>("get", "menuIcon/noManage/getIconNameList", {
    params: data
  });
};
