export type BannerItem = {
  /**
   * 跳转链接
   */
  href: string;
  /**
   * ID 编号
   */
  id: string;
  /**
   * 图片链接
   */
  image: string;
  /**
   * 跳转类型跳转类型1、页面2、H5 3、小程序（小程序使用）
   */
  type: number;
};

export type HomeHotItem = {
  /**
   * 推荐说明
   */
  alt: string;
  /**
   * ID 编号
   */
  id: number;
  images: string[];
  /**
   * 推荐标题
   */
  title: string;
  /**
   * 跳转链接
   */
  href: string;
};
