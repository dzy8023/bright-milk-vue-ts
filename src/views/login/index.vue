<script lang="ts" setup>
import Motion from "./utils/motion";
import { useNav } from "@/layout/hooks/useNav";
import { useLayout } from "@/layout/hooks/useLayout";
import bg from "@/assets/login/bg.png";
import illustration from "@/assets/login/illustration.svg?component";
import { onMounted, toRaw } from "vue";
import { useDataThemeChange } from "@/layout/hooks/useDataThemeChange";
import dayIcon from "@/assets/svg/day.svg?component";
import darkIcon from "@/assets/svg/dark.svg?component";
import globalization from "@/assets/svg/globalization.svg?component";
import Check from "@iconify-icons/ep/check";
import LoginForm from "@/views/login/login-form.vue";
import LoginEmail from "@/views/login/login-email.vue";
import { currentPage } from "@/views/login/utils/hooks";

const { initStorage } = useLayout();
initStorage();

const { dataTheme, overallStyle, dataThemeChange } = useDataThemeChange();
dataThemeChange(overallStyle.value);
const { title } = useNav();
</script>

<template>
  <div class="select-none">
    <img :src="bg" alt="" class="wave" />
    <div class="flex-c absolute right-5 top-3">
      <!-- 主题 -->
      <el-switch
        v-model="dataTheme"
        :active-icon="dayIcon"
        :inactive-icon="darkIcon"
        inline-prompt
        @change="dataThemeChange"
      />
    </div>
    <div class="login-container">
      <div class="img">
        <component :is="toRaw(illustration)" />
      </div>
      <div class="login-box">
        <div class="login-form">
          <img alt="logo" class="avatar" src="/logo.png" />
          <Motion>
            <h2 class="outline-none">{{ title }}</h2>
          </Motion>

          <!-- 登录表单 -->
          <login-form v-if="currentPage === 'default'" />
          <login-email v-if="currentPage === 'email'" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url("@/style/login.css");
</style>

<style lang="scss" scoped>
:deep(.el-input-group__append, .el-input-group__prepend) {
  padding: 0;
}

.translation {
  ::v-deep(.el-dropdown-menu__item) {
    padding: 5px 40px;
  }

  .check-zh {
    position: absolute;
    left: 20px;
  }

  .check-en {
    position: absolute;
    left: 20px;
  }
}
</style>
