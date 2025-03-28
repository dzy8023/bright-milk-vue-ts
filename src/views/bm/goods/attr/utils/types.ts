import type { AttrItem } from "@/types/attr";

interface FormItemProps extends Omit<AttrItem, "id" | "value" | "select"> {
  id?: number;
  title: string;
  value: string[];
}
interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
