<script lang="ts" setup>
import { onMounted, ref } from "vue";
import {
  columns,
  state
} from "@/views/monitor/schedulerExecuteLog/utils/columns";
import PureTableBar from "@/components/RePureTableBar/src/bar";
import PureTable from "@pureadmin/table";
import {
  deleteIds,
  onDelete,
  onDeleteBatch,
  onSearch,
  onView
} from "@/views/monitor/schedulerExecuteLog/utils/hooks";
import Delete from "@iconify-icons/ep/delete";
import Refresh from "@iconify-icons/ep/refresh";
import { selectUserinfo } from "@/components/ReTable/Userinfo/columns";

import { useQuartzExecuteLogStore } from "@/store/monitor/quartzExecuteLog";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { FormInstance } from "element-plus";
import View from "@iconify-icons/ep/view";
import VueJsonPretty from "vue-json-pretty";
import "vue-json-pretty/lib/styles.css";
import { auth } from "@/views/monitor/schedulerExecuteLog/utils/auth";
import { hasAuth } from "@/router/utils";

const tableRef = ref();
const formRef = ref();
const quartzExecuteLogStore = useQuartzExecuteLogStore();

/** 当前页改变时 */
const onCurrentPageChange = async (value: number) => {
  quartzExecuteLogStore.pagination.currentPage = value;
  await onSearch();
};

/** 当分页发生变化 */
const onPageSizeChange = async (value: number) => {
  quartzExecuteLogStore.pagination.pageSize = value;
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
        :model="quartzExecuteLogStore.form"
        class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px] overflow-auto"
      >
        <el-form-item label="任务名称" prop="jobName">
          <el-input
            v-model="quartzExecuteLogStore.form.jobName"
            placeholder="输入任务名称"
            class="!w-[180px]"
            clearable
          />
        </el-form-item>
        <el-form-item label="任务分组" prop="jobGroup">
          <el-input
            v-model="quartzExecuteLogStore.form.jobGroup"
            placeholder="输入任务分组"
            class="!w-[180px]"
            clearable
          />
        </el-form-item>
        <el-form-item label="任务类名" prop="jobClassName">
          <el-input
            v-model="quartzExecuteLogStore.form.jobClassName"
            placeholder="输入任务类名"
            class="!w-[180px]"
            clearable
          />
        </el-form-item>
        <el-form-item label="cron表达式" prop="cronExpression">
          <el-input
            v-model="quartzExecuteLogStore.form.cronExpression"
            placeholder="输入cron表达式"
            class="!w-[180px]"
            clearable
          />
        </el-form-item>
        <el-form-item label="触发器名称" prop="triggerName">
          <el-input
            v-model="quartzExecuteLogStore.form.triggerName"
            placeholder="输入触发器名称"
            class="!w-[180px]"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button
            :icon="useRenderIcon('ri:search-line')"
            :loading="quartzExecuteLogStore.loading"
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
      title="任务执行日志"
      @fullscreen="tableRef.setAdaptive()"
      @refresh="onSearch"
    >
      <template #buttons>
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
          :data="quartzExecuteLogStore.datalist"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
          :loading="quartzExecuteLogStore.loading"
          :pagination="quartzExecuteLogStore.pagination"
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
          <template #executeResult="{ row }">
            <VueJsonPretty
              :data="JSON.parse(row.executeResult)"
              :deep="state.deep"
              :editable="state.editable"
              :editable-trigger="state.editableTrigger as any"
              :show-double-quotes="state.showDoubleQuotes"
              :show-icon="state.showIcon"
              :show-length="state.showLength"
              :show-line="state.showLine"
              :show-line-number="state.showLineNumber"
            />
          </template>

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
              v-if="hasAuth(auth.search)"
              :icon="useRenderIcon(View)"
              :size="size"
              class="reset-margin"
              link
              type="primary"
              @click="onView(row)"
            >
              查看
            </el-button>
            <el-popconfirm
              v-if="hasAuth(auth.deleted)"
              :title="`删除${row.jobName}?`"
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
