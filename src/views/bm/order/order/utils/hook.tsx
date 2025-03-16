import "./reset.css";
import editForm from "../form/index.vue";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import type { FormItemProps } from "./types";
import { deviceDetection } from "@pureadmin/utils";
import { type Ref, h, ref, onMounted, watch } from "vue";
import type { TreeNodeData } from "element-plus/es/components/tree-v2/src/types.mjs";
import { treeProps } from "./columns";
import { useAttrStore } from "@/store/bm/goods/attr";
import { useCategoryStore } from "@/store/bm/goods/category";

export function useAttr(treeRef: Ref) {
  const attrStore = useAttrStore();
  const categoryStore = useCategoryStore();

  const formRef = ref();
  const curRow = ref();

  const treeIds = ref([]);
  const initData = ref([]);
  const isShow = ref(false);
  const treeSearchValue = ref();

  const isExpandAll = ref(false);
  const isSelectAll = ref(false);
  const isLinkage = ref(false);

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
          if (isAdd) {
            result = await attrStore.addAttr(form);
          } else {
            result = await attrStore.updateAttr(form);
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
    isLinkage,
    isExpandAll,
    isSelectAll,
    treeSearchValue,
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
