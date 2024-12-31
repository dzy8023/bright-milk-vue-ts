import type { AttrItem } from "@/types/attr";

export type SupAttr = Pick<AttrItem, "id" | "name"> & {
  value: string | string[];
  props?: string;
};
export type SkuAttr = Pick<AttrItem, "id" | "name"> & {
  value: string[];
  props?: string;
};
