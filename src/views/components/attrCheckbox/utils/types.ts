import type { AttrItem } from "@/types/attr";
type TempItem = {
  /**属性id */
  id: number;
  /**属性名称 */
  name: string;
  /**属性值 */
  value: string;
  /**属性图标 */
  icon?: string;
  /**属性描述 */
  desc?: string;
  /**单选、多选 */
  choose?: 0 | 1;
  options: Array<string>;
};
export type AttrFormInLine = {
  spuAttrs: Array<
    TempItem & {
      quickShow: number;
    }
  >;
  saleAttrs: Array<Omit<TempItem, "value"> & { value: string[] }>;
};

export type SupAttr = Pick<AttrItem, "id" | "name"> & {
  value: string;
  props?: string;
};
export type SkuAttr = Pick<AttrItem, "id" | "name"> & {
  value: string[];
  props?: string;
};
