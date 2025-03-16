<script setup lang="ts">
import "plus-pro-components/es/components/steps-form/style/css";
import { PlusStepsForm } from "plus-pro-components";
import { useStepsForm } from "./utils/hook";

const { active, stepForm, next, pre } = useStepsForm();
</script>
<template>
  <el-card shadow="never">
    <template #header> 发布商品 </template>
    <PlusStepsForm
      :active="active"
      simple
      class="w-[900px] m-auto"
      :data="stepForm as any"
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
