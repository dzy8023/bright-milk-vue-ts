<script setup lang="ts">
import Copy from "@iconify-icons/ep/document-copy";

defineOptions({
  name: "ReCopy"
});
defineProps({
  value: {
    type: String,
    required: true
  },
  icon: {
    type: Boolean,
    default: false
  }
});
</script>

<template>
  <IconifyIconOffline
    v-if="icon"
    v-copy:click="value"
    class="hover:cursor-pointer hover:text-sky-500"
    :icon="Copy"
  />
  <span
    v-else
    v-copy:click="value"
    class="text-sky-500 underline decoration-text_color_regular decoration-dashed underline-offset-2 hover:cursor-pointer"
  >
    {{ value }}
  </span>
</template>
