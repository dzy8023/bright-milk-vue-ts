import { ElTag, ElText } from "element-plus";

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
  {
    label: "接受人昵称",
    prop: "receivedUserNickname",
    slot: "receivedUserNickname",
    minWidth: 150
  },
  // 消息类型
  {
    label: "消息类型",
    prop: "messageType",
    slot: "messageType",
    minWidth: 130
  },
  // 编辑器类型
  {
    label: "编辑器类型",
    prop: "editorType",
    minWidth: 130,
    formatter({ editorType }) {
      return editorType === "rich" ? (
        <ElText type={"info"}>{editorType}</ElText>
      ) : (
        <ElText type={"warning"}>{editorType}</ElText>
      );
    }
  },
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
  // 0:未读 1:已读
  {
    label: "状态",
    prop: "status",
    formatter({ status }) {
      return status ? (
        <ElTag type={"info"} effect={"plain"}>
          已读
        </ElTag>
      ) : (
        <ElTag type={"danger"} effect={"plain"}>
          未读
        </ElTag>
      );
    },
    minWidth: 80
  },
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
  }
];
