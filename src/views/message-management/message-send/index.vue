<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { columns } from "@/views/message-management/message-send/utils/columns";
import PureTableBar from "@/components/RePureTableBar/src/bar";
import PureTable from "@pureadmin/table";
import {
  deleteIds,
  onDelete,
  onDeleteBatch,
  onSearch,
  onUpdate
} from "@/views/message-management/message-send/utils/hooks";
import Delete from "@iconify-icons/ep/delete";
import EditPen from "@iconify-icons/ep/edit-pen";
import Refresh from "@iconify-icons/ep/refresh";
import { selectUserinfo } from "@/components/ReTable/Userinfo/columns";

import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { FormInstance } from "element-plus";
import { messageLevel } from "@/views/message-management/message-editing/utils/columns";
import { isReadStatus } from "@/enums/baseConstant";
import { useMessageSendStore } from "@/store/message/messageSend";
import { useMessageTypeStore } from "@/store/message/messageType";
import { auth } from "@/views/message-management/message-send/utils/auth";
import { hasAuth } from "@/router/utils";

const tableRef = ref();
const formRef = ref();
const messageTypeStore = useMessageTypeStore();
const messageSendStore = useMessageSendStore();

/** 当前页改变时 */
const onCurrentPageChange = async (value: number) => {
  messageSendStore.pagination.currentPage = value;
  await onSearch();
};

/** 当分页发生变化 */
const onPageSizeChange = async (value: number) => {
  messageSendStore.pagination.pageSize = value;
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
        :model="messageSendStore.form"
        class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px] overflow-auto"
      >
        <!-- 消息标题 -->
        <el-form-item label="消息标题" prop="title">
          <el-input
            v-model="messageSendStore.form.title"
            placeholder="输入标题"
            class="!w-[180px]"
            clearable
          />
        </el-form-item>

        <!-- 发送人昵称 -->
        <el-form-item label="发送人昵称" prop="sendNickname">
          <el-input
            v-model="messageSendStore.form.sendNickname"
            placeholder="输入发送人昵称"
            class="!w-[180px]"
            clearable
          />
        </el-form-item>

        <!-- 消息类型 -->
        <el-form-item label="消息类型" prop="messageType">
          <el-select
            v-model="messageSendStore.form.messageType"
            placeholder="选择消息类型"
            class="!w-[180px]"
            clearable
            filterable
          >
            <el-option
              v-for="(item, index) in messageTypeStore.allMessageTypeList"
              :key="index"
              :label="item.messageName"
              :navigationBar="false"
              :value="item.messageType"
            />
          </el-select>
        </el-form-item>

        <!-- 编辑器类型 -->
        <el-form-item label="编辑器类型" prop="editorType">
          <el-select
            v-model="messageSendStore.form.editorType"
            placeholder="选择编辑器类型"
            class="!w-[180px]"
            clearable
            filterable
          >
            <el-option
              v-for="(item, index) in ['rich', 'markdown']"
              :key="index"
              :label="item"
              :navigationBar="false"
              :value="item"
            />
          </el-select>
        </el-form-item>

        <!-- 消息等级 -->
        <el-form-item label="消息等级" prop="level">
          <el-select
            v-model="messageSendStore.form.level"
            placeholder="消息等级"
            class="!w-[180px]"
            clearable
            filterable
            remote
            remote-show-suffix
          >
            <el-option
              v-for="item in messageLevel"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>

        <!-- 消息等级简介 -->
        <el-form-item label="消息等级简介" prop="extra">
          <el-input
            v-model="messageSendStore.form.extra"
            class="!w-[180px]"
            maxlength="20"
            minlength="10"
            show-word-limit
            type="text"
          />
        </el-form-item>

        <!-- 0:未读 1:已读 -->
        <el-form-item label="状态" prop="status">
          <el-select
            v-model="messageSendStore.form.status"
            placeholder="状态"
            class="!w-[180px]"
            clearable
            filterable
            remote
            remote-show-suffix
          >
            <el-option
              v-for="(item, index) in isReadStatus"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button
            :icon="useRenderIcon('ri:search-line')"
            :loading="messageSendStore.loading"
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
      title="系统消息"
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
          :data="messageSendStore.dataList"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
          :loading="messageSendStore.loading"
          :pagination="messageSendStore.pagination"
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
          <template #sendNickname="{ row }">
            <el-button
              link
              type="primary"
              @click="selectUserinfo(row.sendUserId)"
            >
              {{ row.sendNickname }}
            </el-button>
          </template>

          <template #cover="{ row }">
            <el-image
              :initial-index="0"
              :preview-src-list="[row.cover]"
              :src="row.cover"
              class="w-[50px] h-[50px]"
              fit="cover"
              loading="lazy"
              preview-teleported
            />
          </template>

          <template #extra="{ row }">
            <el-text type="danger">{{ row.extra }}</el-text>
          </template>

          <template #messageType="{ row }">
            <el-tag effect="plain" round>{{ row.messageType }}</el-tag>
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
              :title="`删除${row.title}?`"
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
