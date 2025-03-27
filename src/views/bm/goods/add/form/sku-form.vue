<script setup lang="ts">
import { nextTick, ref, watch } from "vue";
import ReCol from "@/components/ReCol";
import type { SkuFormProps } from "../utils/types";
import { rules } from "../utils/columns";
import { usePublicHooks } from "@/views/hooks";
import ReUpload from "@/components/ReUpload";

const props = withDefaults(defineProps<SkuFormProps>(), {
  formInline: () => ({
    name: "",
    image: [],
    price: 0,
    discount: 0,
    desc: "",
    attrs: []
  })
});
// 类型定义
interface InputState {
  visible: boolean;
  value: string;
}
const formRef = ref();
const newFormInline = ref(props.formInline);
const inputRefs = ref<Record<string, HTMLInputElement>>({});
const inputStates = ref<InputState[]>([]);

// 初始化 inputStates
const initInputStates = () => {
  if (newFormInline.value.attrs.length) {
    inputStates.value = newFormInline.value.attrs.map(() => ({
      visible: false,
      value: ""
    }));
  }
};
function getRef() {
  return formRef.value;
}
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
    newFormInline.value.attrs[index].options.push(value);
  }
  inputStates.value[index].visible = false;
  inputStates.value[index].value = "";
};
// 监听 modelValue 变化，重新初始化 inputStates

initInputStates();

defineExpose({ getRef });
</script>
<template>
  <el-form
    ref="formRef"
    :model="newFormInline"
    :rules="rules"
    label-width="98px"
  >
    <!-- 商品名称 -->
    <el-row :gutter="30">
      <re-col>
        <el-form-item label="商品名称" prop="name">
          <el-input
            v-model="newFormInline.name"
            clearable
            placeholder="请输入商品名称"
          />
        </el-form-item>
      </re-col>
    </el-row>
    <!-- sku图片 -->
    <el-row :gutter="30">
      <re-col>
        <el-form-item label="商品图片" prop="image">
          <ReUpload v-model="newFormInline.image" />
        </el-form-item>
      </re-col>
    </el-row>
    <!-- 商品价格、折扣 -->
    <el-row :gutter="30">
      <re-col :value="12">
        <el-form-item label="商品价格" prop="name">
          <el-input-number
            v-model="newFormInline.price"
            :min="0"
            :step="0.01"
            :precision="2"
            placeholder="请输入价格"
          />
        </el-form-item>
      </re-col>
      <re-col :value="12">
        <el-form-item label="商品折扣" prop="discount">
          <el-input-number
            v-model="newFormInline.discount"
            :min="0"
            :step="0.01"
            :precision="2"
            placeholder="请输入折扣"
          />
        </el-form-item>
      </re-col>
    </el-row>
    <!-- 商品销售属性（新增一个sku所以销售属性只能单选） -->
    <el-row :gutter="30">
      <re-col>
        <el-form-item
          v-for="(item, index) in newFormInline.attrs"
          :key="item.id"
          :label="item.name"
        >
          <el-radio-group v-model="item.value">
            <el-radio
              v-for="(val, cindex) in item.options"
              :key="cindex"
              :label="val"
              :value="val"
            />
          </el-radio-group>
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
      </re-col>
    </el-row>
    <el-row :gutter="30">
      <re-col>
        <el-form-item label="商品描述" prop="desc">
          <el-input
            v-model="newFormInline.desc"
            placeholder="请输入描述信息"
            type="textarea"
          />
        </el-form-item>
      </re-col>
    </el-row>
  </el-form>
</template>
<style lang="scss">
.attr-select {
  width: 280px;
  margin-right: 12px;
}
</style>
