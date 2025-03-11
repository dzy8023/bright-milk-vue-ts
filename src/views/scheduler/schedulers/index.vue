<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { columns } from "@/views/scheduler/schedulers/utils/columns";
import PureTableBar from "@/components/RePureTableBar/src/bar";
import AddFill from "@iconify-icons/ri/add-circle-line";
import PureTable from "@pureadmin/table";
import {
  onAdd,
  onDelete,
  onPause,
  onResume,
  onSearch,
  onUpdate
} from "@/views/scheduler/schedulers/utils/hooks";
import Delete from "@iconify-icons/ep/delete";
import EditPen from "@iconify-icons/ep/edit-pen";
import Refresh from "@iconify-icons/ep/refresh";
import { selectUserinfo } from "@/components/ReTable/Userinfo/columns";

import { useSchedulersStore } from "@/store/scheduler/schedulers";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { FormInstance } from "element-plus";
import { auth } from "@/views/scheduler/schedulers/utils/auth";
import { hasAuth } from "@/router/utils";

const tableRef = ref();
const formRef = ref();
const schedulersStore = useSchedulersStore();

/** 当前页改变时 */
const onCurrentPageChange = async (value: number) => {
  schedulersStore.pagination.currentPage = value;
  await onSearch();
};

/** 当分页发生变化 */
const onPageSizeChange = async (value: number) => {
  schedulersStore.pagination.pageSize = value;
  await onSearch();
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
        :model="schedulersStore.form"
        class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px] overflow-auto"
      >
        <el-form-item label="任务名称" prop="jobName">
          <el-input
            v-model="schedulersStore.form.jobName"
            placeholder="输入任务名称"
            class="!w-[180px]"
            clearable
          />
        </el-form-item>
        <el-form-item label="任务分组" prop="jobGroup">
          <el-input
            v-model="schedulersStore.form.jobGroup"
            placeholder="输入任务分组"
            class="!w-[180px]"
            clearable
          />
        </el-form-item>
        <el-form-item label="任务描述" prop="description">
          <el-input
            v-model="schedulersStore.form.description"
            placeholder="输入任务描述"
            class="!w-[180px]"
            clearable
          />
        </el-form-item>
        <el-form-item label="任务类名" prop="jobClassName">
          <el-input
            v-model="schedulersStore.form.jobClassName"
            placeholder="输入任务类名"
            class="!w-[180px]"
            clearable
          />
        </el-form-item>
        <el-form-item label="触发器名称" prop="triggerName">
          <el-input
            v-model="schedulersStore.form.triggerName"
            placeholder="输入触发器名称"
            class="!w-[180px]"
            clearable
          />
        </el-form-item>
        <el-form-item label="触发器状态" prop="triggerState">
          <el-input
            v-model="schedulersStore.form.triggerState"
            placeholder="输入触发器状态"
            class="!w-[180px]"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button
            :icon="useRenderIcon('ri:search-line')"
            :loading="schedulersStore.loading"
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
      title="Schedulers视图"
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
      </template>

      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          ref="tableRef"
          :adaptiveConfig="{ offsetBottom: 96 }"
          :columns="dynamicColumns"
          :data="schedulersStore.datalist"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
          :loading="schedulersStore.loading"
          :pagination="schedulersStore.pagination"
          :size="size"
          adaptive
          align-whole="center"
          border
          highlight-current-row
          row-key="id"
          showOverflowTooltip
          table-layout="auto"
          @page-size-change="onPageSizeChange"
          @page-current-change="onCurrentPageChange"
        >
          <template #createUser="{ row }">
            <el-button
              v-show="row.createUser"
              link
              type="primary"
              @click="selectUserinfo(row.createUser)"
            >
              创建用户
            </el-button>
          </template>

          <template #updateUser="{ row }">
            <el-button
              v-show="row.updateUser"
              link
              type="primary"
              @click="selectUserinfo(row.updateUser)"
            >
              更新用户
            </el-button>
          </template>

          <template #operation="{ row }">
            <el-button
              :icon="useRenderIcon(EditPen)"
              :size="size"
              class="reset-margin"
              link
              type="primary"
              @click="onUpdate(row)"
            >
              修改
            </el-button>

            <!-- 暂停-->
            <Auth :value="auth.pause">
              <el-button
                v-if="row.triggerState !== 'PAUSED'"
                :icon="useRenderIcon('line-md:pause')"
                :size="size"
                class="reset-margin"
                link
                type="primary"
                @click="onPause(row)"
              >
                暂停
              </el-button>
            </Auth>

            <!-- 恢复 -->
            <Auth :value="auth.resume">
              <el-button
                v-if="row.triggerState === 'PAUSED'"
                :icon="useRenderIcon('material-symbols:resume')"
                :size="size"
                class="reset-margin"
                link
                type="primary"
                @click="onResume(row)"
              >
                恢复
              </el-button>
            </Auth>

            <!-- 删除 -->
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
