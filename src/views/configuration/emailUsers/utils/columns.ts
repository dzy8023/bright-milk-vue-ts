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
  // 邮箱
  { label: "邮箱", prop: "email", minWidth: 180 },
  // 密码
  { label: "密码", prop: "password", minWidth: 160 },
  // Host地址
  { label: "主机地址", prop: "host", minWidth: 150 },
  // 端口号
  { label: "端口", prop: "port", minWidth: 90 },
  // 邮箱协议
  { label: "smtp协议", prop: "smtpAgreement", minWidth: 115 },
  // 是否启用SSL
  { label: "是否默认", prop: "isDefault", slot: "isDefault", minWidth: 105 },
  // 是否为默认邮件
  { label: "SSL", prop: "openSSL", slot: "openSSL", minWidth: 100 },
  { label: "更新时间", prop: "updateTime", sortable: true, minWidth: 160 },
  { label: "创建时间", prop: "createTime", sortable: true, minWidth: 160 },
  { label: "创建用户", prop: "createUser", slot: "createUser", minWidth: 130 },
  { label: "更新用户", prop: "updateUser", slot: "updateUser", minWidth: 130 },
  { label: "操作", fixed: "right", minWidth: 210, slot: "operation" }
];

// 添加规则
export const rules: any = reactive({
  // 邮箱
  email: [
    { required: true, message: "输入邮箱", trigger: "blur" },
    { type: "email", message: "输入邮箱格式错误" }
  ],
  // 密码
  password: [{ required: true, message: "输入密码", trigger: "blur" }],
  // Host地址
  host: [{ required: true, message: "输入主机地址", trigger: "blur" }],
  // 端口号
  port: [{ required: true, message: "输入端口", trigger: "blur" }],
  // 是否启用SSL
  openSSL: [{ required: true, message: `SSL`, trigger: "blur" }],
  // 是否为默认邮件
  isDefault: [{ required: true, message: "输入是否默认", trigger: "blur" }]
});
