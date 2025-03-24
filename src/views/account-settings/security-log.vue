<script lang="ts" setup>
import { onMounted, reactive } from "vue";
import { deviceDetection } from "@pureadmin/utils";
import { PureTable } from "@pureadmin/table";
import { columns } from "@/views/account-settings/utils/columns";
import { useUserLoginLogStore } from "@/store/monitor/userLoginLog";

const userLoginLogStore = useUserLoginLogStore();
const userLoginLogs = reactive({
  loading: false,
  dataList: [],
  currentPage: 1,
  pageSize: 15,
  total: 0,
  background: true,
  layout: "prev, pager, next"
});

/** 获取用户登录日志内容 */
const onSearchByLoginLog = async () => {
  userLoginLogs.loading = true;

  const data =
    await userLoginLogStore.getUserLoginLogListByLocalUser(userLoginLogs);
  userLoginLogs.dataList = data.items;
  userLoginLogs.currentPage = data.currentPage;
  userLoginLogs.pageSize = data.pageSize;
  userLoginLogs.total = data.total;

  userLoginLogs.loading = false;
};

/** 当前页改变时 */
const onCurrentPageChange = async (value: number) => {
  userLoginLogs.currentPage = value;
  await onSearchByLoginLog();
};

onMounted(() => {
  onSearchByLoginLog();
});
</script>

<template>
  <div
    :class="[
      'min-w-[280px]',
      deviceDetection() ? 'max-w-[100%]' : 'max-w-[70%]'
    ]"
  >
    <h3 class="my-8">安全日志</h3>
    <pure-table
      :columns="columns"
      :data="userLoginLogs.dataList"
      :loading="userLoginLogs.loading"
      :pagination="userLoginLogs"
      row-key="id"
      table-layout="auto"
      @page-current-change="onCurrentPageChange"
    />
  </div>
</template>
