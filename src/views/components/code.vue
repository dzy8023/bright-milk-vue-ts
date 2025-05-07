<template>
  <div
    v-loading="loading"
    class="flex justify-center items-center min-h-[200px]"
  >
    <div class="w-full max-w-md p-4 bg-white rounded-md text-center">
      <div class="mb-4">
        <span class="text-lg font-bold block"> 请输入验证码 </span>
        <span class="text-sm text-gray-600 block">
          （从 <strong>freeotp</strong> 中获取，开启 OTP
          验证时，用手机扫码的那条记录）
        </span>
      </div>

      <div class="flex justify-center" :style="{ gap: inputGap }">
        <input
          v-for="(input, index) in inputs"
          :key="index"
          :ref="el => (inputRefs[index] = el as HTMLInputElement)"
          type="text"
          :maxlength="1"
          :value="input"
          class="border border-gray-300 rounded-md text-center font-mono"
          :style="{
            width: inputWidth,
            height: inputHeight,
            fontSize: fontSize,
            borderRadius: borderRadius,
            borderColor:
              focusedIndex === index ? focusBorderColor : borderColor,
            backgroundColor:
              focusedIndex === index ? focusBackgroundColor : backgroundColor
          }"
          @focus="handleFocus(index)"
          @input="handleInput(index, $event)"
          @keydown.delete="handleDelete(index)"
          @keydown.left="handleLeftKey(index)"
          @keydown.right="handleRightKey(index)"
          @paste="handlePaste"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, nextTick, onMounted, onBeforeUnmount } from "vue";
const loading = ref(false);
const props = defineProps({
  length: {
    type: Number,
    default: 6
  },
  inputWidth: {
    type: String,
    default: "40px"
  },
  inputHeight: {
    type: String,
    default: "48px"
  },
  fontSize: {
    type: String,
    default: "1.25rem"
  },
  borderRadius: {
    type: String,
    default: "0.375rem" // rounded-md
  },
  borderColor: {
    type: String,
    default: "#e5e7eb" // gray-200
  },
  focusBorderColor: {
    type: String,
    default: "#3b82f6" // blue-500
  },
  backgroundColor: {
    type: String,
    default: "#fff"
  },
  focusBackgroundColor: {
    type: String,
    default: "#fff"
  },
  inputGap: {
    type: String,
    default: "8px"
  }
});
const emit = defineEmits(["verify"]);

const inputs = ref<string[]>(Array(props.length).fill(""));
const inputRefs = ref<Array<HTMLInputElement | null>>([]);
const focusedIndex = ref<number | null>(0);
const handleFocus = index => {
  focusedIndex.value = index;
  inputRefs.value[index]?.select();
};
const handleInput = async (index: number, event: Event) => {
  const input = event.target as HTMLInputElement;
  let value = input.value;
  value = value.replace(/[^0-9]/g, ""); // 只允许输入数字
  inputs.value[index] = value;

  if (value && index < props.length - 1) {
    await nextTick();
    if (inputRefs.value[index + 1]) {
      inputRefs.value[index + 1]!.focus();
    }
  }
  if (inputs.value.every(v => v)) {
    emit("verify", inputs.value.join(""));
  }
};

const handleDelete = (index: number) => {
  if (!inputs.value[index] && index > 0) {
    inputRefs.value[index - 1]?.focus();
    focusedIndex.value = index - 1;
  }
  inputs.value[index] = "";
};

const focusFirstInput = () => {
  nextTick(() => {
    inputRefs.value[0]?.focus();
  });
};
const handleLeftKey = async index => {
  if (index > 0) {
    await nextTick();
    const next = inputRefs.value[index - 1];
    next?.focus();
    setTimeout(() => next?.select(), 0); // 延迟执行
  }
};
const handleRightKey = async index => {
  if (index < inputs.value.length - 1) {
    await nextTick();
    const next = inputRefs.value[index + 1];
    next?.focus();
    setTimeout(() => next?.select(), 0); // 延迟执行
  }
};
const handlePaste = async (event: ClipboardEvent) => {
  event.preventDefault();
  const clipboardData = event.clipboardData;
  if (!clipboardData) return;

  let pasted = clipboardData.getData("text");
  pasted = pasted.replace(/\D/g, ""); // 去除非数字
  const chars = pasted.slice(0, props.length).split("");

  // 填入字符
  chars.forEach((char, idx) => {
    inputs.value[idx] = char;
  });

  await nextTick();

  const nextIndex =
    chars.length < props.length ? chars.length : props.length - 1;
  inputRefs.value[nextIndex]?.focus();
  inputRefs.value[nextIndex]?.select();

  // 如果已经填满，触发验证事件
  if (chars.length === props.length) {
    emit("verify", inputs.value.join(""));
  }
};

const handleClickOutside = (event: MouseEvent) => {
  const isInside = inputRefs.value.some(
    el => el && el.contains(event.target as Node)
  );
  if (!isInside) {
    focusedIndex.value = -1;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
defineExpose({
  loading,
  inputs,
  inputRefs,
  focusedIndex,
  focusFirstInput
});
</script>

<style scoped>
/* You can customize the input style here */
input[type="text"] {
  font-family: "Courier New", Courier, monospace; /* Monospace font */
  text-align: center;
}

input[type="text"]:focus {
  outline: none;
}
</style>
