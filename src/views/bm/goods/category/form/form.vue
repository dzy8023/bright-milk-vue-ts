<script setup lang="ts">
import { ref } from "vue";
import ReCol from "@/components/ReCol";
import { rules } from "../utils/columns";
import { FormProps } from "../utils/types";
import { usePublicHooks } from "@/views/hooks";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    isAdd: false,
    parentId: 0,
    layer: 1,
    sort: 0,
    name: "",
    status: 0,
    higherCategoryOptions: []
  })
});

const formRef = ref();
const { switchStyle } = usePublicHooks();
const newFormInline = ref(props.formInline);
console.log(newFormInline.value);
defineExpose({ formRef });
</script>
<template>
  <el-form
    ref="formRef"
    :rules="rules"
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
      <!--  -->
      <re-col>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="newFormInline.parentId"
            :disabled="!newFormInline.isAdd"
            :options="newFormInline.higherCategoryOptions"
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
