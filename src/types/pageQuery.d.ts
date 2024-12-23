/**分页查询参数 */
export type PageQuery = {
  /** 页码 可选，默认1 */
  page?: number | undefined;
  /** 每页条数 可选，默认10 */
  pageSize?: number | undefined;
};

/**分页查询结果 */
export type PageResult<T> = {
  /** 总条数 */
  total: number;
  /** 列表数据 */
  items: T[];
  /** 页码 */
  currentPage: number;
  /** 每页条数 */
  pageSize: number;
};
