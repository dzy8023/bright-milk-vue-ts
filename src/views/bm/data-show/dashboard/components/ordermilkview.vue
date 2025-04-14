<template>
  <el-card>
    <div class="card-header">
      <span>订奶总览</span>
      <el-button
        text
        class="detail-link"
        @click="router.push('/admin/orderMilk')"
        >订奶管理</el-button
      >
    </div>
    <div class="data-grid1">
      <div
        v-for="(item, index) in orderMilkOverview"
        :key="index"
        class="left-right-data-card"
      >
        <div class="data-title">
          <el-icon :size="20">
            <component :is="item.icon" />
          </el-icon>
          {{ item.title }}
        </div>
        <div class="data-value">{{ item.value }}</div>
      </div>
      <div class="add-button" @click="handleAdd">
        <el-icon :size="20" class="custom-icon">
          <plus />
        </el-icon>
        <div>新增</div>
      </div>
      <div
        v-for="(item, index) in orderMilkOverview"
        :key="index"
        class="left-right-data-card"
      >
        <div class="data-title">
          <el-icon :size="20">
            <component :is="item.icon" />
          </el-icon>
          {{ item.title }}
        </div>
        <div class="data-value">{{ item.value }}</div>
      </div>
      <div class="add-button" @click="handleAdd">
        <el-icon :size="20" class="custom-icon">
          <plus />
        </el-icon>
        <div>新增</div>
      </div>
    </div>
  </el-card>
</template>
<script setup>
import { Plus } from "@element-plus/icons-vue";
import "@/styles/dashboard.scss";
import { useRouter } from "vue-router";
const router = useRouter();

const props = defineProps({
  currentDate: String,
  orderMilkOverview: Array
});

const handleAdd = () => {
  // 处理新增菜品的逻辑
  console.log("新增菜品");
};
</script>
