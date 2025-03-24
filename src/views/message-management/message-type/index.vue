<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { columns } from "@/views/message-management/message-type/utils/columns";
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
} from "@/views/message-management/message-type/utils/hooks";
import Delete from "@iconify-icons/ep/delete";
import EditPen from "@iconify-icons/ep/edit-pen";
import Refresh from "@iconify-icons/ep/refresh";
import { selectUserinfo } from "@/components/ReTable/Userinfo/columns";

import { useMessageTypeStore } from "@/store/message/messageType";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { FormInstance } from "element-plus";
import { enabledOrNotStatus } from "@/enums/baseConstant";
import { usePublicHooks } from "@/views/hooks";
import { auth } from "@/views/message-management/message-type/utils/auth";
import { hasAuth } from "@/router/utils";

const tableRef = ref();
const formRef = ref();
const messageTypeStore = useMessageTypeStore();
// 用户是否停用样式
const { switchStyle } = usePublicHooks();

/** 当前页改变时 */
const onCurrentPageChange = async (value: number) => {
  messageTypeStore.pagination.currentPage = value;
  await onSearch();
};

/** 当分页发生变化 */
const onPageSizeChange = async (value: number) => {
  messageTypeStore.pagination.pageSize = value;
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
        :model="messageTypeStore.form"
        class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px] overflow-auto"
      >
        <!-- 消息名称 -->
        <el-form-item label="消息名称" prop="messageName">
          <el-input
            v-model="messageTypeStore.form.messageName"
            placeholder="输入消息名称"
            class="!w-[180px]"
            clearable
          />
        </el-form-item>

        <!-- 消息类型 -->
        <el-form-item label="消息类型" prop="messageType">
          <el-input
            v-model="messageTypeStore.form.messageType"
            placeholder="输入消息类型"
            class="!w-[180px]"
            clearable
          />
        </el-form-item>

        <!-- 消息备注 -->
        <el-form-item label="消息备注" prop="summary">
          <el-input
            v-model="messageTypeStore.form.summary"
            placeholder="输入消息备注"
            class="!w-[180px]"
            clearable
          />
        </el-form-item>

        <!-- 是否启用 -->
        <el-form-item label="是否启用" prop="status">
          <el-select
            v-model="messageTypeStore.form.status"
            placeholder="选择是否启用"
            class="!w-[180px]"
            clearable
            filterable
          >
            <el-option
              v-for="(item, index) in enabledOrNotStatus"
              :key="index"
              :label="item.label"
              :navigationBar="false"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button
            :icon="useRenderIcon('ri:search-line')"
            :loading="messageTypeStore.loading"
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
      title="系统消息类型"
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
          :data="messageTypeStore.dataList"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
          :loading="messageTypeStore.loading"
          :pagination="messageTypeStore.pagination"
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
          <template #status="{ row }">
            <el-switch
              v-model="row.status"
              active-text="启用"
              :active-value="true"
              inactive-text="禁用"
              :inactive-value="false"
              :style="switchStyle"
              disabled
              inline-prompt
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
              :title="`删除${row.messageName}?`"
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
