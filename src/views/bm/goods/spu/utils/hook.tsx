import "./reset.css";
import { message } from "@/utils/message";
import { getKeyList, deviceDetection } from "@pureadmin/utils";
import { ElMessageBox } from "element-plus";
import { type Ref, ref, onMounted } from "vue";
import { GOOD_STATUS_0, GOOD_STATUS_1 } from "@/constant/status";
import { useCategoryStore } from "@/store/bm/goods/category";
import { useSpuInfoStore } from "@/store/bm/goods/spu";

export function useGoods(tableRef: Ref, treeRef: Ref) {
  const supInfoStore = useSpuInfoStore();
  const categoryStore = useCategoryStore();
  const switchLoadMap = ref({});
  const higherCatOptions = ref();
  const selectedNum = ref(0);

  function onChange(row, index) {
    ElMessageBox.confirm(
      `确认要<strong>${
        row.status === 0 ? GOOD_STATUS_0 : GOOD_STATUS_1
      }</strong><strong style='color:var(--el-color-primary)'>${
        row.name
      }</strong>商品吗?`,
      "系统提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        dangerouslyUseHTMLString: true,
        draggable: true
      }
    )
      .then(() => {
        switchLoadMap.value[index] = Object.assign(
          {},
          switchLoadMap.value[index],
          {
            loading: true
          }
        );
        setTimeout(() => {
          switchLoadMap.value[index] = Object.assign(
            {},
            switchLoadMap.value[index],
            {
              loading: false
            }
          );
          message("已成功修改商品状态", {
            type: "success"
          });
        }, 300);
      })
      .catch(() => {
        row.status === 0 ? (row.status = 1) : (row.status = 0);
      });
  }

  function handleUpdate(row) {
    console.log(row);
  }

  function handleDelete(row) {
    message(`您删除了商品编号为${row.id}的这条数据`, { type: "success" });
    onSearch();
  }

  function handleSizeChange(val: number) {
    console.log(`${val} items per page`);
  }

  function handleCurrentChange(val: number) {
    console.log(`current page: ${val}`);
  }

  /** 当CheckBox选择项发生变化时会触发该事件 */
  function handleSelectionChange(val) {
    selectedNum.value = val.length;
    // 重置表格高度
    tableRef.value.setAdaptive();
  }

  /** 取消选择 */
  function onSelectionCancel() {
    selectedNum.value = 0;
    // 用于多选表格，清空用户的选择
    tableRef.value.getTableRef().clearSelection();
  }

  /** 批量删除 */
  function onbatchDel() {
    // 返回当前选中的行
    const curSelected = tableRef.value.getTableRef().getSelectionRows();
    // 接下来根据实际业务，通过选中行的某项数据，比如下面的id，调用接口进行批量删除
    message(`已删除商品编号为 ${getKeyList(curSelected, "id")} 的数据`, {
      type: "success"
    });
    tableRef.value.getTableRef().clearSelection();
    onSearch();
  }

  async function onSearch() {
    supInfoStore.loading = true;
    await supInfoStore.getSpuInfoPage();
    supInfoStore.loading = false;
  }

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    supInfoStore.form.catId = "";
    treeRef.value.onTreeReset();
    onSearch();
  };

  function onTreeSelect({ id, selected }) {
    supInfoStore.form.catId = selected ? id : "";
    onSearch();
  }

  onMounted(async () => {
    categoryStore.loading = true;
    onSearch();
    await categoryStore.getCategoryTree();
    higherCatOptions.value = categoryStore.treeData;
    categoryStore.loading = false;
  });

  return {
    selectedNum,
    switchLoadMap,
    onChange,
    deviceDetection,
    onSearch,
    resetForm,
    onbatchDel,
    onTreeSelect,
    handleUpdate,
    handleDelete,
    handleSizeChange,
    onSelectionCancel,
    handleCurrentChange,
    handleSelectionChange
  };
}
