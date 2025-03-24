<script setup lang="ts">
import ReUpload from "@/components/ReUpload";
import { computed, ref } from "vue";
import PureTableBar from "@/components/RePureTableBar/src/bar";
import More from "@iconify-icons/ep/more-filled";
import Delete from "@iconify-icons/ep/delete";
import EditPen from "@iconify-icons/ep/edit-pen";
import AddFill from "@iconify-icons/ri/add-circle-line";
import View from "@iconify-icons/ep/view";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
// import MyTagGroup from "@/views/components/attrCheckbox/utils/my-tag-group.vue";
defineOptions({
  name: "SkuTab"
});
const tableRef = ref();
const selectedNum = ref(0);
const props = defineProps({
  tableData: Array as PropType<Array<any>>,
  columns: Array as PropType<TableColumnList>
});
const emit = defineEmits(["update:tableData"]);
const tableData = computed({
  get: () => {
    return props.tableData;
  },
  set: (val: Array<any>) => {
    emit("update:tableData", val);
  }
});
const handleTableDataUpdate = (newTableData: Array<any>) => {
  emit("update:tableData", newTableData);
};
const handleAdd = (row: any) => {
  // 假设'row'对象具有'id'，并以此作为插入依据
  const index = tableData.value.findIndex(item => item.id === row.id);
  const newRow = { ...row, id: index + 1 };
  // 插入行数据到特定位置
  const updatedTableData = [
    ...tableData.value.slice(0, index + 1), // 当前行之后的数据
    newRow, // 新增行
    ...tableData.value
      .slice(index + 1)
      .map(item => ({ ...item, id: item.id + 1 })) // 其他数据
  ];
  handleTableDataUpdate(updatedTableData); // 更新表格
};

const handleDelete = (row: any) => {
  const newData = tableData.value.filter(item => item.id !== row.id);
  handleTableDataUpdate(newData);
};
const handleUpdate = (row: any) => {
  // 假设你需要更新某个 row 的数据
  const newData = tableData.value.map(item =>
    item.id === row.id ? row : item
  );
  handleTableDataUpdate(newData);
};

function handleSelectionChange(val) {
  selectedNum.value = val.length;
  // 重置表格高度
  tableRef.value.setAdaptive();
}
/** 取消选择 */
function onSelectionCancel() {
  selectedNum.value = 0;
  tableRef.value.getTableRef().clearSelection();
}

/** 批量删除 */
function onbatchDel() {
  tableRef.value.getTableRef().clearSelection();
}
function onFullscreen() {
  // 重置表格高度
  tableRef.value.setAdaptive();
}
</script>

<template>
  <div class="w-[100%]">
    <PureTableBar
      title="商品管理（仅演示，操作后不生效）"
      :columns="columns"
      :isExpandAll="false"
      @fullscreen="onFullscreen"
    >
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
              <el-button type="danger" text class="mr-1"> 批量删除 </el-button>
            </template>
          </el-popconfirm>
        </div>
        <!-- :adaptive-config="{ offsetButtom: 50 }"  -->
        <pure-table
          ref="tableRef"
          row-key="id"
          adaptive
          :size="size"
          align-whole="center"
          table-layout="auto"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
          :data="tableData"
          :columns="dynamicColumns"
          border
          @selection-change="handleSelectionChange"
        >
          <template #expand="{ row }">
            <div class="ml-16">
              <h3 class="mb-2">商品名称: {{ row.spuName }}</h3>
              <p class="mb-4">
                商品分类: {{ row.category.map(item => item.name).join("/") }}
              </p>
              <p class="mb-2">
                商品图片:
                <ReUpload v-model="row.image" :limit="1" :multiple="false" />
              </p>
              <p class="mb-2">
                商品描述:
                <br />
                <el-input
                  v-model="row.desc"
                  style="width: 240px"
                  :autosize="{ minRows: 2, maxRows: 4 }"
                  maxlength="128"
                  type="textarea"
                  show-word-limit
                  placeholder="请输入sku描述，最多128字"
                />
              </p>
            </div>
          </template>
          <template #name="{ row }">
            <div class="m-4">
              <el-input v-model="row.name" placeholder="sku名称" />
            </div>
          </template>
          <template #price="{ row }">
            <div class="m-4">
              <el-input-number
                v-model="row.price"
                :min="0"
                :step="0.01"
                :precision="2"
                placeholder="请输入sku价格"
              />
            </div>
          </template>
          <template #discount="{ row }">
            <div class="m-4">
              <el-input-number
                v-model="row.discount"
                :min="0"
                :step="0.01"
                :precision="2"
                placeholder="请输入sku折扣"
              />
            </div>
          </template>
          <template #spuAttrs="{ row, column }">
            <div class="flex flex-wrap">
              <el-tag
                v-for="(item, index) in row[column.property].value"
                :key="index"
                class="mr-1"
                >{{ item }}</el-tag
              >
              <!-- <MyTagGroup v-model="row[column.property].value" /> -->
              <div
                class="quickShow ml-1 flex items-center"
                @click="
                  () =>
                    (row[column.property].quickShow =
                      row[column.property].quickShow === 1 ? 0 : 1)
                "
              >
                <div
                  class="w-3 h-3 rounded-full"
                  :style="{
                    backgroundColor:
                      row[column.property]?.quickShow === 1
                        ? '#81cc95'
                        : '#e44033'
                  }"
                />
                快速展示
              </div>
            </div>
          </template>
          <template #operation="{ row }">
            <el-button
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="useRenderIcon(AddFill)"
              @click="handleAdd(row)"
            >
              新增同类
            </el-button>
            <el-button
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="useRenderIcon(EditPen)"
              @click="handleUpdate(row)"
            >
              修改
            </el-button>
            <!-- 更多操作 -->
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
                    <el-popconfirm
                      :title="`是否确认删除商品编号为${row.id}的这条数据`"
                      @confirm="handleDelete(row)"
                    >
                      <template #reference>
                        <el-button
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
</template>
<style scoped>
.quickShow {
  margin-left: 10px;
  cursor: pointer;
}

.quickShow:hover {
  color: #409eff;
}
</style>
