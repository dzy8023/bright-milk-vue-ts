<script setup lang="ts">
import { ref } from "vue";
import ReCol from "@/components/ReCol";
import { formRules } from "../utils/rule";
import { FormProps } from "../utils/types";
import { usePublicHooks } from "../../hooks";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    title: "新增",
    parentId: 0,
    layer: 1,
    sort: 0,
    name: "",
    status: 0
  })
});

const ruleFormRef = ref();
const { switchStyle } = usePublicHooks();
const newFormInline = ref(props.formInline);

function getRef() {
  return ruleFormRef.value;
}

defineExpose({ getRef });
</script>
<template>
  <el-form
    ref="ruleFormRef"
    :rules="formRules"
    :model="newFormInline"
    label-width="82px"
  >
    <el-row :gutter="30">
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="分类名称" prop="name">
          <el-input
            v-model="newFormInline.name"
            clearable
            placeholder="请输入分类名称"
          />
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="分类排序" prop="sort">
          <el-input
            v-model="newFormInline.sort"
            clearable
            placeholder="请输入分类排序"
          />
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="分类层级">
          <el-select
            v-model="newFormInline.layer"
            placeholder="请选择分类层级"
            class="w-full"
            clearable
          >
            <el-option
              v-for="(item, index) in [
                { label: '一级分类', value: 1 },
                { label: '二级分类', value: 2 },
                { label: '三级分类', value: 3 }
              ]"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="分类状态">
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
  </el-form>
</template>
