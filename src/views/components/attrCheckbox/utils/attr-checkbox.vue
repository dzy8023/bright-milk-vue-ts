<template>
  <!-- 商品属性选择 -->
  <div v-if="localFormData?.spuAttrs?.length" class="attr-section">
    <div class="section-title">选择规格参数</div>
    <el-form
      ref="spuFormRef"
      label-width="auto"
      :model="localFormData.spuAttrs"
    >
      <el-form-item
        v-for="(item, index) in localFormData.spuAttrs"
        :key="item.id"
      >
        <template #label>
          <span v-tippy="item.desc"
            >{{ item.name }}
            <el-tag v-if="item.choose === 1" type="success" size="small"
              >多选</el-tag
            ></span
          >
        </template>
        <el-select
          v-model="localFormData.spuAttrs[index].value"
          class="attr-select"
          :multiple="item.choose === 1"
          filterable
          clearable
          allow-create
          default-first-option
          placeholder="请选择或输入值"
        >
          <el-option
            v-for="val in item.options"
            :key="val"
            :label="val"
            :value="val"
          />
        </el-select>
        <el-checkbox
          v-model="localFormData.spuAttrs[index].quickShow"
          :true-value="1"
          :false-value="0"
        >
          快速展示
        </el-checkbox>
      </el-form-item>
    </el-form>
  </div>
  <div v-else>
    <el-empty description="该分类没有关联规格参数" />
  </div>

  <el-divider />

  <!-- 销售属性选择 -->
  <div v-if="localFormData?.saleAttrs?.length" class="attr-section">
    <div class="section-title">选择销售属性</div>
    <el-form ref="saleFormRef" :model="localFormData.saleAttrs">
      <el-form-item
        v-for="(item, index) in localFormData.saleAttrs"
        :key="item.id"
        :label="item.name"
      >
        <template #label>
          <span v-tippy="item.desc"
            >{{ item.name }}
            <el-tag v-if="item.choose === 1" type="success" size="small"
              >多选</el-tag
            ></span
          >
        </template>
        <el-checkbox-group
          v-model="item.value"
          :max="item.choose === 0 ? 1 : Number.MAX_SAFE_INTEGER"
        >
          <el-checkbox
            v-for="(val, index) in item.options"
            :key="index"
            :label="val"
            :value="val"
          />
        </el-checkbox-group>

        <!-- 自定义属性输入 -->
        <div class="custom-attr-input">
          <el-button
            v-show="!inputStates[index].visible"
            class="button-new-tag"
            size="small"
            @click="showCustomInput(index)"
          >
            +自定义
          </el-button>
          <el-input
            v-show="inputStates[index].visible"
            :ref="el => setInputRef(el, index)"
            v-model="inputStates[index].value"
            size="small"
            class="custom-input"
            @keyup.enter="handleCustomAttrConfirm(index)"
            @blur="handleCustomAttrConfirm(index)"
          />
        </div>
      </el-form-item>
    </el-form>
  </div>
  <div v-else>
    <el-empty description="该分类没有关联销售属性" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { AttrFormInLine } from "./types";

export default defineComponent({
  name: "AttrCheckbox"
});
</script>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, watch } from "vue";
import type { PropType } from "vue";

// 类型定义
interface InputState {
  visible: boolean;
  value: string;
}

interface CustomAttr {
  index: number;
  value: string;
}

// Props 定义
const props = defineProps({
  modelValue: {
    type: Object as PropType<AttrFormInLine>,
    required: true
  }
});

// Emits 定义
const emits = defineEmits<{
  (e: "update:modelValue", value: AttrFormInLine): void;
  (e: "submit", data: any, skus: any[], extendData?: any): void;
}>();

// 本地状态
const spuFormRef = ref();
const saleFormRef = ref();
const inputRefs = ref<Record<string, HTMLInputElement>>({});
const inputStates = ref<InputState[]>([]);

