import "./reset.css";
import dayjs from "dayjs";
import { handleTree } from "@/utils/tree";
import { message } from "@/utils/message";
import noImg from "@/assets/img/noImg.png";
import { usePublicHooks } from "../../hooks";
import type { PaginationProps } from "@pureadmin/table";

import { getKeyList, deviceDetection } from "@pureadmin/utils";
import { getGoodsListApi } from "@/api/goods";
import { ElMessageBox } from "element-plus";
import { type Ref, ref, toRaw, computed, reactive, onMounted } from "vue";
import { getCategoryListApi } from "@/api/category";
import { GOOD_STATUS_0, GOOD_STATUS_1 } from "@/constant/status";
import type { TabItem } from "./types";

export function useGoods(tableRef: Ref, treeRef: Ref) {
  /**搜索条件 */
  const form = reactive({
    // 左侧分类树的id
    catId: "",
    name: "",
    status: ""
  });

  const dataList = ref<TabItem[]>([]);
  const loading = ref(true);
  // 上传头像信息
  const switchLoadMap = ref({});
  const { switchStyle } = usePublicHooks();
  const higherCatOptions = ref();
  const treeData = ref([]);
  const treeLoading = ref(true);
  const selectedNum = ref(0);
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  const columns: TableColumnList = [
    {
      type: "expand",
      slot: "expand"
    },
    {
      label: "勾选列", // 如果需要表格多选，此处label必须设置
      type: "selection",
      fixed: "left",
      reserveSelection: true // 数据刷新后保留选项
    },
    {
      label: "商品编号",
      prop: "id",
      width: 90
    },
    {
      label: "商品图片",
      prop: "image",
      cellRenderer: ({ row }) => (
        <el-image
          fit="cover"
          preview-teleported={true}
          src={row.image || noImg}
          preview-src-list={Array.of(row.image || noImg)}
          class="w-[80px] h-[80px] rounded-full align-middle"
        />
      ),
      width: 90
    },
    {
      label: "商品名称",
      prop: "name",
      minWidth: 130
    },
    {
      label: "分类名称",
      prop: "catName",
      minWidth: 90
    },
    {
      label: "状态",
      prop: "status",
      minWidth: 90,
      cellRenderer: scope => (
        <el-switch
          size={scope.props.size === "small" ? "small" : "default"}
          loading={switchLoadMap.value[scope.index]?.loading}
          v-model={scope.row.status}
          active-value={1}
          inactive-value={0}
          active-text={GOOD_STATUS_1}
          inactive-text={GOOD_STATUS_0}
          inline-prompt
          style={switchStyle.value}
          onChange={() => onChange(scope as any)}
        />
      )
    },
    {
      label: "商品快速展示属性",
      prop: "attrText",
      minWidth: 90,
      cellRenderer: ({ row, props }) => (
        <el-tag size={props.size} type="info">
          {row.attrText}
        </el-tag>
      )
    },
    {
      label: "商品展示价格",
      prop: "price",
      minWidth: 90,
      sortable: true,
      cellRenderer: ({ row, props }) => (
        <el-tag size={props.size} type="danger">
          {row.price.toFixed(2)}
        </el-tag>
      )
    },
    {
      label: "商品折扣",
      prop: "discount",
      minWidth: 90,
      sortable: true,
      cellRenderer: ({ row, props }) => (
        <el-tag size={props.size} type="success">
          {row.discount.toFixed(2)}
        </el-tag>
      )
    },
    {
      label: "商品销量",
      prop: "sales",
      minWidth: 90,
      sortable: true,
      cellRenderer: ({ row, props }) => (
        <el-tag size={props.size} type="warning">
          {row.sales}
        </el-tag>
      )
    },
    {
      label: "创建时间",
      minWidth: 90,
      prop: "createTime",
      sortable: true,
      formatter: ({ createTime }) =>
        dayjs(createTime).format("YYYY-MM-DD HH:mm:ss")
    },
    {
      label: "更新时间",
      minWidth: 90,
      prop: "updateTime",
      sortable: true,
      formatter: ({ updateTime }) =>
        dayjs(updateTime).format("YYYY-MM-DD HH:mm:ss")
    },
    {
      label: "操作",
      fixed: "right",
      width: 180,
      slot: "operation"
    }
  ];
  const childrenColumns: TableColumnList = [
    {
      label: "属性id",
      prop: "attrId",
      minWidth: 40
    },
    {
      label: "属性名称",
      prop: "name",
      minWidth: 50
    },
    {
      label: "属性值",
      prop: "value",
      minWidth: 90
    },
    {
      label: "快速展示",
      prop: "quickShow",
      minWidth: 50,
      cellRenderer: scope => (
        <el-switch
          size={scope.props.size === "small" ? "small" : "default"}
          loading={switchLoadMap.value[scope.index]?.loading}
          v-model={scope.row.quickShow}
          active-value={1}
          inactive-value={0}
          active-text={GOOD_STATUS_1}
          inactive-text={GOOD_STATUS_0}
          inline-prompt
          style={switchStyle.value}
          onChange={() => console.log(scope)}
        />
      )
    }
  ];
  const buttonClass = computed(() => {
    return [
      "!h-[20px]",
      "reset-margin",
      "!text-gray-500",
      "dark:!text-white",
      "dark:hover:!text-primary"
    ];
  });

  function onChange({ row, index }) {
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
    loading.value = true;
    const res = await getGoodsListApi(toRaw(form));
    console.log(res.result);
    dataList.value = res.result.items;
    pagination.total = res.result.total;
    pagination.pageSize = res.result.pageSize;
    pagination.currentPage = res.result.currentPage;
    setTimeout(() => {
      loading.value = false;
    }, 500);
  }

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    form.catId = "";
    treeRef.value.onTreeReset();
    onSearch();
  };

  function onTreeSelect({ id, selected }) {
    form.catId = selected ? id : "";
    onSearch();
  }

  onMounted(async () => {
    treeLoading.value = true;
    onSearch();
    const res = await getCategoryListApi();
    higherCatOptions.value = handleTree(res.result);
    treeData.value = handleTree(res.result);
    treeLoading.value = false;
  });

  return {
    form,
    loading,
    columns,
    dataList,
    treeData,
    treeLoading,
    selectedNum,
    pagination,
    buttonClass,
    childrenColumns,
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
