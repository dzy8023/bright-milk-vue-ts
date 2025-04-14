<script setup lang="ts">
import ReCopy from "@/components/ReCopy";
import type { SseNotification } from "@/types/sseMessage";
import { PropType, ref } from "vue";
import {
  orderStatus,
  orderPostType,
  verifyStatusMap
} from "@/enums/baseConstant";
import Consign from "@iconify-icons/ep/van";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { useSseStore } from "@/store/bm/sse";
const props = defineProps({
  noticeItem: {
    type: Object as PropType<SseNotification>,
    default: () => {}
  }
});
const orderSn = ref(props.noticeItem.content.orderSn);
const emits = defineEmits(["consign"]);
const sseStore = useSseStore();
const handleConsign = (item: SseNotification) => {
  sseStore.handleConsign(item);
};
</script>

<template>
  <div class="order-consign-info">
    <div class="order-consign-info-title">
      <span>订单发货</span>
      <!-- 金额信息 -->
      <el-card shadow="hover">
        <template #header>订单信息</template>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="订单号">
            <re-copy :value="orderSn" />
          </el-descriptions-item>
          <el-descriptions-item label="订单状态">
            <el-tag type="success">{{
              orderStatus[noticeItem.content.status - 1].label
            }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">{{
            noticeItem.content.createTime
          }}</el-descriptions-item>
          <el-descriptions-item label="更新时间">{{
            noticeItem.content.updateTime
          }}</el-descriptions-item>
          <el-descriptions-item label="配送方式">
            {{ orderPostType[noticeItem.content.postType - 1].label }}
          </el-descriptions-item>
          <el-descriptions-item label="商品总价"
            >¥{{ noticeItem.content.totalAmount }}</el-descriptions-item
          >
          <el-descriptions-item label="优惠金额"
            >-¥{{ noticeItem.content.discountAmount }}</el-descriptions-item
          >
          <el-descriptions-item label="运费"
            >¥{{ noticeItem.content.postFee }}</el-descriptions-item
          >
          <el-descriptions-item label="应付金额">
            <span class="text-red-600 font-semibold"
              >¥{{ noticeItem.content.payAmount }}</span
            >
          </el-descriptions-item>
        </el-descriptions>
      </el-card>
    </div>
    <el-button
      v-if="verifyStatusMap['consign'].has(noticeItem.content.status)"
      link
      type="primary"
      :icon="useRenderIcon(Consign)"
      @click="handleConsign(noticeItem)"
    >
      发货
    </el-button>
  </div>
</template>
