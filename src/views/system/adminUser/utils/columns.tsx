import { computed, ref } from "vue";
import type { FormRules } from "element-plus";
import { REGEXP_PWD } from "@/views/login/utils/rule";

// 是否是更新用户信息
export const isAddUserinfo = ref(false);

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
  { label: "用户名", prop: "username", minWidth: 260 },
  // 状态
  { label: "状态", prop: "status", slot: "status", minWidth: 100 },
  // 昵称
  { label: "昵称", prop: "nickname", minWidth: 260 },
  // 邮箱
  { label: "邮箱", prop: "email", minWidth: 260 },
  // 手机号
  { label: "手机号", prop: "phone", minWidth: 160 },
  // 头像
  { label: "头像", prop: "avatar", slot: "avatar", minWidth: 90 },
  // 性别
  { label: "性别", prop: "gender", slot: "gender", minWidth: 90 },
  // 登录的IP地址
  { label: "IP地址", prop: "ipAddress", minWidth: 130 },
  // IP地区
  { label: "归属地", prop: "ipRegion", minWidth: 130 },
  { label: "更新时间", prop: "updateTime", sortable: true, minWidth: 160 },
  { label: "创建时间", prop: "createTime", sortable: true, minWidth: 160 },
  { label: "创建用户", prop: "createUser", slot: "createUser", minWidth: 130 },
  { label: "更新用户", prop: "updateUser", slot: "updateUser", minWidth: 130 },
  { label: "操作", fixed: "right", width: 180, slot: "operation" }
];

// 添加规则
export const rules: any = computed<FormRules>(() => ({
  // 用户名
  username: [{ required: true, message: "输入用户名", trigger: "blur" }],
  // 密码
  password: [
    {
      required: isAddUserinfo.value,
      message: "输入密码",
      trigger: "blur"
    },
    {
      type: "pattern",
      message: "密码格式应为8-18位数字、字母、符号的任意两种组合",
      trigger: ["change", "blur"],
      pattern: REGEXP_PWD
    }
  ],
  // 邮箱
  email: [
    { required: true, message: "输入邮箱", trigger: ["change", "blur"] },
    {
      type: "email",
      message: "输入邮箱格式不正确",
      trigger: ["change", "blur"]
    }
  ],
  // 手机号
  phone: [
    {
      type: "pattern",
      message: "输入手机号格式不正确",
      trigger: ["change", "blur"],
      pattern:
        /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/
    }
  ],
  // 状态
  status: [{ required: true, message: "输入状态", trigger: "blur" }]
}));

export const defaultProps = {
  children: "children",
  value: "id",
  label: "deptName"
};
