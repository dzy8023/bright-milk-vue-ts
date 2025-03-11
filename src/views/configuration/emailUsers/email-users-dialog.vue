<script lang="ts" setup>
import { ref } from "vue";
import { FormInstance } from "element-plus";
import { rules } from "@/views/configuration/emailUsers/utils/columns";
import { FormProps } from "@/views/configuration/emailUsers/utils/types";

import { usePublicHooks } from "@/views/hooks";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    // 邮箱
    email: undefined,
    emailTemplate: undefined,
    // 密码
    password: undefined,
    // Host地址
    host: undefined,
    // 端口号
    port: undefined,
    // 邮箱协议
    smtpAgreement: undefined,
    // 是否启用SSL
    openSSL: false,
    // 是否为默认邮件
    isDefault: false
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
    <!-- 邮箱账号 -->
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="form.email" autocomplete="off" type="text" />
    </el-form-item>

    <!-- 邮箱密码 -->
    <el-form-item label="密码" prop="password">
      <el-input v-model="form.password" autocomplete="off" type="text" />
    </el-form-item>

    <!-- 配置主机 -->
    <el-form-item label="主机地址" prop="host">
      <el-input v-model="form.host" autocomplete="off" type="text" />
    </el-form-item>

    <!-- 邮箱端口号 -->
    <el-form-item label="端口号" prop="port">
      <el-input
        v-model="form.port"
        autocomplete="off"
        max="9999"
        type="number"
      />
    </el-form-item>

    <!-- smtp协议 -->
    <el-form-item label="smtp协议" prop="smtpAgreement">
      <el-input
        v-model="form.smtpAgreement"
        autocomplete="off"
        maxlength="10"
        show-word-limit
        type="text"
      />
    </el-form-item>

    <!-- 是否启用SSL -->
    <el-form-item label="ssl" prop="openSSL">
      <el-switch
        v-model="form.openSSL"
        active-text="启用"
        :active-value="true"
        inactive-text="禁用"
        :inactive-value="false"
        :style="switchStyle"
        inline-prompt
      />
    </el-form-item>

    <!-- 是否为默认 -->
    <el-form-item label="是否为默认" prop="isDefault">
      <el-switch
        v-model="form.isDefault"
        active-text="默认"
        :active-value="true"
        inactive-text="非默认"
        :inactive-value="false"
        :style="switchStyle"
        inline-prompt
      />
    </el-form-item>
  </el-form>
</template>
