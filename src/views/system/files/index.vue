<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { columns } from "@/views/system/files/utils/columns";
import PureTableBar from "@/components/RePureTableBar/src/bar";
import AddFill from "@iconify-icons/ri/add-circle-line";
import PureTable from "@pureadmin/table";
import {
  onAdd,
  onDelete,
  onDeleteBatch,
  onDownload,
  onDownloadBatch,
  onSearch,
  onUpdate,
  selectRows
} from "@/views/system/files/utils/hooks";
import Delete from "@iconify-icons/ep/delete";
import Download from "@iconify-icons/ep/download";
import EditPen from "@iconify-icons/ep/edit-pen";
import Refresh from "@iconify-icons/ep/refresh";
import { selectUserinfo } from "@/components/ReTable/Userinfo/columns";

import { useFilesStore } from "@/store/monitor/files";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { FormInstance } from "element-plus";
import { auth } from "@/views/system/files/utils/auth";
import { hasAuth } from "@/router/utils";

const tableRef = ref();
const formRef = ref();
const filesStore = useFilesStore();

/** 当前页改变时 */
const onCurrentPageChange = async (value: number) => {
  filesStore.pagination.currentPage = value;
  await onSearch();
};

/** 当分页发生变化 */
const onPageSizeChange = async (value: number) => {
  filesStore.pagination.pageSize = value;
  await onSearch();
};

/** 重置表单 */
const resetForm = async (formEl: FormInstance) => {
  if (!formEl) return;
  formEl.resetFields();
  await onSearch();
};

/** 选择多行 */
const onSelectionChange = (rows: Array<any>) => {
  selectRows.value = rows;
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
        :model="filesStore.form"
        class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px] overflow-auto"
      >
        <el-form-item label="文件名称" prop="filename">
          <el-input
            v-model="filesStore.form.filename"
            placeholder="输入文件名称"
            class="!w-[180px]"
            clearable
          />
        </el-form-item>
        <el-form-item label="文件路径" prop="filepath">
          <el-input
            v-model="filesStore.form.filepath"
            placeholder="输入文件路径"
            class="!w-[180px]"
            clearable
          />
        </el-form-item>
        <el-form-item label="文件类型" prop="fileType">
          <el-input
            v-model="filesStore.form.fileType"
            placeholder="输入文件类型"
            class="!w-[180px]"
            clearable
          />
        </el-form-item>
        <el-form-item label="下载量" prop="downloadCount">
          <el-input
            v-model="filesStore.form.downloadCount"
            placeholder="输入下载量"
            class="!w-[180px]"
            clearable
            min="0"
            type="number"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            :icon="useRenderIcon('ri:search-line')"
            :loading="filesStore.loading"
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
      title="系统文件管理"
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

        <!-- 批量下载 -->
        <el-button
          v-if="hasAuth(auth.downloadFilesByFileId)"
          :disabled="!(selectRows.length > 0)"
          :icon="useRenderIcon(Download)"
          type="success"
          @click="onDownloadBatch"
        >
          批量下载
        </el-button>

        <!-- 批量删除按钮 -->
        <el-button
          v-if="hasAuth(auth.deleted)"
          :disabled="!(selectRows.length > 0)"
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
          :data="filesStore.datalist"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
          :loading="filesStore.loading"
          :pagination="filesStore.pagination"
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
            <el-button
              v-if="hasAuth(auth.downloadFilesByFileId)"
              :icon="useRenderIcon(EditPen)"
              :size="size"
              class="reset-margin"
              link
              type="primary"
              @click="onDownload(row)"
            >
              下载
            </el-button>
            <el-popconfirm
              v-if="hasAuth(auth.deleted)"
              :title="`删除 ${row.filename}?`"
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
