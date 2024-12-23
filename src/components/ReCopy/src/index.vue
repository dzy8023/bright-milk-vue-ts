<script setup lang="ts">
import Copy from "@iconify-icons/ep/document-copy";
import { ref } from "vue";

defineOptions({
  name: "ReCopy"
});
const props = defineProps({
  value: {
    type: String,
    required: true
  },
  icon: {
    type: Boolean,
    default: false
  }
});
const modelValue = ref(props.value);
</script>

<template>
  <IconifyIconOffline
    v-if="icon"
    v-copy:click="modelValue"
    class="hover:cursor-pointer hover:text-sky-500"
    :icon="Copy"
  />
  <span
    v-else
    v-copy:click="modelValue"
    class="text-sky-500 underline decoration-text_color_regular decoration-dashed underline-offset-2 hover:cursor-pointer"
  >
    {{ value }}
  </span>
</template>
