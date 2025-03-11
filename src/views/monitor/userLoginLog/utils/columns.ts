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
  // 用户名
  { label: "用户名", prop: "username", minWidth: 180 },
  // 登录Ip
  { label: "IP地址", prop: "ipAddress", minWidth: 130 },
  // 登录Ip归属地
  { label: "IP归属地", prop: "ipRegion", minWidth: 160 },
  // 登录时代理
  { label: "用户代理", prop: "userAgent", minWidth: 200 },
  // 操作类型
  { label: "操作类型", prop: "type", minWidth: 130 },
  // 标识客户端是否是通过Ajax发送请求的
  {
    label: "请求方法",
    prop: "xRequestedWith",
    minWidth: 150
  },
  // 登录token
  { label: "令牌", prop: "token", minWidth: 200 },
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
