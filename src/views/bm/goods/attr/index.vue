<script setup lang="ts">
import { ref, computed, nextTick, onMounted, h } from "vue";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { delay, subBefore, useResizeObserver } from "@pureadmin/utils";
import { tableSelectButtonClass, iconClass } from "@/enums/baseConstant";
import { useAttr } from "./utils/hook";
import { columns } from "./utils/columns";

import More from "@iconify-icons/ep/more-filled";
import Delete from "@iconify-icons/ep/delete";
import EditPen from "@iconify-icons/ep/edit-pen";
import Refresh from "@iconify-icons/ep/refresh";
import AddFill from "@iconify-icons/ri/add-circle-line";
import Close from "@iconify-icons/ep/close";
import Check from "@iconify-icons/ep/check";
import Relate from "@iconify-icons/ep/set-up";
import { useAttrStore } from "@/store/bm/goods/attr";
import { auth } from "./utils/auth";
import { hasAuth } from "@/router/utils";

const treeRef = ref();
const formRef = ref();
const tableRef = ref();
const treeHeight = ref();
const contentRef = ref();
const attrStore = useAttrStore();
const {
  isShow,
  curRow,
  initData,
  treeProps,
  selectedNum,
  isLinkage,
  isExpandAll,
  isSelectAll,
  treeSearchValue,
  onSelectionCancel,
  onbatchDel,
  handleSave,
  onQueryChanged,
  filterMethod,
  rowStyle,
  deviceDetection,
  onSearch,
  resetForm,
  openDialog,
  handleDelete,
  handleSizeChange,
  handleCurrentChange,
  handleSelectionChange,
  handleRelated,
  handleCheckChange
} = useAttr(tableRef, treeRef);

onMounted(() => {
  useResizeObserver(contentRef, async () => {
    await nextTick();
    delay(60).then(() => {
      treeHeight.value = parseFloat(
        subBefore(tableRef.value.getTableDoms().tableWrapper.style.height, "px")
      );
    });
  });
});
</script>

