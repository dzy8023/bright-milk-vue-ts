import { reactive } from "vue";

// 表格列
export const columns: TableColumnList = [
  { type: "selection", align: "left" },
  {
    type: "index",
    index: (index: number) => index + 1,
    label: "序号",
    minWidth: 60
  },
  // 任务名称
  { label: "任务名称", prop: "jobName", minWidth: 100 },
  // 任务分组
  { label: "任务分组", prop: "jobGroup", minWidth: 100 },
  // 执行任务类名
  {
    label: "任务类名",
    prop: "jobClassName",
    minWidth: 300
  },
  // 执行任务core表达式
  {
    label: "core表达式",
    prop: "cronExpression",
    minWidth: 120
  },
  // 触发器名称
  {
    label: "触发器名称",
    prop: "triggerName",
    minWidth: 100
  },
  // 执行结果
  {
    label: "执行结果",
    prop: "executeResult",
    minWidth: 410,
    slot: "executeResult"
  },
  // 执行时间
  { label: "执行时间", prop: "duration", minWidth: 100 },
  {
    label: "更新时间",
    prop: "updateTime",
    sortable: true,
    minWidth: 160
  },
  {
    label: "创建时间",
    prop: "createTime",
    sortable: true,
    minWidth: 160
  },
  {
    label: "创建用户",
    prop: "createUser",
    slot: "createUser",
    minWidth: 130
  },
  {
    label: "更新用户",
    prop: "updateUser",
    slot: "updateUser",
    minWidth: 130
  },
  {
    label: "操作",
    fixed: "right",
    minWidth: 160,
    slot: "operation"
  }
];
// 添加规则
export const rules = reactive({});

export const state = reactive({
  showLine: true,
  showLineNumber: true,
  showDoubleQuotes: true,
  showLength: true,
  editable: true,
  showIcon: true,
  editableTrigger: "click",
  deep: 3
});
