interface BannerItem {
  /**关联id */
  id: string;
  bannerId: number;
  name: string;
  image: string;
  href: string;
  type: number;
  sort?: number;
}
interface TabItem {
  id: number;
  catId?: number;
  catName?: string;
  name: string;
  desc: string;
  status: number;
  bannerList?: BannerItem[];
}
interface FormItemProps extends TabItem {
  categoryOptions: [];
  data: BannerItem[];
}
interface FormProps {
  formInline: FormItemProps;
}

export type { TabItem, FormItemProps, FormProps, BannerItem };
