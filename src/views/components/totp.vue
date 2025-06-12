<template>
  <el-card class="flex justify-center w-full">
    <h2 class="text-xl font-bold mb-4 text-center">
      2FA & TOTP 测试
      <el-button text type="primary" @click="enable2fa">启用</el-button>
    </h2>
    <div v-if="totpStore.qrUrl" class="mb-4">
      <div class="flex flex-col items-center min-h-[200px]">
        <p>
          <!-- 移除 w-full -->
          <qrcode-vue :value="totpStore.qrUrl" :size="150" />
        </p>
        <p class="text-center">请使用谷歌身份验证器扫描以上二维码</p>
        <el-input
          :value="totpStore.qrUrl"
          readonly
          class="text-center w-full"
        />
      </div>
      <div id="code-box" class="text-center mb-4">
        <OtpInput :length="6" @verify="verifyCode" />
      </div>
      <div class="progress">
        <div
          id="progress"
          class="progress-bar"
          :style="{ width: progressWidth + '%' }"
        />
      </div>
    </div>
    <div class="text-center mt-2">
      系统时间：<span id="time">{{ currentTime }}</span>
    </div>
    <div v-if="resultSuccess" class="mt-4 text-center">
      <span class="text-lg text-green-500">{{ resultMessage }}</span>
    </div>
    <div v-if="!resultSuccess" class="mt-4 text-center">
      <span class="text-lg text-red-500">{{ resultMessage }}</span>
    </div>
    <footer class="text-center mt-2">
      <a
        href="https://github.com/Passkou/2fa-test"
        target="_blank"
        class="text-blue-500 hover:underline"
        >GitHub</a
      >
      |
      <a
        href="https://zhuanlan.zhihu.com/p/484991482"
        target="_blank"
        class="text-blue-500 hover:underline"
        >原理说明</a
      >
    </footer>
  </el-card>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from "vue";
import QrcodeVue from "qrcode.vue";
import OtpInput from "@/views/components/code.vue";
import { useTotpStore } from "@/store/bm/totp";
import { message } from "@/utils/message";

const totpStore = useTotpStore();
const resultMessage = ref("");
const resultSuccess = ref(false);
const currentTime = ref(new Date().toLocaleString());
const progressWidth = ref(0);
let intervalId: NodeJS.Timeout | null = null;
let intervalId2: NodeJS.Timeout | null = null;
onMounted(() => {
  intervalId2 = setInterval(() => {
    currentTime.value = new Date().toLocaleString();
  }, 1000);
});
onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
  if (intervalId2) {
    clearInterval(intervalId2);
  }
});
const enable2fa = async () => {
  const res = await totpStore.testTotp();
  if (res) {
    if (intervalId) {
      clearInterval(intervalId);
    }
    startTimer();
  }
};
const verifyCode = async (code: string) => {
  const res = await totpStore.testVerify(code);
  if (res.code === 200) {
    message(res.msg, { type: "success", duration: 3666 });
    resultMessage.value = "验证通过";
    resultSuccess.value = true;
  } else {
    resultMessage.value = res.msg;
    resultSuccess.value = false;
  }
};
const startTimer = () => {
  progressWidth.value = 0;
  intervalId = setInterval(() => {
    if (progressWidth.value < 100) {
      progressWidth.value += 10 / 3;
    } else {
      progressWidth.value = 0;
    }
  }, 1000);
};
</script>

<style scoped>
main {
  max-width: 768px;
  padding: 2em 1em;
  margin: 0 auto;
}

.code {
  display: inline-block;
  padding: 0.5em;
  margin: 0 0.2em; /* Added spacing between digits */
  font-size: 3em;
  border: 2px solid #aaa;
  border-radius: 0.1em;
}

.progress {
  height: 0.5rem; /* Reduced height for a more modern look */
  overflow: hidden; /* Ensure progress bar stays within rounded corners */
  background-color: #e5e7eb; /* Tailwind gray-200 */
  border-radius: 0.75rem; /* Fully rounded corners */
}

.progress-bar {
  width: 0; /* Start with 0 width, gets updated by JS */
  height: 100%;
  background-color: #3b82f6; /* Tailwind blue-500 */
  border-radius: 0.75rem; /* Ensure rounded corners on progress */
  transition: width 0.25s ease; /* Smooth transition */
}

.el-input {
  margin: 0 auto;
}
</style>
