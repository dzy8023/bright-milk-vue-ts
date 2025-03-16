<script setup lang="ts">
import { ref } from "vue";
import ReCol from "@/components/ReCol";
import { FormProps } from "../utils/types";
import { rules } from "../utils/columns";
import { IconSelect } from "@/components/ReIcon";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    title: "新增",
    id: 0,
    name: "",
    icon: "",
    value: [],
    desc: "",
    type: 0
  })
});
const attrTypeOptions = [
  { label: "规格参数", value: 0 },
  { label: "销售属性", value: 1 }
];
const formRef = ref();
const newFormInline = ref(props.formInline);

function getRef() {
  return formRef.value;
}

defineExpose({ getRef });
</script>
<template>
  <el-form
    ref="formRef"
    :model="newFormInline"
    :rules="rules"
    label-width="82px"
  >
    <el-row :gutter="30">
      <re-col>
        <el-form-item label="属性名称" prop="name">
          <el-input
            v-model="newFormInline.name"
            clearable
            placeholder="请输入属性名称"
          />
        </el-form-item>
      </re-col>
      <re-col>
        <el-form-item label="属性值" prop="value">
          <el-input-tag
            v-model="newFormInline.value"
            clearable
            draggable
            placeholder="请输入属性可选值"
          />
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="属性图标" prop="icon">
          <IconSelect v-model="newFormInline.icon" class="w-full" />
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="属性类型" prop="type">
          <el-select
            v-model="newFormInline.type"
            placeholder="请选择属性类型"
            class="w-full"
            clearable
          >
            <el-option
              v-for="(item, index) in attrTypeOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </re-col>

      <re-col>
        <el-form-item label="属性描述" prop="desc">
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
