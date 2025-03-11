<script lang="ts" setup>
import { ref } from "vue";
import { FormInstance } from "element-plus";
import {
  rules,
  state
} from "@/views/monitor/schedulerExecuteLog/utils/columns";
import { FormProps } from "@/views/monitor/schedulerExecuteLog/utils/types";

import VueJsonPretty from "vue-json-pretty";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    // 任务名称
    jobName: undefined,
    // 任务分组
    jobGroup: undefined,
    // 执行任务类名
    jobClassName: undefined,
    // 执行任务core表达式
    cronExpression: undefined,
    // 触发器名称
    triggerName: undefined,
    // 执行结果
    executeResult: undefined,
    // 执行时间
    duration: undefined,
    // 结束时间
    endTime: undefined
  })
});

const formRef = ref<FormInstance>();
const form = ref(props.formInline);

defineExpose({ formRef });
</script>

<template>
  <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
    <!-- 任务名称 -->
    <el-form-item label="任务名称" prop="jobName">
      <el-input
        v-model="form.jobName"
        placeholder="输入任务名称"
        autocomplete="off"
        type="text"
      />
    </el-form-item>

    <!-- 任务分组 -->
    <el-form-item label="任务分组" prop="jobGroup">
      <el-input
        v-model="form.jobGroup"
        placeholder="输入任务分组"
        autocomplete="off"
        type="text"
      />
    </el-form-item>

    <!-- 执行任务类名 -->
    <el-form-item label="任务类名" prop="jobClassName">
      <el-input
        v-model="form.jobClassName"
        placeholder="输入任务类名"
        autocomplete="off"
        type="text"
      />
    </el-form-item>

    <!-- 执行任务core表达式 -->
    <el-form-item label="core表达式" prop="cronExpression">
      <el-input
        v-model="form.cronExpression"
        placeholder="输入core表达式"
        autocomplete="off"
        type="text"
      />
    </el-form-item>

    <!-- 触发器名称 -->
    <el-form-item label="触发器名称" prop="triggerName">
      <el-input
        v-model="form.triggerName"
        placeholder="输入触发器名称"
        autocomplete="off"
        type="text"
      />
    </el-form-item>

    <!-- 执行结果 -->
    <el-form-item label="执行结果" prop="executeResult">
      <VueJsonPretty
        :data="JSON.parse(form.executeResult)"
        :deep="state.deep"
        :editable="state.editable"
        :editable-trigger="state.editableTrigger as any"
        :show-double-quotes="state.showDoubleQuotes"
        :show-icon="state.showIcon"
        :show-length="state.showLength"
        :show-line="state.showLine"
        :show-line-number="state.showLineNumber"
      />
    </el-form-item>

    <!-- 用执行时间户Id -->
    <el-form-item label="执行时间" prop="duration">
      <el-input
        v-model="form.duration"
        placeholder="输入执行时间"
        autocomplete="off"
        type="text"
      />
    </el-form-item>
  </el-form>
</template>
