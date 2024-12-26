<script setup lang="ts">
import { ref } from "vue";
import type { ElTree } from "element-plus";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";

import { useUser } from "../utils/hook";

defineOptions({
  name: "CategoryTree"
});

const treeRef = ref<InstanceType<typeof ElTree>>();
const {
  treeData,
  switchStyle,
  query,
  onChange,
  getCategoryTreeData,
  openDialog,
  handleDelete,
  filterMethod,
  onQueryChanged
} = useUser(treeRef);
getCategoryTreeData();
</script>

<template>
  <el-input
    v-model="query"
    class="mb-4"
    placeholder="请输入关键字查找"
    clearable
    @input="onQueryChanged"
  />
  <el-tree
    ref="treeRef"
    style="max-width: 80%"
    :data="treeData"
    show-checkbox
    node-key="id"
    default-expand-all
    draggable
    :filter-node-method="filterMethod"
    :expand-on-click-node="false"
  >
    <template v-slot="{ node, data }">
      <span class="flex items-center justify-between" style="width: 100%">
        <span class="flex-1">{{ data.name }}</span>
        <div class="flex">
          <el-switch
            v-model="data.status"
            :active-value="1"
            :inactive-value="0"
            active-text="已启用"
            inactive-text="已停用"
            inline-prompt
            :style="switchStyle"
            @change="onChange(data)"
          />
          <el-button
            type="primary"
            text
            :icon="useRenderIcon('ep:document-add')"
            @click="openDialog('新增', node, data)"
          >
            新增
          </el-button>
          <el-button
            type="info"
            text
            :icon="useRenderIcon('ri:search-line')"
            @click="openDialog('修改', node, data)"
          >
            修改
          </el-button>
          <el-button
            type="danger"
            text
            :icon="useRenderIcon('ep:delete')"
            @click="handleDelete(node, data)"
          >
            删除
          </el-button>
        </div>
      </span>
    </template>
  </el-tree>
</template>
