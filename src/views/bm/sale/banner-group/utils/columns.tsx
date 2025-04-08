import { computed } from "vue";
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
    label: "轮播图",
    prop: "bannerList",
    minWidth: 200,
    slot: "bannerList"
  },
  // 轮播图组名称
  { label: "轮播图组名", prop: "name", width: 180 },
  //分类名称
  { label: "分类名称", prop: "catName", width: 180 },
  // 描述
  { label: "描述", prop: "desc", minWidth: 260 },
  // status
  { label: "状态", prop: "status", slot: "status", width: 100 },
  //轮播图组件
  {
    label: "操作",
    fixed: "right",
    width: 210,
    slot: "operation"
  }
];

// 添加规则
export const rules: any = computed<FormRules>(() => ({
  // 轮播图组名称
  name: [{ required: true, message: "轮播图组名称", trigger: "blur" }]
}));
