<script setup lang="ts">
import { ref } from "vue";
import tree from "./tree.vue";
import { useGoods } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";

import More from "@iconify-icons/ep/more-filled";
import Delete from "@iconify-icons/ep/delete";
import EditPen from "@iconify-icons/ep/edit-pen";
import Refresh from "@iconify-icons/ep/refresh";
import AddFill from "@iconify-icons/ri/add-circle-line";
import { GOOD_STATUS_0, GOOD_STATUS_1 } from "@/constant/status";
import { ElMessage } from "element-plus";
import type { TabItem } from "./utils/types";
import { getAttrListBySpuIdApi } from "@/api/bm/goods/attr";

defineOptions({
  name: "GoodsGoods"
});

const treeRef = ref();
const formRef = ref();
const tableRef = ref();
const onAddGood = () => {
  ElMessage.success("新增商品成功");
};
const onEditGood = (title, row) => {
  ElMessage.success(`编辑${title}成功`);
  console.log(row);
};
const subMonted = (row: TabItem) => {
  //如果subLoading为未定义，则说明是第一次加载，需要重新加载数据
  //如果subLoading为true，则说明已经加载过数据，不需要再次加载
  //如果subLoading为false，则说明已经加载过数据，不需要再次加载
  if (row.subLoading === undefined) {
    row.subLoading = true;
    //模拟异步请求
    setTimeout(async () => {
      const res = await getAttrListBySpuIdApi(row.id);
      console.log(res.result);
      row.attrs = res.result;
      row.subLoading = false;
    }, 1000);
  }
};
const {
  form,
  loading,
  columns,
  dataList,
  treeData,
  treeLoading,
  selectedNum,
  pagination,
  childrenColumns,
  deviceDetection,
  onSearch,
  resetForm,
  onbatchDel,
  onTreeSelect,
  handleUpdate,
  handleDelete,
  handleSizeChange,
  onSelectionCancel,
  handleCurrentChange,
  handleSelectionChange
} = useGoods(tableRef, treeRef);
</script>

<template>
  <div :class="['flex', 'justify-between', deviceDetection() && 'flex-wrap']">
    <tree
      ref="treeRef"
      :class="['mr-2', deviceDetection() ? 'w-full' : 'min-w-[200px]']"
      :treeData="treeData"
      :treeLoading="treeLoading"
      @tree-select="onTreeSelect"
    />
    <div
      :class="[deviceDetection() ? ['w-full', 'mt-2'] : 'w-[calc(100%-200px)]']"
    >
      <el-form
        ref="formRef"
        :inline="true"
        :model="form"
        class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px] overflow-auto"
      >
        <el-form-item label="商品名称：" prop="username">
          <el-input
            v-model="form.name"
            placeholder="请输入商品名称"
            clearable
            class="!w-[180px]"
          />
        </el-form-item>
        <el-form-item label="状态：" prop="status">
          <el-select
            v-model="form.status"
            placeholder="请选择"
            clearable
            class="!w-[180px]"
          >
            <el-option :label="GOOD_STATUS_1" value="1" />
            <el-option :label="GOOD_STATUS_0" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :icon="useRenderIcon('ri:search-line')"
            :loading="loading"
            @click="onSearch"
          >
            搜索
          </el-button>
          <el-button :icon="useRenderIcon(Refresh)" @click="resetForm(formRef)">
            重置
          </el-button>
        </el-form-item>
      </el-form>

      <PureTableBar
        title="商品管理（仅演示，操作后不生效）"
        :columns="columns"
        :isExpandAll="false"
        @refresh="onSearch"
      >
        <template #buttons>
          <el-button
            type="primary"
            :icon="useRenderIcon(AddFill)"
            @click="onAddGood()"
          >
            新增商品
          </el-button>
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <div
            v-if="selectedNum > 0"
            v-motion-fade
            class="bg-[var(--el-fill-color-light)] w-full h-[46px] mb-2 pl-4 flex items-center"
          >
            <div class="flex-auto">
              <span
                style="font-size: var(--el-font-size-base)"
                class="text-[rgba(42,46,54,0.5)] dark:text-[rgba(220,220,242,0.5)]"
              >
                已选 {{ selectedNum }} 项
              </span>
              <el-button type="primary" text @click="onSelectionCancel">
                取消选择
              </el-button>
            </div>
            <el-popconfirm title="是否确认删除?" @confirm="onbatchDel">
              <template #reference>
                <el-button type="danger" text class="mr-1">
                  批量删除
                </el-button>
              </template>
            </el-popconfirm>
          </div>
          <pure-table
            ref="tableRef"
            row-key="id"
            adaptive
            :adaptiveConfig="{ offsetBottom: 50 }"
            align-whole="center"
            table-layout="auto"
            :loading="loading"
            :size="size"
            :data="dataList"
            :columns="dynamicColumns"
            :pagination="{ ...pagination, size }"
            :header-cell-style="{
              background: 'var(--el-fill-color-light)',
              color: 'var(--el-text-color-primary)'
            }"
            lazy
            @selection-change="handleSelectionChange"
            @page-size-change="handleSizeChange"
            @page-current-change="handleCurrentChange"
          >
            <template #expand="{ row }: { row: TabItem }">
              <div class="m-4">
                <el-input v-model="row.name" placeholder="请输入商品名称" />
                <p class="mb-2">name: {{ row.name }}</p>
                <p class="mb-2">catName: {{ row.catName }}</p>
                <p class="mb-2">desc: {{ row.desc }}</p>
                <p class="mb-4">catId: {{ row.catId }}</p>
                <pure-table
                  row-key="id"
                  adaptive
                  :adaptiveConfig="{ offsetBottom: 50 }"
                  align-whole="center"
                  table-layout="auto"
                  border
                  :data="row.attrs"
                  :columns="childrenColumns"
                  @vue:mounted="subMonted(row)"
                />
              </div>
            </template>
            <template #operation="{ row }: { row: TabItem }">
              <el-button
                class="reset-margin"
                link
                type="primary"
                :size="size"
                :icon="useRenderIcon(EditPen)"
                @click="onEditGood('修改', row)"
              >
                修改
              </el-button>
              <el-popconfirm
                :title="`是否确认删除用户编号为${row.id}的这条数据`"
                @confirm="handleDelete(row)"
              >
                <template #reference>
                  <el-button
                    class="reset-margin"
                    link
                    type="primary"
                    :size="size"
                    :icon="useRenderIcon(Delete)"
                  >
                    删除
                  </el-button>
                </template>
              </el-popconfirm>
              <el-dropdown>
                <el-button
                  class="ml-3 mt-[2px]"
                  link
                  type="primary"
                  :size="size"
                  :icon="useRenderIcon(More)"
                  @click="handleUpdate(row)"
                />
              </el-dropdown>
            </template>
          </pure-table>
        </template>
      </PureTableBar>
    </div>
  </div>
</template>

<style scoped lang="scss">
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}

:deep(.el-button:focus-visible) {
  outline: none;
}

.main-content {
  margin: 24px 24px 0 !important;
}

.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}
</style>
