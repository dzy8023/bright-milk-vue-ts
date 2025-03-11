<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { columns } from "@/views/message-management/message-received/utils/columns";
import PureTableBar from "@/components/RePureTableBar/src/bar";
import PureTable from "@pureadmin/table";
import {
  onDeleteBatch,
  onSearch,
  selectIds,
  updateMarkMessageReceived
} from "@/views/message-management/message-received/utils/hooks";
import Delete from "@iconify-icons/ep/delete";
import Refresh from "@iconify-icons/ep/refresh";
import { selectUserinfo } from "@/components/ReTable/Userinfo/columns";

import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { FormInstance } from "element-plus";
import { messageLevel } from "@/views/message-management/message-editing/utils/columns";
import { isReadStatus } from "@/enums/baseConstant";
import { useMessageReceivedStore } from "@/store/message/messageReceived";
import { useMessageTypeStore } from "@/store/message/messageType";
import { Message } from "@element-plus/icons-vue";
import { auth } from "@/views/message-management/message-received/utils/auth";
import { hasAuth } from "@/router/utils";

const tableRef = ref();
const formRef = ref();
const messageReceivedStore = useMessageReceivedStore();
const messageTypeStore = useMessageTypeStore();

/** 当前页改变时 */
const onCurrentPageChange = async (value: number) => {
  messageReceivedStore.pagination.currentPage = value;
  await onSearch();
};

/** 当分页发生变化 */
const onPageSizeChange = async (value: number) => {
  messageReceivedStore.pagination.pageSize = value;
  await onSearch();
};

/** 选择多行 */
const onSelectionChange = (rows: Array<any>) => {
  selectIds.value = rows.map((row: any) => row.id);
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
        :model="messageReceivedStore.form"
        class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px] overflow-auto"
      >
        <!-- 消息标题 -->
        <el-form-item label="消息标题" prop="title">
          <el-input
            v-model="messageReceivedStore.form.title"
            placeholder="输入消息标题"
            class="!w-[180px]"
            clearable
          />
        </el-form-item>

        <!-- 发送人昵称 -->
        <el-form-item label="发送人昵称" prop="sendNickname">
          <el-input
            v-model="messageReceivedStore.form.sendNickname"
            placeholder="输入发送人昵称"
            class="!w-[180px]"
            clearable
          />
        </el-form-item>

        <!-- 消息类型 -->
        <el-form-item label="消息类型" prop="messageType">
          <el-select
            v-model="messageReceivedStore.form.messageType"
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
            v-model="messageReceivedStore.form.editorType"
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
            v-model="messageReceivedStore.form.level"
            placeholder="选择消息等级"
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
            v-model="messageReceivedStore.form.extra"
            class="!w-[180px]"
            maxlength="20"
            minlength="10"
            show-word-limit
            type="text"
          />
        </el-form-item>

        <!-- 0:未读 1:已读 -->
        <el-form-item label="消息状态" prop="status">
          <el-select
            v-model="messageReceivedStore.form.status"
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
            :loading="messageReceivedStore.loading"
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
        <!-- 标为已读 -->
        <el-button
          v-if="hasAuth(auth.update)"
          :disabled="!(selectIds.length > 0)"
          :icon="useRenderIcon('octicon:read-24')"
          type="primary"
          @click="updateMarkMessageReceived(true)"
        >
          标为已读
        </el-button>

        <!-- 标为未读 -->
        <el-button
          v-if="hasAuth(auth.update)"
          :disabled="!(selectIds.length > 0)"
          :icon="Message"
          type="primary"
          @click="updateMarkMessageReceived(false)"
        >
          标为未读
        </el-button>

        <!-- 批量删除按钮 -->
        <el-button
          v-if="hasAuth(auth.deleted)"
          :disabled="!(selectIds.length > 0)"
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
          :data="messageReceivedStore.datalist"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
          :loading="messageReceivedStore.loading"
          :pagination="messageReceivedStore.pagination"
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

          <template #receivedUserNickname="{ row }">
            <el-button
              link
              type="primary"
              @click="selectUserinfo(row.receivedUserId)"
            >
              {{ row.receivedUserNickname }}
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
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>
