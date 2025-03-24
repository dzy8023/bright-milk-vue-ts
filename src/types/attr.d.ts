/**属性：分为销售属性和商品规格属性 */
export type AttrItem = {
  /**属性id */
  id: number;
  /**属性名称 */
  name: string;
  /**属性值 */
  value: string;
  /**属性图标 */
  icon: string;
  /**属性描述 */
  desc: string;
  /**属性类型 */
  type: number;
  /**单选、多选 */
  choose?: 0 | 1;
};

/**商品规格属性 */
export type SpuAttr = {
  /**id */
  id: string;
  /**spu id */
  spuId: string;
  /**属性id */
  attrId: number;
  /**属性名称 */
  attrName: string;
  /**属性值 */
  value: string;
  /**属性图标 */
  icon?: string;
  /**属性描述 */
  desc?: string;
  /**是否快速展示 */
  quickShow: number;
};
/**sku属性 */
export type SkuAttr = Omit<SpuAttr, "spuId" | "quickShow"> & {
  /**sku id */
  skuId: string;
};
