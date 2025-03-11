import { addDialog } from "@/components/ReDialog/index";
import RoleDialog from "@/views/system/role/role-dialog.vue";
import { useRoleStore } from "@/store/system/role";
import { h, ref } from "vue";
import { message, messageBox } from "@/utils/message";
import type { FormItemProps } from "@/views/system/role/utils/types";

import { fetchGetPowerListByRoleId } from "@/api/system/power";
import { isAllEmpty } from "@pureadmin/utils";
import DeleteBatchDialog from "@/components/Table/DeleteBatchDialog.vue";

// 表格ref
export const tableRef = ref();
// 表单ref
export const formRef = ref();
// 展开权限内容ref
export const contentRef = ref();
// 权限树形结构ref
export const powerTreeRef = ref();
// 删除的id列表
export const deleteIds = ref([]);
// 是否显示权限菜单
export const powerTreeIsShow = ref(false);
// 选择的当前行
export const currentRow = ref();
const roleStore = useRoleStore();

/**
 * * 搜索初始化角色
 */
export async function onSearch() {
  roleStore.loading = true;
  await roleStore.getRoleList();
  roleStore.loading = false;
}

/** 添加角色 */
export function onAdd() {
  addDialog({
    title: "新增角色",
    width: "30%",
    props: { formInline: { roleCode: undefined, description: undefined } },
    draggable: true,
    fullscreenIcon: true,
    closeOnClickModal: false,
    contentRenderer: () => h(RoleDialog, { ref: formRef, formInline: null }),
    beforeSure: (done, { options }) => {
      const form = options.props.formInline as FormItemProps;
      formRef.value.formRef.validate(async (valid: any) => {
        if (!valid) return;

        const result = await roleStore.addRole(form);
        if (!result) return;
        done();
        await onSearch();
      });
    }
  });
}

/**
 * * 更新角色
 * @param row
 */
export function onUpdate(row: any) {
  addDialog({
    title: "修改角色",
    width: "30%",
    props: {
      formInline: { roleCode: row.roleCode, description: row.description }
    },
    draggable: true,
    fullscreenIcon: true,
    closeOnClickModal: false,
    contentRenderer: () => h(RoleDialog, { ref: formRef, formInline: null }),
    beforeSure: (done, { options }) => {
      const form = options.props.formInline as FormItemProps;
      formRef.value.formRef.validate(async (valid: any) => {
        if (!valid) return;

        const result = await roleStore.updateRole({ ...form, id: row.id });
        if (!result) return;
        done();
        await onSearch();
      });
    }
  });
}

/** 删除角色 */
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
  await roleStore.deleteRole([id]);
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
            await roleStore.deleteRole(ids);
            await onSearch();

            done();
          } else message("取消", { type: "warning" });
        }
      );
    }
  });
};

/**
 * 菜单权限
 * @param row
 */
export const onMenuPowerClick = async (row: any) => {
  const { id } = row;

  if (isAllEmpty(id)) {
    currentRow.value = null;
    powerTreeIsShow.value = false;
  } else {
    currentRow.value = row;
    powerTreeIsShow.value = true;
    const { result } = await fetchGetPowerListByRoleId({ id });
    powerTreeRef.value.setCheckedKeys(result);
  }
};
