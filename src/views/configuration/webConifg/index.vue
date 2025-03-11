<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { FormInstance } from "element-plus";
import ReCol from "@/components/ReCol";
import {
  form,
  onSearch,
  submitForm
} from "@/views/configuration/webConifg/utils/hooks";
import { rules } from "@/views/configuration/webConifg/utils/columns";
import { usePublicHooks } from "@/views/hooks";
import { auth } from "@/views/configuration/webConifg/utils/auth";
import { hasAuth } from "@/router/utils";

const ruleFormRef = ref<FormInstance>();
// 用户是否停用样式
const { switchStyle } = usePublicHooks();
const theme = ["dark", "light", "system"];
const layout = ["vertical", "horizontal", "mix"];

onMounted(() => {
  onSearch();
});
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :model="form"
    :rules="rules"
    class="bg-white p-[30px] h-[100%]"
    label-position="left"
    label-width="auto"
    status-icon
  >
    <el-row :gutter="30">
      <!-- 应用程序的版本 -->
      <re-col :sm="24" :value="12" :xs="24">
        <el-form-item label="版本" prop="version">
          <el-input
            v-model="form.version"
            placeholder="输入版本"
            autocomplete="off"
            type="text"
          />
        </el-form-item>
      </re-col>

      <!-- 应用程序的标题 -->
      <re-col :sm="24" :value="12" :xs="24">
        <el-form-item label="网页title" prop="title">
          <el-input
            v-model="form.title"
            placeholder="输入网页title"
            autocomplete="off"
            type="text"
          />
        </el-form-item>
      </re-col>

      <!-- 版权信息 -->
      <re-col :sm="24" :value="12" :xs="24">
        <el-form-item label="版权" prop="copyright">
          <el-input
            v-model="form.copyright"
            placeholder="输入版权"
            autocomplete="off"
            type="text"
          />
        </el-form-item>
      </re-col>

      <!-- 头部是否固定 -->
      <re-col :sm="24" :value="12" :xs="24">
        <el-form-item label="固定头" prop="fixedHeader">
          <el-switch
            v-model="form.fixedHeader"
            active-text="启用"
            :active-value="true"
            inactive-text="禁用"
            :inactive-value="false"
            :style="switchStyle"
            inline-prompt
          />
        </el-form-item>
      </re-col>

      <!-- 侧边栏是否隐藏 -->
      <re-col :sm="24" :value="12" :xs="24">
        <el-form-item label="侧边栏是否隐藏" prop="hiddenSideBar">
          <el-switch
            v-model="form.hiddenSideBar"
            active-text="启用"
            :active-value="true"
            inactive-text="禁用"
            :inactive-value="false"
            :style="switchStyle"
            inline-prompt
          />
        </el-form-item>
      </re-col>

      <!-- 是否缓存多个标签 -->
      <re-col :sm="24" :value="12" :xs="24">
        <el-form-item label="是否缓存多个标签" prop="multiTagsCache">
          <el-switch
            v-model="form.multiTagsCache"
            active-text="启用"
            :active-value="true"
            inactive-text="禁用"
            :inactive-value="false"
            :style="switchStyle"
            inline-prompt
          />
        </el-form-item>
      </re-col>

      <!-- 是否持久化 -->
      <re-col :sm="24" :value="12" :xs="24">
        <el-form-item label="保持存活" prop="keepAlive">
          <el-switch
            v-model="form.keepAlive"
            active-text="启用"
            :active-value="true"
            inactive-text="禁用"
            :inactive-value="false"
            :style="switchStyle"
            inline-prompt
          />
        </el-form-item>
      </re-col>

      <!-- 语言类型 -->
      <re-col :sm="24" :value="12" :xs="24">
        <el-form-item label="本地语言" prop="locale"> 中文 </el-form-item>
      </re-col>

      <!-- 应用程序的布局 -->
      <re-col :sm="24" :value="12" :xs="24">
        <el-form-item label="应用程序的布局" prop="layout">
          <el-select
            v-model="form.layout"
            placeholder="选择应用程序的布局"
            filterable
          >
            <el-option
              v-for="item in layout"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
      </re-col>

      <!-- 应用程序的主题 -->
      <re-col :sm="24" :value="12" :xs="24">
        <el-form-item label="主题" prop="theme">
          <el-select v-model="form.theme" placeholder="选择主题" filterable>
            <el-option
              v-for="item in theme"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
      </re-col>

      <!-- 是否启用深色模式 -->
      <re-col :sm="24" :value="12" :xs="24">
        <el-form-item label="是否启用深色模式" prop="darkMode">
          <el-switch
            v-model="form.darkMode"
            active-text="启用"
            :active-value="true"
            inactive-text="禁用"
            :inactive-value="false"
            :style="switchStyle"
            inline-prompt
          />
        </el-form-item>
      </re-col>

      <!-- 应用程序的整体样式 -->
      <re-col :sm="24" :value="12" :xs="24">
        <el-form-item label="应用程序的整体样式" prop="overallStyle">
          <el-select
            v-model="form.overallStyle"
            placeholder="选择应用程序的整体样式"
            filterable
          >
            <el-option
              v-for="item in theme"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
      </re-col>

      <!-- 是否启用灰色模式 -->
      <re-col :sm="24" :value="12" :xs="24">
        <el-form-item label="是否启用灰色模式" prop="grey">
          <el-switch
            v-model="form.grey"
            active-text="启用"
            :active-value="true"
            inactive-text="禁用"
            :inactive-value="false"
            :style="switchStyle"
            inline-prompt
          />
        </el-form-item>
      </re-col>

      <!-- 色弱模式 -->
      <re-col :sm="24" :value="12" :xs="24">
        <el-form-item label="色弱模式" prop="weak">
          <el-switch
            v-model="form.weak"
            active-text="启用"
            :active-value="true"
            inactive-text="禁用"
            :inactive-value="false"
            :style="switchStyle"
            inline-prompt
          />
        </el-form-item>
      </re-col>

      <!-- 是否隐藏选项卡 -->
      <re-col :sm="24" :value="12" :xs="24">
        <el-form-item label="是否隐藏选项卡" prop="weak">
          <el-switch
            v-model="form.hideTabs"
            active-text="启用"
            :active-value="true"
            inactive-text="禁用"
            :inactive-value="false"
            :style="switchStyle"
            inline-prompt
          />
        </el-form-item>
      </re-col>

      <!-- 是否隐藏页脚 -->
      <re-col :sm="24" :value="12" :xs="24">
        <el-form-item label="是否隐藏页脚" prop="weak">
          <el-switch
            v-model="form.hideFooter"
            active-text="启用"
            :active-value="true"
            inactive-text="禁用"
            :inactive-value="false"
            :style="switchStyle"
            inline-prompt
          />
        </el-form-item>
      </re-col>

      <!-- 是否拉伸显示 -->
      <re-col :sm="24" :value="12" :xs="24">
        <el-form-item label="是否拉伸显示" prop="stretch">
          <el-switch
            v-model="form.stretch"
            active-text="启用"
            :active-value="true"
            inactive-text="禁用"
            :inactive-value="false"
            :style="switchStyle"
            inline-prompt
          />
        </el-form-item>
      </re-col>

      <!-- 侧边栏的状态 -->
      <re-col :sm="24" :value="12" :xs="24">
        <el-form-item label="侧边栏的状态" prop="sidebarStatus">
          <el-switch
            v-model="form.sidebarStatus"
            active-text="启用"
            :active-value="true"
            inactive-text="禁用"
            :inactive-value="false"
            :style="switchStyle"
            inline-prompt
          />
        </el-form-item>
      </re-col>

      <!-- 主题颜色 -->
      <re-col :sm="24" :value="12" :xs="24">
        <el-form-item label="主题颜色" prop="epThemeColor">
          <el-color-picker v-model="form.epThemeColor" />
        </el-form-item>
      </re-col>

      <!-- 是否显示logo -->
      <re-col :sm="24" :value="12" :xs="24">
        <el-form-item label="是否显示logo" prop="showLogo">
          <el-switch
            v-model="form.showLogo"
            active-text="启用"
            :active-value="true"
            inactive-text="禁用"
            :inactive-value="false"
            :style="switchStyle"
            inline-prompt
          />
        </el-form-item>
      </re-col>

      <!-- 要显示的模型 -->
      <re-col :sm="24" :value="12" :xs="24">
        <el-form-item label="要显示的模型" prop="showModel">
          <el-input
            v-model="form.showModel"
            placeholder="输入要显示的模型"
            autocomplete="off"
            type="text"
          />
        </el-form-item>
      </re-col>

      <!-- 菜单箭头图标是否没有过渡效果 -->
      <re-col :sm="24" :value="12" :xs="24">
        <el-form-item
          label="菜单箭头图标是否没有过渡效果"
          prop="menuArrowIconNoTransition"
        >
          <el-switch
            v-model="form.menuArrowIconNoTransition"
            active-text="启用"
            :active-value="true"
            inactive-text="禁用"
            :inactive-value="false"
            :style="switchStyle"
            inline-prompt
          />
        </el-form-item>
      </re-col>

      <!-- 是否缓存异步路由 -->
      <re-col :sm="24" :value="12" :xs="24">
        <el-form-item label="是否缓存异步路由" prop="cachingAsyncRoutes">
          <el-switch
            v-model="form.cachingAsyncRoutes"
            active-text="启用"
            :active-value="true"
            inactive-text="禁用"
            :inactive-value="false"
            :style="switchStyle"
            inline-prompt
          />
        </el-form-item>
      </re-col>

      <!-- 工具提示的效果 -->
      <re-col :sm="24" :value="12" :xs="24">
        <el-form-item label="工具提示的效果" prop="tooltipEffect">
          <el-select
            v-model="form.tooltipEffect"
            placeholder="选择工具提示的效果"
            filterable
          >
            <el-option
              v-for="item in theme"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
      </re-col>

      <!-- 响应式存储的命名空间 -->
      <re-col :sm="24" :value="12" :xs="24">
        <el-form-item
          label="响应式存储的命名空间"
          prop="responsiveStorageNameSpace"
        >
          <el-input
            v-model="form.responsiveStorageNameSpace"
            placeholder="输入响应式存储的命名空间"
            autocomplete="off"
            type="text"
          />
        </el-form-item>
      </re-col>

      <!-- 菜单搜索历史 -->
      <re-col :sm="24" :value="12" :xs="24">
        <el-form-item label="菜单搜索历史" prop="menuSearchHistory">
          <el-input
            v-model="form.menuSearchHistory"
            :max="99"
            :min="1"
            placeholder="输入菜单搜索历史"
            autocomplete="off"
            type="number"
          />
        </el-form-item>
      </re-col>

      <!-- 提交内容 -->
      <re-col v-if="hasAuth(auth.update)" :sm="24" :value="12" :xs="24">
        <el-form-item>
          <el-button type="primary" @click="submitForm(ruleFormRef)">
            修改配置</el-button
          >
        </el-form-item>
      </re-col>
    </el-row>
  </el-form>
</template>
