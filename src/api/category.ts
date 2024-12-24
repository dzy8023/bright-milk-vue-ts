import { apiHttp } from "@/utils/http";
import type { CategoryListItem } from "@/types/category";

export const getCategoryListApi = () => {
  return apiHttp.request<CategoryListItem[]>("get", "/category/list");
};
export const helloApi = () => {
  return apiHttp.request<string>("get", `/hello`);
};
export const getCategoryById = (id: string) => {
  return apiHttp.request<CategoryListItem>("get", `/category/${id}`);
};
