import { computed } from "vue";
import type { FormRules } from "element-plus";

const validateImage = (rule: any, value: any, callback: any) => {
  if (value && value.length > 0) {
    callback();
  } else {
    callback(new Error("请上传商品图片"));
  }
};
// 表格列
export const columns: TableColumnList = [
  { type: "selection", align: "left" },
  {
    type: "index",
    index: (index: number) => index + 1,
    label: "序号",
    minWidth: 60
  },
  // 轮播图名称
  { label: "轮播图名称", prop: "name", width: 180 },
  // 轮播图
  { label: "轮播图", prop: "image", slot: "image", width: 260 },
  // 跳转链接
  { label: "跳转链接", prop: "href", slot: "href", minWidth: 260 },
  // 跳转类型
  { label: "跳转类型", prop: "type", slot: "type", minWidth: 260 },
  {
    label: "操作",
    fixed: "right",
    width: 210,
    slot: "operation"
  }
];

// 添加规则
export const rules: any = computed<FormRules>(() => ({
  // 轮播图名称
  name: [{ required: true, message: "轮播图名称", trigger: "blur" }],
  // 轮播图
  image: [
    {
      required: true,
      validator: validateImage,
      trigger: "change"
    }
  ],
  href: [
    {
      required: true,
      message: '跳转链接必须以"/"开头',
      trigger: "blur",
      pattern: /^\/.*/
    }
  ]
}));
