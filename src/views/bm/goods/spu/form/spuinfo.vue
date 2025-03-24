<script lang="ts" setup>
import { nextTick, onMounted, ref } from "vue";
import { SpuInfoItem } from "../utils/types";
import ReCopy from "@/components/ReCopy";
const carouselRef = ref();
const props = defineProps<{ spuInfo: SpuInfoItem }>();
const spuInfo = ref(props.spuInfo);
const images = ref([
  spuInfo.value.image,
  ...spuInfo.value.mainImage.map(item => item.image)
]);
// 等待组件挂载后，确保 carouselRef 绑定完成
onMounted(() => {
  nextTick(() => {
    if (carouselRef.value) {
      carouselRef.value.setActiveItem(0);
    }
  });
});

defineEmits(["close"]);
</script>
<template>
  <div class="flex flex-wrap md:flex-nowrap p-4">
    <!-- 图片区域 -->
    <div class="md:w-1/2 p-4">
      <el-carousel
        ref="carouselRef"
        class="mb-5"
        indicator-position="none"
        :interval="5000"
        arrow="hover"
      >
        <el-carousel-item v-for="(item, index) in images" :key="index">
          <el-image
            :src="item"
            :alt="spuInfo.name"
            fit="cover"
            class="w-full rounded-lg"
          />
        </el-carousel-item>
      </el-carousel>
      <div class="thumbnails flex mt-auto">
        <el-image
          :src="spuInfo.image"
          fit="cover"
          :class="{ selected: carouselRef?.activeIndex === 0 }"
          class="thumbnail fixed-thumbnail"
          @click="carouselRef.setActiveItem(0)"
        />
        <el-scrollbar style="max-width: 250px; overflow-x: auto">
          <div class="scrollable-thumbnails">
            <el-image
              v-for="(img, index) in spuInfo.mainImage"
              :key="index"
              :src="img.image"
              fit="cover"
              class="thumbnail"
              :class="{
                selected: carouselRef?.activeIndex === index + 1
              }"
              @click="carouselRef.setActiveItem(index + 1)"
            />
          </div>
        </el-scrollbar>
      </div>
    </div>

    <!-- 文字描述区域 -->
    <div class="md:w-1/2 p-4">
      <ReCopy :value="spuInfo.id" />
      <h2 class="text-2xl font-bold">
        {{ spuInfo.name }}
        <el-tag type="success" size="small" round class="mb-4">{{
          spuInfo.catName
        }}</el-tag>
      </h2>
      <p class="text-gray-500 text-sm">{{ spuInfo.attrText }}</p>
      <p class="text-red-500 text-xl mt-2">
        价格：￥{{ spuInfo.price }}
        <span class="text-xs">折扣：￥{{ spuInfo.discount }}</span>
        <span class="text-xs ml-[8px]">销量：{{ spuInfo.sales }}</span>
      </p>
      <p class="text-gray-500 text-sm mt-1">{{ spuInfo.desc }}</p>
      <el-divider />
      <p>
        规格参数：
        <el-descriptions border label-width="100px" :column="1">
          <el-descriptions-item
            v-for="(attr, index) in spuInfo.attrs"
            :key="index"
            :label="attr.attrName"
            >{{ attr.value }}</el-descriptions-item
          >
        </el-descriptions>
      </p>
    </div>
  </div>
</template>

<style>
.thumbnails {
  display: flex;
  gap: 12px;
  align-items: center;
  overflow-x: auto;
}

.selected {
  border: 2px solid var(--el-color-danger);
}

.thumbnail {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  color: var(--el-color-danger);
  text-align: center;
  cursor: pointer;
  background: var(--el-color-danger-light-9);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgb(0 0 0 / 10%);
}

.fixed-thumbnail {
  flex-shrink: 0;
}

.scrollable-thumbnails {
  display: flex;
  gap: 8px;
  white-space: nowrap;
}
</style>
