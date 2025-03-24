<script setup lang="ts">
import { PropType } from "vue";
import noImg from "@/components/ReImage/noImg.vue";
import More2Fill from "@iconify-icons/ri/more-2-fill";
import Fire from "@iconify-icons/ri/fire-line";
import type { SkuInfoItem } from "../utils/types";

defineProps({
  skuInfo: {
    type: Object as PropType<SkuInfoItem>
  }
});

const emit = defineEmits(["view-item", "changeStatus-item"]);

const handleView = (data: SkuInfoItem) => {
  console.log(data);
  emit("view-item", data);
};
const handleChangeStatus = async (data: SkuInfoItem) => {
  await emit("changeStatus-item", data);
};
</script>

<template>
  <div class="list-card-item_detail bg-bg_color">
    <el-row>
      <noImg :name="skuInfo.name" :url="skuInfo.image" />
      <div class="list-card-item_detail--sales flex">
        <IconifyIconOffline :icon="Fire" class="text-[24px] text-red-500" />
        <span class="text-gray-500 inline-block"> {{ skuInfo.sales }}</span>
      </div>
      <!-- 右上角状态与操作 -->
      <div class="list-card-item_detail--operation">
        <!-- 更改状态 -->
        <el-popconfirm
          :title="`是否要${skuInfo.status === 1 ? '停用' : '启用'}【${skuInfo.name}】?`"
          @confirm="handleChangeStatus(skuInfo)"
        >
          <template #reference>
            <el-tag
              :color="skuInfo.status === 1 ? '#00a870' : '#7f7f7f'"
              effect="dark"
              class="mx-1 list-card-item_detail--operation--tag cursor-pointer"
            >
              {{ skuInfo.status === 1 ? "已启用" : "已停用" }}
            </el-tag>
          </template>
        </el-popconfirm>
        <!-- 操作插槽 -->
        <el-dropdown trigger="click">
          <IconifyIconOffline :icon="More2Fill" class="text-[24px]" />
          <template #dropdown>
            <slot name="operation" :row="skuInfo" />
          </template>
        </el-dropdown>
      </div>
    </el-row>
    <div class="list-card-item_detail--name text-text_color_primary">
      <!-- 鼠标移入颜色变蓝，并且指针 -->
      <p
        class="text-lg mb-1 hover:text-blue-500 cursor-pointer"
        @click="handleView(skuInfo)"
      >
        {{ skuInfo.name }}
      </p>
      <span
        style="border-radius: 2px"
        class="text-gray-500 text-sm bg-[#F4F4F5] inline-block"
      >
        {{ skuInfo.attrText }}
      </span>
    </div>
    <div class="flex items-center text-red-500 text-xl mt-2">
      价格：￥{{ skuInfo.price }}
      <span class="text-xs ml-2">折扣：￥{{ skuInfo.discount }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.list-card-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
  overflow: hidden;
  cursor: pointer;
  border-radius: 3px;

  &_detail {
    position: relative; /* 设置为相对定位，便于子元素绝对定位 */
    min-height: 140px;
    padding: 10px;

    &--operation {
      position: absolute; /* 绝对定位 */
      top: 5px; /* 调整到顶部位置 */
      right: 5px; /* 调整到右侧位置 */
      gap: 5px; /* 标签和下拉按钮之间增加间距 */
      align-items: center;

      &--tag {
        padding: 2px 5px;
        font-size: 14px; /* 状态的字体大小 */
        line-height: 1;
        border: 0;
      }
    }

    &--sales {
      position: absolute; /* 绝对定位 */
      top: 5px; /* 调整到顶部位置 */
      left: 5px; /* 调整到右侧位置 */
      align-items: center;
    }

    &--name {
      font-size: 16px;
      font-weight: 400;
    }
  }
}
</style>
