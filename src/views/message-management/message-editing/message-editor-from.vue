<script lang="ts" setup>
import {
  beforeUpload,
  coverUrl,
  formState,
  loading,
  onSearchUserinfo,
  onUpload,
  userDataList
} from "@/views/message-management/message-editing/utils/hooks";
import { onMounted, ref, toRaw } from "vue";

import {
  messageLevel,
  rules
} from "@/views/message-management/message-editing/utils/columns";
import { FormInstance } from "element-plus";
import { editorTypeList } from "@/views/message-management/message-send/utils/columns";
import LoadingSvg from "@/assets/svg/loading.svg";
import { useMessageTypeStore } from "@/store/message/messageType";

import { message } from "@/utils/message";
import { useMessageSendStore } from "@/store/message/messageSend";
import { Plus } from "@element-plus/icons-vue";
import ImageLoading from "@/components/ReImage/index.vue";
import { hasAuth } from "@/router/utils";
import { auth } from "@/views/message-management/message-editing/utils/auth";
import { encode } from "js-base64";
import { usePublicHooks } from "@/views/hooks";

const formRef = ref();
// 用户是否停用样式
const { switchStyle } = usePublicHooks();
const messageTypeStore = useMessageTypeStore();
const messageSendStore = useMessageSendStore();

/** 提交消息 */
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;

  // 内容过短
  if (formState.content.trim().length <= 30) {
    message("内容过短", { type: "warning" });
    return;
  }

  formEl.validate(async valid => {
    if (valid) {
      // 复制数据
      const data = toRaw(formState);
      data.content = encode(formState.content);

      // 添加消息
      const result = await messageSendStore.addMessage(data);
      if (!result) return;

      // 清除数据
      resetForm(formEl);
    }
  });
};

/** 重置消息 */
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  formState.content = "";
  coverUrl.value = "";
};

onMounted(() => {
  messageTypeStore.getAllMessageTypeList();
});
</script>

<template>
  <el-form
    ref="formRef"
    :model="formState"
    :rules="rules"
    class="w-[100%] p-5"
    label-width="auto"
  >
    <!-- 标题 -->
    <el-form-item label="标题" prop="title">
      <el-input v-model="formState.title" />
    </el-form-item>

    <!-- 消息类型 -->
    <el-form-item label="消息类型" prop="messageTypeId">
      <el-select
        v-model="formState.messageTypeId"
        placeholder="选择消息类型"
        clearable
        filterable
      >
        <el-option
          v-for="(item, index) in messageTypeStore.allMessageTypeList"
          :key="index"
          :label="item.messageName"
          :navigationBar="false"
          :value="item.id"
        />
      </el-select>
    </el-form-item>

    <!-- 接收人ID -->
    <el-form-item label="接收人ID" prop="receivedUserIds">
      <el-select
        v-model="formState.receivedUserIds"
        :loading="loading"
        placeholder="接收人ID"
        :remote-method="onSearchUserinfo"
        clearable
        filterable
        multiple
        remote
        remote-show-suffix
      >
        <el-option
          v-for="item in userDataList"
          :key="item.id"
          :label="item.username"
          :value="item.id"
        />
        <template #loading>
          <el-icon class="is-loading">
            <LoadingSvg />
          </el-icon>
        </template>
      </el-select>
    </el-form-item>

    <!-- 编辑器类型 -->
    <el-form-item label="编辑器类型" prop="editorType">
      <el-radio-group v-model="formState.editorType">
        <el-radio
          v-for="(item, index) in editorTypeList"
          :key="index"
          :navigationBar="false"
          :value="item.value"
        >
          {{ item.label }}
        </el-radio>
      </el-radio-group>
    </el-form-item>

    <!-- 是否已读 -->
    <el-form-item label="是否已读" prop="status">
      <el-switch
        v-model="formState.status"
        active-text="已读"
        :active-value="true"
        inactive-text="未读"
        :inactive-value="false"
        :style="switchStyle"
        inline-prompt
      />
    </el-form-item>

    <!-- 封面内容 -->
    <el-form-item label="封面内容" prop="cover">
      <el-upload
        :auto-upload="true"
        :before-upload="beforeUpload"
        :http-request="onUpload"
        :show-file-list="false"
        accept="image/*"
        drag
      >
        <el-image v-if="coverUrl" :src="coverUrl" fit="cover" lazy>
          <template #placeholder>
            <ImageLoading />
          </template>
        </el-image>
        <el-icon v-else size="36">
          <Plus />
        </el-icon>
      </el-upload>
      <el-button v-show="coverUrl" link type="primary" @click="coverUrl = ''">
        删除图片</el-button
      >
    </el-form-item>

    <!-- 简介 -->
    <el-form-item label="简介" prop="summary">
      <el-input
        v-model="formState.summary"
        :autosize="{ minRows: 3, maxRows: 6 }"
        maxlength="200"
        minlength="10"
        show-word-limit
        type="textarea"
      />
    </el-form-item>

    <!-- 消息等级 -->
    <el-form-item label="消息等级" prop="level">
      <el-select
        v-model="formState.level"
        placeholder="消息等级"
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
        v-model="formState.extra"
        maxlength="20"
        minlength="10"
        show-word-limit
        type="text"
      />
    </el-form-item>

    <!-- 提交 -->
    <el-form-item>
      <div v-if="hasAuth(auth.add)" class="grid grid-cols-2 w-[100%]">
        <el-button
          bg
          class="w-[100%]"
          text
          type="primary"
          @click="submitForm(formRef)"
          >提交</el-button
        >
        <el-button bg class="w-[100%]" text @click="resetForm(formRef)"
          >重置</el-button
        >
      </div>
    </el-form-item>
  </el-form>
</template>

<style lang="scss" scoped>
:deep(.el-upload-dragger) {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 90px;
  height: 90px;
}
</style>
