import { reactive } from "vue";

// 表格列
export const columns: TableColumnList = [
  {
    type: "index",
    index: (index: number) => index + 1,
    label: "序号",
    minWidth: 60
  },
  // 任务名称
  { label: "任务名称", prop: "jobName" },
  // 任务分组
  { label: "任务分组", prop: "jobGroup" },
  // 任务详情
  { label: "任务详情", prop: "description" },
  // 任务类名称
  { label: "任务类名称", prop: "jobClassName" },
  // 触发器名称
  { label: "触发器名称", prop: "triggerName" },
  // 触发器状态
  { label: "触发器状态", prop: "triggerState" },
  // corn表达式
  { label: "corn表达式", prop: "cronExpression" },
  { label: "操作", fixed: "right", minWidth: 210, slot: "operation" }
];

// 添加规则
export const rules = reactive({
  // 任务名称
  jobName: [{ required: true, message: "输入任务名称", trigger: "blur" }],
  // 任务分组
  jobGroup: [{ required: true, message: "输入任务分组", trigger: "blur" }],
  // 任务类名称
  jobClassName: [
    { required: true, message: "输入任务类名称", trigger: "blur" }
  ],
  // corn表达式
  cronExpression: [
    { required: true, message: "输入corn表达式", trigger: "blur" }
  ]
});
