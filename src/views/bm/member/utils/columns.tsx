import { computed, ref } from "vue";
import dayjs from "dayjs";
import type { FormRules } from "element-plus";
import { REGEXP_PWD } from "@/views/login/utils/rule";

// 是否是更新会员信息
export const isAddMember = ref(false);

// 表格列
export const columns: TableColumnList = [
  { type: "selection", align: "left" },
  {
    type: "index",
    index: (index: number) => index + 1,
    label: "序号",
    minWidth: 60
  },
  // 会员名
  { label: "会员名", prop: "username", minWidth: 180 },
  // 昵称
  { label: "昵称", prop: "nickname", minWidth: 180 },
  // 手机号
  { label: "手机号", prop: "phone", minWidth: 160 },
  // 头像
  { label: "头像", prop: "avatar", slot: "avatar", minWidth: 90 },
  // 性别
  { label: "性别", prop: "gender", slot: "gender", minWidth: 90 },
  // 状态
  { label: "状态", prop: "status", slot: "status", minWidth: 100 },
  // 生日
  { label: "生日", prop: "birthday", minWidth: 130 },
  {
    label: "余额",
    prop: "balance",
    minWidth: 90,
    sortable: true,
    cellRenderer: ({ row, props }) => (
      <el-tag size={props.size} type="primary">
        {row.balance.toFixed(2)}
      </el-tag>
    )
  },
  {
    label: "积分",
    prop: "integration",
    minWidth: 90,
    sortable: true,
    cellRenderer: ({ row, props }) => (
      <el-tag size={props.size} type="success">
        {row.integration}
      </el-tag>
    )
  },

  {
    label: "创建时间",
    width: 180,
    prop: "createTime",
    sortable: true,
    formatter: ({ createTime }) =>
      dayjs(createTime).format("YYYY-MM-DD HH:mm:ss")
  },
  { label: "操作", fixed: "right", width: 180, slot: "operation" }
];

// 添加规则
export const rules: any = computed<FormRules>(() => ({
  // 会员名
  username: [{ required: true, message: "输入会员名", trigger: "blur" }],
  // 密码
  password: [
    {
      required: isAddMember.value,
      message: "输入密码",
      trigger: "blur"
    },
    {
      type: "pattern",
      message: "密码格式应为8-18位数字、字母、符号的任意两种组合",
      trigger: ["blur"],
      pattern: REGEXP_PWD
    }
  ],
  // 手机号
  phone: [
    {
      type: "pattern",
      message: "输入手机号格式不正确",
      trigger: ["blur"],
      pattern:
        /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/
    }
  ],
  // 状态
  status: [{ required: true, message: "输入状态", trigger: "blur" }]
}));
