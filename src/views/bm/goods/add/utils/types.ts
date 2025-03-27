import type { UploadUserFile } from "element-plus";
type tempType = {
  name: string;
  price: number;
  discount: number;
  attrText: string;
  desc: string;
};
type attrItem = {
  attrId: number;
  name: string;
  value: string;
  quickShow: 1 | 0;
};
export type skuItem = tempType & {
  image: string;
  skuAttrs: Array<Omit<attrItem, "quickShow">>;
};
export type spuItem = Omit<skuItem, "skuAttrs" | "image"> & {
  mainImage: string;
  category: string;
  detailImg?: string;
  spuAttrs: Array<attrItem>;
  images: Array<string>;
};

interface SkuFormItemProps extends Omit<tempType, "attrText"> {
  attrs?: {
    id: number;
    name: string;
    value: string;
    options: string[];
    props: string;
  }[];
  image: UploadUserFile[];
}
interface SkuFormProps {
  formInline: SkuFormItemProps;
}

export type { SkuFormItemProps, SkuFormProps };
