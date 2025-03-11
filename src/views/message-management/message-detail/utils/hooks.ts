import { ref } from "vue";
import { messageBox } from "@/utils/message";

import { useMessageUserStore } from "@/store/message/messageUser";

// 删除ids
export const selectIds = ref([]);
const messageUserStore = useMessageUserStore();

/** 搜索初始化系统消息 */
export const onSearch = async (messageType?: string) => {
  messageUserStore.loading = true;
  if (messageType) {
    messageUserStore.form.messageType = messageType;
  }
  await messageUserStore.getMessageList();
  messageUserStore.loading = false;
};

/** 删除系统消息 */
export const onDelete = async () => {
  const ids = selectIds.value;

  // 是否确认删除
  const result = await messageBox({
    title: "是否确认删除",
    showMessage: false,
    confirmMessage: undefined,
    cancelMessage: "取消"
  });
  if (!result) return;

  // 删除数据
  await messageUserStore.deleteUserMessageByIds(ids);
  await onSearch();
};

/** 标为已读 */
export const markAsRead = async () => {
  const ids = selectIds.value;

  // 是否确认标为已读
  const result = await messageBox({
    title: "标为已读",
    showMessage: false,
    confirmMessage: undefined,
    cancelMessage: "取消"
  });
  if (!result) return;

  // 标为已读
  await messageUserStore.updateUserMarkAsRead(ids);
  await onSearch();
};

/** 全部标为已读 */
export const markAsAllRead = async () => {
  const ids = messageUserStore.datalist.map(
    message => message.messageReceivedId
  );

  // 是否确认标为已读
  const result = await messageBox({
    title: "全部标为已读",
    showMessage: false,
    confirmMessage: undefined,
    cancelMessage: "取消"
  });
  if (!result) return;

  // 标为已读
  await messageUserStore.updateUserMarkAsRead(ids);
  await onSearch();
};
