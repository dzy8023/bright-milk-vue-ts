import type { ContextProps } from "@/components/ReSplitPane";
import { reactive } from "vue";

export const rules = {
  // 消息标题
  title: [{ required: true, message: "输入消息标题", trigger: "blur" }],
  // 消息类型
  messageTypeId: [{ required: true, message: "输入消息类型", trigger: "blur" }],
  // 消息内容
  content: [{ required: true, message: "输入消息内容", trigger: "blur" }],
  // 编辑器类型
  editorType: [{ required: true, message: "输入编辑器类型", trigger: "blur" }],
  // 消息简介
  summary: [{ required: true, message: "输入消息简介", trigger: "blur" }]
};

export const messageLevel = ["primary", "success", "warning", "info", "danger"];

export const settingLR: ContextProps = reactive({
  minPercent: 20,
  defaultPercent: 80,
  split: "vertical"
});
