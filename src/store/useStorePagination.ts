import type { PageResult } from "@/types/result";
import type { Data } from "@/utils/http/types";

/**
 * * 通用表单分页
 * @param response
 */
export function storePagination(response: Data<PageResult<any>>) {
  // 返回成功为其赋值
  if (response.code === 200) {
    this.dataList = response.result.items;
    this.pagination.currentPage = response.result.currentPage;
    this.pagination.pageSize = response.result.pageSize;
    this.pagination.total = response.result.total;
    return true;
  }
  return false;
}
