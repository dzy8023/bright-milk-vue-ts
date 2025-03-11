import { reactive } from "vue";

// 表格列
export const columns: TableColumnList = [
  { type: "selection", align: "left" },
  {
    type: "index",
    index: (index: number) => index + 1,
    label: "序号",
    width: 60
  },
  // icon 类名
  { label: "图标类名", prop: "iconCode", slot: "iconCode" },
  // icon 名称
  { label: "图标名称", prop: "iconName", slot: "iconName" },
  { label: "更新时间", prop: "updateTime", sortable: true },
  { label: "创建时间", prop: "createTime", sortable: true },
  { label: "创建用户", prop: "createUser", slot: "createUser", width: 130 },
  { label: "更新用户", prop: "updateUser", slot: "updateUser", width: 130 },
  { label: "操作", fixed: "right", width: 210, slot: "operation" }
];

// 添加规则
export const rules = reactive({
  // icon 类名
  iconCode: [{ required: true, message: "输入图标类名", trigger: "blur" }],
  // icon 名称
  iconName: [{ required: true, message: "输入图标名称", trigger: "blur" }]
});
