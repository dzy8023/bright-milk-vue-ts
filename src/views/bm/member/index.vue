<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { columns } from "./utils/columns";
import PureTableBar from "@/components/RePureTableBar/src/bar";
import AddFill from "@iconify-icons/ri/add-circle-line";
import PureTable from "@pureadmin/table";
import {
  deleteIds,
  onDelete,
  onDeleteBatch,
  onSearch,
  switchLoadMap,
  openDialog,
  onResetPassword,
  updateMemberStatus
} from "./utils/hooks";
import Delete from "@iconify-icons/ep/delete";
import EditPen from "@iconify-icons/ep/edit-pen";
import Refresh from "@iconify-icons/ep/refresh";
import { selectUserinfo } from "@/components/ReTable/Userinfo/columns";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Password from "@iconify-icons/ri/lock-password-line";
import More from "@iconify-icons/ep/more-filled";
import { useMemberStore } from "@/store/bm/member";
import {
  genderConstant,
  tableSelectButtonClass,
  UserAvatar,
  userStatus
} from "@/enums/baseConstant";
import { deviceDetection } from "@pureadmin/utils";
import { FormInstance } from "element-plus";
import { usePublicHooks } from "@/views/hooks";
import { auth } from "./utils/auth";
import { hasAuth } from "@/router/utils";

const memberStore = useMemberStore();
// 用户是否停用样式
const { switchStyle } = usePublicHooks();
const tableRef = ref();
const formRef = ref();

/** 当前页改变时 */
const onCurrentPageChange = async (value: number) => {
  memberStore.pagination.currentPage = value;
  await onSearch();
};

/** 当分页发生变化 */
const onPageSizeChange = async (value: number) => {
  memberStore.pagination.pageSize = value;
  await onSearch();
};

/** 重置表单 */
const resetForm = async (formEl: FormInstance) => {
  if (!formEl) return;
  formEl.resetFields();
  await onSearch();
};

/** 选择多行 */
const onSelectionChange = (rows: Array<any>) => {
  deleteIds.value = rows.map((row: any) => row.id);
};

onMounted(() => {
  onSearch();
});
</script>

<template>
  <div :class="['flex', 'justify-between', deviceDetection() && 'flex-wrap']">
    <div :class="[deviceDetection() ? ['w-full', 'mt-2'] : 'w-[calc(100%)]']">
      <Auth :value="auth.search">
        <el-form
          ref="formRef"
          :inline="true"
          :model="memberStore.form"
          class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px] overflow-auto"
        >
          <!-- 查询用户名 -->
          <el-form-item label="名称" prop="name">
            <el-input
              v-model="memberStore.form.name"
              placeholder="输入名称"
              class="!w-[180px]"
              clearable
            />
          </el-form-item>
          <!-- 查询手机号 -->
          <el-form-item label="手机号" prop="phone">
            <el-input
              v-model="memberStore.form.phone"
              placeholder="输入手机号"
              class="!w-[180px]"
              clearable
            />
          </el-form-item>

          <!-- 查询性别 -->
          <el-form-item label="性别" prop="gender">
            <el-select
              v-model="memberStore.form.gender"
              placeholder="输入性别"
              class="!w-[180px]"
              clearable
              filterable
            >
              <el-option
                v-for="(item, index) in genderConstant"
                :key="index"
                :label="item.label"
                :navigationBar="false"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <!-- 查询状态 -->
          <el-form-item label="状态" prop="status">
            <el-select
              v-model="memberStore.form.status"
              placeholder="输入状态"
              class="!w-[180px]"
              clearable
              filterable
            >
              <el-option
                v-for="(item, index) in userStatus"
                :key="index"
                :label="item.label"
                :navigationBar="false"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button
              :icon="useRenderIcon('ri:search-line')"
              :loading="memberStore.loading"
              type="primary"
              @click="onSearch"
            >
              搜索
            </el-button>
            <el-button
              :icon="useRenderIcon(Refresh)"
              @click="resetForm(formRef)"
            >
              重置</el-button
            >
          </el-form-item>
        </el-form>
      </Auth>

      <PureTableBar
        :columns="columns"
        title="用户信息"
        @fullscreen="tableRef.setAdaptive()"
        @refresh="onSearch"
      >
        <template #buttons>
          <el-button
            v-if="hasAuth(auth.add)"
            :icon="useRenderIcon(AddFill)"
            type="primary"
            @click="openDialog(true)"
          >
            新增
          </el-button>

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
            :data="memberStore.datalist"
            :header-cell-style="{
              background: 'var(--el-fill-color-light)',
              color: 'var(--el-text-color-primary)'
            }"
            :loading="memberStore.loading"
            :pagination="memberStore.pagination"
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
            <!-- 显示头像 -->
            <template #avatar="{ row }">
              <el-image
                :preview-src-list="Array.of(row.avatar || UserAvatar)"
                :src="row.avatar || UserAvatar"
                class="w-[24px] h-[24px] rounded-full align-middle"
                fit="cover"
                preview-teleported
              >
                <template #error>
                  <div class="image-slot">
                    <img :src="UserAvatar" alt="" />
                  </div>
                </template>
              </el-image>
            </template>

            <!-- 显示用户状态 -->
            <template #status="{ row, index }">
              <el-switch
                v-model="row.status"
                active-text="启用"
                :active-value="1"
                inactive-text="禁用"
                :inactive-value="0"
                :loading="switchLoadMap[index]?.loading"
                :style="switchStyle"
                inline-prompt
                @click="updateMemberStatus(row, index)"
              />
            </template>

            <!-- 用户性别 -->
            <template #gender="{ row }">
              <el-tag :type="row.gender === 0 ? 'danger' : null" effect="plain">
                {{ row.gender === 1 ? "男" : "女" }}
              </el-tag>
            </template>

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
              <!-- 修改 -->
              <el-button
                v-if="hasAuth(auth.update)"
                :icon="useRenderIcon(EditPen)"
                :size="size"
                class="reset-margin"
                link
                type="primary"
                @click="openDialog(false, row)"
              >
                修改
              </el-button>

              <!-- 删除 -->
              <el-popconfirm
                v-if="hasAuth(auth.deleted)"
                :title="`删除 ${row.username}?`"
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

              <!-- 更多操作 -->
              <el-dropdown>
                <el-button
                  :icon="useRenderIcon(More)"
                  :size="size"
                  class="ml-3 mt-[2px]"
                  link
                  type="primary"
                />
                <template #dropdown>
                  <el-dropdown-menu>
                    <!-- 重置密码 -->
                    <el-dropdown-item v-if="hasAuth(auth.resetPassword)">
                      <el-button
                        :class="tableSelectButtonClass"
                        :icon="useRenderIcon(Password)"
                        :size="size"
                        link
                        type="primary"
                        @click="onResetPassword(row)"
                      >
                        重置密码
                      </el-button>
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
