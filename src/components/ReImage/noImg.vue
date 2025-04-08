<script lang="ts" setup>
import { computed } from "vue"; // 导入 computed
import noImgPath from "@/assets/img/noImg.png"; // 重命名导入，避免命名冲突

const props = withDefaults(
  defineProps<{
    name?: string;
    url?: string;
  }>(),
  {
    name: "no img"
  }
);

// 使用 Vite 的方式获取图片的正确 URL
const noImgUrl = computed(() => new URL(noImgPath, import.meta.url).href);
</script>

<template>
  <div class="w-full h-full flex">
    <!-- 使用 props.url 和计算出的 noImgUrl -->
    <el-image :src="props.url || noImgUrl" :alt="props.name" fit="contain">
      <template #error>
        <!-- 加载失败时使用计算出的 noImgUrl -->
        <el-image :src="noImgUrl" fit="contain" />
      </template>
    </el-image>
  </div>
</template>
