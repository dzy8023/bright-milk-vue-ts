import { addDialog } from "@/components/ReDialog/index";
import MemberDialog from "../member-dialog.vue";
import { h, reactive, ref } from "vue";
import { message, messageBox } from "@/utils/message";
import type { FormItemProps } from "./types";
import { isAddMember } from "./columns";
import ResetPasswordDialog from "@/components/ReTable/ResetPasswords.vue";
import DeleteBatchDialog from "@/components/ReTable/DeleteBatchDialog.vue";
import { useMemberStore } from "@/store/bm/member";

const memberStore = useMemberStore();
// 表单Ref
const formRef = ref();
// 重置密码表单校验Ref
const ruleFormByRestPasswordRef = ref();
// 重置密码表单
const restPasswordForm = reactive({
  memberId: void 0,
  password: ""
});
// 批量删除id列表
export const deleteIds = ref([]);
// 用户是否停用加载集合
export const switchLoadMap = ref({});

/**
 * * 搜索初始化用户信息
 */
export async function onSearch() {
  memberStore.loading = true;
  await memberStore.getMemberPage();
  memberStore.loading = false;
}

/** 添加/更新用户信息 */
export function openDialog(isAdd: boolean, row?: any) {
  isAddMember.value = isAdd;
  const title = isAdd ? "新增" : "修改";
  addDialog({
    title: `${title}用户`,
    width: "30%",
    props: {
      formInline: {
        username: row?.username || "",
        nickname: row?.nickname || "",
        phone: row?.phone || "",
        password: row?.password || "",
        avatar: row?.avatar || "",
        gender: row?.gender || 0,
        status: row?.status || false,
        birthday: row?.birthday || ""
      }
    },
    draggable: true,
    fullscreenIcon: true,
    closeOnClickModal: false,
    contentRenderer: () => h(MemberDialog, { ref: formRef, formInline: null }),
    beforeSure: (done, { options }) => {
      const form = options.props.formInline as FormItemProps;
      formRef.value.formRef.validate(async (valid: any) => {
        if (!valid) {
          console.log("error submit!!", valid);
          return;
        }
        let result;
        if (isAdd) {
          result = await memberStore.addMember(form);
        } else {
          result = await memberStore.updateMember(form);
        }

        if (!result) return;
        done();
        await onSearch();
      });
    }
  });
}

/** 删除用户信息 */
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
  await memberStore.deleteMember([id]);
  await onSearch();
};

/** 批量删除用户 */
export const onDeleteBatch = async () => {
  const formDeletedBatchRef = ref();

  addDialog({
    title: "批量删除",
    width: "30%",
    props: { formInline: { confirmText: "" } },
    draggable: true,
    fullscreenIcon: true,
    closeOnClickModal: false,
    contentRenderer: () =>
      h(DeleteBatchDialog, { ref: formDeletedBatchRef, formInline: null }),
    beforeSure: (done, { options }) => {
      formDeletedBatchRef.value.formDeletedBatchRef.validate(
        async (valid: any) => {
          if (!valid) return;

          const text = options.props.formInline.confirmText.toLowerCase();
          if (text === "yes" || text === "y") {
            // 删除数据
            await memberStore.deleteMember(deleteIds.value);
            await onSearch();

            done();
          } else message("取消", { type: "warning" });
        }
      );
    }
  });
};

/**
 * * 更新用户状态
 * @param row
 * @param index
 */
export const updateMemberStatus = async (row: any, index: number) => {
  // 点击时开始loading加载
  switchLoadMap.value[index] = Object.assign({}, switchLoadMap.value[index], {
    loading: true
  });

  // 是否确认修改弹窗内容
  const confirm = await messageBox({
    title: "是否要修改状态",
    showMessage: false,
    confirmMessage: undefined,
    cancelMessage: "取消"
  });

  // 如果不修改将值恢复到之前状态
  if (!confirm) {
    row.status = !row.status;
    switchLoadMap.value[index] = Object.assign({}, switchLoadMap.value[index], {
      loading: false
    });
    return;
  }

  // 修改用户状态
  const data = { memberId: row.id, status: row.status };
  const result = await memberStore.changeMemberStatus(data);
  if (!result) {
    row.status = !row.status;
    switchLoadMap.value[index] = Object.assign({}, switchLoadMap.value[index], {
      loading: false
    });
    return;
  }
  await onSearch();
  switchLoadMap.value[index] = Object.assign({}, switchLoadMap.value[index], {
    loading: false
  });
};

/**
 * * 重置密码
 * @param row
 */
export const onResetPassword = (row: any) => {
  addDialog({
    title: `重置${row.username}密码`,
    width: "30%",
    draggable: true,
    closeOnClickModal: false,
    fullscreenIcon: true,
    destroyOnClose: true,
    contentRenderer: () => (
      <ResetPasswordDialog
        ref={ruleFormByRestPasswordRef}
        form={restPasswordForm}
      />
    ),
    beforeSure: (done: any) => {
      ruleFormByRestPasswordRef.value.ruleFormRef.validate(
        async (valid: any) => {
          if (valid) {
            // 更新用户密码
            const data = {
              memberId: row.id,
              password: restPasswordForm.password
            };
            const result = await memberStore.resetPassword(data);

            // 更新成功关闭弹窗
            if (!result) return;
            restPasswordForm.password = "";
            restPasswordForm.memberId = undefined;
            done();
          }
        }
      );
    }
  });
};
