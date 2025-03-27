<script setup lang="ts">
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import skuInfoCard from "./form/skuinfo-card.vue";
import More from "@iconify-icons/ep/more-filled";
import Delete from "@iconify-icons/ep/delete";
import EditPen from "@iconify-icons/ep/edit-pen";
import Refresh from "@iconify-icons/ep/refresh";
import AddFill from "@iconify-icons/ri/add-circle-line";
import View from "@iconify-icons/ep/view";
import Close from "@iconify-icons/ep/close";
import Check from "@iconify-icons/ep/check";
import { auth } from "./utils/auth";
import { hasAuth } from "@/router/utils";
import { useSkuInfoStore } from "@/store/bm/goods/sku";
import { useSkuInfo } from "./utils/hook";
import { ref } from "vue";
import { GOOD_STATUS_0, GOOD_STATUS_1 } from "@/constant/status";
import { useSpuInfoStore } from "@/store/bm/goods/spu";
import { debounce } from "@pureadmin/utils";
import { message } from "@/utils/message";

const svg = `
        <path class="path" d="
          M 30 15
          L 28 17
          M 25.61 25.61
          A 15 15, 0, 0, 1, 15 30
          A 15 15, 0, 1, 1, 27.99 7.5
          L 15 15
        " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
      `;
const formRef = ref();
const skuInfoStore = useSkuInfoStore();
const spuInfoStore = useSpuInfoStore();
const current = ref("");
const sortType = ref([
  //sort false:desc true:asc
  { label: "综合排序", sortBy: "", isAsc: false },
  { label: "价格", sortBy: "price", isAsc: false },
  { label: "销量", sortBy: "sales", isAsc: false }
]);

const {
  selectedIds,
  onSearch,
  resetForm,
  handleDelete,
  handleUpdate,
  handleChangeStatus,
  handleView,
  handleSizeChange,
  handleCurrentChange,
  handleSelectItem,
  onSelectionCancel,
  onbatchDel,
  selectAll
} = useSkuInfo();
const debounceSearch = debounce(onSearch, 500);
const useSortBy = (store: any, data: { sortBy: string; isAsc: boolean }) => {
  store.sortBy = data.sortBy;
  store.isAsc = data.isAsc;
};
const handleSortType = (index: number) => {
  if (index > 0 && current.value === sortType.value[index].sortBy) {
    sortType.value[index].isAsc = !sortType.value[index].isAsc;
  }
  useSortBy(skuInfoStore.form, sortType.value[index]);
  debounceSearch();
  console.log(current.value, index, sortType.value[index]);
};
const suggestList = ref(
  spuInfoStore.dataList.map(item => ({ value: item.id, name: item.name }))
);
const querySearch = (queryString: string, cb: any) => {
  const results = queryString
    ? suggestList.value.filter(createFilter(queryString))
    : suggestList.value;
  cb(results);
};
const createFilter = (queryString: string) => {
  return (item: any) => {
    return item.value.indexOf(queryString) === 0;
  };
};
</script>

<template>
  <div>
    <div class="w-full flex mb-4">
      <el-form
        ref="formRef"
        :inline="true"
        :model="skuInfoStore.form"
        class="search-form bg-bg_color w-[80%] pl-8 pt-[12px] overflow-auto"
      >
        <el-form-item label="商品名称：" prop="name">
          <el-input
            v-model="skuInfoStore.form.name"
            style="width: 300px"
            placeholder="请输入商品名称"
            clearable
          >
            <template #suffix>
              <el-icon class="el-input__icon">
                <IconifyIconOffline
                  v-show="skuInfoStore.form.name.length === 0"
                  icon="ri:search-line"
                />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="spuId" prop="spuId">
          <el-autocomplete
            v-model="skuInfoStore.form.spuId"
            placeholder="请输入spuId"
            clearable
            class="!w-[200px]"
            :fetch-suggestions="querySearch"
            @clear="onSearch"
            @keyup.enter="onSearch"
          >
            <template #default="{ item }">
              <span v-tippy="{ content: item.name }">{{ item.value }}</span>
            </template>
          </el-autocomplete>
        </el-form-item>
        <el-form-item label="状态：" prop="status">
          <el-select
            v-model="skuInfoStore.form.status"
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
            :loading="skuInfoStore.loading"
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
        class="flex p-5 bg-white flex-col-reverse items-start h-full ml-1 gap-2"
      >
        <el-button :icon="useRenderIcon(Check)" @click="selectAll">
          全部选中
        </el-button>
        <el-radio-group v-model="current" size="small">
          <el-radio-button
            v-for="(item, index) in sortType"
            :key="index"
            :value="item.sortBy"
            @click="handleSortType(index)"
          >
            <span class="flex">
              <IconifyIconOnline
                v-if="index > 0"
                :icon="item.isAsc ? 'ep:caret-top' : 'ep:caret-bottom'"
                class="mr-1"
              />
              {{ item.label }}
            </span>
          </el-radio-button>
        </el-radio-group>
      </div>
    </div>
    <div
      v-loading="skuInfoStore.loading"
      :element-loading-svg="svg"
      element-loading-svg-view-box="-10, -10, 50, 50"
    >
      <template v-if="skuInfoStore.dataList.length > 0">
        <div
          v-if="selectedIds.size > 0"
          v-motion-fade
          class="bg-[var(--el-fill-color-light)] w-full h-[46px] mb-2 pl-4 flex items-center"
        >
          <div class="flex-auto">
            <span
              style="font-size: var(--el-font-size-base)"
              class="text-[rgba(42,46,54,0.5)] dark:text-[rgba(220,220,242,0.5)]"
            >
              已选 {{ selectedIds.size }} 项
            </span>
            <el-button type="primary" text @click="onSelectionCancel">
              取消选择
            </el-button>
          </div>
          <el-popconfirm title="是否确认删除?" @confirm="onbatchDel">
            <template #reference>
              <el-button type="danger" text class="mr-1"> 批量删除 </el-button>
            </template>
          </el-popconfirm>
        </div>
        <el-row :gutter="16">
          <el-col
            v-for="(item, index) in skuInfoStore.dataList"
            :key="index"
            class="mb-4"
            :xs="24"
            :sm="12"
            :md="8"
            :lg="6"
            :xl="4"
          >
            <skuInfoCard
              :skuInfo="item"
              :isSelected="selectedIds.has(item.id)"
              @selectItem="handleSelectItem"
              @delete-item="handleDelete"
              @update-item="handleUpdate"
              @view-item="handleView"
              @changeStatus-item="handleChangeStatus"
            >
              <template #operation="{ row }">
                <el-dropdown-menu>
                  <el-dropdown-item>
                    <el-button
                      link
                      type="primary"
                      :icon="useRenderIcon(View)"
                      @click="handleView(row)"
                    >
                      查看
                    </el-button>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-button
                      link
                      type="primary"
                      :icon="useRenderIcon(EditPen)"
                      @click="handleUpdate(row)"
                    >
                      修改
                    </el-button>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-button
                      class="reset-margin"
                      link
                      type="danger"
                      :icon="useRenderIcon(Delete)"
                      @click="handleDelete(row)"
                    >
                      删除
                    </el-button>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </skuInfoCard>
          </el-col>
        </el-row>
        <el-pagination
          v-model:currentPage="skuInfoStore.pagination.currentPage"
          class="float-right"
          :page-size="skuInfoStore.pagination.pageSize"
          :total="skuInfoStore.pagination.total"
          :page-sizes="[24, 36, 48]"
          :background="true"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </template>
      <template v-else>
        <el-empty description="暂无数据" />
      </template>
    </div>
  </div>
</template>
