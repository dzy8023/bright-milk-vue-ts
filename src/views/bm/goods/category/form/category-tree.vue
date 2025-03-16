<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { ElTree } from "element-plus";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { useCategory } from "../utils/hook";
import { useCategoryStore } from "@/store/bm/goods/category";
import { auth } from "../utils/auth";
import { hasAuth } from "@/router/utils";
import { MaxCategoryLayer } from "@/enums/baseConstant";

const categoryStore = useCategoryStore();
const treeRef = ref<InstanceType<typeof ElTree>>();
const draggable = ref(true);
const {
  switchStyle,
  query,
  expandKeys,
  onChange,
  onSearch,
  openDialog,
  handleDelete,
  filterMethod,
  onQueryChanged,
  handleRelateAttr,
  onSelectionCancel,
  onbatchDel,
  handleDrop,
  handleAllowDrop,
  handleRelateAttrBatch,
  handleExpandAll
} = useCategory(treeRef);
onMounted(async () => {
  await onSearch();
  console.log("categoryStore.treeData", categoryStore.treeData);
});
</script>

<template>
  <el-input
    v-model="query"
    class="mb-4"
    placeholder="请输入关键字查找"
    clearable
    @input="onQueryChanged"
  />
  <div class="max-w-[80%] mb-2 flex justify-between">
    <el-switch
      v-model="draggable"
      active-text="启用拖拽"
      inactive-text="禁用拖拽"
    />
    <el-button
      type="primary"
      text
      :icon="useRenderIcon('ri:expand-up-down-line')"
      @click="handleExpandAll"
      >全部展开</el-button
    >
    <el-button
      type="primary"
      text
      :icon="useRenderIcon('ep:document-add')"
      @click="openDialog(true, null, null)"
      >新增分类</el-button
    >
  </div>

  <div
    v-if="hasAuth(auth.deleted) && treeRef?.getCheckedKeys().length > 0"
    v-motion-fade
    class="bg-[var(--el-fill-color-light)] w-full h-[46px] mb-2 pl-4 flex items-center"
  >
    <div class="flex-auto">
      <span
        style="font-size: var(--el-font-size-base)"
        class="text-[rgba(42,46,54,0.5)] dark:text-[rgba(220,220,242,0.5)]"
      >
        已选 {{ treeRef.getCheckedKeys().length }} 项
      </span>
      <el-button type="primary" text @click="onSelectionCancel">
        取消选择
      </el-button>
    </div>
    <el-button type="warning" text class="mr-1" @click="handleRelateAttrBatch">
      批量关联属性
    </el-button>

    <el-popconfirm title="是否确认删除?" @confirm="onbatchDel">
      <template #reference>
        <el-button type="danger" text class="mr-1"> 批量删除 </el-button>
      </template>
    </el-popconfirm>
  </div>
  <el-tree
    ref="treeRef"
    style="max-width: 80%"
    :data="categoryStore.treeData"
    show-checkbox
    node-key="id"
    :default-expanded-keys="expandKeys"
    :draggable="draggable && hasAuth(auth.update)"
    :filter-node-method="filterMethod"
    :expand-on-click-node="false"
    :allow-drop="handleAllowDrop"
    @node-drop="handleDrop"
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
            @change="hasAuth(auth.update) && onChange(data)"
          />
          <el-button
            v-if="hasAuth(auth.add) && data.layer < MaxCategoryLayer"
            type="primary"
            text
            :icon="useRenderIcon('ep:document-add')"
            @click="openDialog(true, node, data)"
          >
            新增
          </el-button>
          <el-button
            v-if="hasAuth(auth.update)"
            type="info"
            text
            :icon="useRenderIcon('ep:edit-pen')"
            @click="openDialog(false, node, data)"
          >
            修改
          </el-button>
          <el-button
            v-if="hasAuth(auth.deleted)"
            type="danger"
            text
            :icon="useRenderIcon('ep:delete')"
            @click="handleDelete(node, data)"
          >
            删除
          </el-button>
          <el-button
            v-if="hasAuth(auth.update)"
            type="warning"
            text
            :icon="useRenderIcon('ri:links-line')"
            @click="handleRelateAttr(node, data)"
          >
            关联属性
          </el-button>
        </div>
      </span>
    </template>
  </el-tree>
</template>
