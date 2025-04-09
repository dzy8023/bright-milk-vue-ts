<template>
  <div class="max-w-6xl mx-auto p-6 space-y-6">
    <!-- 订单信息 -->
    <el-card shadow="hover">
      <template #header>订单信息</template>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="订单号">
          <re-copy :value="orderInfo.orderSn" />
        </el-descriptions-item>
        <el-descriptions-item label="订单状态">
          <el-tag type="success">{{
            orderStatus[orderInfo.status - 1].label
          }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="创建用户">
          {{ orderInfo.username }}</el-descriptions-item
        >
        <el-descriptions-item label="电话">
          <re-copy :value="orderInfo.phone" />
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">{{
          orderInfo.createTime
        }}</el-descriptions-item>
        <el-descriptions-item label="更新时间">{{
          orderInfo.updateTime
        }}</el-descriptions-item>
        <el-descriptions-item label="配送方式">
          {{ orderPostType[orderInfo.postType - 1].label }}
        </el-descriptions-item>
        <el-descriptions-item label="订单来源">
          {{ orderSourceType[orderInfo.sourceType - 1].label }}
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <!-- 收货信息 -->
    <el-card v-if="orderInfo.userAddress" shadow="hover">
      <template #header>收货信息</template>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="收货人">{{
          orderInfo.userAddress.name
        }}</el-descriptions-item>
        <el-descriptions-item label="联系电话">{{
          orderInfo.userAddress.phone
        }}</el-descriptions-item>
        <el-descriptions-item label="地址">{{
          orderInfo.userAddress.address
        }}</el-descriptions-item>
      </el-descriptions>
    </el-card>
    <!-- 金额信息 -->
    <el-card shadow="hover">
      <template #header>金额信息</template>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="商品总价"
          >¥{{ orderInfo.totalAmount }}</el-descriptions-item
        >
        <el-descriptions-item label="优惠金额"
          >-¥{{ orderInfo.discountAmount }}</el-descriptions-item
        >
        <el-descriptions-item label="运费"
          >¥{{ orderInfo.postFee }}</el-descriptions-item
        >
        <el-descriptions-item label="应付金额">
          <span class="text-red-600 font-semibold"
            >¥{{ orderInfo.payAmount }}</span
          >
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
    <!-- 商品列表 -->
    <el-card shadow="hover">
      <template #header>商品列表</template>
      <pure-table
        row-key="id"
        adaptive
        :data="orderInfo.skus"
        :columns="skuColumns"
      >
        <template #empty>暂无数据</template>
        <template #id="{ row }">
          <re-copy :value="row.id" />
        </template>
        <template #name="{ row }">
          {{ row.name }}
        </template>
        <template #image="{ row }">
          <img :src="row.image" :alt="row.name" class="w-20 h-20" />
        </template>
      </pure-table>
    </el-card>
  </div>
</template>
<script lang="ts" setup>
import {
  orderStatus,
  orderSourceType,
  orderPostType,
  verifyStatusMap
} from "@/enums/baseConstant";
import noImg from "@/components/ReImage/noImg.vue";
import ReCopy from "@/components/ReCopy";
import { OrderDetail } from "../utils/types";
import { skuColumns } from "../utils/columns";
import { PropType } from "vue";
const props = defineProps({
  orderInfo: {
    type: Object as PropType<OrderDetail>
  }
});
console.log(props.orderInfo);

defineEmits(["close"]);
</script>

<style scoped>
.text-red-600 {
  color: #dc2626;
}
</style>
