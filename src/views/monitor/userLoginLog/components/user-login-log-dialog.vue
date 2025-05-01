<script lang="ts" setup>
import { ref } from "vue";
import { FormInstance } from "element-plus";
import { rules } from "@/views/monitor/userLoginLog/utils/columns";
import { FormProps } from "@/views/monitor/userLoginLog/utils/types";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    // 用户Id
    userId: undefined,
    // 用户名
    username: undefined,
    // 登录token
    token: undefined,
    // 登录Ip
    ipAddress: undefined,
    // 登录Ip归属地
    ipRegion: undefined,
    // 登录时代理
    userAgent: undefined,
    // 操作类型
    type: undefined,
    // 标识客户端是否是通过Ajax发送请求的
    xRequestedWith: undefined,
    // 客户端连接到服务器的近似带宽
    downlink: undefined
  })
});

const formRef = ref<FormInstance>();
const form = ref(props.formInline);

defineExpose({ formRef });
</script>

<template>
  <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
    <!-- 用户Id -->
    <el-form-item label="用户Id" prop="userId">
      <el-input
        v-model="form.userId"
        placeholder="输入用户Id"
        autocomplete="off"
        type="text"
      />
    </el-form-item>

    <!-- 用户名 -->
    <el-form-item label="用户名" prop="username">
      <el-input
        v-model="form.username"
        placeholder="输入用户名"
        autocomplete="off"
        type="text"
      />
    </el-form-item>

    <!-- 登录token -->
    <el-form-item label="令牌" prop="token">
      <el-input
        v-model="form.token"
        :autosize="{ minRows: 2, maxRows: 8 }"
        placeholder="输入令牌"
        autocomplete="off"
        type="textarea"
      />
    </el-form-item>

    <!-- 登录Ip -->
    <el-form-item label="IP地址" prop="ipAddress">
      <el-input
        v-model="form.ipAddress"
        placeholder="输入IP地址"
        autocomplete="off"
        type="text"
      />
    </el-form-item>

    <!-- 登录Ip归属地 -->
    <el-form-item label="IP归属地" prop="ipRegion">
      <el-input
        v-model="form.ipRegion"
        placeholder="输入IP归属地"
        autocomplete="off"
        type="text"
      />
    </el-form-item>

    <!-- 登录时代理 -->
    <el-form-item label="用户代理" prop="userAgent">
      <el-input
        v-model="form.userAgent"
        :autosize="{ minRows: 2, maxRows: 8 }"
        placeholder="输入用户代理"
        autocomplete="off"
        type="textarea"
      />
    </el-form-item>

    <!-- 操作类型 -->
    <el-form-item label="操作类型" prop="type">
      <el-input
        v-model="form.type"
        placeholder="输入操作类型"
        autocomplete="off"
        type="text"
      />
    </el-form-item>

    <!-- 标识客户端是否是通过Ajax发送请求的 -->
    <el-form-item label="请求方法" prop="xRequestedWith">
      <el-input
        v-model="form.xRequestedWith"
        placeholder="输入请求方法"
        autocomplete="off"
        type="text"
      />
    </el-form-item>
  </el-form>
</template>
