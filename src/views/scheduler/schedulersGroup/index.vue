<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { columns } from "@/views/scheduler/schedulersGroup/utils/columns";
import PureTableBar from "@/components/RePureTableBar/src/bar";
import AddFill from "@iconify-icons/ri/add-circle-line";
import PureTable from "@pureadmin/table";
import {
  deleteIds,
  onAdd,
  onDelete,
  onDeleteBatch,
  onSearch,
  onUpdate
} from "@/views/scheduler/schedulersGroup/utils/hooks";
import Delete from "@iconify-icons/ep/delete";
import EditPen from "@iconify-icons/ep/edit-pen";
import Refresh from "@iconify-icons/ep/refresh";
import { selectUserinfo } from "@/components/ReTable/Userinfo/columns";

import { useSchedulersGroupStore } from "@/store/scheduler/schedulersGroup";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { FormInstance } from "element-plus";
import { auth } from "@/views/scheduler/schedulersGroup/utils/auth";
import { hasAuth } from "@/router/utils";

const tableRef = ref();
const formRef = ref();
const schedulersGroupStore = useSchedulersGroupStore();

/** 当前页改变时 */
const onCurrentPageChange = async (value: number) => {
  schedulersGroupStore.pagination.currentPage = value;
  await onSearch();
};

/** 当分页发生变化 */
const onPageSizeChange = async (value: number) => {
  schedulersGroupStore.pagination.pageSize = value;
  await onSearch();
};

/** 选择多行 */
const onSelectionChange = (rows: Array<any>) => {
  deleteIds.value = rows.map((row: any) => row.id);
};

/** 重置表单 */
const resetForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  await onSearch();
};

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
        :model="schedulersGroupStore.form"
        class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px] overflow-auto"
      >
        <el-form-item label="分组名称" prop="groupName">
          <el-input
            v-model="schedulersGroupStore.form.groupName"
            placeholder="输入分组名称"
            class="!w-[180px]"
            clearable
          />
        </el-form-item>
        <el-form-item label="任务调度详情" prop="description">
          <el-input
            v-model="schedulersGroupStore.form.description"
            placeholder="任务调度详情"
            class="!w-[180px]"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button
            :icon="useRenderIcon('ri:search-line')"
            :loading="schedulersGroupStore.loading"
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
      title="任务调度分组"
      @fullscreen="tableRef.setAdaptive()"
      @refresh="onSearch"
    >
      <template #buttons>
        <el-button
          v-if="hasAuth(auth.add)"
          :icon="useRenderIcon(AddFill)"
          type="primary"
          @click="onAdd"
        >
          新增
        </el-button>

        <!-- 批量删除按钮 -->
        <el-button
          v-if="hasAuth(auth.deleted)"
          :disabled="!(deleteIds.length > 0)"
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
          :data="schedulersGroupStore.dataList"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
          :loading="schedulersGroupStore.loading"
          :pagination="schedulersGroupStore.pagination"
          :size="size"
          adaptive
          align-whole="center"
          border
          highlight-current-row
          row-key="id"
          showOverflowTooltip
          table-layout="auto"
          @page-size-change="onPageSizeChange"
          @selection-change="onSelectionChange"
          @page-current-change="onCurrentPageChange"
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
            <el-popconfirm
              v-if="hasAuth(auth.deleted)"
              :title="`删除${row.groupName}?`"
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
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>
