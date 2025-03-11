<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { FormInstance } from "element-plus";
import { powerCascadeProps, rules } from "@/views/system/power/utils/columns";
import { FormProps } from "@/views/system/power/utils/types";

import { handleTree } from "@pureadmin/utils";
import { usePowerStore } from "@/store/system/power";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    // 父级id
    parentId: undefined,
    // 权限编码
    powerCode: undefined,
    // 权限名称
    powerName: undefined,
    // 请求路径
    requestUrl: undefined
  })
});

const formRef = ref<FormInstance>();
const form = ref(props.formInline);
const powerStore = usePowerStore();

onMounted(() => {
  powerStore.getAllPowers();
});

defineExpose({ formRef });
</script>

<template>
  <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
    <el-form-item label="父级权限" prop="parentId">
      <el-cascader
        v-model="form.parentId"
        :options="handleTree(powerStore.allPowerList)"
        :props="powerCascadeProps"
        class="w-full"
        clearable
        filterable
        show-all-levels
      />
    </el-form-item>
    <el-form-item label="权限码" prop="powerCode">
      <el-input
        v-model="form.powerCode"
        placeholder="权限码"
        autocomplete="off"
        type="text"
      />
    </el-form-item>
    <el-form-item label="权限名称" prop="powerName">
      <el-input
        v-model="form.powerName"
        placeholder="权限名称"
        autocomplete="off"
        type="text"
      />
    </el-form-item>
    <el-form-item label="请求URL" prop="requestUrl">
      <el-input
        v-model="form.requestUrl"
        placeholder="请求URL"
        autocomplete="off"
        type="text"
      />
    </el-form-item>
  </el-form>
</template>
