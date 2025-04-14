<script setup lang="ts">
import type { SseNotification } from "@/types/sseMessage";
import { PropType } from "vue";

defineProps({
  noticeItem: {
    type: Object as PropType<SseNotification>,
    default: () => {}
  }
});
//耗时
const elapsedTime = (noticeItem: SseNotification) => {
  const startTime = new Date(noticeItem.content.startTime);
  const endTime = new Date(noticeItem.content.endTime);
  const elapsedTime = (endTime.getTime() - startTime.getTime()) / 1000;
  return elapsedTime.toFixed(2);
};
</script>

<template>
  <div class="data-export-info">
    <div class="data-export-info-title">{{ noticeItem.title }}</div>
    <div class="data-export-info-content">
      <div class="data-export-info-content-result">
        <div class="data-export-info-content-result">
          导出结果：
          <a
            v-if="noticeItem.content.present === 100"
            v-tippy="{ content: '点击下载' }"
            class="cursor-pointer hover:text-sky-500"
            :href="noticeItem.content.result"
            target="_blank"
          >
            {{ noticeItem.content.result }}
          </a>
          <span v-else class="text-gray-500">{{
            noticeItem.content.result
          }}</span>
        </div>
        <div class="data-export-info-content-time">
          开始时间：{{ noticeItem.content.startTime }}
        </div>
        <div class="data-export-info-content-time">
          结束时间：{{ noticeItem.content.endTime }}
        </div>
        <div class="data-export-info-content-time">
          耗时：{{ elapsedTime(noticeItem) }}s
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.data-export-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 20px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 0 10px rgb(0 0 0 / 10%);
}

.data-export-info-title {
  margin-bottom: 10px;
  font-size: 18px;
  font-weight: bold;
}

.data-export-info-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.data-export-info-content-result {
  margin-bottom: 10px;
  font-size: 16px;
}

.data-export-info-content-time {
  margin-bottom: 10px;
  font-size: 14px;
}
</style>
