import { reactive } from "vue";

import type { FormRules } from "element-plus";

// 表格列
export const columns: TableColumnList = [
  { type: "selection", align: "left" },
  {
    type: "index",
    index: (index: number) => index + 1,
    label: "序号",
    width: 60
  },
  // 是否启用
  { label: "是否启用", prop: "status", slot: "status" },
  // 消息名称
  { label: "消息名称", prop: "messageName" },
  // 消息类型
  { label: "消息类型", prop: "messageType" },
  // 消息备注
  { label: "消息备注", prop: "summary" },
  { label: "更新时间", prop: "updateTime", sortable: true, width: 160 },
  { label: "创建时间", prop: "createTime", sortable: true, width: 160 },
  { label: "创建用户", prop: "createUser", slot: "createUser", width: 130 },
  { label: "更新用户", prop: "updateUser", slot: "updateUser", width: 130 },
  { label: "操作", fixed: "right", width: 210, slot: "operation" }
];

// 添加规则
export const rules = reactive<FormRules>({
  // 消息名称
  messageName: [{ required: true, message: "请输入消息名称", trigger: "blur" }],
  // 消息类型
  messageType: [
    {
      required: true,
      message: "请输入消息类型",
      trigger: "blur"
    },
    {
      pattern: /^[a-z]+$/i,
      message: "输入必须为英文字符",
      trigger: ["blur", "change"]
    }
  ]
});
