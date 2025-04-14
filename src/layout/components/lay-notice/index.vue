<script setup lang="ts">
import { ref, computed } from "vue";
import NoticeList from "./components/NoticeList.vue";
import NoticeList00 from "./components/NoticeList0-0.vue";
import { SseEntityType } from "@/enums/baseConstant";

import BellIcon from "@iconify-icons/ep/bell";
import { useSseStore } from "@/store/bm/sse";
//使用sse
const sseStore = useSseStore();
const noticesNum = computed(() => {
  return sseStore.noticesData.reduce((acc, cur) => {
    return acc + cur.list.length;
  }, 0);
});
const notices = ref(sseStore.noticesData);
const activeKey = ref(sseStore.noticesData[0]?.key);

const getLabel = computed(
  () => item =>
    item.name + (item.list.length > 0 ? `(${item.list.length})` : "")
);

if (!sseStore.sseConnection) {
  sseStore.initSSE();
}
const toggleSSEConnection = () => {
  if (!sseStore.sseConnection) {
    sseStore.initSSE();
  }
};
const handleDelete = (item: any, index: number) => {
  sseStore.noticesData[item.type].list.splice(index, 1);
};
const handleDeleteAll = (index: number) => {
  sseStore.noticesData[index].list = [];
};
</script>

<template>
  <el-dropdown trigger="click" placement="bottom-end">
    <span
      :class="[
        'dropdown-badge',
        'navbar-bg-hover',
        'select-none',
        Number(noticesNum) !== 0 && 'mr-[10px]'
      ]"
      @click="toggleSSEConnection"
    >
      <el-badge :value="Number(noticesNum) === 0 ? '' : noticesNum" :max="99">
        <span class="header-notice-icon">
          <IconifyIconOffline :icon="BellIcon" />
        </span>
      </el-badge>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-tabs
          v-model="activeKey"
          :stretch="true"
          class="dropdown-tabs"
          :style="{ width: notices.length === 0 ? '200px' : '330px' }"
        >
          <el-empty
            v-if="notices.length === 0"
            description="暂无消息"
            :image-size="60"
          />
          <span v-else>
            <template v-for="(item, index) in notices" :key="item.key">
              <el-tab-pane :label="getLabel(item)" :name="`${item.key}`">
                <el-scrollbar max-height="330px">
                  <div class="noticeList-container">
                    <div
                      v-if="item.list.length > 0"
                      v-motion-fade
                      class="bg-[var(--el-fill-color-light)] w-full h-[30px] mb-2 pl-4 flex items-center justify-end"
                    >
                      <el-button
                        class="mr-2"
                        type="danger"
                        link
                        size="small"
                        text
                        @click="handleDeleteAll(index)"
                      >
                        全部删除
                      </el-button>
                    </div>
                    <Component
                      :is="
                        item.type === SseEntityType.NOTIFICATION
                          ? NoticeList00
                          : NoticeList
                      "
                      :list="item.list"
                      :emptyText="item.emptyText"
                      @delete="handleDelete"
                    />
                  </div>
                </el-scrollbar>
              </el-tab-pane>
            </template>
          </span>
        </el-tabs>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style lang="scss" scoped>
.dropdown-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 48px;
  cursor: pointer;

  .header-notice-icon {
    font-size: 18px;
  }
}

.dropdown-tabs {
  .noticeList-container {
    padding: 15px 24px 0;
  }

  :deep(.el-tabs__header) {
    margin: 0;
  }

  :deep(.el-tabs__nav-wrap)::after {
    height: 1px;
  }

  :deep(.el-tabs__nav-wrap) {
    padding: 0 36px;
  }
}
</style>
