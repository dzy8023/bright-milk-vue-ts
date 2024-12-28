<script setup lang="ts">
import { reactive, ref } from "vue";
import { message } from "@/utils/message";
import { createFormData } from "@pureadmin/utils";
import type { UploadFile, UploadUserFile } from "element-plus";
import UploadIcon from "@iconify-icons/ri/upload-2-line";
import { formUpload } from "@/api/mock";
import { Delete, Download, ZoomIn } from "@element-plus/icons-vue";

const formRef = ref();
const uploadRef = ref();
const validateForm = reactive({
  fileList: [] as UploadUserFile[],
  date: ""
});

const dialogImageUrl = ref("");
const dialogVisible = ref(false);
const disabled = ref(false);

const handleRemove = (file: UploadFile) => {
  console.log(file);
  const index = validateForm.fileList.findIndex(item => item.raw === file.raw);
  validateForm.fileList.splice(index, 1);
};

const handlePictureCardPreview = (file: UploadFile) => {
  dialogImageUrl.value = file.url!;
  dialogVisible.value = true;
};

const handleDownload = (file: UploadFile) => {
  console.log(file);
};
const submitForm = formEl => {
  if (!formEl) return;
  formEl.validate(valid => {
    if (valid) {
      // 多个 file 在一个接口同时上传
      const formData = createFormData({
        files: validateForm.fileList.map(file => ({ raw: file.raw })), // file 文件
        date: validateForm.date // 别的字段
      });
      formUpload(formData)
        .then(({ success }) => {
          if (success) {
            message("提交成功", { type: "success" });
          } else {
            message("提交失败");
          }
        })
        .catch(error => {
          message(`提交异常 ${error}`, { type: "error" });
        });
    } else {
      return false;
    }
  });
};
const resetForm = formEl => {
  if (!formEl) return;
  formEl.resetFields();
};
</script>

<template>
  <el-form ref="formRef" :model="validateForm" label-width="82px">
    <el-form-item
      label="附件"
      prop="fileList"
      :rules="[{ required: true, message: '附件不能为空' }]"
    >
      <el-upload
        ref="uploadRef"
        v-model:file-list="validateForm.fileList"
        drag
        list-type="picture-card"
        accept=".jpg,.jpeg,.png,.gif"
        multiple
        action="#"
        :auto-upload="false"
      >
        <div class="el-upload__text">
          <IconifyIconOffline
            :icon="UploadIcon"
            width="26"
            class="m-auto mb-2"
          />
          可点击或拖拽上传
        </div>
        <template #file="{ file }">
          <div>
            <img
              class="el-upload-list__item-thumbnail"
              :src="file.url"
              :alt="file.name"
            />
            <span class="el-upload-list__item-actions">
              <span
                class="el-upload-list__item-preview"
                @click="handlePictureCardPreview(file)"
              >
                <el-icon><zoom-in /></el-icon>
              </span>
              <span
                v-if="!disabled"
                class="el-upload-list__item-delete"
                @click="handleDownload(file)"
              >
                <el-icon><Download /></el-icon>
              </span>
              <span
                v-if="!disabled"
                class="el-upload-list__item-delete"
                @click="handleRemove(file)"
              >
                <el-icon><Delete /></el-icon>
              </span>
            </span>
          </div>
        </template>
      </el-upload>
    </el-form-item>
    <el-form-item
      label="日期"
      prop="date"
      :rules="[{ required: true, message: '日期不能为空' }]"
    >
      <el-date-picker
        v-model="validateForm.date"
        type="datetime"
        class="!w-[200px]"
        placeholder="请选择日期时间"
        value-format="YYYY-MM-DD HH:mm:ss"
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" text bg @click="submitForm(formRef)">
        提交
      </el-button>
      <el-button text bg @click="resetForm(formRef)">重置</el-button>
    </el-form-item>
  </el-form>
  <el-dialog v-model="dialogVisible">
    <img w-full :src="dialogImageUrl" alt="Preview Image" />
  </el-dialog>
</template>
