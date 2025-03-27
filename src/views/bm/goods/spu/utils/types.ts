import type { GoodItem } from "@/types/item";
import type { SpuAttr } from "@/types/attr";
import type { UploadUserFile } from "element-plus";
export interface TabItem extends GoodItem {
  subLoading?: boolean;
  attrs?: SpuAttr[];
}
export interface SpuImage {
  id: string;
  spuId: string;
  image: string;
}
export interface SpuInfoItem extends GoodItem {
  attrs?: SpuAttr[];
  mainImage: SpuImage[];
}
export interface FormItemProps
  extends Omit<
    SpuInfoItem,
    | "catId"
    | "catName"
    | "attrs"
    | "sales"
    | "createTime"
    | "updateTime"
    | "image"
    | "mainImage"
    | "detailImg"
  > {
  image: UploadUserFile[];
  mainImage: UploadUserFile[];
  detailImg?: UploadUserFile[];
  attrs?: (Omit<SpuAttr, "value"> & {
    options: string[];
    choose: 0 | 1;
    value: string | string[];
  })[];
}
export interface FormProps {
  formInline: FormItemProps;
}
