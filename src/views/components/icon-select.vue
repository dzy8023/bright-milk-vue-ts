<script setup lang="ts">
import { ref } from "vue";
import { IconSelect } from "@/components/ReIcon";
import ReCopy from "@/components/ReCopy";

defineOptions({
  name: "IconSelect"
});

const icon = ref("ep:add-location");
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <div class="card-header">
        <span class="font-medium">图标选择器</span>
      </div>
      <el-link
        class="mt-2"
        href="https://github.com/pure-admin/vue-pure-admin/blob/main/src/views/components/icon-select.vue"
        target="_blank"
      >
        代码位置 src/views/components/icon-select.vue
      </el-link>
    </template>
    <IconSelect v-model="icon" class="w-[200px]" />
    <ReCopy
      v-tippy="{
        content: '在线图标，IconifyIconOnline'
      }"
      :value="icon"
    />
    <br />
    <ReCopy
      v-tippy="{
        content: '离线图标，IconifyIconOnline'
      }"
      :value="icon.replace(':', '/')"
    />
  </el-card>
</template>
