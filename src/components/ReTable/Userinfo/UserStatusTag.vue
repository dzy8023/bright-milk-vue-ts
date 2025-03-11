<script lang="ts" setup>
defineProps({
  status: {
    type: Boolean
  }
});
</script>

<template>
  <el-tag v-show="!status" effect="dark" size="large" type="success">{{
    $t("status.enable")
  }}</el-tag>
  <el-tag v-show="status" effect="dark" size="large" type="danger">{{
    $t("status.disable")
  }}</el-tag>
</template>
