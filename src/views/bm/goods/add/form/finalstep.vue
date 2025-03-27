<template>
  <el-card class="container">
    <div v-loading="!spu" class="flex flex-col md:flex-row">
      <!-- 图片区域 -->
      <div class="md:w-1/3 p-4">
        <el-image
          :src="selectedImage"
          :alt="spu.name"
          fit="cover"
          class="w-full rounded-lg shadow"
        />
        <div class="thumbnails flex mt-2">
          <!-- 固定主图缩略图 -->
          <el-image
            :src="spu.mainImage"
            fit="cover"
            class="thumbnail fixed-thumbnail"
            @click="selectedImage = spu.mainImage"
          />
          <el-scrollbar>
            <!-- 可滚动的其他缩略图 -->
            <div class="scrollable-thumbnails">
              <el-image
                v-for="(img, index) in spu.images"
                :key="index"
                :src="img"
                fit="cover"
                class="thumbnail"
                @click="selectedImage = img"
              />
            </div>
          </el-scrollbar>
        </div>
        <el-image
          :src="spu.detailImg"
          fit="cover"
          class="thumbnail fixed-thumbnail mt-2"
          @click="dialogVisible = true"
        />
      </div>
      <div class="md:w-2/3 p-4">
        <h2 class="text-2xl font-bold">
          {{ spu.name }}
          <el-tag type="success" size="small" round class="mb-4">{{
            spu.category
          }}</el-tag>
          <p class="text-gray-500 text-sm">{{ spu.attrText }}</p>
        </h2>
        <p class="text-red-500 text-xl mt-2">
          价格：￥{{ spu.price }}
          <span class="text-xs">折扣：￥{{ spu.discount }}</span>
        </p>
        <p class="text-gray-500 text-sm mt-1">{{ spu.desc }}</p>
        <p>
          规格参数：
          <el-descriptions border label-width="100px" :column="1">
            <el-descriptions-item
              v-for="(attr, index) in spu.spuAttrs"
              :key="index"
              :label="attr.name"
              :content="attr.value"
              >{{ attr.value }}</el-descriptions-item
            >
          </el-descriptions>
        </p>
      </div>
    </div>
    <el-divider />
    <h2 @click="handleClick">sku</h2>
    <div v-loading="!skus">
      <div
        v-for="(sku, index) in skus"
        :key="index"
        class="flex flex-col md:flex-row"
      >
        <!-- 图片区域 -->
        <div class="md:w-1/3 p-4">
          <el-image
            :src="sku.image"
            :alt="sku.name"
            fit="cover"
            class="w-full rounded-lg shadow"
          />
        </div>
        <div class="md:w-2/3 p-4">
          <h2 class="text-2xl font-bold">
            {{ sku.name }}
            <p class="text-gray-500 text-sm">{{ sku.attrText }}</p>
          </h2>
          <p class="text-red-500 text-xl mt-2">
            价格：￥{{ sku.price }}
            <span class="text-xs">折扣：￥{{ sku.discount }}</span>
          </p>
          <p class="text-gray-500 text-sm mt-1">{{ sku.desc }}</p>
          <p>
            销售属性：
            <el-descriptions border label-width="100px" :column="1">
              <el-descriptions-item
                v-for="(attr, index) in sku.skuAttrs"
                :key="index"
                :label="attr.name"
                :content="attr.value"
                >{{ attr.value }}</el-descriptions-item
              >
            </el-descriptions>
          </p>
        </div>
      </div>
    </div>
    <el-dialog v-model="dialogVisible">
      <span class="el-dialog__title">商品详情图</span>
      <img w-full :src="spu.detailImg" alt="商品详情图" />
    </el-dialog>
  </el-card>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { skuItem, spuItem } from "../utils/types";
const props = defineProps<{
  spu: spuItem;
  skus: skuItem[];
}>();
const dialogVisible = ref(false);
const emits = defineEmits(["uploadSpuImages", "saveSpuInfo", "saveSkuInfo"]);
const handleUpload = async () => {
  emits("uploadSpuImages");
};
const handleSaveSpu = async () => {
  emits("saveSpuInfo");
};
const handleSaveSku = async () => {
  emits("saveSkuInfo");
};
//计算属性
const spu = computed(() => props.spu); // 使用 computed 直接引用 props.spu

const skus = computed(() => props.skus); // 使用 computed 直接引用 props.skus

const selectedImage = ref(spu?.value.mainImage);

// 监听 spu 变化，更新 selectedImage
watch(
  () => props.spu,
  newSpu => {
    selectedImage.value = newSpu.mainImage;
  },
  { immediate: true }
);

const handleClick = () => {
  console.log("final-step", spu.value, skus.value);
  console.log("props", props.spu, props.skus);
};
</script>

<style>
.container {
  max-width: 800px;
  margin: auto;
}

.thumbnails {
  display: flex;
  gap: 12px;
  align-items: center;
  overflow-x: auto;
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
