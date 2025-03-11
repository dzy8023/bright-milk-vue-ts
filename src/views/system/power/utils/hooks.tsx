import { addDialog } from "@/components/ReDialog/index";
import PowerDialog from "@/views/system/power/power-dialog.vue";
import { usePowerStore } from "@/store/system/power";
import { h, reactive, ref } from "vue";
import { message, messageBox } from "@/utils/message";
import type { FormItemProps } from "@/views/system/power/utils/types";

import { handleTree } from "@pureadmin/utils";
import { powerCascadeProps } from "@/views/system/power/utils/columns";
import { ElCascader, ElForm, ElFormItem } from "element-plus";
import DeleteBatchDialog from "@/components/Table/DeleteBatchDialog.vue";

export const formRef = ref();
// 批量点击id列表
export const powerIds = ref([]);
const powerStore = usePowerStore();

/** 搜索初始化权限 */
export async function onSearch() {
  powerStore.loading = true;
  await powerStore.getPowerList();
  powerStore.loading = false;
}

/** 添加权限 */
export function onAdd(parentId = 0) {
  addDialog({
    title: "新增权限",
    width: "30%",
    props: {
      formInline: {
        parentId,
        powerCode: undefined,
        powerName: undefined,
        requestUrl: undefined
      }
    },
    draggable: true,
    fullscreenIcon: true,
    closeOnClickModal: false,
    contentRenderer: () => h(PowerDialog, { ref: formRef, formInline: null }),
    beforeSure: (done, { options }) => {
      const form = options.props.formInline as FormItemProps;
      formRef.value.formRef.validate(async (valid: any) => {
        if (!valid) return;

        const result = await powerStore.addPower(form);
        if (!result) return;
        done();
        await onSearch();
      });
    }
  });
}

/**
 * * 更新权限
 * @param row
 */
export function onUpdate(row: any) {
  addDialog({
    title: "修改权限",
    width: "30%",
    props: {
      formInline: {
        parentId: row.parentId,
        powerCode: row.powerCode,
        powerName: row.powerName,
        requestUrl: row.requestUrl
      }
    },
    draggable: true,
    fullscreenIcon: true,
    closeOnClickModal: false,
    contentRenderer: () => h(PowerDialog, { ref: formRef, formInline: null }),
    beforeSure: (done, { options }) => {
      const form = options.props.formInline as FormItemProps;
      formRef.value.formRef.validate(async (valid: any) => {
        if (!valid) return;

        const result = await powerStore.updatePower({ ...form, id: row.id });
        if (!result) return;
        done();
        await onSearch();
      });
    }
  });
}

/** 删除权限 */
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
  await powerStore.deletePower([id]);
  await onSearch();
};

/** 批量删除 */
export const onDeleteBatch = async () => {
  const ids = powerIds.value;
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
            await powerStore.deletePower(ids);
            await onSearch();

            done();
          } else message("取消", { type: "warning" });
        }
      );
    }
  });
};

/** 批量更新父级id */
export const onUpdateBatchParent = async () => {
  const formUpdateParentRef = ref();
  const form = reactive({
    ids: powerIds.value,
    parentId: undefined
  });

  await powerStore.getAllPowers();
  addDialog({
    title: "批量更新父级",
    width: "30%",
    draggable: true,
    fullscreenIcon: true,
    closeOnClickModal: false,
    contentRenderer: () => (
      <ElForm ref={formUpdateParentRef} model={form}>
        <ElFormItem
          rules={{
            required: true,
            message: "请选择父级权限",
            trigger: "blur"
          }}
          label="图标名称"
          prop={"parentId"}
        >
          <ElCascader
            v-model={form.parentId}
            options={handleTree(powerStore.allPowerList)}
            props={powerCascadeProps}
            class={"w-full"}
            clearable
            filterable
            show-all-levels
          />
        </ElFormItem>
      </ElForm>
    ),
    beforeSure: (done, _) => {
      formUpdateParentRef.value.validate(async (valid: any) => {
        if (!valid) return;

        const result = await powerStore.updateBatchByPowerWithParentId(form);
        if (!result) return;

        done();
        await onSearch();
      });
    }
  });
};
