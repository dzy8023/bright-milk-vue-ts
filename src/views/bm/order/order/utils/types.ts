import type { AttrItem } from "@/types/attr";

interface FormItemProps extends Omit<AttrItem, "id" | "value" | "select"> {
  id?: number;
  title: string;
  value: string[];
}
interface FormProps {
  formInline: FormItemProps;
}
interface SkuItem {
  id: string;
  spuId: string;
  image: string;
  name: string;
  attrText: string;
  discount: number;
  price: number;
  quantity: number;
}
interface userAddress {
  id: string;
  name: string;
  phone: string;
  address: string;
}
interface OrderDetail {
  id: string;
  username: string;
  phone: string;
  orderSn: string;
  status: number;
  postType: number;
  sourceType: number;
  createTime: string;
  updateTime: string;
  countdown: number;
  payLatestTime: string;
  payAmount: number;
  totalAmount: number;
  discountAmount: number;
  postFee: number;
  totalNum: number;
  skus: SkuItem[];
  userAddress: userAddress;
}

export type { FormItemProps, FormProps, OrderDetail };
