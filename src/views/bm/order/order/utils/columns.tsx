import { reactive } from "vue";
import type { FormRules } from "element-plus";

// 表格列
export const columns: TableColumnList = [
  { type: "selection", align: "left" },
  {
    type: "index",
    index: (index: number) => index + 1,
    label: "序号",
    minWidth: 60
  },
  {
    label: "订单号",
    prop: "orderSn",
    slot: "orderSn",
    width: 180
  },
  {
    label: "用户名",
    prop: "username",
    slot: "username",
    width: 120
  },
  {
    label: "手机号",
    prop: "phone",
    width: 120
  },
  {
    label: "订单状态",
    prop: "status",
    sortable: true,
    slot: "status",
    minWidth: 90
  },
  {
    label: "订单来源",
    prop: "sourceType",
    slot: "sourceType",
    minWidth: 90
  },
  {
    label: "配送方式",
    prop: "postType",
    slot: "postType",
    minWidth: 90
  },
  {
    label: "总价",
    prop: "totalAmount",
    sortable: true,
    minWidth: 90
  },
  {
    label: "实付金额",
    prop: "payAmount",
    sortable: true,
    minWidth: 90
  },
  {
    label: "总折扣",
    prop: "discountAmount",
    sortable: true,
    minWidth: 90
  },
  {
    label: "配送费",
    prop: "postFee",
    sortable: true,
    minWidth: 90
  },
  { label: "更新时间", prop: "updateTime", sortable: true, minWidth: 160 },
  { label: "创建时间", prop: "createTime", sortable: true, minWidth: 160 },
  {
    label: "操作",
    fixed: "right",
    width: 210,
    slot: "operation"
  }
];
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
    label: "描述性文字",
    prop: "attrText",
    width: 120
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
  },
  {
    label: "数量",
    prop: "quantity",
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
