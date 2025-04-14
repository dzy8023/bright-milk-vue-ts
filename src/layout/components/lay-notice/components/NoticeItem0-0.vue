<script setup lang="ts">
import type { SseNotification } from "@/types/sseMessage";
import { ref, PropType, nextTick, h } from "vue";
import { useNav } from "@/layout/hooks/useNav";
import { deviceDetection } from "@pureadmin/utils";
import { SseNotificationType } from "@/enums/baseConstant";
import { addDialog } from "@/components/ReDialog";
import DataExportInfo from "./DataExportInfo.vue";
import OrderConsignInfo from "./OrderConsignInfo.vue";

defineProps({
  noticeItem: {
    type: Object as PropType<SseNotification>,
    default: () => {}
  }
});

const titleRef = ref(null);
const titleTooltip = ref(false);
const descriptionRef = ref(null);
const descriptionTooltip = ref(false);
const { tooltipEffect } = useNav();
const isMobile = deviceDetection();

function hoverTitle() {
  nextTick(() => {
    titleRef.value?.scrollWidth > titleRef.value?.clientWidth
      ? (titleTooltip.value = true)
      : (titleTooltip.value = false);
  });
}
function getType(item: SseNotification) {
  if (!item.content.status) {
    return 0;
  } else if (item.content.present == 100) {
    return 1;
  } else {
    return 2;
  }
}

function hoverDescription(event, description) {
  // currentWidth 为文本在页面中所占的宽度，创建标签，加入到页面，获取currentWidth ,最后在移除
  const tempTag = document.createElement("span");
  tempTag.innerText = description;
  tempTag.className = "getDescriptionWidth";
  document.querySelector("body").appendChild(tempTag);
  const currentWidth = (
    document.querySelector(".getDescriptionWidth") as HTMLSpanElement
  ).offsetWidth;
  document.querySelector(".getDescriptionWidth").remove();

  // cellWidth为容器的宽度
  const cellWidth = event.target.offsetWidth;

  // 当文本宽度大于容器宽度两倍时，代表文本显示超过两行
  currentWidth > 2 * cellWidth
    ? (descriptionTooltip.value = true)
    : (descriptionTooltip.value = false);
}
const openDialog = (item: SseNotification, component: any) => {
  addDialog({
    title: `${item.title}`,
    width: "46%",
    draggable: true,
    fullscreen: deviceDetection(),
    fullscreenIcon: true,
    closeOnClickModal: true,
    contentRenderer: () => h(component, { noticeItem: item })
  });
};
function handleClick(item: SseNotification) {
  switch (item.childType) {
    case SseNotificationType.DATA_EXPORT:
      if (item.content.status) {
        openDialog(item, DataExportInfo);
      }
      break;
    case SseNotificationType.ORDER_CONSIGN:
      console.log(item.content);
      openDialog(item, OrderConsignInfo);
      break;
    default:
      break;
  }
}
</script>

<template>
  <div
    class="notice-container border-b-[1px] border-solid border-[#f0f0f0] dark:border-[#303030]"
  >
    <el-avatar
      v-if="noticeItem.avatar"
      :size="30"
      :src="noticeItem.avatar"
      class="notice-container-avatar"
    />
    <div class="notice-container-text">
      <div class="notice-text-title text-[#000000d9] dark:text-white">
        <el-tooltip
          popper-class="notice-title-popper"
          :effect="tooltipEffect"
          :disabled="!titleTooltip"
          :content="noticeItem.title"
          placement="top-start"
          :enterable="!isMobile"
        >
          <div
            ref="titleRef"
            class="notice-title-content"
            @mouseover="hoverTitle"
          >
            {{ noticeItem.title }}
          </div>
        </el-tooltip>
        <el-tag
          v-if="noticeItem?.status !== null"
          :type="
            getType(noticeItem) === 0
              ? 'primary'
              : getType(noticeItem) === 1
                ? 'success'
                : 'danger'
          "
          size="small"
          class="notice-title-extra"
        >
          {{
            getType(noticeItem) === 0
              ? "进行中"
              : getType(noticeItem) === 1
                ? "已完成"
                : "失败"
          }}
        </el-tag>
      </div>

      <el-tooltip
        popper-class="notice-title-popper"
        :effect="tooltipEffect"
        :disabled="!descriptionTooltip"
        :content="noticeItem.summary"
        placement="top-start"
      >
        <div
          ref="descriptionRef"
          :class="[
            'notice-text-description',
            noticeItem.content.status ? 'completed' : ''
          ]"
          @mouseover="hoverDescription($event, noticeItem.summary)"
          @click="handleClick(noticeItem)"
        >
          {{ noticeItem.summary }}
        </div>
      </el-tooltip>
      <el-progress
        v-if="noticeItem.content.present"
        :percentage="noticeItem.content.present"
      />
      <div class="notice-text-datetime text-[#00000073] dark:text-white">
        {{ noticeItem.createdTime }}
      </div>
    </div>
  </div>
</template>

<style>
.notice-title-popper {
  max-width: 238px;
}
</style>
<style scoped lang="scss">
.notice-container {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 12px 0;

  // border-bottom: 1px solid #f0f0f0;

  .notice-container-avatar {
    margin-right: 16px;
    background: #fff;
  }

  .notice-container-text {
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: space-between;

    .notice-text-title {
      display: flex;
      margin-bottom: 8px;
      font-size: 14px;
      font-weight: 400;
      line-height: 1.5715;
      cursor: pointer;

      .notice-title-content {
        flex: 1;
        width: 200px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .notice-title-extra {
        float: right;
        margin-top: -1.5px;
        font-weight: 400;
      }
    }

    .notice-text-description,
    .notice-text-datetime {
      font-size: 12px;
      line-height: 1.5715;
    }

    .notice-text-description {
      display: -webkit-box;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .notice-text-description.completed:hover {
      color: blue;
      cursor: pointer; /* 可选：让鼠标显示为指针，提高交互感 */
    }

    .notice-text-datetime {
      margin-top: 4px;
    }
  }
}
</style>
