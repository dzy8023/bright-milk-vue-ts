import { addDialog } from "@/components/ReDialog/index";
import AdminUserDialog from "@/views/system/adminUser/admin-user-dialog.vue";
import { useAdminUserStore } from "@/store/system/adminUser";
import { h, reactive, ref } from "vue";
import { message, messageBox } from "@/utils/message";
import type { FormItemProps } from "@/views/system/adminUser/utils/types";

import { isAddUserinfo } from "@/views/system/adminUser/utils/columns";
import ResetPasswordDialog from "@/components/ReTable/ResetPasswords.vue";
import { deviceDetection } from "@pureadmin/utils";
import CropperPreview from "@/components/ReCropperPreview";
import AssignUserToRole from "@/views/system/adminUser/assign-roles-to-user.vue";
import { fetchUploadAvatarByAdmin } from "@/api/system/adminUser";
import { useUserStore } from "@/store/system/user";
import DeleteBatchDialog from "@/components/ReTable/DeleteBatchDialog.vue";
import { UserAvatar } from "@/enums/baseConstant";

const adminUserStore = useAdminUserStore();
const userStore = useUserStore();
// 表单Ref
const formRef = ref();
// 剪裁头像的Ref
const cropRef = ref();
// 分配角色的Ref
const assignRolesRef = ref();
// 上传头像信息
const avatarInfo = ref();
// 重置密码表单校验Ref
const ruleFormByRestPasswordRef = ref();
// 重置密码表单
const restPasswordForm = reactive({
  userId: void 0,
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
  adminUserStore.loading = true;
  await adminUserStore.getAdminUserList();
  adminUserStore.loading = false;
}

/** 添加用户信息 */
export function onAdd() {
  isAddUserinfo.value = true;
  addDialog({
    title: "新增用户",
    width: "30%",
    props: {
      formInline: {
        username: undefined,
        nickname: undefined,
        email: undefined,
        phone: undefined,
        password: undefined,
        avatar: undefined,
        sex: undefined,
        summary: undefined,
        status: false,
        deptId: undefined
      }
    },
    draggable: true,
    fullscreenIcon: true,
    closeOnClickModal: false,
    contentRenderer: () =>
      h(AdminUserDialog, { ref: formRef, formInline: null }),
    beforeSure: (done, { options }) => {
      const form = options.props.formInline as FormItemProps;
      formRef.value.formRef.validate(async (valid: any) => {
        if (!valid) return;

        const result = await adminUserStore.addAdminUser(form);
        if (!result) return;
        done();
        await onSearch();
      });
    }
  });
}

/**
 * * 更新用户信息
 * @param row
 */
export function onUpdate(row: any) {
  isAddUserinfo.value = false;
  addDialog({
    title: "修改用户",
    width: "30%",
    props: {
      formInline: {
        username: row.username,
        nickname: row.nickname,
        email: row.email,
        phone: row.phone,
        password: row.password,
        avatar: row.avatar,
        sex: row.sex,
        summary: row.summary,
        status: row.status,
        deptId: row.deptId
      }
    },
    draggable: true,
    fullscreenIcon: true,
    closeOnClickModal: false,
    contentRenderer: () =>
      h(AdminUserDialog, { ref: formRef, formInline: null }),
    beforeSure: (done, { options }) => {
      const form = options.props.formInline as FormItemProps;
      formRef.value.formRef.validate(async (valid: any) => {
        if (!valid) return;
        const result = await adminUserStore.updateAdminUser({
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
  await adminUserStore.deleteAdminUser([id]);
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
            await adminUserStore.deleteAdminUser(deleteIds.value);
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
export const updateUserStatus = async (row: any, index: number) => {
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
  const data = { userId: row.id, status: row.status };
  const result = await adminUserStore.updateUserStatusByAdmin(data);
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
 * * 上传头像
 * @param row
 */
export const onUploadAvatar = (row: any) => {
  addDialog({
    title: "裁剪并上传头像",
    width: "40%",
    closeOnClickModal: false,
    fullscreen: deviceDetection(),
    contentRenderer: () =>
      h(CropperPreview, {
        ref: cropRef,
        imgSrc: row.avatar || UserAvatar,
        onCropper: info => (avatarInfo.value = info)
      }),
    beforeSure: async done => {
      // 上传头像
      const data = { userId: row.id, avatar: avatarInfo.value.blob };
      const result = await fetchUploadAvatarByAdmin(data);
      if (result.code !== 200) return;

      message(result.msg, { type: "success" });
      done();
      await onSearch();
    },
    closeCallBack: () => cropRef.value.hidePopover()
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
              userId: row.id,
              password: restPasswordForm.password
            };
            const result =
              await adminUserStore.updateAdminUserPasswordByManager(data);

            // 更新成功关闭弹窗
            if (!result) return;
            restPasswordForm.password = "";
            restPasswordForm.userId = undefined;
            done();
          }
        }
      );
    }
  });
};

/**
 * 为用户分配角色
 * @param row
 */
export const onAssignRolesToUser = (row: any) => {
  addDialog({
    title: `$为 ${row.username} 分配角色`,
    width: "45%",
    draggable: true,
    closeOnClickModal: false,
    fullscreenIcon: true,
    contentRenderer: () => (
      <AssignUserToRole ref={assignRolesRef} userId={row.id} />
    ),
    beforeSure: async (done: any) => {
      // 分配用户角色
      const data = {
        userId: row.id,
        roleIds: assignRolesRef.value.assignRoles
      };
      const result = await userStore.assignRolesToUsers(data);

      // 更新成功关闭弹窗
      if (!result) return;
      done();
    }
  });
};

/**
 * * 强制下线
 * @param row
 */
export const onForcedOffline = async (row: any) => {
  const id = row.id;
  const confirm = await messageBox({
    title: "强制下线",
    showMessage: false,
    confirmMessage: undefined,
    cancelMessage: "取消"
  });
  if (!confirm) return;

  adminUserStore.forcedOffline(id);
};
