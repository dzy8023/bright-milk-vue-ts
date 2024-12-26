import type { GoodItem } from "@/types/item";
import type { SpuAttr } from "@/types/attr";
export interface TabItem extends GoodItem {
  subLoading?: boolean;
  attrs?: SpuAttr[];
}
