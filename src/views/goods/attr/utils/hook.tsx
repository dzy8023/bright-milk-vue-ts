import "./reset.css";
import editForm from "../form/index.vue";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import type { PaginationProps } from "@pureadmin/table";
import type { FormItemProps } from "../utils/types";
import { getKeyList, deviceDetection } from "@pureadmin/utils";
import { type Ref, h, ref, toRaw, computed, reactive, onMounted } from "vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { getAttrPageApi } from "@/api/attr";

export function useUser(tableRef: Ref) {
  const form = reactive({
    name: "",
    type: ""
  });
  const formRef = ref();
  const dataList = ref<Required<Omit<FormItemProps, "title">>[]>([]);
  const loading = ref(true);
  const selectedNum = ref(0);
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  const columns: TableColumnList = [
    {
      label: "勾选列", // 如果需要表格多选，此处label必须设置
      type: "selection",
      fixed: "left",
      reserveSelection: true // 数据刷新后保留选项
    },
    {
      label: "属性编号",
      prop: "id",
      width: 90
    },
    {
      label: "属性名称",
      prop: "name",
      cellRenderer: ({ row }) => (
        <>
          <span class="inline-block mr-1">
            {h(useRenderIcon(row.icon), {
              style: { paddingTop: "1px" }
            })}
          </span>
          <span>{row.name}</span>
        </>
      ),
      minWidth: 90
    },
    {
      label: "属性值",
      prop: "value",
      minWidth: 120,
      cellRenderer: ({ row }) => (
        <>
          {row.value.map((item, i) => (
            <el-tag size="small" type="info" key={i}>
              {item}
            </el-tag>
          ))}
        </>
      )
    },
    {
      label: "属性描述",
      prop: "desc",
      minWidth: 90
    },
    {
      label: "属性类型",
      prop: "type",
      sortable: true,
      minWidth: 90,
      cellRenderer: ({ row }) => (
        <>
          <el-tag size="small" type={row.type === 0 ? "primary" : "success"}>
            {row.type === 0 ? "规格参数" : "销售属性"}
          </el-tag>
        </>
      )
    },
    {
      label: "操作",
      fixed: "right",
      width: 180,
      slot: "operation"
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
  function handleUpdate(row) {
    console.log(row);
  }

  function handleDelete(row) {
    message(`您删除了属性编号为${row.id}的这条数据`, { type: "success" });
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
    message(`已删除属性编号为 ${getKeyList(curSelected, "id")} 的数据`, {
      type: "success"
    });
    tableRef.value.getTableRef().clearSelection();
    onSearch();
  }

  async function onSearch() {
    loading.value = true;
    const res = await getAttrPageApi(toRaw(form));
    res.result.items.map(item => {
      dataList.value.push({
        ...item,
        value: item.value.split(",")
      });
    });
    pagination.total = res.result.total;
    pagination.pageSize = res.result.pageSize;
    pagination.currentPage = res.result.currentPage;
    setTimeout(() => {
      loading.value = false;
    }, 500);
  }

  const resetForm = (formEl: { resetFields: () => void }) => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  };

  function openDialog(title = "新增", row?: FormItemProps) {
    addDialog({
      title: `${title}属性`,
      props: {
        formInline: {
          title,
          id: row?.id ?? "",
          name: row?.name ?? "",
          value: row?.value ?? [],
          icon: row?.icon ?? "",
          desc: row?.desc ?? "",
          type: row?.type ?? 0
        }
      },
      width: "45%",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef, formInline: null }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        function chores() {
          message(`您${title}了属性名称为${curData.name}的这条数据`, {
            type: "success"
          });
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }
        FormRef.validate(valid => {
          if (valid) {
            console.log("curData", curData);
            // 表单规则校验通过
            if (title === "新增") {
              // 实际开发先调用新增接口，再进行下面操作
              chores();
            } else {
              // 实际开发先调用修改接口，再进行下面操作
              chores();
            }
          }
        });
      }
    });
  }

  onMounted(async () => {
    onSearch();
  });

  return {
    form,
    loading,
    columns,
    dataList,
    selectedNum,
    pagination,
    buttonClass,
    deviceDetection,
    onSearch,
    resetForm,
    onbatchDel,
    openDialog,
    handleUpdate,
    handleDelete,
    handleSizeChange,
    onSelectionCancel,
    handleCurrentChange,
    handleSelectionChange
  };
}