<template>
  <div class="main">
    <el-form
      ref="formRef"
      :inline="true"
      :model="attrStore.form"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px] overflow-auto"
    >
      <el-form-item label="属性名称：" prop="username">
        <el-input
          v-model="attrStore.form.name"
          placeholder="请输入属性名称"
          clearable
          class="!w-[180px]"
        />
      </el-form-item>
      <el-form-item label="类型：" prop="status">
        <el-select
          v-model="attrStore.form.type"
          placeholder="请选择"
          clearable
          class="!w-[180px]"
        >
          <el-option label="规格参数" value="0" />
          <el-option label="销售属性" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :icon="useRenderIcon('ri:search-line')"
          :loading="attrStore.loading"
          @click="onSearch"
        >
          搜索
        </el-button>
        <el-button :icon="useRenderIcon(Refresh)" @click="resetForm(formRef)">
          重置
        </el-button>
      </el-form-item>
    </el-form>
    <div
      ref="contentRef"
      :class="['flex', deviceDetection() ? 'flex-wrap' : '']"
    >
      <PureTableBar
        title="属性管理（仅演示，操作后不生效）"
        :class="[isShow && !deviceDetection() ? '!w-[60vw]' : 'w-full']"
        style="transition: width 220ms cubic-bezier(0.4, 0, 0.2, 1)"
        :columns="columns"
        @refresh="onSearch"
      >
        <template #buttons>
          <el-button
            v-if="hasAuth(auth.add)"
            type="primary"
            :icon="useRenderIcon(AddFill)"
            @click="openDialog(true)"
          >
            新增属性
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
            <el-popconfirm
              v-if="hasAuth(auth.deleted)"
              title="是否确认删除?"
              @confirm="onbatchDel"
            >
              <template #reference>
                <el-button type="danger" text class="mr-1">
                  批量删除
                </el-button>
              </template>
            </el-popconfirm>
          </div>
          <pure-table
            ref="tableRef"
            align-whole="center"
            showOverflowTooltip
            table-layout="auto"
            :loading="attrStore.loading"
            :size="size"
            adaptive
            :row-style="rowStyle"
            :adaptiveConfig="{ offsetBottom: 108 }"
            :data="attrStore.dataList"
            :columns="dynamicColumns"
            :pagination="{ ...attrStore.pagination, size }"
            :header-cell-style="{
              background: 'var(--el-fill-color-light)',
              color: 'var(--el-text-color-primary)'
            }"
            @selection-change="handleSelectionChange"
            @page-size-change="handleSizeChange"
            @page-current-change="handleCurrentChange"
          >
            <template #operation="{ row }">
              <el-button
                v-if="hasAuth(auth.update)"
                class="reset-margin"
                link
                type="primary"
                :size="size"
                :icon="useRenderIcon(EditPen)"
                @click="openDialog(false, row)"
              >
                修改
              </el-button>
              <el-popconfirm
                :title="`是否确认删除角色名称为${row.name}的这条数据`"
                @confirm="handleDelete(row)"
              >
                <template #reference>
                  <el-button
                    v-if="hasAuth(auth.deleted)"
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
                />
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item v-if="hasAuth(auth.update)">
                      <el-button
                        :class="tableSelectButtonClass"
                        link
                        type="primary"
                        :size="size"
                        :icon="useRenderIcon(Relate)"
                        @click="handleRelated(row)"
                      >
                        属性关联
                      </el-button>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
          </pure-table>
        </template>
      </PureTableBar>
      <div
        v-if="isShow"
        class="!min-w-[calc(100vw-60vw-268px)] w-full mt-2 px-2 pb-2 bg-bg_color ml-2 overflow-auto"
      >
        <div class="flex justify-between w-full px-3 pt-5 pb-4">
          <div class="flex">
            <span :class="iconClass">
              <IconifyIconOffline
                v-tippy="{
                  content: '关闭'
                }"
                class="dark:text-white"
                width="18px"
                height="18px"
                :icon="Close"
                @click="handleRelated"
              />
            </span>
            <span :class="[iconClass, 'ml-2']">
              <IconifyIconOffline
                v-tippy="{
                  content: '保存菜单权限'
                }"
                class="dark:text-white"
                width="18px"
                height="18px"
                :icon="Check"
                @click="handleSave"
              />
            </span>
          </div>
          <p class="font-bold truncate">
            属性分类
            {{ `${curRow?.name ? `（${curRow.name}）` : ""}` }}
            <el-tag
              size="small"
              :type="curRow.type === 0 ? 'primary' : 'success'"
            >
              {{ curRow?.type === 0 ? "规格参数" : "销售属性" }}
            </el-tag>
          </p>
        </div>
        <el-input
          v-model="treeSearchValue"
          placeholder="请输入菜单进行搜索"
          class="mb-1"
          clearable
          @input="onQueryChanged"
        />
        <div class="flex flex-wrap">
          <el-checkbox v-model="isExpandAll" label="展开/折叠" />
          <el-checkbox v-model="isSelectAll" label="全选/全不选" />
          <el-checkbox v-model="isLinkage" label="父子联动" />
        </div>
        <el-tree
          ref="treeRef"
          show-checkbox
          :data="initData"
          node-key="id"
          :props="treeProps"
          :height="treeHeight"
          :check-strictly="!isLinkage"
          :filter-method="filterMethod"
          v-on:check-change="handleCheckChange"
        >
          <template #default="{ node }">
            <span>{{ node.label }}</span>
            <el-tag
              v-if="
                node.isLeaf &&
                (node.data.select === 1 || node.data.select === 0)
              "
              v-tippy="{
                content: '点击切换单选/多选'
              }"
              class="ml-2"
              :type="node.data.select === 0 ? 'success' : 'warning'"
              @click="
                () => {
                  console.log(node);
                  node.data.select = node.data.select === 1 ? 0 : 1;
                }
              "
              >{{ node.data.select === 0 ? "单选" : "多选" }}</el-tag
            >
          </template>
        </el-tree>
      </div>
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
