<template>
  <el-table :data="orderData" style="width: 100%">
    <el-table-column
      v-for="(column, index) in columns"
      :key="index"
      :prop="column.prop"
      :label="column.label"
      :width="column.width"
    >
      <!-- <template v-if="column.slot" #default="{ row }">
                <template v-if="column.slot === 'status'">
                    {{ statusSlot(row) }}
                </template>
                <template v-else-if="column.slot === 'action'">
                    {{ actionSlot(row) }}
                </template>
            </template> -->
    </el-table-column>
    <template #empty>
      <el-empty description="没有数据" />
    </template>
  </el-table>
</template>

<script setup>
import { ref } from "vue"; // 导入 h 函数

const props = defineProps({
  orderData: {
    type: Array,
    default: () => []
  }
});

// 定义列配置
const columns = ref([
  { prop: "orderId", label: "订单号" },
  { prop: "phone", label: "电话号码" },
  { prop: "createTime", label: "创建时间" },
  { label: "订单状态", slot: "status" }, // 使用 statusSlot
  { prop: "actualPayment", label: "实付金额" },
  { label: "操作", slot: "action", actionName: ["查看"], width: "100" } // 使用 actionSlot
]);

// 处理订单信息的插槽
// const statusSlot = (row) => {
//     return h('span', {}, row.status); // 使用 h 函数
// };

// 处理操作的插槽
// const actionSlot = (row) => {
//     return (

//     );
// };

// 处理订单信息
const handleOrderInfo = row => {
  console.log(row);
};
</script>
