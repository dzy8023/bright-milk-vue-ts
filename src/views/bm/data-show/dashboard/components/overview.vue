<template>
  <div class="data-grid data-item-grid">
    <div
      v-for="(item, index) in todayData"
      :key="index"
      class="up-down-data-card"
    >
      <div class="data-title">{{ item.title }}</div>
      <div class="data-value">{{ item.value }}</div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  todayData: Array
});
</script>
