<script setup lang="ts">
import Upload from "@/components/ReUpload/src/upload.vue";
defineOptions({
  name: "SkuTab"
});
defineProps({
  tableData: Array as PropType<Array<any>>,
  columns: Array as PropType<TableColumnList> // 明确指定 columns 的类型
});
</script>

<template>
  <pure-table
    row-key="id"
    align-whole="center"
    table-layout="auto"
    :data="tableData"
    :columns="columns"
    border
  >
    <template #expand="{ row }">
      <div class="ml-16">
        <h3 class="mb-2">商品名称: {{ row.spuName }}</h3>
        <p class="mb-4">
          商品分类: {{ row.category.map(item => item.name).join("/") }}
        </p>
        <p class="mb-2">商品图片:<Upload v-model:model-value="row.image" /></p>
        <p class="mb-2">
          商品描述:
          <br />
          <el-input
            v-model="row.desc"
            style="width: 240px"
            :autosize="{ minRows: 2, maxRows: 4 }"
            maxlength="128"
            type="textarea"
            show-word-limit
            placeholder="请输入sku描述，最多128字"
          />
        </p>
      </div>
    </template>
    <template #name="{ row }">
      <div class="m-4">
        <el-input v-model="row.name" placeholder="sku名称" />
      </div>
    </template>
    <template #price="{ row }">
      <div class="m-4">
        <el-input-number
          v-model="row.price"
          :min="0"
          :step="0.01"
          :precision="2"
          placeholder="请输入sku价格"
        />
      </div>
    </template>
  </pure-table>
</template>
