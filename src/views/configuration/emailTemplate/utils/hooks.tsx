import { addDialog } from "@/components/ReDialog/index";
import EmailTemplateDialog from "@/views/configuration/emailTemplate/email-template-dialog.vue";
import { useEmailTemplateStore } from "@/store/configuration/emailTemplate";
import { h, ref } from "vue";
import { message, messageBox } from "@/utils/message";
import type { FormItemProps } from "@/views/configuration/emailTemplate/utils/types";
import DeleteBatchDialog from "@/components/Table/DeleteBatchDialog.vue";

// 选择的row列表
export const selectRows = ref([]);
export const formRef = ref();
const emailTemplateStore = useEmailTemplateStore();

/** 搜索初始化邮件模板表 */
export async function onSearch() {
  emailTemplateStore.loading = true;
  await emailTemplateStore.getEmailTemplateList();
  emailTemplateStore.loading = false;
}

/** 添加邮件模板表 */
export function onAdd() {
  addDialog({
    title: "新增邮件模板",
    width: "30%",
    props: {
      formInline: {
        templateName: undefined,
        emailUser: undefined,
        subject: undefined,
        isDefault: undefined,
        body: undefined,
        type: undefined
      }
    },
    draggable: true,
    fullscreenIcon: true,
    closeOnClickModal: false,
    contentRenderer: () =>
      h(EmailTemplateDialog, { ref: formRef, formInline: null }),
    beforeSure: (done, { options }) => {
      const form = options.props.formInline as FormItemProps;
      formRef.value.formRef.validate(async (valid: any) => {
        if (!valid) return;

        const result = await emailTemplateStore.addEmailTemplate(form);
        if (!result) return;
        done();
        await onSearch();
      });
    }
  });
}

/**
 * * 更新邮件模板表
 * @param row
 */
export function onUpdate(row: any) {
  addDialog({
    title: "修改邮件模板",
    width: "30%",
    props: {
      formInline: {
        templateName: row.templateName,
        emailUser: row.emailUser,
        subject: row.subject,
        isDefault: row.isDefault,
        body: row.body,
        type: row.type
      }
    },
    draggable: true,
    fullscreenIcon: true,
    closeOnClickModal: false,
    contentRenderer: () =>
      h(EmailTemplateDialog, { ref: formRef, formInline: null }),
    beforeSure: (done, { options }) => {
      const form = options.props.formInline as FormItemProps;
      formRef.value.formRef.validate(async (valid: any) => {
        if (!valid) return;

        const result = await emailTemplateStore.updateEmailTemplate({
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

/** 删除邮件模板表 */
export const onDelete = async (row: any) => {
  const id = row.id;

  // 是否确认删除
  const result = await messageBox({
    title: "是否确认删除",
    showMessage: false,
    confirmMessage: undefined,
    cancelMessage: "取消"
  });
  if (!result) return;

  // 删除数据
  await emailTemplateStore.deleteEmailTemplate([id]);
  await onSearch();
};

/** 批量删除 */
export const onDeleteBatch = async () => {
  const ids = selectRows.value.map((row: any) => row.id);
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
            await emailTemplateStore.deleteEmailTemplate(ids);
            await onSearch();

            done();
          } else message("批量删除", { type: "warning" });
        }
      );
    }
  });
};

/** 查看模板 */
export const viewTemplate = (template: string) => {
  addDialog({
    title: "查看模板",
    draggable: true,
    fullscreenIcon: true,
    closeOnClickModal: false,
    contentRenderer: () => <div v-html={template} />
  });
};
