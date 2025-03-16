import { addDialog } from "@/components/ReDialog/index";
import SchedulersGroupDialog from "@/views/scheduler/schedulersGroup/schedulers-group-dialog.vue";
import { useSchedulersGroupStore } from "@/store/scheduler/schedulersGroup";
import { h, ref } from "vue";
import { message, messageBox } from "@/utils/message";
import type { FormItemProps } from "@/views/scheduler/schedulersGroup/utils/types";

import DeleteBatchDialog from "@/components/ReTable/DeleteBatchDialog.vue";

export const formRef = ref();
// 删除ids
export const deleteIds = ref([]);
const schedulersGroupStore = useSchedulersGroupStore();

/** 搜索初始化任务调度分组 */
export async function onSearch() {
  schedulersGroupStore.loading = true;
  await schedulersGroupStore.getSchedulersGroupList();
  schedulersGroupStore.loading = false;
}

/** 添加任务调度分组 */
export function onAdd() {
  addDialog({
    title: "新增任务调度分组",
    width: "30%",
    props: {
      formInline: {
        groupName: undefined,
        description: undefined
      }
    },
    draggable: true,
    fullscreenIcon: true,
    closeOnClickModal: false,
    contentRenderer: () =>
      h(SchedulersGroupDialog, { ref: formRef, formInline: null }),
    beforeSure: (done, { options }) => {
      const form = options.props.formInline as FormItemProps;
      formRef.value.formRef.validate(async (valid: any) => {
        if (!valid) return;

        const result = await schedulersGroupStore.addSchedulersGroup(form);
        if (!result) return;
        done();
        await onSearch();
      });
    }
  });
}

/**
 * * 更新任务调度分组
 * @param row
 */
export function onUpdate(row: any) {
  addDialog({
    title: "修改任务调度分组",
    width: "30%",
    props: {
      formInline: {
        groupName: row.groupName,
        description: row.description
      }
    },
    draggable: true,
    fullscreenIcon: true,
    closeOnClickModal: false,
    contentRenderer: () =>
      h(SchedulersGroupDialog, { ref: formRef, formInline: null }),
    beforeSure: (done, { options }) => {
      const form = options.props.formInline as FormItemProps;
      formRef.value.formRef.validate(async (valid: any) => {
        if (!valid) return;

        const result = await schedulersGroupStore.updateSchedulersGroup({
          ...form,
          id: row.id
        });
        if (!result) return;
        done();
        await onSearch();
      });
    }
  });
}

/** 删除任务调度分组 */
export const onDelete = async (row: any) => {
  const id = row.id;

  // 是否确认删除
  const result = await messageBox({
    title: "是否确认删除",
    showMessage: false,
    confirmMessage: undefined,
    cancelMessage: "取消删除"
  });
  if (!result) return;

  // 删除数据
  await schedulersGroupStore.deleteSchedulersGroup([id]);
  await onSearch();
};

/** 批量删除 */
export const onDeleteBatch = async () => {
  const ids = deleteIds.value;
  const formDeletedBatchRef = ref();

  addDialog({
    title: "批量删除",
    width: "30%",
    props: { formInline: { confirmText: "" } },
    draggable: true,
    fullscreenIcon: true,
    closeOnClickModal: false,
    contentRenderer: () => h(DeleteBatchDialog, { ref: formDeletedBatchRef }),
    beforeSure: (done, { options }) => {
      formDeletedBatchRef.value.formDeletedBatchRef.validate(
        async (valid: any) => {
          if (!valid) return;

          const text = options.props.formInline.confirmText.toLowerCase();
          if (text === "yes" || text === "y") {
            // 删除数据
            await schedulersGroupStore.deleteSchedulersGroup(ids);
            await onSearch();

            done();
          } else message("取消", { type: "warning" });
        }
      );
    }
  });
};
