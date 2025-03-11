<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { message } from "@/utils/message";
import type { FormInstance } from "element-plus";
import ReCropperPreview from "@/components/ReCropperPreview";
import { deviceDetection } from "@pureadmin/utils";
import uploadLine from "@iconify-icons/ri/upload-line";
import { rules } from "@/views/account-settings/utils/columns";
import {
  cropperBlob,
  handleSubmitImage,
  isShow,
  onSearchByUserinfo,
  uploadAvatarSrc,
  userInfos
} from "@/views/account-settings/utils/hooks";
import { sexConstant } from "@/enums/baseConstant";
import { useAdminUserStore } from "@/store/system/adminUser";

const userInfoFormRef = ref<FormInstance>();
const uploadRef = ref();
const cropRef = ref();
// 剪裁完成后头像地址，base64内容
const imgBase64Src = ref("");

const adminUserStore = useAdminUserStore();

/** 关闭弹窗 */
const handleClose = () => {
  cropRef.value.hidePopover();
  uploadRef.value.clearFiles();
  isShow.value = false;
};

/** 剪裁头像 */
const onCropper = ({ blob }) => (cropperBlob.value = blob);

/** 头像修改内容 */
const onChange = (uploadFile: any) => {
  const reader = new FileReader();
  reader.onload = e => {
    imgBase64Src.value = e.target.result as string;
    isShow.value = true;
  };
  reader.readAsDataURL(uploadFile.raw);
};

/** 提交表单 */
const onSubmit = async (formEl: FormInstance) => {
  await formEl.validate(async valid => {
    if (valid) {
      // 如果用户修改了头像，将上传的路径赋值进去
      const avatar = uploadAvatarSrc.value;
      if (avatar) userInfos.avatar = avatar;

      // 更新用户信息
      const result = await adminUserStore.updateAdminUserByLocalUser(userInfos);
      if (!result) return;

      // 重新加载用户信息
      await onSearchByUserinfo();
    } else {
      message("填写必填项", { type: "warning" });
    }
  });
};

onMounted(() => {
  onSearchByUserinfo();
});
</script>

<template>
  <div
    :class="[
      'min-w-[180px]',
      deviceDetection() ? 'max-w-[100%]' : 'max-w-[70%]'
    ]"
  >
    <h3 class="my-8">个人信息</h3>

    <!-- 头像 -->
    <el-form
      ref="userInfoFormRef"
      :model="userInfos"
      :rules="rules"
      label-position="top"
    >
      <el-form-item label="头像">
        <el-avatar :size="80" :src="userInfos.avatar" />
        <el-upload
          ref="uploadRef"
          :auto-upload="false"
          :limit="1"
          :on-change="onChange"
          :show-file-list="false"
          accept="image/*"
        >
          <el-button class="ml-4" plain>
            <IconifyIconOffline :icon="uploadLine" />
            <span class="ml-2">上传头像</span>
          </el-button>
        </el-upload>
      </el-form-item>

      <!-- 用户名 -->
      <el-form-item label="用户名" prop="username">
        <el-input
          v-model="userInfos.username"
          placeholder="用户名"
          autocomplete="off"
          disabled
          type="text"
        />
      </el-form-item>

      <!-- 昵称 -->
      <el-form-item label="昵称" prop="nickname">
        <el-input
          v-model="userInfos.nickname"
          placeholder="昵称"
          autocomplete="off"
          type="text"
        />
      </el-form-item>

      <!-- 邮箱 -->
      <el-form-item label="邮箱" prop="email">
        <el-input
          v-model="userInfos.email"
          placeholder="邮箱"
          autocomplete="off"
          type="text"
        />
      </el-form-item>

      <!-- 手机号 -->
      <el-form-item label="手机号" prop="phone">
        <el-input
          v-model="userInfos.phone"
          placeholder="手机号"
          autocomplete="off"
          type="text"
        />
      </el-form-item>

      <!-- 性别 -->
      <el-form-item label="性别" prop="gender">
        <el-select
          v-model="userInfos.sex"
          placeholder="性别"
          clearable
          filterable
        >
          <el-option
            v-for="(item, index) in sexConstant"
            :key="index"
            label="item.label"
            :navigationBar="false"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <!-- 更新信息 -->
      <el-button type="primary" @click="onSubmit(userInfoFormRef)">
        更新信息</el-button
      >
    </el-form>

    <el-dialog
      v-model="isShow"
      :before-close="handleClose"
      :closeOnClickModal="false"
      :fullscreen="deviceDetection()"
      destroy-on-close
      title="编辑头像"
      width="40%"
    >
      <ReCropperPreview
        ref="cropRef"
        :imgSrc="imgBase64Src"
        @cropper="onCropper"
      />
      <template #footer>
        <div class="dialog-footer">
          <el-button bg text @click="handleClose">取消</el-button>
          <el-button bg text type="primary" @click="handleSubmitImage">
            确定</el-button
          >
        </div>
      </template>
    </el-dialog>
  </div>
</template>
