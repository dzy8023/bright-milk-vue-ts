import type { PageResult } from "@/types/result";
import { apiHttp } from "@/utils/http";

/** 任务调度分组---获取任务调度分组列表 */
export const fetchGetSchedulersGroupList = (data: any) => {
  return apiHttp.request<PageResult<any>>(
    "get",
    `schedulersGroup/getSchedulersGroupList/${data.currentPage}/${data.pageSize}`,
    { params: data }
  );
};

/** 任务调度分组---获取所有任务调度分组 */
export const fetchGetAllSchedulersGroup = () => {
  return apiHttp.request<PageResult<any>>(
    "get",
    "schedulersGroup/getAllSchedulersGroup"
  );
};

/** 任务调度分组---添加任务调度分组 */
export const fetchAddSchedulersGroup = (data: any) => {
  return apiHttp.request<object>("post", "schedulersGroup/addSchedulersGroup", {
    data
  });
};

/** 任务调度分组---更新任务调度分组 */
export const fetchUpdateSchedulersGroup = (data: any) => {
  return apiHttp.request<object>(
    "put",
    "schedulersGroup/updateSchedulersGroup",
    { data }
  );
};

/** 任务调度分组---删除任务调度分组 */
export const fetchDeleteSchedulersGroup = (data: any) => {
  return apiHttp.request<object>(
    "delete",
    "schedulersGroup/deleteSchedulersGroup",
    { data }
  );
};
