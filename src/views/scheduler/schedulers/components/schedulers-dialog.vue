<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { FormInstance } from "element-plus";
import { rules } from "@/views/scheduler/schedulers/utils/columns";
import { FormProps } from "@/views/scheduler/schedulers/utils/types";

import { useSchedulersGroupStore } from "@/store/scheduler/schedulersGroup";
import { useSchedulersStore } from "@/store/scheduler/schedulers";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    // 任务名称
    jobName: undefined,
    // 任务分组
    jobGroup: undefined,
    // 任务详情
    description: undefined,
    // 任务类名称
    jobClassName: undefined,
    // corn表达式
    cronExpression: undefined,
    // 执行方法
    jobMethodName: undefined,
    // 是否是更新
    isUpdate: false
  })
});

const formRef = ref<FormInstance>();
const form = ref(props.formInline);
const schedulersStore = useSchedulersStore();
const schedulersGroupStore = useSchedulersGroupStore();

onMounted(() => {
  // 获取所有可用调度任务
  schedulersStore.getAllScheduleJobList();

  // 获取所有任务调度分组
  schedulersGroupStore.getAllSchedulersGroup();
});

defineExpose({ formRef });
</script>

<template>
  <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
    <!-- 任务名称 -->
    <el-form-item label="任务名称" prop="jobName">
      <el-input
        v-model="form.jobName"
        :disabled="form.isUpdate"
        placeholder="输入任务名称"
        autocomplete="off"
        type="text"
      />
    </el-form-item>

    <!-- 任务分组 -->
    <el-form-item label="任务分组" prop="jobGroup">
      <el-select
        v-model="form.jobGroup"
        :disabled="form.isUpdate"
        placeholder="选择任务分组"
        clearable
        filterable
      >
        <el-option
          v-for="(item, index) in schedulersGroupStore.allSchedulersGroup"
          :key="index"
          :label="item.groupName"
          :navigationBar="false"
          :value="item.groupName"
        />
      </el-select>
    </el-form-item>

    <!-- 需要执行的任务类名 -->
    <el-form-item label="任务类名" prop="jobClassName">
      <el-select
        v-model="form.jobClassName"
        :disabled="form.isUpdate"
        placeholder="选择任务类名"
        clearable
        filterable
      >
        <el-option
          v-for="(item, index) in schedulersStore.allScheduleJobList"
          :key="index"
          :label="item.label"
          :navigationBar="false"
          :value="item.value"
        />
      </el-select>
    </el-form-item>

    <!-- 执行的corn表达式 -->
    <el-form-item label="corn表达式" prop="cronExpression">
      <el-input
        v-model="form.cronExpression"
        placeholder="输入corn表达式"
        autocomplete="off"
        type="text"
      />
    </el-form-item>

    <!-- 任务详情 -->
    <el-form-item label="任务详情" prop="description">
      <el-input
        v-model="form.description"
        :disabled="form.isUpdate"
        placeholder="输入任务详情"
        autocomplete="off"
        type="text"
      />
    </el-form-item>
  </el-form>
</template>
