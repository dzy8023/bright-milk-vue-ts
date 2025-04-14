<template>
  <el-card>
    <div class="block">
      <div class="demonstration">选择日期范围</div>
      <div class="w-full flex justify-between items-center space-x-2">
        <div class="max-w-[300px] w-full">
          <!-- 限制日期框最大宽度 -->
          <el-date-picker
            v-model="value"
            type="daterange"
            unlink-panels
            range-separator="To"
            start-placeholder="Start date"
            end-placeholder="End date"
            :shortcuts="shortcuts"
            value-format="YYYY-MM-DD"
            style="width: 100%"
            @change="handleRangePickerChange"
          />
        </div>
        <el-button
          type="primary"
          :icon="useRenderIcon(Export)"
          @click="dialogVisible = true"
        >
          导出
        </el-button>
      </div>
    </div>

    <el-divider />
    <div>
      <el-row :gutter="20" class="section">
        <el-col :span="12">
          <RevenueChart
            :revenueData="staStore.revenueData"
            :dateRange="dateRange"
          />
        </el-col>
        <el-col :span="12">
          <MemberChart
            :memberData="staStore.memberData"
            :dateRange="dateRange"
          />
        </el-col>
      </el-row>
      <el-row :gutter="20" class="section">
        <el-col :span="12">
          <OrderChart :orderOverviewData="staStore.orderData" />
        </el-col>
        <el-col :span="12">
          <TopSalesChart
            :topSalesData="staStore.saleData"
            :dateRange="[value[0], value[1]]"
          />
        </el-col>
      </el-row>
    </div>
    <el-dialog
      v-model="dialogVisible"
      title="数据导出"
      width="30%"
      height="20%"
      center
    >
      <el-checkbox
        v-model="checkAll"
        :indeterminate="indeterminate"
        @change="handleCheckAll"
        >全选</el-checkbox
      >
      <el-checkbox-group v-model="checkedList" @change="handleCheckedList">
        <el-checkbox
          v-for="item in charts"
          :key="item.id"
          :label="item.name"
          :value="item.id"
          >{{ item.name }}</el-checkbox
        >
      </el-checkbox-group>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button
            type="primary"
            :disabled="checkedList.length === 0"
            @click="handleExport"
            >导出</el-button
          >
        </div>
      </template>
    </el-dialog>
  </el-card>
</template>

<script lang="ts" setup>
import { ref } from "vue";

import RevenueChart from "../bm/data-show/chart/components/revenueChart.vue";
import MemberChart from "../bm/data-show/chart/components/memberChart.vue";
import OrderChart from "../bm/data-show/chart/components/orderChart.vue";
import TopSalesChart from "../bm/data-show/chart/components/topSalesChart.vue";
import { useStatisticsStore } from "@/store/bm/data-show/statistics";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Export from "@iconify-icons/ep/download";
import { message } from "@/utils/message";
import { PureHttpResponse } from "@/utils/http/types";
const value = ref();
const dateRange = ref([]);
const dialogVisible = ref(false);
const charts = [
  { id: 1, name: "营业额数据" },
  { id: 2, name: "新增用户数据" },
  { id: 3, name: "订单数据" },
  { id: 4, name: "销量数据" }
];
const checkAll = ref(false);
const indeterminate = ref(false);
const checkedList = ref([]);

const handleCheckAll = val => {
  checkedList.value = val ? charts.map(item => item.id) : [];
  indeterminate.value = false;
};

const handleCheckedList = val => {
  indeterminate.value = val.length > 0 && val.length < charts.length;
  checkAll.value = val.length === charts.length;
};
const staStore = useStatisticsStore();
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 月份从0开始，需要加1
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
const thisWeek = () => {
  // 本周
  const start = new Date();
  const end = new Date();
  // 获取当前日期是星期几（0-6，0 表示星期日）
  const dayOfWeek = start.getDay();

  // 计算本周的起始日期（星期一）
  start.setDate(start.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1));
  start.setHours(0, 0, 0, 0); // 设置时间为当天的0点0分0秒0毫秒

  // 计算本周的结束日期（星期日）
  end.setDate(end.getDate() - dayOfWeek + (dayOfWeek === 0 ? 0 : 7));
  end.setHours(23, 59, 59, 999); // 设置时间为当天的23点59分59秒999毫秒
  return [formatDate(start), formatDate(end)];
};
value.value = thisWeek();
const shortcuts = [
  {
    text: "本周",
    value: thisWeek()
  },
  {
    text: "前7天",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      return [start, end];
    }
  },
  {
    text: "上月",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      return [start, end];
    }
  },
  {
    text: "上3个月",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
      return [start, end];
    }
  }
];
const getDateRange = (start, end) => {
  const range = [];
  const current = new Date(start);
  const endDate = new Date(end);
  while (current <= endDate) {
    const year = current.getFullYear();
    const month = String(current.getMonth() + 1).padStart(2, "0");
    const day = String(current.getDate()).padStart(2, "0");
    range.push(`${year}-${month}-${day}`);
    current.setDate(current.getDate() + 1);
  }
  return range;
};

const initData = async () => {
  const data = {
    start: value.value[0],
    end: value.value[1]
  };
  dateRange.value = getDateRange(value.value[0], value.value[1]);
  console.log(dateRange.value);
  await staStore.getRevenueData(data);
  await staStore.getMemberData(data);
  await staStore.getOrderData(data);
  await staStore.getSaleData(data);
};
initData();

const handleRangePickerChange = (val: string) => {
  dateRange.value = getDateRange(value.value[0], value.value[1]);
  initData();
};
const handleExport = () => {
  const cb = (res: PureHttpResponse) => {
    console.log(res);
    if (res.data) {
      const blob = new Blob([res.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      });
      // 兼容不同浏览器的URL对象
      const url = window.URL || window.webkitURL;
      const href = url.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = href;
      // 获取响应头中的 content-disposition，获取文件名，处理中文名编码问题
      const contentDisposition = res.headers["content-disposition"];
      const fileName = contentDisposition.split("filename=")[1].split(";")[0]; // 修改此行
      const decodedFileName = decodeURIComponent(fileName);
      a.download = decodedFileName;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(a.href);
      document.body.removeChild(a);
      message("导出成功", {
        type: "success"
      });
    } else {
      message("导出失败", {
        type: "error"
      });
    }
  };
  staStore.exportData({
    types: checkedList.value,
    start: value.value[0],
    end: value.value[1]
  });
  dialogVisible.value = false;
};
</script>

<style scoped>
.section {
  margin-bottom: 20px;
}
</style>
