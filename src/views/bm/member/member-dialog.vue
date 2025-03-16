<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { FormInstance } from "element-plus";
import { isAddMember, rules } from "./utils/columns";
import { FormProps } from "./utils/types";

import ReCol from "@/components/ReCol";
import { genderConstant } from "@/enums/baseConstant";
import { usePublicHooks } from "@/views/hooks";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    // 用户名
    username: undefined,
    // 昵称
    nickname: undefined,
    // 手机号
    phone: undefined,
    // 密码
    password: undefined,
    // 头像
    avatar: undefined,
    // 性别
    gender: undefined,
    //生日
    birthday: undefined,
    // 用户状态
    status: undefined
  })
});
const formRef = ref<FormInstance>();
const form = ref(props.formInline);
// 用户是否停用样式
const { switchStyle } = usePublicHooks();
const disabledDate = (time: Date) => {
  return time.getTime() > Date.now();
};
defineExpose({ formRef });
onMounted(() => {
  console.log("rules", rules, isAddMember.value);
});
</script>

<template>
  <el-form
    ref="formRef"
    :model="form"
    :rules="rules"
    label-position="left"
    label-width="auto"
  >
    <el-row :gutter="30">
      <!-- 用户名 -->
      <re-col :sm="24" :value="12" :xs="24">
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="form.username"
            placeholder="用户名"
            autocomplete="off"
            type="text"
            clearable
          />
        </el-form-item>
      </re-col>

      <!-- 昵称 -->
      <re-col :sm="24" :value="12" :xs="24">
        <el-form-item label="昵称" prop="nickname">
          <el-input
            v-model="form.nickname"
            placeholder="昵称"
            autocomplete="off"
            type="text"
            clearable
          />
        </el-form-item>
      </re-col>

      <!-- 密码 -->
      <re-col v-show="isAddMember" :sm="24" :xs="24">
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="form.password"
            placeholder="密码"
            autocomplete="off"
            show-password
            type="password"
            clearable
          />
        </el-form-item>
      </re-col>

      <!-- 手机号 -->
      <re-col :sm="24" :value="14" :xs="24">
        <el-form-item label="手机号" prop="phone">
          <el-input
            v-model="form.phone"
            placeholder="手机号"
            autocomplete="off"
            type="text"
            clearable
          />
        </el-form-item>
      </re-col>

      <!-- 性别 -->
      <re-col :sm="24" :value="10" :xs="24">
        <el-form-item label="性别" prop="gender">
          <el-select
            v-model="form.gender"
            placeholder="性别"
            clearable
            filterable
          >
            <el-option
              v-for="(item, index) in genderConstant"
              :key="index"
              :label="item.label"
              :navigationBar="false"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </re-col>
      <!-- 生日 -->
      <re-col :sm="24" :value="14" :xs="24">
        <el-form-item label="生日" prop="birthday">
          <el-date-picker
            v-model="form.birthday"
            type="date"
            placeholder="选择生日"
            :default-value="new Date(2010, 9, 1)"
            :disabled-date="disabledDate"
          />
        </el-form-item>
      </re-col>

      <!-- 用户状态 -->
      <re-col :sm="24" :value="10" :xs="24">
        <el-form-item label="状态" prop="status">
          <el-switch
            v-model="form.status"
            active-text="启用"
            :active-value="1"
            inactive-text="禁用"
            :inactive-value="0"
            :style="switchStyle"
            inline-prompt
          />
        </el-form-item>
      </re-col>
    </el-row>
  </el-form>
</template>
