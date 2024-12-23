import type { CategoryListItem } from "@/types/category";
import { http } from "@/utils/http";

/**获取分类列表 */
export const getCategoryListApi = () => {
  return http.request<CategoryListItem[]>("get", "/category/list");
};
