import type { OrderState } from "@/services/constants";
import type { AddressItem } from "./address";
import type { PageQuery, PageResult } from "./pageQuery";

/** 获取预付订单 返回信息 */
export type OrderPreResult = {
  /** 商品集合 [ 商品信息 ] */
  goods: OrderPreGoods[];
  /** 结算信息 */
  summary: {
    /** 商品总价 */
    totalPrice: number;
    /** 邮费 */
    postFee: number;
    /** 应付金额 */
    totalPayPrice: number;
    /**折扣价格 */
    discountPrice: number;
    /**商品数量 */
    goodsCount: number;
  };
  /** 用户地址列表 [ 地址信息 ] */
  userAddresses: AddressItem[];
};

/** 商品信息 */
export type OrderPreGoods = {
  /** 属性文字，例如“颜色:瓷白色 尺寸：8寸” */
  attrsText: string;
  /** 数量 */
  quantity: number;
  /** id */
  id: string;
  /** 商品名称 */
  name: string;
  /** 实付单价 */
  payPrice?: number;
  /** 图片 */
  image: string;
  /** 原单价 */
  price: number;
  /**商品折扣 */
  discount: number;
  /** SKUID */
  skuId: string;
  /** 实付价格小计 */
  totalPayPrice: string;
};

/** 提交订单 请求参数 */
export type OrderCreateParams = {
  /** 所选地址Id */
  addressId?: string;
  /** 订单备注 */
  note?: string;
  /** 商品集合[ 商品信息 ] */
  goods: {
    /** 数量 */
    count: number;
    /** skuId */
    skuId: string;
  }[];
  /**配送方式 */
  postType: number;
};

/** 提交订单 返回信息 */
export type OrderCreateResult = {
  /** 订单Id */
  id: string;
};
/** 订单详情 返回信息 */
export type OrderResult = {
  /** 订单id */
  id: string;
  /**订单号 */
  orderSn: string;
  /** 订单状态，1为待付款、2为待发货、3为待收货、4为待评价、5为已完成、6为已取消 */
  status: OrderState;
  /**配送方式 */
  postType: number;
  /** 倒计时--剩余的秒数 -1 表示已经超时，正数表示倒计时未结束 */
  countdown: number;
  /**用户地址 */
  userAddress?: Omit<AddressItem, "id" | "isDefault">;
  /** 商品总价 */
  totalAmount: number;
  /** 运费 */
  postFee?: number;
  /**折扣总额 */
  discountAmount: number;
  /** 应付金额 */
  payMoney: number;
  /**商品总件数 */
  totalNum: number;
  /** 商品集合 [ 商品信息 ] */
  skus: OrderSkuItem[];
  /**最迟支付时间 */
  payLatestTime: string;
  /** 下单时间 */
  createTime: string;
};

/** 商品信息 */
export type OrderSkuItem = {
  /** sku id */
  id: string;
  /** 商品 id */
  spuId: string;
  /** 商品名称 */
  name: string;
  /** 商品属性文字 */
  attrsText: string;
  /** 数量 */
  quantity: number;
  /** 购买时单价 */
  price: number;
  /**折扣 */
  discount: number;
  /** 图片地址 */
  image: string;
};

/** 物流信息 返回值类型 */
export type OrderLogisticResult = {
  /** 快递公司 */
  company: {
    /** 公司名称 */
    name: string;
    /** 快递编号 */
    number: string;
    /** 联系电话 */
    tel: string;
  };
  /** 商品件数 */
  count: number;
  /** 物流日志 */
  list: LogisticItem[];
};

/** 物流日志 */
export type LogisticItem = {
  /** 信息ID */
  id: string;
  /** 信息文字 */
  text: string;
  /** 时间 */
  time: string;
};

/** 订单列表参数 */
export type OrderListParams = PageQuery & { status: number };

/** 订单列表 */
export type OrderListResult = PageResult<OrderItem>;

/** 订单列表项 */
export type OrderItem = OrderResult & {
  /** 总件数 */
  totalNum: number;
};
