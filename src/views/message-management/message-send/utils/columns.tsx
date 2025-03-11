import { reactive } from "vue";

import { ElTag, type FormRules } from "element-plus";

// 表格列
export const columns: TableColumnList = [
  { type: "selection", align: "left" },
  {
    type: "index",
    index: (index: number) => index + 1,
    label: "序号",
    minWidth: 60
  },
  // 消息标题
  { label: "消息标题", prop: "title", minWidth: 150 },
  // 消息简介
  { label: "消息简介", prop: "summary", minWidth: 200 },
  // 发送人昵称
  {
    label: "发送人昵称",
    prop: "sendNickname",
    slot: "sendNickname",
    minWidth: 130
  },
  // 接受人昵称
  { label: "接受人昵称", prop: "receivedUserNickname", minWidth: 150 },
  // 消息类型
  {
    label: "消息类型",
    prop: "messageType",
    slot: "messageType",
    minWidth: 130
  },
  // 编辑器类型
  { label: "编辑器类型", prop: "editorType", minWidth: 105 },
  // 封面
  { label: "封面", prop: "cover", slot: "cover", minWidth: 80 },
  // 消息等级
  {
    label: "消息等级",
    prop: "level",
    formatter({ level }) {
      return (
        <ElTag type={level} effect={"plain"} round>
          {level}
        </ElTag>
      );
    },
    minWidth: 130
  },
  // 消息等级详情
  { label: "消息等级详情", prop: "extra", slot: "extra", minWidth: 230 },
  { label: "更新时间", prop: "updateTime", sortable: true, minWidth: 160 },
  { label: "创建时间", prop: "createTime", sortable: true, minWidth: 160 },
  { label: "创建用户", prop: "createUser", slot: "createUser", minWidth: 130 },
  { label: "更新用户", prop: "updateUser", slot: "updateUser", minWidth: 130 },
  { label: "操作", fixed: "right", minWidth: 150, slot: "operation" }
];

// 添加规则
export const rules = reactive<FormRules>({
  // 消息标题
  title: [{ required: true, message: "输入消息标题", trigger: "blur" }],
  // 发送人用户ID
  sendUserId: [
    { required: true, message: "输入发送人用户ID", trigger: "blur" }
  ],
  // 消息类型
  messageTypeId: [{ required: true, message: "输入消息类型", trigger: "blur" }],
  // 消息内容
  content: [{ required: true, message: "输入消息内容", trigger: "blur" }],
  // 编辑器类型
  editorType: [{ required: true, message: "输入编辑器类型", trigger: "blur" }]
});

/** 编辑器类型 */
export const editorTypeList = [
  { label: "Markdown", value: "markdown" },
  { label: "富文本", value: "rich" }
];
