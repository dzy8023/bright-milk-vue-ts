<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { useRoleStore } from "@/store/system/role";
import { userMenuStore } from "@/store/system/menu";

const props = defineProps({
  routerId: { type: String as PropType<String> },
  warning: { type: String as PropType<String> }
});

const roleStore = useRoleStore();
const menuStore = userMenuStore();
// 分配的角色
const assignRoles = ref([]);

/**
 * * 根据用户id获取当前用户角色
 */
const getRoleListByRouterId = async () => {
  // 初始化值为空数组
  assignRoles.value = [];

  // 根据用户id查询角色信息
  const routerId = props.routerId;
  if (routerId) {
    assignRoles.value = await menuStore.getRoleListByRouterId({ routerId });
  }
};

onMounted(() => {
  roleStore.getAllRoles();
  getRoleListByRouterId();
});

defineExpose({ assignRoles });
</script>

<template>
  <div class="flex flex-col items-center">
    <el-text v-show="warning" class="mx-1" type="danger">{{ warning }}</el-text>
    <el-transfer
      v-model="assignRoles"
      :button-texts="['撤回', '添加']"
      :data="roleStore.allRoleList"
      filter-placeholder="查找路由"
      :format="{
        noChecked: `总共 $\{total}`,
        hasChecked: '${checked}/${total}'
      }"
      :titles="['未添加', '已添加']"
      class="m-3"
      filterable
    />
  </div>
</template>
