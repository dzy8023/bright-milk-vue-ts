<script setup lang="ts">
import { ref } from "vue";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Delete from "@iconify-icons/ep/delete";
import EditPen from "@iconify-icons/ep/edit-pen";
import Refresh from "@iconify-icons/ep/refresh";
import AddFill from "@iconify-icons/ri/add-circle-line";
import { useBanner } from "./utils/hooks";
import { columns } from "./utils/columns";
import { useBannerGroupStore } from "@/store/bm/sale/bannerGroup";
import { usePublicHooks } from "@/views/hooks";
import noImg from "@/assets/img/noImg.png";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import SwiperCore from "swiper";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

SwiperCore.use([Autoplay, Navigation, Pagination]);
const { switchStyle } = usePublicHooks();
const formRef = ref();
const tableRef = ref();
const bannerGroupStore = useBannerGroupStore();
const swiperOptions = {
  Autoplay: {
    delay: 2000,
    disableOnInteraction: false
  },
  Pagination: {
    clickable: true
  },
  loop: true
};
const {
  selectedNum,
  switchLoadMap,
  onChange,

  /** 搜索 */
  onSearch,
  /** 重置 */
  resetForm,
  /** 新增、修改轮播图*/
  openDialog,
  /** 删除轮播图*/
  handleDelete,
  onbatchDel,
  handleSelectionChange,
  handleSizeChange,
  handleCurrentChange,
  onSelectionCancel
} = useBanner(tableRef);

function onFullscreen() {
  // 重置表格高度
  tableRef.value.setAdaptive();
}
</script>

<template>
  <div class="main">
    <el-form
      ref="formRef"
      :inline="true"
      :model="bannerGroupStore.form"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px] overflow-auto"
    >
      <el-form-item label="轮播图组名称：" prop="name">
        <el-input
          v-model="bannerGroupStore.form.name"
          placeholder="请输入轮播图组名称"
          clearable
          class="!w-[180px]"
        />
      </el-form-item>
      <el-form-item label="状态：" prop="status">
        <el-select
          v-model="bannerGroupStore.form.status"
          placeholder="请选择"
          clearable
          class="!w-[180px]"
        >
          <el-option label="启用" value="1" />
          <el-option label="禁用" value="0" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :icon="useRenderIcon('ri:search-line')"
          :loading="bannerGroupStore.loading"
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
      title="轮播图管理"
      :columns="columns"
      :tableRef="tableRef?.getTableRef()"
      @refresh="onSearch"
      @fullscreen="onFullscreen"
    >
      <template #buttons>
        <el-button
          type="primary"
          :icon="useRenderIcon(AddFill)"
          @click="openDialog(true, null)"
        >
          新增轮播图
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
              <el-button type="danger" text class="mr-1"> 批量删除 </el-button>
            </template>
          </el-popconfirm>
        </div>
        <pure-table
          ref="tableRef"
          adaptive
          :adaptiveConfig="{ offsetBottom: 45 }"
          align-whole="center"
          row-key="id"
          showOverflowTooltip
          table-layout="auto"
          default-expand-all
          :loading="bannerGroupStore.loading"
          :pagination="bannerGroupStore.pagination"
          :size="size"
          :data="bannerGroupStore.dataList"
          :columns="dynamicColumns"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
          @selection-change="handleSelectionChange"
          @page-size-change="handleSizeChange"
          @page-current-change="handleCurrentChange"
        >
          <template #status="{ row, index }">
            <el-switch
              v-model="row.status"
              active-text="启用"
              inactive-text="禁用"
              :active-value="1"
              :inactive-value="0"
              :loading="switchLoadMap[index]?.loading"
              :style="switchStyle"
              inline-prompt
              @click="onChange(row, index)"
            />
          </template>
          <template #bannerList="{ row }">
            <swiper
              v-if="row.bannerList && row.bannerList.length > 0"
              v-bind="swiperOptions"
            >
              <swiper-slide
                v-for="(item, index) in row.bannerList"
                :key="index"
              >
                <img :src="item.image" class="h-[70px]" />
              </swiper-slide>
            </swiper>
            <img v-else :src="noImg" class="h-[70px]" />
          </template>
          <template #operation="{ row }">
            <el-button
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="useRenderIcon(EditPen)"
              @click="openDialog(false, row)"
            >
              修改
            </el-button>
            <el-button
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="useRenderIcon(AddFill)"
              @click="openDialog(true, { parentId: row.id } as any)"
            >
              新增
            </el-button>
            <el-popconfirm
              :title="`是否确认删除轮播图名称为${row.name}的这条数据`"
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
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-table__inner-wrapper::before) {
  height: 0;
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
