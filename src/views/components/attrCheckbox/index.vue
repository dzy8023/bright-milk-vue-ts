<template>
  <el-card>
    <attr-checkbox
      ref="attrCheckboxRef"
      v-model="data"
      v-on:submit="handleSubmit"
    />
    <el-button type="success" @click="attrCheckboxRef.submit(extandData)"
      >下一步：设置SKU信息</el-button
    >
    <el-divider />
    <pure-table
      row-key="id"
      :data="tableData"
      :columns="columns"
      align-whole="center"
      table-layout="auto"
      border
      lazy
    >
      <template #expand="{ row }">
        <div class="m-4">
          <el-input v-model="row.name" placeholder="sku名称" />
          <p class="mb-2">State: {{ row.state }}</p>
          <p class="mb-2">City: {{ row.city }}</p>
          <p class="mb-2">Address: {{ row.address }}</p>
          <p class="mb-4">Zip: {{ row.zip }}</p>
          <h3>Family</h3>
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
            :precision="2"
            :step="1"
            placeholder="Price"
          />
        </div>
      </template>
    </pure-table>
  </el-card>
</template>

<script lang="ts" setup>
const extandData = {
  state: "California",
  city: "Los Angeles",
  "post-code": "CA 90036"
};
import { ref } from "vue";
import attrCheckbox from "./utils/attr-checkbox.vue";
import { useColumns } from "./utils/hook";
defineOptions({
  name: "AttrCheckbox"
});
const { attrCheckboxRef, columns, tableData, handleSubmit } = useColumns();
const data = ref({});
</script>
