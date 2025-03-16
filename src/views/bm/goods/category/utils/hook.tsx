import editForm from "../form/form.vue";
import { message, messageBox } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import type { FormItemProps } from "./types";
import { cloneDeep, deviceDetection } from "@pureadmin/utils";
import { ElMessageBox } from "element-plus";
import { h, ref, type Ref } from "vue";
import type { CategoryItem, CategoryTreeNode } from "@/types/category";
import { usePublicHooks } from "@/views/hooks";
import { useCategoryStore } from "@/store/bm/goods/category";
import RelateAttrToCategory from "../form/relate-attr-to-category.vue";
import { useAttrStore } from "@/store/bm/goods/attr";
import { MaxCategoryLayer } from "@/enums/baseConstant";
import type Node from "element-plus/es/components/tree/src/model/node.mjs";
import { getStrFromArr } from "@/utils/utils";

export function useCategory(treeRef: Ref) {
  const categoryStore = useCategoryStore();
  const attrStore = useAttrStore();
  const formRef = ref();
  const relateRef = ref();
  const switchLoadMap = ref({});
  const { switchStyle } = usePublicHooks();
  const query = ref("");
  const expandKeys = ref([]);
  let maxLevel = 1;
  let updateNodes = [];

  /** 取消选择 */
  function onSelectionCancel() {
    treeRef.value.setCheckedKeys([]);
  }

  /** 批量删除 */
  async function onbatchDel() {
    const ids = treeRef.value.getCheckedKeys();
    if (ids.length === 0) {
      message("请选择要删除的分类", { type: "warning" });
      return;
    }
    await categoryStore.deleteCategory(ids);
    await onSearch();
  }
  async function handleDelete(node: Node, data) {
    const title = `${data.children.length > 0 ? "将会把分类及其子分类删除" : "是否确认删除"}`;
    // 是否确认删除
    const result = await messageBox({
      title: title,
      showMessage: false,
      confirmMessage: undefined,
      cancelButtonText: "取消"
    });
    if (!result) return;
    // 删除数据
    await categoryStore.deleteCategory([data.id]);
    await onSearch(node.parent.id === 0 ? [] : [node.parent.id]);
  }
  function onChange(data: CategoryItem) {
    ElMessageBox.confirm(
      `确认要<strong>${
        data.status === 0 ? "停用" : "启用"
      }</strong><strong style='color:var(--el-color-primary)'>${
        data.name
      }</strong>分类吗?`,
      "系统提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        dangerouslyUseHTMLString: true,
        draggable: true
      }
    )
      .then(async () => {
        switchLoadMap.value[data.id] = Object.assign(
          {},
          switchLoadMap.value[data.id],
          {
            loading: true
          }
        );
        await categoryStore.changeCategoryStatus(data.id);
        switchLoadMap.value[data.id] = Object.assign(
          {},
          switchLoadMap.value[data.id],
          {
            loading: false
          }
        );
      })
      .catch(() => {
        data.status === 0 ? (data.status = 1) : (data.status = 0);
      });
  }

  const onSearch = async (_expandKeys: Array<number> = []) => {
    categoryStore.loading = true;
    await categoryStore.getCategoryTree();
    expandKeys.value = _expandKeys;
    categoryStore.loading = false;
  };
  const onQueryChanged = (query: string) => {
    (treeRef as any).value!.filter(query);
  };
  const filterMethod = (query: string, node: CategoryTreeNode) => {
    return node.name!.indexOf(query) !== -1;
  };

  /** 格式化菜单选项 递归遍历树节点，如果layer大于等于3并且isAdd为true，则添加disabled属性
   * 如果isAdd为false时data为必要参数，否则为null
   */
  const formatCategoryOptions = (isAdd: boolean, treeList: any) => {
    //递归获取data的id
    const formatNode = (node: any) => {
      if (node.layer >= MaxCategoryLayer) {
        node.disabled = true;
        console.log("disabled", node);
      }
      if (node.children && node.children.length > 0) {
        node.children = node.children.map((child: any) => formatNode(child));
      }
      return node;
    };
    return treeList.map((node: any) => formatNode(node));
  };

  /**新增，修改分类 */
  function openDialog(isAdd: boolean, node: Node, data?: FormItemProps) {
    console.log("openDialog", isAdd, node, data);
    const sort = isAdd
      ? node?.childNodes.length + 1 || categoryStore.treeData.length + 1
      : data?.sort;
    const formInline = isAdd
      ? {
          isAdd,
          id: "",
          name: "",
          parentId: data?.id ?? 0,
          sort: sort,
          status: 0
        }
      : { ...data };
    addDialog({
      title: `${isAdd ? "新增" : "修改"}分类`,
      props: {
        formInline: {
          ...formInline,
          higherCategoryOptions: formatCategoryOptions(
            isAdd,
            cloneDeep(categoryStore.treeData)
          )
        }
      },
      width: "46%",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef, formInline: null }),
      beforeSure: (done, { options }) => {
        const form = options.props.formInline as FormItemProps;
        formRef.value.formRef.validate(async (valid: boolean) => {
          if (!valid) return;
          let result;
          if (isAdd) {
            result = await categoryStore.addCategory(form);
          } else {
            console.log("updateCategory", form);
            // 修改
            result = await categoryStore.updateCategory(form);
          }
          if (!result) {
            return;
          }
          done();
          let _eppandKeys = isAdd ? (node ? [node.data.id] : []) : [data.id];
          if (form.parentId > 0) {
            _eppandKeys.push(form.parentId);
          }
          await onSearch(_eppandKeys);
        });
      }
    });
  }

  const buildRelateDialog = (title: string, catIds: [number]) => {
    addDialog({
      title: `为 【${title}】 关联属性`,
      width: "45%",
      draggable: true,
      closeOnClickModal: false,
      fullscreenIcon: true,
      contentRenderer: () => (
        <RelateAttrToCategory
          ref={relateRef}
          catId={catIds.length === 1 ? catIds[0] : null}
        />
      ),
      beforeSure: async (done: any) => {
        const attrList = [];
        attrStore.attrList.forEach(item => {
          if (relateRef.value.relateAttr.includes(item.id)) {
            attrList.push({
              attrId: item.id,
              choose: item.choose
            });
          }
        });

        // 关联分类属性
        const params = {
          catIds: catIds,
          attrList: attrList
        };
        console.log("params", params, attrList);
        const result = await categoryStore.categoryRelateAttr(params);

        // // 更新成功关闭弹窗
        if (!result) return;
        done();
      }
    });
  };
  function handleRelateAttr(node, data) {
    console.log("handleRelateAttr", node, data);
    buildRelateDialog(data.name, [data.id]);
  }
  function handleRelateAttrBatch() {
    const catIds = treeRef.value.getCheckedKeys();
    if (catIds.length === 0) {
      message("请选择要关联属性的分类", { type: "warning" });
      return;
    }
    console.log("handleRelateAttrBatch", treeRef.value.getCheckedNodes());
    const title = getStrFromArr(treeRef.value.getCheckedNodes(), "name", 10);
    buildRelateDialog(title, catIds);
    onSelectionCancel();
  }
  function countNodeLevel(node: Node) {
    maxLevel = node.level;
    if (node.childNodes && node.childNodes.length > 0) {
      for (let i = 0; i < node.childNodes.length; i++) {
        if (node.childNodes[i].level > maxLevel) {
          maxLevel = node.childNodes[i].level;
        }
        countNodeLevel(node.childNodes[i]);
      }
    }
  }
  function updateChild(node, level) {
    if (node.childNodes != null && node.childNodes.length > 0) {
      for (let i = 0; i < node.childNodes.length; i++) {
        node.childNodes[i].level += level;
        updateNodes.push({
          id: node.childNodes[i].data.id,
          layer: node.childNodes[i].level,
          name: node.childNodes[i].data.name
        });
        updateChild(node.childNodes[i], level);
      }
    }
  }
  async function handleDrop(draggingNode, dropNode, type) {
    let pCid = 0;
    let sibling = null;
    //层数变化量
    let temp = dropNode.level - draggingNode.level;
    if (type === "inner") {
      pCid = dropNode.data.id;
      sibling = dropNode.childNodes;
      temp += 1;
      draggingNode.level = dropNode.level + 1;
    } else {
      //如果是根节点，则父节点为0
      pCid = dropNode.parent.data.id || 0;
      sibling = dropNode.parent.childNodes;
      draggingNode.level = dropNode.level;
    }
    for (let i = 0; i < sibling.length; i++) {
      if (sibling[i].data.id == draggingNode.data.id) {
        updateNodes.push({
          id: sibling[i].data.id,
          sort: i + 1,
          parentId: pCid,
          layer: draggingNode.level,
          name: draggingNode.data.name
        });
        //子节点层级变化
        if (temp != 0) {
          updateChild(draggingNode, temp);
        }
      } else {
        updateNodes.push({
          id: sibling[i].data.id,
          sort: i + 1,
          name: sibling[i].data.name
        });
      }
    }
    console.log(updateNodes, pCid);
    console.log(draggingNode, dropNode, type);
    //删除name属性
    for (let i = 0; i < updateNodes.length; i++) {
      delete updateNodes[i].name;
    }
    //批量更新分类
    await categoryStore.batchUpdateCategory(updateNodes);
    //刷新
    onSearch([pCid === 0 ? draggingNode.data.id : pCid]);
    updateNodes = [];
    maxLevel = 1;
  }
  const handleAllowDrop = (draggingNode: Node, dropNode: Node, type) => {
    //1.被拖动的节点以及所在的父节点总层数不能大于3
    countNodeLevel(draggingNode);
    let temp = dropNode.level - draggingNode.level + maxLevel;
    if (type === "inner") {
      temp += 1;
    }
    if (temp <= 3) {
      return true;
    } else {
      return false;
    }
  };
  const handleExpandAll = () => {
    let _expandKeys = [];
    //递归遍历树
    function traverse(node: any) {
      if (node.children && node.children.length > 0) {
        _expandKeys.push(node.id);
        node.children.forEach(child => {
          traverse(child);
        });
      }
    }
    categoryStore.treeData.forEach(node => {
      traverse(node);
    });
    expandKeys.value = _expandKeys;
  };
  return {
    switchStyle,
    query,
    expandKeys,
    onbatchDel,
    onSelectionCancel,
    onChange,
    onSearch,
    openDialog,
    handleDelete,
    filterMethod,
    onQueryChanged,
    handleRelateAttr,
    handleDrop,
    handleAllowDrop,
    handleRelateAttrBatch,
    handleExpandAll
  };
}
