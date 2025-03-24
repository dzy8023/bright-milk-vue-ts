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
        <el-button type="primary" size="large" @click="handleUpload">
          上传图片
        </el-button>
        <el-button type="primary" size="large" @click="handleSaveSpu">
          上传spu
        </el-button>
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
      <el-button type="primary" size="large" @click="handleSaveSku">
        上传sku
      </el-button>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { skuItem, spuItem } from "../utils/types";
const props = defineProps<{
  spu: spuItem;
  skus: skuItem[];
}>();
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
//   ref({
//   id: 1,
//   name: "光明浓醇鲜牛奶",
//   category: "牛奶",
//   price: 5.2,
//   discount: 0.5,
//   attrText: "原味;香浓;果糖",
//   description: "该产品玻璃瓶包装需要回收，请饮用后及时放回奶箱中，感谢！",
//   mainImage:
//     "https://assets.4008117117.com/upload/2023/4/11/6937caf6-9da6-4ec1-94f4-9d71dadd992b.png?x-oss-process=image/resize,m_pad,w_860,h_860",
//   images: [
//     "https://assets.4008117117.com/upload/2025/2/18/e6462bb5-e084-4850-b14c-e19d7f933ef9.png?x-oss-process=image/resize,m_pad,w_860,h_860",
//     "https://assets.4008117117.com/upload/2025/3/5/1ded095e-7a30-473a-a7fb-11d413414c97.png?x-oss-process=image/resize,m_pad,w_860,h_860",
//     "https://assets.4008117117.com/upload/2025/2/18/e6462bb5-e084-4850-b14c-e19d7f933ef9.png?x-oss-process=image/resize,m_pad,w_860,h_860",
//     "https://assets.4008117117.com/upload/2025/3/5/1ded095e-7a30-473a-a7fb-11d413414c97.png?x-oss-process=image/resize,m_pad,w_860,h_860"
//   ],
//   spuAttrs: [
//     { attrId: 1, name: "产地", value: "内蒙古;新疆", quickShow: 1 },
//     { attrId: 2, name: "保质期", value: "30天", quickShow: 1 },
//     { attrId: 3, name: "包装", value: "玻璃瓶;塑封", quickShow: 0 }
//   ]
// });

const skus = computed(() => props.skus); // 使用 computed 直接引用 props.skus
//   ref([
//   {
//     id: 1,
//     name: "光明浓醇鲜牛奶袋装195ml",
//     price: 5.2,
//     discount: 0.5,
//     attrText: "原味;香浓;果糖",
//     description: "因配送地址的不同有",
//     stock: 100,
//     image:
//       "https://assets.4008117117.com/upload/2023/9/18/71f19e2b-e472-4fb1-876a-f676a14f79a5.png?x-oss-process=image/resize,m_pad,w_860,h_860",
//     skuAttrs: [
//       {
//         attrId: 1,
//         name: "规格",
//         value: "195ml"
//       },
//       {
//         attrId: 2,
//         name: "包装",
//         value: "玻璃瓶"
//       }
//     ]
//   },
//   {
//     id: 2,
//     name: "光明浓醇鲜牛奶玻璃瓶250ml",
//     price: 6.2,
//     discount: 0.5,
//     attrText: "原味;香浓;果糖",
//     description: "因配送地址的不同有",
//     stock: 100,
//     image:
//       "https://assets.4008117117.com/upload/2023/7/14/f5d7f702-e0a2-4c02-8153-5a9c8f806fd0.png?x-oss-process=image/resize,m_pad,w_860,h_860",
//     skuAttrs: [
//       {
//         attrId: 1,
//         name: "规格",
//         value: "250ml"
//       },
//       {
//         attrId: 2,
//         name: "包装",
//         value: "袋装"
//       }
//     ]
//   }
// ]);
const selectedImage = ref(spu?.value.mainImage);

// 监听 spu 变化，更新 selectedImage
watch(
  () => props.spu,
  newSpu => {
    selectedImage.value = newSpu.mainImage;
  },
  { immediate: true }
);
// // 监听 skus 变化
// watch(
//   () => props.skus,
//   () => {
//     console.log("final-step", spu.value, skus.value);
//   },
//   { immediate: true }
// );
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
