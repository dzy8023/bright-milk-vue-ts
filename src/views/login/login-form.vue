<script lang="ts" setup>
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import User from "@iconify-icons/ri/user-3-fill";
import Lock from "@iconify-icons/ri/lock-fill";
import { onBeforeUnmount, onMounted, reactive, ref } from "vue";

import { useUserStore } from "@/store/system/user";
import Motion from "./utils/motion";
import { FormInstance } from "element-plus";
import { formRules } from "@/views/login/utils/rule";
import { useLogin } from "./utils/hooks";

const userStore = useUserStore();
const ruleFormRef = ref<FormInstance>();
const { loading, onLogin } = useLogin();
const ruleForm = reactive({
  username: "admin",
  password: "admin123",
  emailCode: "1",
  type: "default"
});

/** 使用公共函数，避免`removeEventListener`失效 */
function onkeypress({ code }: KeyboardEvent) {
  if (["Enter", "NumpadEnter"].includes(code)) {
    onLogin(ruleFormRef.value, ruleForm);
  }
}
onMounted(() => {
  window.document.addEventListener("keypress", onkeypress);
});
const emits = defineEmits(["change"]);
onBeforeUnmount(() => {
  window.document.removeEventListener("keypress", onkeypress);
});
</script>

<template>
  <el-form ref="ruleFormRef" :model="ruleForm" :rules="formRules" size="large">
    <Motion>
      <el-form-item prop="username">
        <el-input
          v-model="ruleForm.username"
          placeholder="用户名"
          :prefix-icon="useRenderIcon(User)"
          clearable
        />
      </el-form-item>
    </Motion>

    <Motion :delay="150">
      <el-form-item prop="password">
        <el-input
          v-model="ruleForm.password"
          placeholder="密码"
          :prefix-icon="useRenderIcon(Lock)"
          clearable
          show-password
        />
        <el-checkbox v-model="userStore.isRemembered">
          <el-text size="small" type="primary"
            >{{ userStore.readMeDay }}天免登录
          </el-text>
        </el-checkbox>
      </el-form-item>
    </Motion>

    <Motion :delay="150">
      <el-form-item>
        <el-button
          :loading="loading"
          class="w-full"
          size="default"
          type="primary"
          @click="onLogin(ruleFormRef, ruleForm)"
        >
          登录
        </el-button>
      </el-form-item>
    </Motion>

    <!-- 邮箱登录 -->
    <Motion :delay="300">
      <el-form-item>
        <el-button
          class="w-full"
          size="default"
          @click="() => emits('change', 'email')"
        >
          邮箱登录</el-button
        >
      </el-form-item>
    </Motion>
  </el-form>
</template>
