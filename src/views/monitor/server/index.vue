<script lang="ts" setup>
import SystemInfo from "@/views/monitor/server/component/system-info.vue";
import { svg } from "@/views/monitor/server/utils/columns";
import { info, loading } from "@/views/monitor/server/utils/hooks";
import SystemServer from "@/views/monitor/server/component/system-server.vue";
import SystemCpu from "@/views/monitor/server/component/system-cpu.vue";
import SystemJvmCpu from "@/views/monitor/server/component/system-jvm-cpu.vue";
</script>

<template>
  <div
    v-loading="loading"
    :element-loading-svg="svg"
    element-loading-svg-view-box="-10, -10, 50, 50"
  >
    <el-row :gutter="16">
      <system-info v-if="info" />
      <system-server />
    </el-row>

    <!-- CPU 信息-->
    <el-row :gutter="16">
      <system-cpu />
      <system-jvm-cpu />
    </el-row>
  </div>
</template>
