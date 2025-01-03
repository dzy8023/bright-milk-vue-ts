import "./reset.css";
import editForm from "../form/index.vue";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import type { PaginationProps } from "@pureadmin/table";
import type { FormItemProps } from "../utils/types";
import { deviceDetection } from "@pureadmin/utils";
import {
  type Ref,
  h,
  ref,
  toRaw,
  reactive,
  onMounted,
  computed,
  watch
} from "vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { getAttrPageApi, getCatIdsByAttrIdApi } from "@/api/attr";
import { getCategoryTreeApi } from "@/api/category";
import type { TreeNodeData } from "element-plus/es/components/tree-v2/src/types.mjs";

export function useUser(treeRef: Ref) {
  const form = reactive({
    name: "",
    type: ""
  });
  const formRef = ref();
  const dataList = ref<Required<Omit<FormItemProps, "title">>[]>([]);
  const loading = ref(true);
  const curRow = ref();

  const treeIds = ref([]);
  const treeData = ref([]);
  const initData = [];
  const isShow = ref(false);
  const treeSearchValue = ref();

  const isExpandAll = ref(false);
  const isSelectAll = ref(false);
  const isLinkage = ref(false);
  const treeProps = {
    value: "id",
    label: "name",
    children: "children",
    disabled: "status"
  };
  const buttonClass = computed(() => {
    return [
      "!h-[20px]",
      "reset-margin",
      "!text-gray-500",
      "dark:!text-white",
      "dark:hover:!text-primary"
    ];
  });
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const columns: TableColumnList = [
    {
      label: "属性编号",
      prop: "id"
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
      width: 210,
      slot: "operation"
    }
  ];

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
    console.log("handleSelectionChange", val);
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
  /** 高亮当前权限选中行 */
  function rowStyle({ row: { id } }) {
    return {
      cursor: "pointer",
      background: id === curRow.value?.id ? "var(--el-fill-color-light)" : ""
    };
  }

  /** 菜单权限-保存 */
  function handleSave() {
    const { id, name } = curRow.value;
    // 根据用户 id 调用实际项目中菜单权限修改接口
    console.log(id, treeRef.value.getCheckedKeys());
    message(`角色名称为${name}的菜单权限修改成功`, {
      type: "success"
    });
  }
  const onQueryChanged = (query: string) => {
    treeRef.value!.filter(query);
  };
  const forEachTree = (data: any, cb: (item: any) => void) => {
    if (Array.isArray(data)) {
      data.forEach(item => {
        cb(item);
        forEachTree(item.children, cb);
      });
    }
  };

  const filterMethod = (query: string, node) => {
    return node.title!.includes(query);
  };
  onMounted(async () => {
    onSearch();
    // const res = await getCategoryListApi();
    // treeIds.value = getKeyList(res.result, "id");
    // treeData.value = handleTree(res.result);
    const res = await getCategoryTreeApi();
    treeIds.value = [];
    initData.push(...res.result);
    treeData.value = initData;
    forEachTree(res.result, item => {
      treeIds.value.push(item.id);
    });
    console.log(treeIds.value, initData);
  });
  watch(isExpandAll, val => {
    val
      ? treeRef.value.setExpandedKeys(treeIds.value)
      : treeRef.value.setExpandedKeys([]);
  });

  watch(isSelectAll, val => {
    val
      ? treeRef.value.setCheckedKeys(treeIds.value)
      : treeRef.value.setCheckedKeys([]);
  });
  /**属性关联分类 */
  const handleRelated = async (row: any) => {
    const { id } = row;
    if (id) {
      //初始化数据,深拷贝
      // treeData.value = JSON.parse(JSON.stringify(initData));
      curRow.value = row;
      isShow.value = true;
      const res = await getCatIdsByAttrIdApi(id);
      //遍历树，给选中的节点添加select属性
      forEachTree(treeData.value, item => {
        let index = res.result.findIndex(item1 => item1.catId === item.id);
        if (index !== -1) {
          item.select = res.result[index].select;
        }
      });
      treeRef.value.setCheckedKeys(res.result.map(item => item.catId));
      console.log(row, res.result, treeData.value, initData);
    } else {
      curRow.value = null;
      isShow.value = false;
    }
  };
  const handleCheckChange = (data: TreeNodeData, checked: boolean) => {
    if (checked) {
      data.select = 0;
    } else {
      data.select = undefined;
    }
  };
  return {
    isShow,
    curRow,
    treeData,
    treeProps,
    isLinkage,
    isExpandAll,
    isSelectAll,
    treeSearchValue,
    buttonClass,
    form,
    loading,
    columns,
    dataList,
    pagination,
    handleSave,
    onQueryChanged,
    filterMethod,
    rowStyle,
    deviceDetection,
    onSearch,
    resetForm,
    openDialog,
    handleDelete,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange,
    handleRelated,
    handleCheckChange
  };
}
