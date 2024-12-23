<script setup lang="ts">
import { ref } from "vue";
import type { ElTreeV2 } from "element-plus";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import NodeTree from "@iconify-icons/ri/node-tree";
import { TreeNode } from "../utils/types";

defineOptions({
  name: "CategoryTree"
});

const query = ref("");

const treeRef = ref<InstanceType<typeof ElTreeV2>>();

const treeData = ref<TreeNode[]>([
  {
    id: 1,
    name: "Level one 1",
    parentId: null,
    layer: 1,
    status: true,
    sort: 1,
    children: [
      {
        id: 11,
        name: "Level one 1-1",
        parentId: 1,
        layer: 2,
        status: true,
        sort: 1,
        children: []
      },
      {
        id: 12,
        name: "Level one 1-2",
        parentId: 1,
        layer: 2,
        status: true,
        sort: 2,
        children: []
      }
    ]
  },
  {
    id: 2,
    name: "Level two 2",
    parentId: null,
    layer: 1,
    status: true,
    sort: 2,
    children: [
      {
        id: 21,
        name: "Level one 2-1",
        parentId: 2,
        layer: 2,
        status: true,
        sort: 1,
        children: [
          {
            id: 211,
            name: "Level one 2-1-1",
            parentId: 21,
            layer: 3,
            status: true,
            sort: 1,
            children: []
          },
          {
            id: 212,
            name: "Level one 2-1-2",
            parentId: 21,
            layer: 3,
            status: true,
            sort: 2,
            children: []
          }
        ]
      },
      {
        id: 22,
        name: "Level one 2-2",
        parentId: 2,
        layer: 2,
        status: true,
        sort: 2,
        children: []
      }
    ]
  }
]);
const onHandleAdd = (node: any, data: TreeNode) => {
  console.log("onHandleAdd", node, data);
};
const onQueryChanged = (query: string) => {
  (treeRef as any).value!.filter(query);
};
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
    <el-input
      v-model="query"
      class="mb-4"
      placeholder="请输入关键字查找"
      clearable
      @input="onQueryChanged"
    />
    <el-tree
      style="max-width: 600px"
      :data="treeData"
      show-checkbox
      node-key="id"
      default-expand-all
      draggable
      :expand-on-click-node="false"
    >
      <template v-slot="{ node, data }">
        <span class="flex items-center justify-between" style="width: 100%">
          <span class="flex-1">{{ data.name }}</span>
          <div class="flex">
            <el-button
              type="primary"
              text
              :icon="useRenderIcon('ep:document-add')"
              @click="onHandleAdd(node, data)"
            >
              新增
            </el-button>
            <el-button type="info" text :icon="useRenderIcon('ri:search-line')">
              修改
            </el-button>
            <el-button type="danger" text :icon="useRenderIcon('ep:delete')">
              删除
            </el-button>
          </div>
        </span>
      </template>
    </el-tree>
  </el-card>
</template>
