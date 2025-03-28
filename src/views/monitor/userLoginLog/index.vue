<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { columns } from "@/views/monitor/userLoginLog/utils/columns";
import PureTableBar from "@/components/RePureTableBar/src/bar";
import PureTable from "@pureadmin/table";
import {
  deleteIds,
  onDelete,
  onDeleteBatch,
  onSearch,
  onView
} from "@/views/monitor/userLoginLog/utils/hooks";
import Delete from "@iconify-icons/ep/delete";
import View from "@iconify-icons/ep/view";
import Refresh from "@iconify-icons/ep/refresh";
import { selectUserinfo } from "@/components/ReTable/Userinfo/columns";

import { useUserLoginLogStore } from "@/store/monitor/userLoginLog";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { FormInstance } from "element-plus";
import { auth } from "@/views/monitor/userLoginLog/utils/auth";
import { hasAuth } from "@/router/utils";

const tableRef = ref();
const formRef = ref();
const userLoginLogStore = useUserLoginLogStore();

/** 当前页改变时 */
const onCurrentPageChange = async (value: number) => {
  userLoginLogStore.pagination.currentPage = value;
  await onSearch();
};

/** 当分页发生变化 */
const onPageSizeChange = async (value: number) => {
  userLoginLogStore.pagination.pageSize = value;
  await onSearch();
};

/** 选择多行 */
const onSelectionChange = (rows: Array<any>) => {
  deleteIds.value = rows.map((row: any) => row.id);
};

/** 重置表单 */
const resetForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  await onSearch();
};

onMounted(() => {
  onSearch();
});
</script>

<template>
  <div class="main">
    <el-form
      ref="formRef"
      :inline="true"
      :model="userLoginLogStore.form"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px] overflow-auto"
    >
      <!-- 用户名 -->
      <el-form-item label="用户名" prop="username">
        <el-input
          v-model="userLoginLogStore.form.username"
          placeholder="输入用户名"
          class="!w-[180px]"
          clearable
        />
      </el-form-item>

      <!-- 登录Ip -->
      <el-form-item label="IP地址" prop="ipAddress">
        <el-input
          v-model="userLoginLogStore.form.ipAddress"
          placeholder="输入IP地址"
          class="!w-[180px]"
          clearable
        />
      </el-form-item>

      <!-- 登录Ip归属地 -->
      <el-form-item label="IP归属地" prop="ipRegion">
        <el-input
          v-model="userLoginLogStore.form.ipRegion"
          placeholder="输入IP归属地"
          class="!w-[180px]"
          clearable
        />
      </el-form-item>

      <!-- 操作类型 -->
      <el-form-item label="操作类型" prop="type">
        <el-input
          v-model="userLoginLogStore.form.type"
          placeholder="输入操作类型"
          class="!w-[180px]"
          clearable
        />
      </el-form-item>

      <!-- 标识客户端是否是通过Ajax发送请求的 -->
      <el-form-item label="请求方法" prop="xRequestedWith">
        <el-input
          v-model="userLoginLogStore.form.xRequestedWith"
          placeholder="输入请求方法"
          class="!w-[180px]"
          clearable
        />
      </el-form-item>

      <el-form-item>
        <el-button
          :icon="useRenderIcon('ri:search-line')"
          :loading="userLoginLogStore.loading"
          type="primary"
          @click="onSearch"
        >
          搜索
        </el-button>
        <el-button :icon="useRenderIcon(Refresh)" @click="resetForm(formRef)">
          重置</el-button
        >
      </el-form-item>
    </el-form>
    <Auth :value="auth.search" />

    <PureTableBar
      :columns="columns"
      title="用户登录日志"
      @fullscreen="tableRef.setAdaptive()"
      @refresh="onSearch"
    >
      <template #buttons>
        <!-- 批量删除按钮 -->
        <el-button
          v-if="hasAuth(auth.deleted)"
          :disabled="!(deleteIds.length > 0)"
          :icon="useRenderIcon(Delete)"
          type="danger"
          @click="onDeleteBatch"
        >
          批量删除
        </el-button>
      </template>

      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          ref="tableRef"
          :adaptiveConfig="{ offsetBottom: 96 }"
          :columns="dynamicColumns"
          :data="userLoginLogStore.dataList"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
          :loading="userLoginLogStore.loading"
          :pagination="userLoginLogStore.pagination"
          :size="size"
          adaptive
          align-whole="center"
          border
          highlight-current-row
          row-key="id"
          showOverflowTooltip
          table-layout="auto"
          @page-size-change="onPageSizeChange"
          @selection-change="onSelectionChange"
          @page-current-change="onCurrentPageChange"
        >
          <template #createUser="{ row }">
            <el-button
              v-show="row.createUser"
              link
              type="primary"
              @click="selectUserinfo(row.createUser)"
            >
              {{ row.createUsername }}
            </el-button>
          </template>

          <template #updateUser="{ row }">
            <el-button
              v-show="row.updateUser"
              link
              type="primary"
              @click="selectUserinfo(row.updateUser)"
            >
              {{ row.updateUsername }}
            </el-button>
          </template>

          <template #operation="{ row }">
            <el-button
              v-if="hasAuth(auth.search)"
              :icon="useRenderIcon(View)"
              :size="size"
              class="reset-margin"
              link
              type="primary"
              @click="onView(row)"
            >
              查看
            </el-button>
            <el-popconfirm
              v-if="hasAuth(auth.deleted)"
              :title="`删除${row.username}?`"
              @confirm="onDelete(row)"
            >
              <template #reference>
                <el-button
                  :icon="useRenderIcon(Delete)"
                  :size="size"
                  class="reset-margin"
                  link
                  type="primary"
                >
                  删除
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>
