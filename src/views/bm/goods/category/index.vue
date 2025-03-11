<script setup lang="ts">
import CategoryTree from "./components/category-tree.vue";
import NodeTree from "@iconify-icons/ri/node-tree";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <div class="card-header">
        <span class="font-medium">
          菜单树结构（采用 Element Plus 的
          <el-link
            href="https://element-plus.gitee.io/zh-CN/component/tree-v2.html"
            target="_blank"
            :icon="useRenderIcon(NodeTree)"
            style="margin: 0 5px 4px 0; font-size: 16px"
          >
            Tree V2
          </el-link>
          组件并支持国际化）
        </span>
      </div>
      <el-link
        class="mt-2"
        href="https://github.com/pure-admin/vue-pure-admin/blob/main/src/views/able/menu-tree.vue"
        target="_blank"
      >
        代码位置 src/views/able/menu-tree.vue
      </el-link>
    </template>
    <CategoryTree />
  </el-card>
</template>
