export type CategoryItem = {
  /**分类id */
  id: number;
  /**分类名称 */
  name: string;
  /**父级分类id */
  parentId: number;
  /**分类层级 */
  layer: number;
  /**分类状态 */
  status: boolean;
  /**分类排序 */
  sort: number;
};
export type CategoryListItem = Pick<
  CategoryItem,
  "id" | "name" | "parentId"
> & {
  children: CategoryListItem[];
};
