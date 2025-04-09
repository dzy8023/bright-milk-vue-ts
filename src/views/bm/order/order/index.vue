<script setup lang="ts">
import { ref, computed, nextTick, onMounted, h } from "vue";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { tableSelectButtonClass, iconClass } from "@/enums/baseConstant";
import { useOrder } from "./utils/hook";
import { columns } from "./utils/columns";
import { selectMemberInfo } from "@/components/ReTable/Userinfo/columns";

import More from "@iconify-icons/ep/more-filled";
import Delete from "@iconify-icons/ep/delete";
import Refresh from "@iconify-icons/ep/refresh";
import View from "@iconify-icons/ep/view";
import Refund from "@iconify-icons/ep/coin";
import Remind from "@iconify-icons/ep/phone";
import Relate from "@iconify-icons/ep/set-up";
import Consign from "@iconify-icons/ep/van";
import Cancel from "@iconify-icons/ri/file-excel-line";
import { auth } from "./utils/auth";
import { hasAuth } from "@/router/utils";
import { useOrderStore } from "@/store/bm/order/order";
import {
  orderStatus,
  orderSourceType,
  orderPostType,
  verifyStatusMap
} from "@/enums/baseConstant";
import ReCopy from "@/components/ReCopy";

const formRef = ref();
const tableRef = ref();
const orderStore = useOrderStore();

const {
  selectedNum,
  deviceDetection,
  onSearch,
  resetForm,
  handleView,
  handleConsign,
  handleRefund,
  handleCancel,
  handleRemind,
  handleDelete,
  onbatchDel,
  onSelectionCancel,
  handleSizeChange,
  handleCurrentChange,
  handleSelectionChange
} = useOrder(tableRef);

onMounted(() => {
  onSearch();
});
</script>

