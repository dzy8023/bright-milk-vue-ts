import editForm from "../form/index.vue";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import type { FormItemProps } from "./types";
import { deviceDetection, getKeyList } from "@pureadmin/utils";
import { type Ref, h, ref, onMounted, watch } from "vue";
import type { TreeNodeData } from "element-plus/es/components/tree-v2/src/types.mjs";
import { treeProps } from "./columns";
import { useAttrStore } from "@/store/bm/goods/attr";
import { useCategoryStore } from "@/store/bm/goods/category";

export function useAttr(tableRef: any, treeRef: Ref) {
  const attrStore = useAttrStore();
  const categoryStore = useCategoryStore();

  const formRef = ref();
  const curRow = ref();
  const selectedNum = ref(0);

  const treeIds = ref([]);
  const initData = ref([]);
  const isShow = ref(false);
  const treeSearchValue = ref();

  const isExpandAll = ref(false);
  const isSelectAll = ref(false);
  const isLinkage = ref(false);

  function handleDelete(row) {
    console.log(row);
    attrStore.deleteAttr([row.id]);
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
    if (curSelected.length > 0) {
      attrStore.deleteAttr(getKeyList(curSelected, "id"));
    }
    // 接下来根据实际业务，通过选中行的某项数据，比如下面的id，调用接口进行批量删除
    message(`已删除商品编号为 ${getKeyList(curSelected, "id")} 的数据`, {
      type: "success"
    });
    tableRef.value.getTableRef().clearSelection();
    selectedNum.value = 0;
    onSearch();
  }

  async function onSearch() {
    attrStore.loading = true;
    await attrStore.getAttrPage();
    attrStore.loading = false;
  }

  const resetForm = (formEl: { resetFields: () => void }) => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  };

  function openDialog(isAdd: boolean, row?: FormItemProps) {
    const title = isAdd ? "新增" : "修改";
    addDialog({
      title: `${title}属性`,
      props: {
        formInline: {
          title: title,
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
        const form = options.props.formInline as FormItemProps;
        formRef.value.getRef().validate(async valid => {
          if (!valid) return;
          let result;
          const data = { ...form, value: form.value.join(";") };
          if (isAdd) {
            result = await attrStore.addAttr(data);
          } else {
            result = await attrStore.updateAttr(data);
          }

          if (!result) return;
          done();
          await onSearch();
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
    await categoryStore.getCategoryTree();
    treeIds.value = [];
    initData.value.push(...categoryStore.treeData);
    forEachTree(initData.value, item => {
      treeIds.value.push(item.id);
    });
    console.log(treeIds.value, initData.value);
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
      const res = await attrStore.getCatIdsByAttrId(id);
      //遍历树，给选中的节点添加select属性
      forEachTree(initData.value, item => {
        let index = res.result.findIndex(item1 => item1.catId === item.id);
        if (index !== -1) {
          item.select = res.result[index].select;
        }
      });
      treeRef.value.setCheckedKeys(res.result.map(item => item.catId));
      console.log(row, res.result, categoryStore.treeData, initData.value);
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
    initData,
    treeProps,
    selectedNum,
    isLinkage,
    isExpandAll,
    isSelectAll,
    treeSearchValue,
    onSelectionCancel,
    onbatchDel,
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
