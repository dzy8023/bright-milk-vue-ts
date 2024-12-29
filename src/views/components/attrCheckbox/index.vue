<template>
  <el-card>
    <attr-checkbox v-model="data" />
  </el-card>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import attrCheckbox from "./utils/attr-checkbox.vue";
defineOptions({
  name: "AttrCheckbox"
});

const data = ref({});
</script>
