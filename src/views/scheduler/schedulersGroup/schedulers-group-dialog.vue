<script lang="ts" setup>
import { ref } from "vue";
import { FormInstance } from "element-plus";
import { rules } from "@/views/scheduler/schedulersGroup/utils/columns";
import { FormProps } from "@/views/scheduler/schedulersGroup/utils/types";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    // 分组名称
    groupName: undefined,
    // 分组详情
    description: undefined
  })
});

const formRef = ref<FormInstance>();
const form = ref(props.formInline);

defineExpose({ formRef });
</script>

<template>
  <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
    <el-form-item label="分组名称" prop="groupName">
      <el-input
        v-model="form.groupName"
        placeholder="输入分组名称"
        autocomplete="off"
        type="text"
      />
    </el-form-item>
    <el-form-item label="任务调度详情" prop="description">
      <el-input
        v-model="form.description"
        placeholder="输入任务调度详情"
        autocomplete="off"
        type="text"
      />
    </el-form-item>
  </el-form>
</template>
