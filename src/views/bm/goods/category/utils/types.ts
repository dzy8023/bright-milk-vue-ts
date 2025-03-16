interface FormItemProps {
  id?: number;
  /** 用于判断是`新增`还是`修改` */
  isAdd: boolean;
  parentId: number;
  layer: number;
  name: string;
  sort: number;
  status: number;
  higherCategoryOptions: [];
}
interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
