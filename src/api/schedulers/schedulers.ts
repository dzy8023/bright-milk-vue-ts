import type { PageResult } from "@/types/result";
import { apiHttp } from "@/utils/http";
/** Schedulers视图---获取Schedulers视图列表 */
export const fetchGetSchedulersList = (data: any) => {
  return apiHttp.request<PageResult<any>>(
    "get",
    `schedulers/getSchedulersList/${data.currentPage}/${data.pageSize}`,
    { params: data }
  );
};

/** Schedulers视图---获取所有可用调度任务 */
export const fetchGetAllScheduleJobList = () => {
  return apiHttp.request<PageResult<any>>(
    "get",
    "schedulers/noManage/getAllScheduleJobList"
  );
};

/** Schedulers视图---添加Schedulers视图 */
export const fetchAddSchedulers = (data: any) => {
  return apiHttp.request<object>("post", "schedulers/addSchedulers", { data });
};

/** Schedulers视图---更新Schedulers视图 */
export const fetchUpdateSchedulers = (data: any) => {
  return apiHttp.request<object>("put", "schedulers/updateSchedulers", {
    data
  });
};

/** Schedulers视图---暂停任务 */
export const fetchPauseSchedulers = (data: any) => {
  return apiHttp.request<object>("put", "schedulers/pauseSchedulers", { data });
};

/** Schedulers视图---恢复任务 */
export const fetchResumeSchedulers = (data: any) => {
  return apiHttp.request<object>("put", "schedulers/resumeSchedulers", {
    data
  });
};

/** Schedulers视图---删除Schedulers视图 */
export const fetchDeleteSchedulers = (data: any) => {
  return apiHttp.request<object>("delete", "schedulers/deleteSchedulers", {
    data
  });
};
