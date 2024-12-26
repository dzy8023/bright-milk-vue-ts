import type { CategoryTreeNode, CategoryItem } from "@/types/category";
import { apiHttp } from "@/utils/http";

export const getCategoryListApi = () => {
  return apiHttp.request<CategoryItem[]>("get", "/category/list");
};
export const helloApi = () => {
  return apiHttp.request<string>("get", `/hello`);
};
export const getCategoryById = (id: string) => {
  return apiHttp.request<CategoryItem>("get", `/category/${id}`);
};

export const getCategoryTreeApi = () => {
  return apiHttp.request<CategoryTreeNode[]>("get", "/category/tree");
};
