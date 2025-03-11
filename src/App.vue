<template>
  <el-config-provider :locale="currentLocale">
    <router-view />
    <ReDialog />
  </el-config-provider>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { ElConfigProvider } from "element-plus";
import { ReDialog } from "@/components/ReDialog";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import plusZhCn from "plus-pro-components/es/locale/lang/zh-cn";

export default defineComponent({
  name: "app",
  components: {
    [ElConfigProvider.name]: ElConfigProvider,
    ReDialog
  },
  computed: {
    currentLocale() {
      return { ...zhCn, ...plusZhCn };
    }
  }
});
</script>
<style>
/* 定义滚动条高宽及背景高宽分别对应横竖滚动条的尺寸 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
  background-color: var(--el-text-color-secondary);
}

/* 定义滚动条轨道内阴影+圆角 */
::-webkit-scrollbar-track {
  background-color: #ebecef;
  border-radius: 5px;
  box-shadow: inset 0 0 6px #ebecef;
}

/* 定义滑块内阴影+圆角 */
::-webkit-scrollbar-thumb {
  background-color: #d0d2d6;
  border-radius: 5px;
  box-shadow: inset 0 0 6px #d0d2d6;
}
</style>
