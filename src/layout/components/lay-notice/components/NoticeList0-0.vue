<script setup lang="ts">
import { PropType } from "vue";
import type { SseNotification } from "@/types/sseMessage";
import NoticeItem00 from "./NoticeItem0-0.vue";
import ReSwiperItem from "@/components/ReSwiperItem/index.vue";

defineProps({
  list: {
    type: Array as PropType<Array<SseNotification>>,
    default: () => []
  },
  emptyText: {
    type: String,
    default: ""
  }
});
const emits = defineEmits(["delete"]);
const handleDelete = (item: SseNotification, index: number) => {
  emits("delete", item, index);
};
</script>

<template>
  <div v-if="list.length">
    <ReSwiperItem
      v-for="(item, index) in list"
      :key="index"
      @delete="handleDelete(item, index)"
    >
      <NoticeItem00 :noticeItem="item" />
    </ReSwiperItem>
  </div>
  <el-empty v-else :description="emptyText" />
</template>
