<script setup lang="ts">
import { ref } from "vue";
import ReCol from "@/components/ReCol";
import { rules } from "../utils/columns";
import { FormProps } from "../utils/types";
import { usePublicHooks } from "@/views/hooks";
import BannerCheck from "./banner-check.vue";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    id: 0,
    name: "",
    catId: 0,
    desc: "",
    status: 0,
    data: [],
    bannerList: [],
    categoryOptions: []
  })
});

const formRef = ref();
const { switchStyle } = usePublicHooks();
const newFormInline = ref(props.formInline);
const data = ref(props.formInline.data);

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
    label-width="auto"
  >
    <el-row :gutter="30">
      <re-col :xs="24" :sm="24">
        <el-form-item label="轮播图组名称" prop="name">
          <el-input
            v-model="newFormInline.name"
            clearable
            placeholder="请输入轮播图组名称"
          />
        </el-form-item>
      </re-col>
    </el-row>
    <el-row :gutter="30">
      <re-col :value="12">
        <el-form-item label="分类">
          <el-cascader
            v-model="newFormInline.catId"
            :options="newFormInline.categoryOptions"
            :props="{
              value: 'id',
              label: 'name',
              disabled: 'disabled',
              emitPath: false,
              checkStrictly: true
            }"
            class="w-full"
            clearable
            filterable
            placeholder="请选择上级分类"
          >
            <template #default="{ node, data }">
              <span>{{ data.name }}</span>
              <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
            </template>
          </el-cascader>
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="轮播图组状态">
          <el-switch
            v-model="newFormInline.status"
            inline-prompt
            :active-value="1"
            :inactive-value="0"
            active-text="启用"
            inactive-text="停用"
            :style="switchStyle"
          />
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

    <!-- 选择轮播图图片，可以多选并且可以拖拽排序 -->
    <el-row :gutter="30">
      <re-col>
        <el-form-item label="商品描述" prop="bannerList">
          <BannerCheck v-model="newFormInline.bannerList" :data="data" />
        </el-form-item>
      </re-col>
    </el-row>
  </el-form>
</template>
