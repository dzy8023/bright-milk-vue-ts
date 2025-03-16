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
  // 权限编码
  { label: "权限码", prop: "powerCode", minWidth: 350 },
  // 权限名称
  { label: "权限名称", prop: "powerName", minWidth: 320 },
  // 请求路径
  { label: "请求路径", prop: "requestUrl", minWidth: 360 },
  { label: "更新时间", prop: "updateTime", sortable: true, minWidth: 160 },
  { label: "创建时间", prop: "createTime", sortable: true, minWidth: 160 },
  { label: "创建用户", prop: "createUser", slot: "createUser", minWidth: 130 },
  { label: "更新用户", prop: "updateUser", slot: "updateUser", minWidth: 130 },
  { label: "操作", fixed: "right", width: 180, slot: "operation" }
];

// 添加规则
export const rules = reactive<FormRules>({
  // 权限编码
  powerCode: [{ required: true, message: "输入权限码", trigger: "blur" }],
  // 权限名称
  powerName: [{ required: true, message: "输入权限名称", trigger: "blur" }],
  // 请求地址
  requestUrl: [
    {
      type: "pattern",
      message: "请输入正确的请求路径",
      pattern: /^\/.*/,
      trigger: "change"
    }
  ]
});

// 权限树形结构props
export const powerCascadeProps = {
  value: "id",
  label: "powerName",
  emitPath: false,
  checkStrictly: true
};
