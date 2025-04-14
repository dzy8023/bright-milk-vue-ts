<template>
  <div class="flex flex-wrap md:flex-nowrap p-4">
    <!-- 图片区域 -->
    <div class="md:w-1/2 p-4">
      <noImg :name="data.name" :url="data.image" />
    </div>
    <!-- 商品信息区域 -->
    <div class="md:w-2/3 p-4">
      <ReCopy :value="data.id" />
      <h2 class="text-2xl font-bold">
        {{ data.name }}
      </h2>
      <el-descriptions border label-width="80px" :column="1">
        <el-descriptions-item label="价格"
          ><p class="text-red-500 text-lg">
            ￥{{ data.price }}
          </p></el-descriptions-item
        >
        <el-descriptions-item label="折扣"
          ><p class="text-gray-500 text-lg">
            ￥{{ data.discount }}
          </p></el-descriptions-item
        >
        <el-descriptions-item label="销量"
          ><el-tag> {{ data.sales }} </el-tag></el-descriptions-item
        >
      </el-descriptions>
      <div class="block flex justify-between items-center">
        <el-date-picker
          v-model="date"
          style="width: 80%"
          type="daterange"
          unlink-panels
          range-separator="To"
          start-placeholder="Start date"
          end-placeholder="End date"
          :shortcuts="shortcuts"
          size="small"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
        />
        <el-button text type="primary" @click="handleQuery">查询</el-button>
      </div>
    </div>
  </div>
  <!-- <el-divider /> -->
  <!-- sku列表 -->
  <div class="p-4 h-auto">
    <pure-table
      :header-cell-style="{
        background: 'var(--el-fill-color-light)',
        color: 'var(--el-text-color-primary)'
      }"
      row-key="id"
      adaptive
      :data="data.skus"
      :columns="skuColumns"
    >
      <template #empty>暂无数据</template>
      <template #id="{ row }">
        <ReCopy :value="row.id" />
      </template>
      <template #name="{ row }">
        {{ row.name }}
      </template>
      <template #image="{ row }">
        <img :src="row.image" :alt="row.name" class="w-20 h-20" />
      </template>
    </pure-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import ReCopy from "@/components/ReCopy";
import noImg from "@/components/ReImage/noImg.vue";
// import { getMilkDisInfo, getMilkSaleDate } from "@/api/milk";
import { skuColumns } from "../utils/columns";
import { useStatisticsStore } from "@/store/bm/data-show/statistics";
const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
});
const data = ref(props.data);
const date = ref(data.value.term);
const saleLabel = ref("销量:");
const staStore = useStatisticsStore();

const handleQuery = async () => {
  if (date.value) {
    saleLabel.value = `销量(${date.value[0].slice(5)}~${date.value[1].slice(5)}):`;
    shortcuts.push({
      text: date.value[0].slice(5) + "~" + date.value[1].slice(5),
      value: () => {
        return [new Date(date.value[0]), new Date(date.value[1])];
      }
    });
    //查询商品销量
    const res = await staStore.getSpuSaleData(data.value.id, {
      start: date.value[0],
      end: date.value[1]
    });
    if (res) {
      data.value = res;
    }
  }
};
const shortcuts = [
  {
    text: "Last week",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      return [start, end];
    }
  },
  {
    text: "Last month",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      return [start, end];
    }
  },
  {
    text: "Last 3 months",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
      return [start, end];
    }
  }
];
onMounted(() => {
  const text = `${data.value.term[0].slice(5)}~${data.value.term[1].slice(5)}`;
  saleLabel.value = `销量(${text}):`;
  shortcuts.push({
    text: text,
    value: () => {
      return data.value.term;
    }
  });
});
</script>
