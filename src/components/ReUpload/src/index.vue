<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import {
  genFileId,
  UploadUserFile,
  type UploadFile,
  type UploadInstance,
  type UploadProps,
  type UploadRawFile
} from "element-plus";
import UploadIcon from "@iconify-icons/ri/upload-2-line";
import { Delete, Download, ZoomIn } from "@element-plus/icons-vue";
import noImg from "@/components/ReImage/noImg.vue";
defineOptions({
  name: "ReUpload"
});
const props = defineProps({
  modelValue: {
    type: Array as PropType<UploadUserFile[]>,
    default: () => []
  },
  action: {
    type: String, // 使用 UploadUserFile 类型
    default: "#"
  },
  //多选文件
  multiple: {
    type: Boolean,
    default: false
  },
  limit: {
    type: Number,
    default: 1
  }
});
const fileList = computed({
  get() {
    return props.modelValue; // 返回 props.modelValue
  },
  set(value) {
    // 确保 value 是一个数组，并且每个 item 都有 url 属性
    if (Array.isArray(value)) {
      emits("update:modelValue", value); // 触发 update:modelValue 事件
    } else {
      console.error("value is not an array");
    }
  }
});

const uploadRef = ref<UploadInstance>();
const dialogImageUrl = ref("");
const dialogVisible = ref(false);
const disabled = ref(false);
const handleRemove = (file: UploadFile) => {
  const newFileList = props.modelValue.filter(
    (item: UploadFile) => item.uid !== file.uid
  );
  emits("update:modelValue", newFileList); // 触发update:modelValue事件
};
const handlePictureCardPreview = (file: UploadFile) => {
  reader.onload = e => {
    dialogImageUrl.value = e.target.result as string;
  };
  reader.readAsDataURL(file.raw);
  dialogVisible.value = true;
};
const reader = new FileReader();
const handleDownload = (file: UploadFile) => {
  console.log(file);
};

const handleExceed: UploadProps["onExceed"] = files => {
  uploadRef.value!.clearFiles();
  const file = files[0] as UploadRawFile;
  file.uid = genFileId();
  uploadRef.value!.handleStart(file);
};
const emits = defineEmits(["update:modelValue", "close"]); // 触发update:modelValue事件
const reset = () => {
  fileList.value = [];
  uploadRef.value!.clearFiles();
  emits("update:modelValue", []);
  dialogImageUrl.value = "";
  dialogVisible.value = false;
};
const getFiles = () => {
  return fileList.value;
};
// 初始化图片数据
const initImageData = (files: UploadUserFile[]) => {
  if (!files?.length) return;
  files.forEach(file => {
    if (file.raw && file.url.startsWith("blob:")) {
      const reader = new FileReader();
      reader.onload = e => {
        file.url = e.target?.result as string;
      };
      reader.readAsDataURL(file.raw);
    }
  });
};

// 组件挂载时初始化
onMounted(() => {
  if (props.modelValue?.length) {
    initImageData(props.modelValue);
  }
});
defineExpose({
  reset,
  getFiles,
  initImageData
});
</script>

<template>
  <el-upload
    ref="uploadRef"
    v-model:file-list="fileList"
    drag
    list-type="picture-card"
    accept=".jpg,.jpeg,.png,.gif"
    :multiple="multiple"
    :action="action"
    :limit="limit"
    :on-exceed="handleExceed"
    :auto-upload="false"
  >
    <div
      v-tippy="{ content: `最多只能上传${limit}张图片` }"
      class="el-upload__text"
    >
      <IconifyIconOffline :icon="UploadIcon" width="26" class="m-auto mb-2" />
      可点击或拖拽上传
    </div>
    <template #file="{ file }">
      <div>
        <noImg :name="file.name" :url="file.url" />

        <span class="el-upload-list__item-actions">
          <span
            v-if="!disabled"
            class="el-upload-list__item-preview"
            @click="handlePictureCardPreview(file)"
          >
            <el-icon><zoom-in /></el-icon>
          </span>
          <span
            v-if="!disabled"
            class="el-upload-list__item-delete"
            @click="handleDownload(file)"
          >
            <el-icon><Download /></el-icon>
          </span>
          <span
            v-if="!disabled"
            class="el-upload-list__item-delete"
            @click="handleRemove(file)"
          >
            <el-icon><Delete /></el-icon>
          </span>
        </span>
      </div>
    </template>
  </el-upload>

  <el-dialog v-model="dialogVisible">
    <img w-full :src="dialogImageUrl" alt="Preview Image" />
  </el-dialog>
</template>
