<script lang="ts" setup>
import { onMounted, ref } from "vue";

import PureTableBar from "@/components/RePureTableBar/src/bar";
import Delete from "@iconify-icons/ep/delete";
import EditPen from "@iconify-icons/ep/edit-pen";
import Refresh from "@iconify-icons/ep/refresh";
import AddFill from "@iconify-icons/ri/add-circle-line";
import {
  assignBatchRolesToRouter,
  assignRolesToRouter,
  clearAllRolesSelect,
  onAdd,
  onChangeMenuRank,
  onchangeVisible,
  onDelete,
  onSearch,
  onUpdate,
  selectIds,
  switchLoadMap,
  tableRef
} from "@/views/system/menu/utils/hooks";
import PureTable from "@pureadmin/table";
import { columns } from "@/views/system/menu/utils/columns";
import { userMenuStore } from "@/store/system/menu";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { selectUserinfo } from "@/components/ReTable/Userinfo/columns";
import More from "@iconify-icons/ep/more-filled";
import Upload from "@iconify-icons/ri/upload-line";
import { FormInstance } from "element-plus";
import { usePublicHooks } from "@/views/hooks";
import { auth } from "@/views/system/menu/utils/auth";
import { hasAuth } from "@/router/utils";

const formRef = ref();
const routerStore = userMenuStore();
// 用户是否停用样式
const { switchStyle } = usePublicHooks();

/**
 * 表单重置
 * @param formEl
 */
const resetForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  await onSearch();
};

/**
 * * 选择多行
 * @param rows
 */
const onSelectionChange = (rows: Array<any>) => {
  selectIds.value = rows.map((row: any) => row.id);
};

onMounted(() => {
  onSearch();
});
</script>

<template>
  <div class="main">
    <Auth :value="auth.search">
      <el-form
        ref="formRef"
        :inline="true"
        :model="routerStore.form"
        class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px] overflow-auto"
      >
        <el-form-item label="菜单名称" prop="title">
          <el-input
            v-model="routerStore.form.title"
            placeholder="输入菜单名称"
            class="!w-[180px]"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button
            :icon="useRenderIcon('ri:search-line')"
            :loading="routerStore.loading"
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
    </Auth>

    <PureTableBar
      :columns="columns"
      :isExpandAll="false"
      :tableRef="tableRef?.getTableRef()"
      title="菜单管理"
      @fullscreen="tableRef?.setAdaptive()"
      @refresh="onSearch"
    >
      <template #buttons>
        <!-- 添加菜单 -->
        <el-button
          v-if="hasAuth(auth.add)"
          :icon="useRenderIcon(AddFill)"
          type="primary"
          @click="onAdd()"
        >
          新增
        </el-button>

        <!-- 批量为菜单添加角色 -->
        <el-button
          v-if="hasAuth(auth.assignAddBatchRolesToRouter)"
          :disabled="!(selectIds.length > 0)"
          :icon="useRenderIcon('iwwa:assign')"
          type="warning"
          @click="assignBatchRolesToRouter()"
        >
          批量关联角色
        </el-button>

        <!-- 清除选中所以角色 -->
        <el-button
          v-if="hasAuth(auth.clearAllRolesSelect)"
          :disabled="!(selectIds.length > 0)"
          :icon="useRenderIcon('ic:baseline-clear')"
          type="danger"
          @click="clearAllRolesSelect()"
        >
          清除所有角色
        </el-button>
      </template>

      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          ref="tableRef"
          :adaptiveConfig="{ offsetBottom: 96 }"
          :columns="dynamicColumns"
          :data="routerStore.dataList"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
          :loading="routerStore.loading"
          :size="size"
          adaptive
          align-whole="center"
          border
          highlight-current-row
          row-key="id"
          showOverflowTooltip
          table-layout="auto"
          @selection-change="onSelectionChange"
        >
          <template #visible="{ row, index }">
            <el-switch
              v-model="row.visible"
              active-text="显示"
              :active-value="true"
              inactive-text="隐藏"
              :inactive-value="false"
              :loading="switchLoadMap[index]?.loading"
              :style="switchStyle"
              inline-prompt
              @click="onchangeVisible(row, index)"
            />
          </template>

          <template #rank="{ row }">
            <el-input
              v-model="row.rank"
              :max="9999"
              :min="1"
              type="number"
              @blur="onChangeMenuRank(row)"
            />
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
              @click="onUpdate(row)"
            >
              修改
            </el-button>

            <!-- 新增 -->
            <Auth :value="auth.add">
              <el-button
                v-show="row.menuType !== 3"
                :icon="useRenderIcon(AddFill)"
                :size="size"
                class="reset-margin"
                link
                type="primary"
                @click="onAdd(row.id)"
              >
                新增
              </el-button>
            </Auth>
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
                  <el-dropdown-item v-if="hasAuth(auth.deleted)">
                    <!-- 删除操作 -->
                    <el-popconfirm
                      :title="`删除 ${row.title}?`"
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
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <!-- 分配角色 -->
                    <Auth :value="auth.assignRolesToRouter">
                      <el-button
                        v-show="row.menuType !== 3"
                        :icon="useRenderIcon(Upload)"
                        :size="size"
                        class="reset-margin"
                        link
                        type="primary"
                        @click="assignRolesToRouter(row)"
                      >
                        分配角色
                      </el-button>
                    </Auth>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-table__inner-wrapper::before) {
  height: 0;
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
