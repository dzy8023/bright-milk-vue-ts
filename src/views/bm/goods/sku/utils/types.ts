import type { SkuAttr } from "@/types/attr";
import type { GoodItem } from "@/types/item";
import type { UploadUserFile } from "element-plus";

export interface SkuInfoItem extends Omit<GoodItem, "catName" | "catId"> {
  spuId: string;
  attrs?: SkuAttr[];
  enableOrder: 0 | 1;
}

interface SkuFormItemProps
  extends Omit<SkuInfoItem, "attrs" | "updateTime" | "createTime" | "image"> {
  attrs?: (SkuAttr & {
    options: string[];
    choose: 0 | 1;
  })[];
  image: UploadUserFile[];
}
interface SkuFormProps {
  formInline: SkuFormItemProps;
}

export type { SkuFormItemProps, SkuFormProps };
