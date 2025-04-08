<script setup lang="ts">
import { ref } from "vue";
import ReCol from "@/components/ReCol";
import { rules } from "../utils/columns";
import { FormProps } from "../utils/types";
import { usePublicHooks } from "@/views/hooks";
import ReUpload from "@/components/ReUpload";
const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    id: 0,
    name: "",
    image: [],
    href: "",
    type: 0
  })
});

const formRef = ref();
const { switchStyle } = usePublicHooks();
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
    :label-width="100"
  >
    <el-row :gutter="30">
      <re-col>
        <el-form-item label="轮播图名称" prop="name">
          <el-input
            v-model="newFormInline.name"
            clearable
            placeholder="请输入轮播图名称"
          />
        </el-form-item>
      </re-col>
    </el-row>
    <el-row :gutter="30">
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="跳转链接" prop="href">
          <el-input
            v-model="newFormInline.href"
            clearable
            placeholder="请输入跳转链接"
          />
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="跳转类型">
          <el-select v-model="newFormInline.type">
            <el-option label="外部链接" value="0" />
            <el-option label="内部页面" value="1" />
          </el-select>
        </el-form-item>
      </re-col>
    </el-row>

    <!-- 轮播图图片 -->
    <el-row :gutter="30">
      <re-col>
        <el-form-item label="轮播图" prop="image">
          <ReUpload v-model="newFormInline.image" />
        </el-form-item>
      </re-col>
    </el-row>
  </el-form>
</template>
