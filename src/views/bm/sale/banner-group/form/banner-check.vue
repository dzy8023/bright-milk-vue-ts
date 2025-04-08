<template>
  <el-card shadow="never">
    <el-scrollbar>
      <div class="scrollbar-flex-content">
        <div
          v-for="item in bannerList"
          :key="item.id"
          class="scrollbar-demo-item"
          :class="{ selected: isSelected(item.bannerId) }"
          @click="toggleSelection(item)"
        >
          <noImg :name="item.name" :url="item.image" />
        </div>
      </div>
    </el-scrollbar>
    <el-divider />
    <draggable
      v-model="selectedBanners"
      group="banners"
      item-key="bannerId"
      class="banner-list"
    >
      <template #item="{ element }">
        <div
          class="banner-item"
          @mouseenter="hoveredId = element.bannerId"
          @mouseleave="hoveredId = null"
        >
          <img :src="element.image" alt="轮播图" class="banner-image" />
          <span>{{ element.name }}</span>
          <el-button
            v-if="hoveredId === element.bannerId"
            class="delete-button"
            circle
            size="small"
            :icon="useRenderIcon('ep:close')"
            @click="removeBanner(element.bannerId)"
          />
        </div>
      </template>
    </draggable>
  </el-card>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import draggable from "vuedraggable/src/vuedraggable";
import noImg from "@/components/ReImage/noImg.vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { BannerItem } from "../utils/types";
const props = defineProps({
  data: {
    type: Array<BannerItem>,
    default: () => []
  },
  modelValue: {
    type: Array<BannerItem>,
    default: () => []
  }
});
const handleSubmit = () => {
  console.log(selectedBanners.value);
};

const bannerList = ref(props.data);

const selectedBanners = ref(props.modelValue);
const hoveredId = ref<string | null>(null);

const isSelected = (id: number) =>
  selectedBanners.value.some(item => item.bannerId === id);

const toggleSelection = item => {
  if (isSelected(item.bannerId)) {
    selectedBanners.value = selectedBanners.value.filter(
      banner => banner.bannerId !== item.bannerId
    );
  } else {
    selectedBanners.value.push(item);
  }
};

const removeBanner = (id: number) => {
  selectedBanners.value = selectedBanners.value.filter(
    banner => banner.bannerId !== id
  );
};
</script>

<style lang="scss" scoped>
.scrollbar-flex-content {
  display: flex;
  width: fit-content;
}

.scrollbar-demo-item {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 100px;
  margin: 10px;
  color: var(--el-color-danger);
  text-align: center;
  cursor: pointer;
  background: var(--el-color-danger-light-9);
  border: 2px solid transparent;
  border-radius: 4px;
}

.scrollbar-demo-item.selected {
  border-color: var(--el-color-primary);
}

.banner-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.banner-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.banner-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
}

.delete-button {
  position: absolute;
  top: 5px;
  right: 5px;
}
</style>