// 初始化 inputStates
const initInputStates = () => {
  if (props.modelValue?.saleAttrs) {
    inputStates.value = props.modelValue.saleAttrs.map(() => ({
      visible: false,
      value: ""
    }));
  }
};

// 监听 modelValue 变化，重新初始化 inputStates
watch(
  () => props.modelValue?.saleAttrs,
  () => {
    initInputStates();
  },
  { immediate: true }
);

// 计算属性
const localFormData = computed({
  get: () => props.modelValue,
  set: val => emits("update:modelValue", val)
});

const setInputRef = (el: any, index: number) => {
  if (el) {
    inputRefs.value[`input-${index}`] = el;
  }
};

// 自定义属性相关方法
const showCustomInput = async (index: number) => {
  inputStates.value[index].visible = true;
  await nextTick();
  inputRefs.value[`input-${index}`]?.focus();
};

const handleCustomAttrConfirm = (index: number) => {
  const value = inputStates.value[index].value.trim().replaceAll(";", "");
  if (value) {
    localFormData.value.saleAttrs[index].options.push(value);
  }
  inputStates.value[index].visible = false;
  inputStates.value[index].value = "";
};

// 生成SKU属性组合
const generateSkuCombinations = (attrs: any[]) => {
  const results: any[] = [];
  const temp: any[] = [];

  const cartesian = (index: number) => {
    if (index === attrs.length) {
      results.push([...temp]);
      return;
    }
    for (const value of attrs[index].value) {
      temp.push({
        id: attrs[index].id,
        name: attrs[index].name,
        value
      });
      cartesian(index + 1);
      temp.pop();
    }
  };

  cartesian(0);
  return results;
};

// 提交方法
const submit = (extendData?: any) => {
  const processedData = {
    spuAttrs: localFormData.value.spuAttrs
      .filter(item => item.value && item.value.length > 0)
      .map(item => ({
        id: item.id,
        name: item.name,
        value: Array.isArray(item.value) ? item.value.join(";") : item.value,
        quickShow: item.quickShow,
        props: `spu-${item.id}`
      })),
    saleAttrs: localFormData.value.saleAttrs
      .filter(item => item.value.length > 0)
      .map(item => ({
        id: item.id,
        name: item.name,
        value: item.value,
        props: `sku-${item.id}`,
        options: item.options
      }))
  };

  const skuCombinations = generateSkuCombinations(processedData.saleAttrs);
  const skus = skuCombinations.map(combination => {
    const skuProps = combination.reduce(
      (acc: any, curr: any) => ({
        ...acc,
        [`sku-${curr.id}`]: curr.value
      }),
      {}
    );

    const spuProps = processedData.spuAttrs.reduce(
      (acc: any, curr: any) => ({
        ...acc,
        [`spu-${curr.id}`]: {
          value: curr.value.split(";"),
          quickShow: curr.quickShow
        }
      }),
      {}
    );

    return { ...skuProps, ...spuProps };
  });

  emits("submit", processedData, skus, extendData);
};

onMounted(() => {
  initInputStates();
});

// 暴露方法
defineExpose({
  submit
});
</script>

<style scoped>
.attr-section {
  margin: 12px 0;
}

.section-title {
  margin-bottom: 12px;
  font-size: 16px;
  font-weight: 500;
}

:deep(.el-form) {
  width: 100%;
}

:deep(.el-form-item) {
  margin-bottom: 12px;
}

:deep(.el-form-item__label) {
  padding-right: 8px;
  line-height: 32px;

  /* width: auto; */
  text-align: right;
}

:deep(.el-form-item__content) {
  display: flex;
  align-items: center;
  min-height: 32px;
}

.attr-select {
  width: 280px;
  margin-right: 12px;
}

.custom-attr-input {
  display: inline-flex;
  align-items: center;
  margin-left: 12px;
}

.custom-input {
  width: 150px;
}

:deep(.el-checkbox) {
  display: flex;
  align-items: center;
  height: 32px;
  margin-right: 8px;
}

:deep(.el-checkbox-group) {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

:deep(.el-divider) {
  margin: 12px 0;
}
</style>
