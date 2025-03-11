import { reactive } from "vue";
import { ElTag } from "element-plus";

// 表格列
export const columns: TableColumnList = [
  { type: "selection", align: "left" },
  {
    type: "index",
    index: (index: number) => index + 1,
    label: "序号",
    minWidth: 60
  },
  // 模板名称
  { label: "模板名称", prop: "templateName", minWidth: 150 },
  // 模板名称
  {
    label: "邮件模板用户",
    prop: "emailUser",
    slot: "emailUser",
    minWidth: 180
  },
  // 主题
  { label: "主题", prop: "subject", minWidth: 200 },
  // 邮件内容
  { label: "模板内容", prop: "body", minWidth: 150 },
  // 邮件类型
  { label: "模板类型", prop: "summary", minWidth: 150 },
  // 是否默认
  {
    label: "是否默认",
    prop: "isDefault",
    formatter({ isDefault }) {
      return isDefault ? (
        <ElTag type={"success"}>默认</ElTag>
      ) : (
        <ElTag size={"large"} type={"danger"}>
          不默认
        </ElTag>
      );
    },
    minWidth: 100
  },
  { label: "更新时间", prop: "updateTime", sortable: true, minWidth: 160 },
  { label: "创建时间", prop: "createTime", sortable: true, minWidth: 160 },
  { label: "创建用户", prop: "createUser", slot: "createUser", minWidth: 130 },
  { label: "更新用户", prop: "updateUser", slot: "updateUser", minWidth: 130 },
  { label: "操作", fixed: "right", minWidth: 210, slot: "operation" }
];

// 添加规则
export const rules = reactive({
  // 模板名称
  templateName: [{ required: true, message: "输入模板名称", trigger: "blur" }],
  // 模板名称
  emailUser: [{ required: true, message: "输入邮件模板用户", trigger: "blur" }],
  // 主题
  subject: [{ required: true, message: "输入主题", trigger: "blur" }],
  // 邮件内容
  body: [{ required: true, message: "输入模板内容", trigger: "blur" }],
  // 邮件类型
  type: [{ required: true, message: "输入模板类型", trigger: "blur" }]
});
