<script lang="ts" setup>
import { emailRules } from "@/views/login/utils/rule";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import User from "@iconify-icons/ri/user-3-fill";
import Lock from "@iconify-icons/ri/lock-fill";
import { onBeforeUnmount, onMounted, reactive, ref } from "vue";

import { useUserStore } from "@/store/system/user";
import { message } from "@/utils/message";
import Motion from "./utils/motion";
import { FormInstance } from "element-plus";
import { currentPage, useLogin } from "./utils/hooks";

const userStore = useUserStore();
const ruleFormRef = ref<FormInstance>();
const sendSecond = ref(60);
const timer = ref(null);
const { loading, onLogin, onBack } = useLogin();
const ruleForm = reactive({
  username: "2890716703@qq.com",
  password: "admin123",
  emailCode: "",
  type: currentPage.value
});

/**
 * * 发送邮箱验证码
 */
const onSendEmailCode = async () => {
  // 判断是否填写邮箱，如果没有填写邮箱不给发送验证码
  if (ruleForm.username === "" || ruleForm.username === void 0) {
    message("请先填写邮箱地址", { type: "warning" });
    return false;
  }
  const result = await userStore.postEmailCode(ruleForm.username);
  if (result) {
    // 开始倒计时，之后发送邮箱验证码
    onSendEmailTimer();
  }
};

/**
 * * 发送邮箱倒计时点击
 */
const onSendEmailTimer = () => {
  // 开始倒计时
  timer.value = setInterval(() => {
    // 当定时小于0时清除定时器
    if (sendSecond.value <= 0) {
      clearInterval(timer.value);
      timer.value = null;
      sendSecond.value = 60;
      return;
    }
    // 之后每秒减去时间
    sendSecond.value--;
  }, 1000);
};

/** 使用公共函数，避免`removeEventListener`失效 */
function onkeypress({ code }: KeyboardEvent) {
  if (["Enter", "NumpadEnter"].includes(code)) {
    onLogin(ruleFormRef.value, ruleForm);
  }
}

onMounted(() => {
  window.document.addEventListener("keypress", onkeypress);
});

onBeforeUnmount(() => {
  window.document.removeEventListener("keypress", onkeypress);
});
</script>

<template>
  <el-form ref="ruleFormRef" :model="ruleForm" :rules="emailRules" size="large">
    <Motion :delay="100">
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
      </el-form-item>
    </Motion>

    <Motion :delay="150">
      <el-form-item prop="emailCode">
        <el-input
          v-model="ruleForm.emailCode"
          placeholder="邮箱验证码"
          :prefix-icon="useRenderIcon('ic:outline-email')"
          clearable
          @keydown.enter="onLogin(ruleFormRef, ruleForm)"
        >
          <template v-slot:append>
            <el-link
              v-if="sendSecond === 60"
              :underline="false"
              class="px-2"
              type="primary"
              @click="onSendEmailCode"
            >
              获取验证码
            </el-link>
            <el-link v-else :underline="false" class="px-2" type="primary">
              {{ sendSecond }}
              秒后获取验证码
            </el-link>
          </template>
        </el-input>
        <el-checkbox v-model="userStore.isRemembered">
          <el-text size="small" type="primary"
            >{{
              userStore.readMeDay
            }}天免登录(邮箱验证码随便输入,后端校验验证码已注释)
          </el-text>
        </el-checkbox>
      </el-form-item>
    </Motion>

    <Motion :delay="250">
      <el-button
        :loading="loading"
        class="w-full"
        size="default"
        type="primary"
        @click="onLogin(ruleFormRef, ruleForm)"
      >
        登录
      </el-button>
    </Motion>

    <Motion :delay="200">
      <el-form-item>
        <el-button class="w-full mt-4" size="default" @click="onBack">
          返回
        </el-button>
      </el-form-item>
    </Motion>
  </el-form>
</template>
