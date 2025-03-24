<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { columns } from "@/views/system/power/utils/columns";
import PureTableBar from "@/components/RePureTableBar/src/bar";
import AddFill from "@iconify-icons/ri/add-circle-line";
import PureTable from "@pureadmin/table";
import {
  onAdd,
  onDelete,
  onDeleteBatch,
  onSearch,
  onUpdate,
  onUpdateBatchParent,
  powerIds
} from "@/views/system/power/utils/hooks";
import More from "@iconify-icons/ep/more-filled";

import Delete from "@iconify-icons/ep/delete";
import EditPen from "@iconify-icons/ep/edit-pen";
import Refresh from "@iconify-icons/ep/refresh";
import { selectUserinfo } from "@/components/ReTable/Userinfo/columns";

import { usePowerStore } from "@/store/system/power";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { handleTree } from "@pureadmin/utils";
import { FormInstance } from "element-plus";
import { auth } from "@/views/system/power/utils/auth";
import { hasAuth } from "@/router/utils";

const tableRef = ref();
const formRef = ref();
const powerStore = usePowerStore();
const dataList = computed(() => handleTree(powerStore.dataList));

/**
 * * 当前页改变时
 */
const onCurrentPageChange = async (value: number) => {
  powerStore.pagination.currentPage = value;
  await onSearch();
};

/**
 * * 当分页发生变化
 * @param value
 */
const onPageSizeChange = async (value: number) => {
  powerStore.pagination.pageSize = value;
  await onSearch();
};

/**
 * * 选择多行
 * @param rows
 */
const onSelectionChange = (rows: Array<any>) => {
  powerIds.value = rows.map((row: any) => row.id);
};

/**
 * 重置表单
 * @param formEl
 */
const resetForm = async (formEl: FormInstance) => {
  if (!formEl) return;
  formEl.resetFields();
  await onSearch();
};
computed(() => [
  "!h-[20px]",
  "reset-margin",
  "!text-gray-500",
  "dark:!text-white",
  "dark:hover:!text-primary"
]);
onMounted(() => {
  onSearch();
});
</script>

<template>
  <div class="main">
    <Auth :value="auth.search">
      <el-form
        ref="formRef"
        :inline="true"
        :model="powerStore.form"
        class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px] overflow-auto"
      >
        <el-form-item label="权限码" prop="powerCode">
          <el-input
            v-model="powerStore.form.powerCode"
            placeholder="输入权限码"
            class="!w-[180px]"
            clearable
          />
        </el-form-item>
        <el-form-item label="权限名称" prop="powerName">
          <el-input
            v-model="powerStore.form.powerName"
            placeholder="输入权限名称"
            class="!w-[180px]"
            clearable
          />
        </el-form-item>
        <el-form-item label="请求URL" prop="requestUrl">
          <el-input
            v-model="powerStore.form.requestUrl"
            placeholder="输入请求URL"
            class="!w-[180px]"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button
            :icon="useRenderIcon('ri:search-line')"
            :loading="powerStore.loading"
            type="primary"
            @click="onSearch"
          >
            搜索
          </el-button>
          <el-button :icon="useRenderIcon(Refresh)" @click="resetForm(formRef)">
            重置</el-button
          >
        </el-form-item>
      </el-form>
    </Auth>

    <PureTableBar
      :columns="columns"
      :isExpandAll="true"
      :tableRef="tableRef?.getTableRef()"
      title="权限管理"
      @fullscreen="tableRef.setAdaptive()"
      @refresh="onSearch"
    >
      <template #buttons>
        <!-- 添加权限按钮 -->
        <el-button
          v-if="hasAuth(auth.add)"
          :icon="useRenderIcon(AddFill)"
          type="primary"
          @click="onAdd()"
        >
          新增
        </el-button>

        <!-- 批量更新父级id -->
        <el-button
          v-if="hasAuth(auth.updateBatchByPowerWithParentId)"
          :disabled="!(powerIds.length > 0)"
          :icon="useRenderIcon(EditPen)"
          type="primary"
          @click="onUpdateBatchParent"
        >
          批量更新父级
        </el-button>

        <!-- 批量删除按钮 -->
        <el-button
          v-if="hasAuth(auth.deleted)"
          :disabled="!(powerIds.length > 0)"
          :icon="useRenderIcon(Delete)"
          type="danger"
          @click="onDeleteBatch"
        >
          批量删除
        </el-button>
      </template>

      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          ref="tableRef"
          :adaptiveConfig="{ offsetBottom: 96 }"
          :columns="dynamicColumns"
          :data="dataList"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
          :loading="powerStore.loading"
          :pagination="powerStore.pagination"
          :size="size"
          adaptive
          align-whole="center"
          border
          default-expand-all
          highlight-current-row
          row-key="id"
          showOverflowTooltip
          table-layout="auto"
          @page-size-change="onPageSizeChange"
          @page-current-change="onCurrentPageChange"
          @selection-change="onSelectionChange"
        >
          <template #createUser="{ row }">
            <el-button
              v-show="row.createUser"
              link
              type="primary"
              @click="selectUserinfo(row.createUser)"
            >
              {{ row.createUsername }}
            </el-button>
          </template>

          <template #updateUser="{ row }">
            <el-button
              v-show="row.updateUser"
              link
              type="primary"
              @click="selectUserinfo(row.updateUser)"
            >
              {{ row.updateUsername }}
            </el-button>
          </template>

          <template #operation="{ row }">
            <!-- 修改 -->
            <el-button
              v-if="hasAuth(auth.update)"
              :icon="useRenderIcon(EditPen)"
              :size="size"
              class="reset-margin"
              link
              type="primary"
              @click="onUpdate(row)"
            >
              修改
            </el-button>
            <!-- 添加 -->
            <el-button
              v-if="hasAuth(auth.add)"
              :icon="useRenderIcon(AddFill)"
              :size="size"
              class="reset-margin"
              link
              type="primary"
              @click="onAdd(row.id)"
            >
              新增
            </el-button>
            <!-- 更多操作 -->
            <el-dropdown>
              <el-button
                :icon="useRenderIcon(More)"
                :size="size"
                class="ml-3 mt-[2px]"
                link
                type="primary"
              />
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item v-if="hasAuth(auth.deleted)">
                    <!-- 删除 -->
                    <el-popconfirm
                      :title="`删除${row.powerName}?`"
                      @confirm="onDelete(row)"
                    >
                      <template #reference>
                        <el-button
                          :icon="useRenderIcon(Delete)"
                          :size="size"
                          class="reset-margin"
                          link
                          type="primary"
                        >
                          删除
                        </el-button>
                      </template>
                    </el-popconfirm>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>
