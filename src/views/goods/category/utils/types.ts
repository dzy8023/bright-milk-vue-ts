import type { CategoryItem } from "@/types/category";
export type TreeNode = CategoryItem & {
  children: TreeNode[];
};
