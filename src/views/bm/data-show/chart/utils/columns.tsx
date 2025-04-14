import { reactive } from "vue";
import type { FormRules } from "element-plus";

//
export const skuColumns: TableColumnList = [
  {
    label: "id",
    prop: "id",
    slot: "id",
    width: 180
  },
  {
    label: "商品名称",
    prop: "name",
    slot: "name",
    width: 210
  },
  {
    label: "图片",
    prop: "image",
    slot: "image",
    width: 120
  },
  {
    label: "销量",
    prop: "sales",
    sortable: true,
    minWidth: 90
  },
  {
    label: "单价",
    prop: "price",
    sortable: true,
    minWidth: 90
  },
  {
    label: "折扣",
    prop: "discount",
    sortable: true,
    minWidth: 90
  }
];
/** 自定义表单规则校验 */
export const rules: any = reactive<FormRules>({
  name: [{ required: true, message: "属性名称为必填项", trigger: "blur" }],
  value: [{ required: true, message: "属性值为必填项", trigger: "blur" }],
  type: [
    { required: true, message: "属性类型为必填项", trigger: "blur" },
    { pattern: /^(0|1)$/, message: "属性类型值只能为0或1", trigger: "blur" }
  ]
});
// 树形选择器属性
export const treeProps = {
  value: "id",
  label: "name",
  children: "children",
  disabled: "status"
};
