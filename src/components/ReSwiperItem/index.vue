<template>
  <div
    ref="itemRoot"
    class="swipe-item"
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
    @mousedown="onMouseDown"
    @mousemove="onMouseMove"
    @mouseup="onMouseUp"
    @mouseleave="onMouseUp"
  >
    <div
      class="swipe-content"
      :style="{ transform: `translateX(${translateX}px)` }"
    >
      <slot />
    </div>
    <div class="swipe-actions">
      <button class="delete-btn" @click="($emit('delete'), (translateX = 0))">
        删除
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted, onMounted, onBeforeUnmount } from "vue";

const itemRoot = ref<HTMLElement | null>(null); // 用于判断点击是否在当前组件内

function onClickOutside(e: MouseEvent) {
  if (itemRoot.value && !itemRoot.value.contains(e.target as Node)) {
    // 点击在外部，收起滑动项
    translateX.value = 0;
    openItemRef.value = null;
  }
}

onMounted(() => {
  document.addEventListener("click", onClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", onClickOutside);
});

// 控制所有 SwipeItem 的唯一展开项
const openItemRef = ref<HTMLElement | null>(null);
const itemRef = ref<HTMLElement | null>(null);

const translateX = ref(0);
let startX = 0;
let dragging = false;
const maxTranslate = -80;

function closeOtherItems() {
  if (openItemRef.value && openItemRef.value !== itemRef.value) {
    openItemRef.value.style.transform = "translateX(0px)";
    openItemRef.value = null;
  }
}

function disableScroll(e: TouchEvent) {
  e.preventDefault();
}

function onTouchStart(e: TouchEvent) {
  closeOtherItems();
  startX = e.touches[0].clientX;
  dragging = true;
  document.body.addEventListener("touchmove", disableScroll, {
    passive: false
  });
}

function onTouchMove(e: TouchEvent) {
  if (!dragging) return;
  const deltaX = e.touches[0].clientX - startX;
  translateX.value = Math.min(0, Math.max(maxTranslate, deltaX));
}

function onTouchEnd() {
  dragging = false;
  document.body.removeEventListener("touchmove", disableScroll);
  if (translateX.value < maxTranslate / 2) {
    translateX.value = maxTranslate;
    openItemRef.value = itemRef.value!;
  } else {
    translateX.value = 0;
    openItemRef.value = null;
  }
}

// 鼠标支持
function onMouseDown(e: MouseEvent) {
  closeOtherItems();
  startX = e.clientX;
  dragging = true;
}

function onMouseMove(e: MouseEvent) {
  if (!dragging) return;
  const deltaX = e.clientX - startX;
  translateX.value = Math.min(0, Math.max(maxTranslate, deltaX));
}

function onMouseUp() {
  if (!dragging) return;
  dragging = false;
  if (translateX.value < maxTranslate / 2) {
    translateX.value = maxTranslate;
    openItemRef.value = itemRef.value!;
  } else {
    translateX.value = 0;
    openItemRef.value = null;
  }
}

onMounted(() => {
  if (itemRef.value) {
    itemRef.value.style.transition = "transform 0.2s ease";
  }
});

onUnmounted(() => {
  document.body.removeEventListener("touchmove", disableScroll);
});
</script>

<style scoped lang="scss">
.swipe-item {
  position: relative;
  overflow: hidden;
  user-select: none;

  .swipe-content {
    position: relative;
    z-index: 1;
    background-color: #fff;
  }

  .swipe-actions {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 80px;
    height: 100%;
    background-color: red;
  }

  .delete-btn {
    padding: 8px 12px;
    font-size: 14px;
    color: #fff;
    cursor: pointer;
    background: red;
    border: none;
    border-radius: 4px;
  }
}
</style>
