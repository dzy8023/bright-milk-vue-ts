<script lang="ts" setup>
import { SkuInfoItem } from "../utils/types";
import noImg from "@/components/ReImage/noImg.vue";
import ReCopy from "@/components/ReCopy";
defineProps({
  skuInfo: {
    type: Object as PropType<SkuInfoItem>
  }
});
const statusType = (status: number) => {
  return status === 1 ? "success" : "danger";
};
defineEmits(["close"]);
</script>
<template>
  <div class="flex flex-wrap md:flex-nowrap p-4">
    <!-- 图片区域 -->
    <div class="md:w-1/2 p-4">
      <noImg :name="skuInfo.name" :url="skuInfo.image" />
    </div>
    <!-- 商品信息区域 -->
    <div class="md:w-2/3 p-4">
      <ReCopy :value="skuInfo.id" />
      <h2 class="text-2xl font-bold">
        {{ skuInfo.name }}
        <span
          style="border-radius: 2px"
          class="text-gray-500 text-sm bg-[#F4F4F5] inline-block"
        >
          {{ skuInfo.attrText }}
        </span>
      </h2>
      <p class="text-red-500 text-xl mt-2">
        价格：￥{{ skuInfo.price }}
        <span class="text-xs">折扣：￥{{ skuInfo.discount }}</span>
        <span class="text-xs ml-[8px]">销量：{{ skuInfo.sales }}</span>
      </p>
      <p class="text-gray-500 text-sm mt-1">{{ skuInfo.desc }}</p>
      <p class="text-gray-500 text-sm mt-1">
        售卖状态：<el-tag :type="statusType(skuInfo.status)">{{
          skuInfo.status === 1 ? "起售" : "禁售"
        }}</el-tag>
      </p>
      <p class="text-gray-500 text-sm mt-1">
        是否可以订奶：<el-tag :type="statusType(skuInfo.enableOrder)">{{
          skuInfo.enableOrder === 1 ? "可以订奶" : "禁止订奶"
        }}</el-tag>
      </p>
      <p>
        销售属性：
        <el-descriptions border label-width="100px" :column="1">
          <el-descriptions-item
            v-for="(attr, index) in skuInfo.attrs"
            :key="index"
            :label="attr.attrName"
            :content="attr.value"
            >{{ attr.value }}</el-descriptions-item
          >
        </el-descriptions>
      </p>
    </div>
  </div>
</template>
