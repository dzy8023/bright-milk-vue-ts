<script lang="ts" setup>
import {
  FormInstance,
  type FormRules,
  genFileId,
  type UploadProps,
  type UploadRawFile
} from "element-plus";
import { reactive, ref } from "vue";

import { UploadFilled } from "@element-plus/icons-vue";

interface Props {
  form: {
    file: any;
  };
}

const rules = reactive<FormRules>({
  file: [
    {
      required: true,
      message: `请选择文件`,
      trigger: "blur"
    }
  ]
});

const props = withDefaults(defineProps<Props>(), {
  form: () => ({
    file: undefined
  })
});

const formRef = ref<FormInstance>();
const form = ref(props.form);
const uploadRef = ref();

const handleExceed: UploadProps["onExceed"] = files => {
  uploadRef.value!.clearFiles();
  const file = files[0] as UploadRawFile;
  file.uid = genFileId();
  uploadRef.value!.handleStart(file);
};

defineExpose({ formRef });
</script>

<template>
  <el-form ref="formRef" :model="form" :rules="rules" isDefault-icon>
    <el-form-item label="文件上传" prop="file">
      <el-upload
        ref="uploadRef"
        v-model:file-list="form.file"
        :autoUpload="false"
        :limit="1"
        :on-exceed="handleExceed"
        class="w-full mt-2"
        drag
      >
        <el-icon class="el-icon--upload">
          <UploadFilled />
        </el-icon>
        <div class="el-upload__text">
          <em>{{ `拖拽 / 点击上传` }}</em>
        </div>
      </el-upload>
    </el-form-item>

    <!-- 更新提示 -->
    <el-text type="danger">更新时确保数据备份，以免丢失</el-text>
  </el-form>
</template>
