<template>
  <el-card>
    <template #header>用户统计</template>
    <div ref="memberChart" class="chart" />
  </el-card>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import * as echarts from "echarts";

const props = defineProps({
  memberData: {
    type: Object,
    required: true
  },
  dateRange: {
    type: Array,
    required: true
  }
});
const memberChart = ref(null);
const initData = () => {
  let totalMembers = [];
  let newMembers = [];
  let temp = props.memberData.totalMember;
  props.dateRange.forEach((item, index) => {
    const member = props.memberData.newMember?.find(
      member => member.date === item
    );
    newMembers[index] = member ? member.count : 0;
    temp += newMembers[index];
    totalMembers[index] = temp;
  });
  return { totalMembers, newMembers };
};
const initMemberChart = () => {
  if (memberChart.value) {
    echarts.dispose(memberChart.value); // 销毁已有的图表实例
  }
  const chart = echarts.init(memberChart.value);
  const data = initData();
  const option = {
    title: {
      text: "用户统计"
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
      type: "value"
    },
    series: [
      {
        name: "用户总量",
        data: data.totalMembers,
        type: "line",
        emphasis: {
          color: "#5c7bd9",
          itemStyle: {
            // 圆点颜色
            color: "#ffe400",
            borderWidth: 5,
            borderColor: "#5c7bd9"
          }
        },
        symbolSize: data.totalMembers.length > 10 ? 0 : 10 //圆点大小
      },
      {
        name: "新增用户",
        data: data.newMembers,
        type: "line",
        emphasis: {
          color: "#FD7F7F",
          itemStyle: {
            // 圆点颜色
            color: "#ffe400",
            borderWidth: 5,
            borderColor: "#FD7F7F"
          }
        },
        symbolSize: data.newMembers.length > 10 ? 0 : 10 //圆点大小
      }
    ]
  };
  chart.setOption(option);
};
onMounted(() => {
  initMemberChart();
});
watch(
  () => props.memberData,
  () => {
    initMemberChart();
  }
);
</script>
<style scoped lang="scss">
.chart {
  width: 100%;
  height: 400px; /* 确保图表有高度 */
}
</style>
