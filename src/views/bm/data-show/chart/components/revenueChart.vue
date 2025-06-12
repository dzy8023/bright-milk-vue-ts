<template>
  <el-card>
    <template #header>营业额统计</template>
    <div ref="revenueChart" class="chart" />
  </el-card>
  <el-dialog
    v-model="dialogVisible"
    top="2%"
    :destroy-on-close="true"
    :draggable="true"
    :title="title"
    width="40%"
    :before-close="handleClose"
    center
  >
    <el-table :data="saleData" border style="width: 100%" height="450">
      <el-table-column
        fixed
        prop="name"
        label="牛奶名称"
        style="height: 40px"
      />
      <el-table-column
        prop="image"
        label="牛奶图片"
        style="height: 50px; padding: 0"
      >
        <template #default="{ row }">
          <el-image
            style="
              width: 100%;
              height: 50px;
              cursor: pointer;
              object-fit: contain;
            "
            :src="row.image"
          >
            <!-- 修改了这里 -->
            <template #error>
              <div class="image-slot">
                <img
                  :src="noImage"
                  style="width: 100%; height: 50px; object-fit: cover"
                />
              </div>
            </template>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column prop="number" label="销售数量" />
      <!-- 添加了 style -->
      <el-table-column prop="totalAmount" label="总价" />
      <!-- 添加了 style -->
    </el-table>
    <template #footer>
      <el-button type="primary" size="large" @click="dialogVisible = false"
        >关闭</el-button
      >
    </template>
  </el-dialog>
</template>

<script setup>
import noImage from "@/assets/img/noImg.png";
import { ref, onMounted, watch, nextTick } from "vue";
// import { getMilksSaleData } from "@/api/milk";

import * as echarts from "echarts";
const dialogVisible = ref(false);
const saleData = ref(null);
const title = ref("营业额统计");
const handleClose = () => {
  dialogVisible.value = false;
};

const props = defineProps({
  revenueData: {
    type: Array,
    required: true,
    default: () => []
  },
  dateRange: {
    type: Array,
    required: true,
    default: () => []
  }
});
const revenueChart = ref(null);
const initData = () => {
  let data = [];
  if (props.dateRange.length <= 15) {
    props.dateRange.forEach((item, index) => {
      const revenue = props.revenueData.find(revenue => revenue.date === item);
      data[index] = revenue ? revenue.amount : 0;
    });
  } else {
    props.dateRange.forEach((item, index) => {
      const revenue = props.revenueData.find(revenue => revenue.date === item);
      data[index] = revenue ? revenue.amount : "-";
    });
  }
  return data;
};
const initRevenueChart = () => {
  if (revenueChart.value) {
    echarts.dispose(revenueChart.value); // 销毁已有的图表实例
  }
  const chart = echarts.init(revenueChart.value);
  const data = initData();
  const option = {
    title: {
      text: "营业额统计"
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "line",
        lineStyle: {
          color: "#ffc200",
          width: 1.5,
          shadowColor: "rgba(255, 242, 105, 0.8)",
          shadowBlur: 10
        }
      }
    },
    legend: {
      orient: "vertical",
      left: "right",
      top: "top",
      textStyle: {
        color: "#333"
      }
    },
    xAxis: {
      type: "category",
      data: props.dateRange,
      axisTick: {
        alignWithLabel: true
      }
    },
    yAxis: {
      type: "value",
      axisTick: {
        show: false
      },
      axisLine: {
        lineStyle: {
          color: "#57617B"
        }
      }
    },
    series: [
      {
        name: "营业额",
        data: data,
        type: "line",
        connectNulls: true,
        itemStyle: {
          color: "#fd7f7f"
        },
        emphasis: {
          itemStyle: {
            color: "#ffe400",
            borderWidth: 5,
            borderColor: "#fd7f7f"
          }
        },
        symbolSize: data.length > 10 ? 0 : 10 //圆点大小
      },
      {
        name: "营业额",
        data: data,
        showBackground: true,
        label: {
          show: true,
          position: "top",
          color: "#333"
        },
        type: "bar"
      }
    ]
  };
  chart.setOption(option);
  chart.on("click", function (params) {
    if (params.value > 0) {
      // getMilksSaleData(params.name).then(res => {
      //   saleData.value = res.data;
      //   dialogVisible.value = true;
      // });
    }
  });
};
onMounted(() => {
  nextTick(() => {
    initRevenueChart();
  });
});
watch([() => props.revenueData], () => {
  initRevenueChart();
});
</script>
<style scoped lang="scss">
.chart {
  width: 100%;
  height: 400px; /* 确保图表有高度 */
}
</style>
