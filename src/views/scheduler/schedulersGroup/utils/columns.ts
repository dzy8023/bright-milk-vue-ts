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
  // 分组名称
  { label: "分组名称", prop: "groupName" },
  // 分组详情
  { label: "任务调度详情", prop: "description" },
  { label: "更新时间", prop: "updateTime", sortable: true, width: 160 },
  { label: "创建时间", prop: "createTime", sortable: true, width: 160 },
  { label: "创建用户", prop: "createUser", slot: "createUser", width: 130 },
  { label: "更新用户", prop: "updateUser", slot: "updateUser", width: 130 },
  { label: "操作", fixed: "right", width: 210, slot: "operation" }
];

// 添加规则
export const rules = reactive({
  // 分组名称
  groupName: [{ required: true, message: "输入分组名称", trigger: "blur" }],
  // 分组详情
  description: [{ required: true, message: "输入分组详情", trigger: "blur" }]
});
