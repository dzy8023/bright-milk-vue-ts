<script lang="ts" setup>
import { ref } from "vue";
import { FormInstance } from "element-plus";
import { rules } from "@/views/message-management/message-type/utils/columns";
import { FormProps } from "@/views/message-management/message-type/utils/types";

import { usePublicHooks } from "@/views/hooks";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    // 是否启用
    status: true,
    // 消息名称
    messageName: undefined,
    // 消息类型
    messageType: undefined,
    // 消息备注
    summary: undefined
  })
});

const formRef = ref<FormInstance>();
const form = ref(props.formInline);
// 用户是否停用样式
const { switchStyle } = usePublicHooks();

defineExpose({ formRef });
</script>

<template>
  <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
    <!-- 消息类型 -->
    <el-form-item label="消息类型" prop="messageType">
      <el-input
        v-model="form.messageType"
        placeholder="输入消息类型"
        autocomplete="off"
        type="text"
      />
    </el-form-item>

    <!-- 消息名称 -->
    <el-form-item label="消息名称" prop="messageName">
      <el-input
        v-model="form.messageName"
        placeholder="输入消息名称"
        autocomplete="off"
        type="text"
      />
    </el-form-item>

    <!-- 消息备注 -->
    <el-form-item label="消息备注" prop="summary">
      <el-input
        v-model="form.summary"
        placeholder="输入消息备注"
        autocomplete="off"
        maxlength="300"
        show-word-limit
        type="textarea"
      />
    </el-form-item>

    <!-- 是否启用 -->
    <el-form-item label="是否启用" prop="status">
      <el-switch
        v-model="form.status"
        active-text="启用"
        :active-value="true"
        inactive-text="禁用"
        :inactive-value="false"
        :style="switchStyle"
        inline-prompt
      />
    </el-form-item>
  </el-form>
</template>
