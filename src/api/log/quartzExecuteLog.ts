import type { PageResult } from "@/types/result";
import { apiHttp } from "@/utils/http";

/** 调度任务执行日志---获取调度任务执行日志列表 */
export const fetchGetQuartzExecuteLogList = (data: any) => {
  return apiHttp.request<PageResult<any>>(
    "get",
    `quartzExecuteLog/getQuartzExecuteLogList/${data.currentPage}/${data.pageSize}`,
    { params: data }
  );
};

/** 调度任务执行日志---删除调度任务执行日志 */
export const fetchDeleteQuartzExecuteLog = (data: any) => {
  return apiHttp.request<object>(
    "delete",
    "quartzExecuteLog/deleteQuartzExecuteLog",
    { data }
  );
};
