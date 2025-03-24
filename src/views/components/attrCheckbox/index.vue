<template>
  <el-card>
    <!-- 属性选择器组件 -->
    <attr-checkbox
      ref="attrCheckboxRef"
      v-model="formState"
      @submit="handleAttrSubmit"
    />

    <!-- 操作按钮 -->
    <div class="flex justify-end mt-4">
      <el-button type="primary" @click="handleGenerateSku">生成SKU</el-button>
    </div>

    <!-- SKU表格 -->
    <template v-if="tableData.length">
      <el-divider />
      <pure-table
        row-key="id"
        :data="tableData"
        :columns="columns"
        align-whole="center"
        table-layout="auto"
        border
      >
        <template #name="{ row }">
          <el-input v-model="row.name" placeholder="请输入SKU名称" />
        </template>

        <template #price="{ row }">
          <el-input-number
            v-model="row.price"
            :min="0"
            :precision="2"
            :step="1"
            placeholder="请输入价格"
            class="w-full"
          />
        </template>

        <template #stock="{ row }">
          <el-input-number
            v-model="row.stock"
            :min="0"
            :step="1"
            placeholder="请输入库存"
            class="w-full"
          />
        </template>
      </pure-table>
    </template>
  </el-card>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import type { AttrItem } from "@/types/attr";
import attrCheckbox from "./utils/attr-checkbox.vue";
import { AttrFormInLine } from "./utils/types";

// 表格列定义
const columns = [
  {
    label: "规格",
    prop: "specs",
    width: 200
  },
  {
    label: "SKU名称",
    prop: "name",
    slot: true
  },
  {
    label: "价格",
    prop: "price",
    slot: true,
    width: 200
  },
  {
    label: "库存",
    prop: "stock",
    slot: true,
    width: 200
  }
];

// 状态定义
const attrState = ref<{
  spuAttrs: Array<Omit<AttrItem, "type"> & { choose: 0 | 1 }>;
  saleAttrs: Array<Omit<AttrItem, "type"> & { choose: 0 | 1 }>;
}>({
  spuAttrs: [
    {
      id: 1,
      name: "颜色",
      icon: "el-icon-color",
      value: "黑色;白色;红色;蓝色",
      desc: "颜色",
      choose: 0
    },
    {
      id: 2,
      name: "尺寸",
      icon: "el-icon-s-grid",
      value: "S;M;L;XL",
      desc: "尺寸",
      choose: 1
    }
  ],
  saleAttrs: [
    {
      id: 1,
      name: "规格",
      icon: "el-icon-color",
      value: "180ml;200ml;250ml;300ml",
      desc: "规格",
      choose: 0
    },
    {
      id: 2,
      name: "包装",
      icon: "el-icon-s-grid",
      value: "袋装;盒装;瓶装;桶装",
      desc: "包装",
      choose: 1
    }
  ]
});

// 表单数据
const formState = ref<AttrFormInLine>({
  spuAttrs: attrState.value.spuAttrs.map(item => ({
    id: item.id,
    name: item.name,
    options: item.value.split(";"),
    value: "",
    quickShow: 0,
    desc: item.desc,
    icon: item.icon,
    choose: item.choose
  })),
  saleAttrs: attrState.value.saleAttrs.map(item => ({
    id: item.id,
    name: item.name,
    options: item.value.split(";"),
    value: [],
    desc: item.desc,
    icon: item.icon,
    choose: item.choose
  }))
});
// 表格数据
const tableData = ref<any[]>([]);
const attrCheckboxRef = ref();

// 事件处理
const handleAttrSubmit = (data: any, skus: any[]) => {
  console.log("属性提交:", { data, skus });
  // 处理SKU数据
  tableData.value = skus.map((sku, index) => {
    // 获取所有销售属性值组合
    const specs = Object.entries(sku)
      .filter(([key]) => key.startsWith("sku-"))
      .map(([_, value]) => value)
      .join(" + ");

    return {
      id: index + 1,
      specs,
      name: "",
      price: 0,
      stock: 0,
      ...sku
    };
  });
};

// 生成SKU
const handleGenerateSku = () => {
  attrCheckboxRef.value?.submit();
};
onMounted(() => {
  console.log("属性选择器组件挂载完成");
});
</script>

<style scoped>
.el-card :deep(.el-card__body) {
  padding: 20px;
}

:deep(.el-input-number) {
  width: 100%;
}
</style>
