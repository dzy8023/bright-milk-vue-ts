<script lang="ts" setup>
import { ref } from "vue";
import { FormInstance } from "element-plus";
import { rules } from "@/views/configuration/menuIcon/utils/columns";
import { FormProps } from "@/views/configuration/menuIcon/utils/types";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import MenuIconSelectIconName from "@/views/configuration/menuIcon/menu-icon-select-icon-name.vue";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    // icon类名
    iconCode: undefined,
    // icon 名称
    iconName: undefined
  })
});

const formRef = ref<FormInstance>();
const form = ref(props.formInline);

defineExpose({ formRef });
</script>

<template>
  <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
    <el-form-item label="图标类名" prop="iconCode">
      <el-input v-model="form.iconCode" autocomplete="off" type="text" />
    </el-form-item>

    <el-form-item label="图标名称" prop="iconName">
      <MenuIconSelectIconName :formInline="form" />
    </el-form-item>

    <el-form-item v-show="form.iconCode" label="图标预览">
      <div class="flex justify-center">
        <component
          :is="useRenderIcon(form.iconCode)"
          class="flex justify-center"
          style="font-size: 30px"
        />
      </div>
    </el-form-item>

    <!-- icon 官网 -->
    <el-form-item label="菜单图标官网">
      <el-link
        title="菜单图标官网"
        :underline="false"
        href="https://icon-sets.iconify.design/"
        target="_blank"
        type="primary"
      >
        菜单图标官网
      </el-link>
    </el-form-item>
  </el-form>
</template>
