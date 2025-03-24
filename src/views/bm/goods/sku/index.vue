<script setup lang="ts">
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import skuInfoCard from "./form/skuinfo-card.vue";
import editForm from "./form/index.vue";
import More from "@iconify-icons/ep/more-filled";
import Delete from "@iconify-icons/ep/delete";
import EditPen from "@iconify-icons/ep/edit-pen";
import Refresh from "@iconify-icons/ep/refresh";
import AddFill from "@iconify-icons/ri/add-circle-line";
import View from "@iconify-icons/ep/view";
import Close from "@iconify-icons/ep/close";
import Check from "@iconify-icons/ep/check";
import Relate from "@iconify-icons/ep/set-up";
import { auth } from "./utils/auth";
import { hasAuth } from "@/router/utils";
import { useSkuInfoStore } from "@/store/bm/goods/sku";
import { useSkuInfo } from "./utils/hook";
import { ref } from "vue";
import { GOOD_STATUS_0, GOOD_STATUS_1 } from "@/constant/status";

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

const {
  onSearch,
  resetForm,
  openDialog,
  handleDelete,
  handleUpdate,
  handleChangeStatus,
  handleView,
  handleSizeChange,
  handleCurrentChange
} = useSkuInfo();
</script>

<template>
  <div>
    <div class="w-full flex justify-between mb-4">
      <el-form
        ref="formRef"
        :inline="true"
        :model="skuInfoStore.form"
        class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px] overflow-auto"
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
      <el-button :icon="useRenderIcon(AddFill)" @click="openDialog(true, null)">
        新建产品
      </el-button>
    </div>
    <div
      v-loading="skuInfoStore.loading"
      :element-loading-svg="svg"
      element-loading-svg-view-box="-10, -10, 50, 50"
    >
      <template v-if="skuInfoStore.dataList.length > 0">
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
