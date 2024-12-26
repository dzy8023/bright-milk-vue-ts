import type { GoodsItem, CategoryItem } from "./item";

/**商品信息 */
export type GoodsResult = {
  /**spuId*/
  id: string;
  /** 商品名称*/
  name: string;
  /**商品描述 */
  desc: string;
  /**商品价格*/
  price: string;
  /** 商品图片 */
  mainImages: string[];
  /**商品折扣 */
  discount: number; //折扣
  /**商品销量*/
  sales: number;
  /**sku销售属性集合 */
  specs: SpecItem[]; //可选规格集合备注[ 可选规格信息 ]
  /** sku集合 */
  skus: SkuItem[];
  /**分类完整路径 */
  categories: CategoryItem[];
  /**商品详情: 包含详情属性 + 详情图片 */
  details: Details;
  /**相似商品  */
  similarProducts: GoodsItem[]; //相似商品
  hotByDay?: GoodsItem[]; //今日热销
  recommends?: any; //TODO:推荐商品
};
/** 商品详情，包含详情属性+详情图片 */
export type Details = {
  /** 商品属性集合*/
  properties: DetailsPropertyItem[];
  /**商品详情图片集合 */
  images: string[];
};

/**属性信息*/
export type DetailsPropertyItem = {
  /**属性名称 */
  name: string;
  /**属性值*/
  value: string;
};

/**sku数据模型*/
export type SkuItem = {
  /**sku_id */
  id: string;
  /** sku描述 */
  desc: string;
  /** 会员折扣 */
  discount: number;

  /** sku图片*/
  image: string;
  /**sku价格 */
  price: number;

  /** sku库存*/
  stock: number;
  /** sku销售属性,规格集合 */
  specs: SkuSpecItem[];
};
/** 规格信息 */
export type SkuSpecItem = {
  /** 销售属性名  */
  name: string;
  /** 销售属性值  */
  valueName: string;
};

/** 可选规格信息 */
export type SpecItem = {
  /**规格id*/
  id: number;
  /**规格名称 */
  name: string;
  /** 可选值集合*/
  values: SpecValueItem[];
};

/** 可选值信息 */
export type SpecValueItem = {
  /** 可选值名称 */
  name: string;
  /** 可选值图片链接 */
  image: string;
};
