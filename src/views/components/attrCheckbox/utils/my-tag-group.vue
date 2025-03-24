<template>
  <div class="flex gap-2">
    <el-tag
      v-for="(tag, index) in modelValue"
      :key="tag"
      :disable-transitions="false"
      @mouseenter="showDeleteIcon[index] = true"
      @mouseleave="showDeleteIcon[index] = false"
    >
      {{ tag }}
      <el-icon
        v-if="showDeleteIcon[index]"
        class="delete-icon"
        @click="handleRemoveTag(index)"
      >
        <Close />
      </el-icon>
    </el-tag>
    <div v-if="inputable">
      <el-input
        v-if="inputVisible"
        ref="InputRef"
        v-model="inputValue"
        class="ml-1 !w-20"
        size="small"
        @keyup.enter="handleInputConfirm"
        @blur="handleInputConfirm"
      />
      <el-button v-else class="ml-1" size="small" @click="showInput">
        新建标签
      </el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, ref } from "vue";
import { ElInput } from "element-plus";
import type { InputInstance } from "element-plus";
import { Close } from "@element-plus/icons-vue";

const props = defineProps<{
  modelValue: string[];
  inputable?: boolean;
}>();

const inputVisible = ref(false);
const modelValue = ref(props.modelValue);
const showDeleteIcon = ref<boolean[]>(
  new Array(props.modelValue.length).fill(false)
);
const inputValue = ref<string>("");
const InputRef = ref<InputInstance>();
const inputable = ref(props.inputable ?? false);

const handleRemoveTag = (index: number) => {
  //删除该标签
  modelValue.value.splice(index, 1);

  showDeleteIcon.value.splice(index, 1);
};

const showInput = () => {
  inputVisible.value = true;
  nextTick(() => {
    InputRef.value!.input!.focus();
  });
};

const handleInputConfirm = () => {
  if (inputValue.value) {
    modelValue.value.push(inputValue.value);
    showDeleteIcon.value.push(false);
  }
  inputVisible.value = false;
  inputValue.value = "";
};
</script>
<style scoped>
.delete-icon {
  margin-left: 4px;
  cursor: pointer;
  transition: opacity 0.3s ease;
}

.tag:hover .delete-icon {
  opacity: 1;
}

.delete-icon:hover {
  color: white; /* 改变图标颜色 */
  background: #409eff; /* 悬停时的背景颜色 */
  border-radius: 50%; /* 使背景呈圆形 */
}
</style>
