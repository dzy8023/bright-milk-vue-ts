import { message } from "@/utils/message";
import { deviceDetection } from "@pureadmin/utils";
import { useOrderStore } from "@/store/bm/order/order";
import { type Ref, ref } from "vue";
import OrderInfo from "../form/order-info.vue";
import { addDialog } from "@/components/ReDialog";

export function useOrder(tableRef: Ref) {
  const curRow = ref();
  const selectedNum = ref(0);
  const orderStore = useOrderStore();

  /** 当CheckBox选择项发生变化时会触发该事件 */
  function handleSelectionChange(val) {
    console.log(val);
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

  const onbatchDel = () => {
    message("批量删除成功", { type: "success" });
    onSearch();
  };

  const handleView = async row => {
    const res = await orderStore.queryOrderDetail(row.id);
    if (!res) {
      return;
    }
    const orderInfo = { ...row, ...res };
    addDialog({
      title: "订单详情",
      width: "45%",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: true,
      contentRenderer: (): JSX.Element => <OrderInfo orderInfo={orderInfo} />
    });
  };

  const handleConsign = row => {
    const res = orderStore.consignOrder([row.id]);
    if (res) {
      row.status += 1;
    }
  };

  const handleRefund = row => {
    const res = orderStore.refundOrder([row.id]);
    if (res) {
      row.status += 1;
    }
  };

  const handleCancel = row => {
    orderStore.cancelOrder([row.id]);
  };

  const handleRemind = row => {
    orderStore.remindOrder([row.id]);
  };

  function handleDelete(row) {
    message(`您删除了订单编号为${row.id}的这条数据`, { type: "success" });
    onSearch();
  }

  function handleSizeChange(val: number) {
    console.log(`${val} items per page`);
  }

  function handleCurrentChange(val: number) {
    console.log(`current page: ${val}`);
  }

  async function onSearch() {
    orderStore.loading = true;
    await orderStore.getOrderPage();
    orderStore.loading = false;
  }

  const resetForm = (formEl: { resetFields: () => void }) => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  };

  /** 高亮当前权限选中行 */
  function rowStyle({ row: { id } }) {
    return {
      cursor: "pointer",
      background: id === curRow.value?.id ? "var(--el-fill-color-light)" : ""
    };
  }

  return {
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
    handleSelectionChange,
    onSelectionCancel,
    handleSizeChange,
    handleCurrentChange,
    rowStyle
  };
}
