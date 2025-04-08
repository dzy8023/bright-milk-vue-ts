import type { UploadUserFile } from "element-plus";

interface TabItem {
  id: number;
  name: string;
  image: string;
  href: string;
  type: number;
}
interface FormItemProps extends Omit<TabItem, "image"> {
  image: UploadUserFile[];
}
interface FormProps {
  formInline: FormItemProps;
}

export type { TabItem, FormItemProps, FormProps };