<template>
  <div :class="['flex', 'justify-between', deviceDetection() && 'flex-wrap']">
    <div :class="[deviceDetection() ? ['w-full', 'mt-2'] : 'w-[calc(100%)]']">
      <el-form
        ref="formRef"
        :inline="true"
        :model="orderStore.form"
        class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px] overflow-auto"
      >
        <!-- <el-form-item label="memberId" prop="memberId">
          <el-autocomplete
            v-model="orderStore.form.memberId"
            placeholder="请输入memberId"
            clearable
            class="!w-[200px]"
            :fetch-suggestions="querySearch"
            @clear="onSearch"
            @keyup.enter="onSearch"
          >
            <template #default="{ item }">
              <span v-tippy="{ content: item.name }">{{ item.value }}</span>
            </template>
          </el-autocomplete>
        </el-form-item> -->
        <el-form-item label="用户名：" prop="username">
          <el-input
            v-model="orderStore.form.username"
            placeholder="请输入用户名"
            clearable
            class="!w-[180px]"
          />
        </el-form-item>
        <el-form-item label="手机号：" prop="phone">
          <el-input
            v-model="orderStore.form.phone"
            placeholder="请输入手机号"
            clearable
            class="!w-[180px]"
          />
        </el-form-item>
        <el-form-item label="订单号：" prop="orderSn">
          <el-input
            v-model="orderStore.form.orderSn"
            placeholder="请输入订单号"
            clearable
            class="!w-[180px]"
          />
        </el-form-item>
        <el-form-item label="状态：" prop="status">
          <el-select
            v-model="orderStore.form.status"
            placeholder="请选择"
            clearable
            class="!w-[180px]"
          >
            <el-option
              v-for="item in orderStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="来源：" prop="sourceType">
          <el-select
            v-model="orderStore.form.sourceType"
            placeholder="请选择"
            clearable
            class="!w-[180px]"
          >
            <el-option
              v-for="item in orderSourceType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="配送方式：" prop="postType">
          <el-select
            v-model="orderStore.form.postType"
            placeholder="请选择"
            clearable
            class="!w-[180px]"
          >
            <el-option
              v-for="item in orderPostType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :icon="useRenderIcon('ri:search-line')"
            :loading="orderStore.loading"
            @click="onSearch"
          >
            搜索
          </el-button>
          <el-button :icon="useRenderIcon(Refresh)" @click="resetForm(formRef)">
            重置
          </el-button>
        </el-form-item>
      </el-form>
      <PureTableBar title="订单管理" :columns="columns" @refresh="onSearch">
        <template v-slot="{ size, dynamicColumns }">
          <div
            v-if="selectedNum > 0"
            v-motion-fade
            class="bg-[var(--el-fill-color-light)] w-full h-[46px] mb-2 pl-4 flex items-center"
          >
            <div class="flex-auto">
              <span
                style="font-size: var(--el-font-size-base)"
                class="text-[rgba(42,46,54,0.5)] dark:text-[rgba(220,220,242,0.5)]"
              >
                已选 {{ selectedNum }} 项
              </span>
              <el-button type="primary" text @click="onSelectionCancel">
                取消选择
              </el-button>
            </div>
            <el-popconfirm title="是否确认删除?" @confirm="onbatchDel">
              <template #reference>
                <el-button type="danger" text class="mr-1">
                  批量删除
                </el-button>
              </template>
            </el-popconfirm>
          </div>
          <pure-table
            ref="tableRef"
            :adaptiveConfig="{ offsetBottom: 96 }"
            :columns="dynamicColumns"
            :data="orderStore.dataList"
            :header-cell-style="{
              background: 'var(--el-fill-color-light)',
              color: 'var(--el-text-color-primary)'
            }"
            :loading="orderStore.loading"
            :pagination="orderStore.pagination"
            :size="size"
            adaptive
            align-whole="center"
            border
            highlight-current-row
            row-key="id"
            showOverflowTooltip
            table-layout="auto"
            @page-size-change="handleSizeChange"
            @selection-change="handleSelectionChange"
            @page-current-change="handleCurrentChange"
          >
            <template #orderSn="{ row }">
              <ReCopy :value="row.orderSn" />
            </template>
            <template #username="{ row }">
              <el-button
                v-show="row.username"
                link
                type="primary"
                @click="selectMemberInfo(row.memberId)"
              >
                {{ row.username }}
              </el-button>
            </template>
            <template #status="{ row }">
              <el-tag type="info" class="ml-1">
                {{ orderStatus[row.status - 1].label }}
              </el-tag>
            </template>
            <template #sourceType="{ row }">
              <el-tag
                :type="orderSourceType[row.sourceType - 1].type"
                class="ml-1"
              >
                {{ orderSourceType[row.sourceType - 1].label }}
              </el-tag>
            </template>
            <template #postType="{ row }">
              <el-tag :type="orderPostType[row.postType - 1].type" class="ml-1">
                {{ orderPostType[row.postType - 1].label }}
              </el-tag>
            </template>
            <template #operation="{ row }">
              <el-button
                class="reset-margin"
                link
                type="primary"
                :size="size"
                :icon="useRenderIcon(View)"
                @click="handleView(row)"
              >
                查看
              </el-button>
              <el-button
                :disabled="!verifyStatusMap['consign'].has(row.status)"
                link
                type="primary"
                :size="size"
                :icon="useRenderIcon(Consign)"
                @click="handleConsign(row)"
              >
                发货
              </el-button>
              <el-dropdown>
                <el-button
                  class="ml-3 mt-[2px]"
                  link
                  type="primary"
                  :size="size"
                  :icon="useRenderIcon(More)"
                />
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item>
                      <el-button
                        :disabled="!verifyStatusMap['remind'].has(row.status)"
                        :class="tableSelectButtonClass"
                        link
                        type="primary"
                        :size="size"
                        :icon="useRenderIcon(Remind)"
                        @click="handleRemind(row)"
                      >
                        催单
                      </el-button>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <el-button
                        :disabled="!verifyStatusMap['refund'].has(row.status)"
                        link
                        type="primary"
                        :size="size"
                        :icon="useRenderIcon(Refund)"
                        @click="handleRefund(row)"
                      >
                        退款
                      </el-button>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <el-button
                        :disabled="!verifyStatusMap['cancel'].has(row.status)"
                        link
                        type="warning"
                        :size="size"
                        :icon="useRenderIcon(Cancel)"
                        @click="handleCancel(row)"
                      >
                        取消
                      </el-button>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <el-popconfirm
                        :title="`是否确认删除角色名称为${row.name}的这条数据`"
                        @confirm="handleDelete(row)"
                      >
                        <template #reference>
                          <el-button
                            :disabled="
                              !verifyStatusMap['delete'].has(row.status)
                            "
                            class="reset-margin"
                            link
                            type="danger"
                            :size="size"
                            :icon="useRenderIcon(Delete)"
                          >
                            删除
                          </el-button>
                        </template>
                      </el-popconfirm>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
          </pure-table>
        </template>
      </PureTableBar>
    </div>
  </div>
</template>

<style scoped lang="scss">
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}

:deep(.el-button:focus-visible) {
  outline: none;
}

.main-content {
  margin: 24px 24px 0 !important;
}

.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}
</style>
