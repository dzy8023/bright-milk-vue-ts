<script setup lang="ts">
import CategoryTree from "./form/category-tree.vue";
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <p class="font-bold truncate">分类管理</p>
    </template>
    <CategoryTree />
  </el-card>
</template>
