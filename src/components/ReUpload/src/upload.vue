<template>
  <div
    class="upload-container"
    @mouseenter="showOverlay = true"
    @mouseleave="showOverlay = false"
  >
    <input
      ref="fileRef"
      type="file"
      accept="image/*"
      style="display: none"
      @change="handleFileChange"
    />
    <div v-if="!imageUrl" class="upload-placeholder" @click="triggerUpload">
      <span class="icon-plus">+</span>
    </div>
    <div v-else class="image-wrapper">
      <img :src="imageUrl" class="uploaded-image" @load="handleImageLoad" />
      <div v-if="showOverlay && !loading" class="overlay">
        <button class="overlay-button" @click.stop="triggerUpload">
          重新选择
        </button>
        <button class="overlay-button" @click.stop="removeImage">
          删除图片
        </button>
      </div>
    </div>
    <div v-if="loading" class="progress-bar">
      <div class="progress" :style="{ width: progress + '%' }" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ElMessage } from "element-plus";
import { computed, onMounted, ref } from "vue";

const props = defineProps({
  modelValue: {
    type: String,
    required: true
  }
});

const emits = defineEmits(["update:modelValue", "upload"]);
const imageUrl = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emits("update:modelValue", val);
  }
});
const fileRef = ref<HTMLInputElement>();
const showOverlay = ref<boolean>(false);
const loading = ref<boolean>(false);
const progress = ref<number>(0);
const reader = new FileReader();
let loadingTimer: ReturnType<typeof setInterval> | null = null;
let delay = 2000;

const triggerUpload = () => {
  fileRef.value?.click();
};
const startLoading = () => {
  if (loadingTimer) {
    clearInterval(loadingTimer);
  }
  loadingTimer = setInterval(
    () => {
      if (progress.value < 100) {
        progress.value += 10;
      } else {
        clearInterval(loadingTimer);
      }
    },
    (delay * 10 * Math.random()) / (100 - progress.value)
  );
};

const handleFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file && file.type.startsWith("image/")) {
    loading.value = true;
    progress.value = 0;
    startLoading();
    //上传文件
    emits("upload", file);
    loading.value = false;
    reader.readAsDataURL(file);
  } else {
    ElMessage.error("请上传图片格式的文件");
  }
};
const handleImageLoad = () => {
  loading.value = false;
};
const removeImage = () => {
  imageUrl.value = "";
  emits("update:modelValue", "");
};
onMounted(() => {
  reader.onloadstart = () => {
    loading.value = true;
    progress.value = 0;
  };
  reader.onload = e => {
    setTimeout(() => {
      clearInterval(loadingTimer);
      progress.value = 100;
      emits("update:modelValue", e.target?.result as string);
    }, delay);
  };
});
</script>

<style scoped>
.upload-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 150px;
  height: 150px;
  overflow: hidden;
  cursor: pointer;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  transition: border-color 0.3s ease;
}

.upload-container:hover {
  border-color: #409eff;
}

.upload-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: 28px;
  color: #8c939d;
}

.image-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.uploaded-image {
  width: 100%;
  height: 100%;
  object-fit: fill;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: rgb(0 0 0 / 50%);
}

.overlay-button {
  margin: 5px 0;
  font-size: 16px;
  color: white;
  cursor: pointer;
  background: transparent;
  border: 1px, dashed, white;
}

.overlay-button:hover {
  color: #ffc200;
  border-color: #ffc200;
}

.progress-bar {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 80%;
  height: 10px;
  background-color: rgb(255 255 255 / 50%);
  border-radius: 5px;
  transform: translate(-50%, -50%);
}

.progress {
  height: 100%;
  background-color: #409eff;
  border-radius: 5px;
  transition: width 0.3s ease;
}
</style>
