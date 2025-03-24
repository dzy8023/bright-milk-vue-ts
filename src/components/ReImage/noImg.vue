<script lang="ts" setup>
import noImg from "@/assets/img/noImg.png";
withDefaults(
  defineProps<{
    name?: string;
    url: string;
  }>(),
  {
    name: "no img"
  }
);
</script>

<template>
  <el-image
    class="el-upload-list__item-thumbnail"
    :src="url"
    :alt="name"
    fit="cover"
    width="100%"
  >
    <template #error>
      <el-image :src="noImg" />
    </template>
  </el-image>
</template>
