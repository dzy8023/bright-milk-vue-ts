<script setup lang="ts">
import "plus-pro-components/es/components/steps-form/style/css";
import { PlusStepsForm } from "plus-pro-components";
import { useStepsForm } from "./utils/hook";
import {
  onBeforeRouteLeave,
  onBeforeRouteUpdate,
  useRoute,
  useRouter
} from "vue-router";
import { onMounted, onUnmounted } from "vue";
// import finalstep from "./form/finalstep.vue";
//实现当页面修改时，提示是否离开

const { active, stepForm, next, pre, isDirty } = useStepsForm();
const router = useRouter();
//添加路由守卫
const handleRouteLeave = (to, from, next) => {
  if (isDirty.value) {
    const confirm = window.confirm("是否确认离开?");
    if (confirm) {
      next();
    } else {
      next(false); // 阻止路由
    }
  } else {
    next(true);
  }
};
onBeforeRouteLeave(handleRouteLeave);
onBeforeRouteUpdate(handleRouteLeave);
// 处理浏览器标签关闭
onMounted(() => {
  window.addEventListener("beforeunload", handleUnload);
});

onUnmounted(() => {
  window.removeEventListener("beforeunload", handleUnload);
});

const handleUnload = (e: BeforeUnloadEvent) => {
  if (isDirty.value) {
    e.preventDefault();
    // 现代浏览器统一处理方式（无需设置 returnValue）
    // 如需兼容旧浏览器可添加下行（使用类型断言）
    // (e as any).returnValue = "";
  }
};
</script>
<template>
  <el-card shadow="never">
    <template #header> 发布商品 </template>
    <PlusStepsForm
      :active="active"
      simple
      class="w-[900px] m-auto"
      :data="stepForm"
      @next="next"
      @pre="pre"
    />
  </el-card>
</template>

<style scoped>
:deep(.el-tabs__nav-wrap)::after {
  height: 1px;
}

:deep(.el-tabs__nav-next),
:deep(.el-tabs__nav-prev) {
  font-size: 16px;
  color: var(--el-text-color-primary);
}

:deep(.el-tabs__nav-next.is-disabled),
:deep(.el-tabs__nav-prev.is-disabled) {
  opacity: 0.5;
}
</style>
