import editForm from "../form/index.vue";
import { addDialog } from "@/components/ReDialog";
import { ref, onMounted, h } from "vue";
import type { FormItemProps } from "../utils/types";
import { cloneDeep, deviceDetection, getKeyList } from "@pureadmin/utils";
import type { TabItem } from "./types";
import { useCategoryStore } from "@/store/bm/goods/category";
import { useBannerGroupStore } from "@/store/bm/sale/bannerGroup";
import { useBannerStore } from "@/store/bm/sale/banner";
import { equalObjOnProps } from "@/utils/utils";
import { ElMessageBox } from "element-plus";

export function useBanner(tableRef: any) {
  const formRef = ref();
  const switchLoadMap = ref({});
  const bannerGroupStore = useBannerGroupStore();
  const bannerStore = useBannerStore();
  const categoryStore = useCategoryStore();

  const selectedNum = ref(0);
  function onChange(row, index) {
    ElMessageBox.confirm(
      `确认要<strong>${
        row.status === 0 ? "禁用" : "启用"
      }</strong><strong style='color:var(--el-color-primary)'>${
        row.name
      }</strong>分组吗?`,
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
        switchLoadMap.value[index] = Object.assign(
          {},
          switchLoadMap.value[index],
          {
            loading: true
          }
        );
        const res = await bannerGroupStore.changeBannerGroupStatus(row.id);
        if (!res) {
          row.status === 0 ? (row.status = 1) : (row.status = 0);
        }
        switchLoadMap.value[index] = Object.assign(
          {},
          switchLoadMap.value[index],
          {
            loading: false
          }
        );
      })
      .catch(() => {
        row.status === 0 ? (row.status = 1) : (row.status = 0);
      });
  }
  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
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
  async function onSearch() {
    bannerGroupStore.loading = true;
    await bannerGroupStore.getBannerGroupPage();
    bannerGroupStore.loading = false;
  }
  /** 格式化菜单选项 递归遍历树节点，
   * 如果isAdd为false时data为必要参数，否则为null
   */
  const formatCategoryOptions = (treeList: any) => {
    //递归获取data的id
    const formatNode = (node: any) => {
      if (node.children && node.children.length > 0) {
        node.children = node.children.map((child: any) => formatNode(child));
      }
      return node;
    };
    return treeList.map((node: any) => formatNode(node));
  };
  async function openDialog(isAdd: boolean, row?: TabItem) {
    if (!categoryStore.treeData.length) {
      await categoryStore.getCategoryTree();
    }
    //获取所有banner
    if (!bannerStore.list.length) {
      await bannerStore.getBannerList();
    }
    const data = bannerStore.list.map(item => ({
      ...item,
      bannerId: item.id,
      id: ""
    }));
    addDialog({
      title: `${isAdd ? "新增" : "修改"}分组`,
      props: {
        formInline: {
          id: isAdd ? null : row.id,
          name: isAdd ? "" : row.name,
          catId: isAdd ? "" : row.catId,
          desc: isAdd ? "" : row.desc,
          status: isAdd ? 0 : row.status,
          bannerList: isAdd ? [] : row.bannerList ? [...row.bannerList] : [],
          categoryOptions: formatCategoryOptions(
            cloneDeep(categoryStore.treeData)
          ),
          data: data
        }
      },
      width: "40%",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef, formInline: null }),
      beforeSure: (done, { options }) => {
        const form = options.props.formInline as FormItemProps;
        formRef.value.getRef().validate(async (valid: any) => {
          if (!valid) return;
          //重新设置排序，更新时先全部删除在批量插入
          form.bannerList.forEach((item, index) => {
            item.sort = index + 1;
          });
          if (!isAdd) {
            //判断是否有变化
            if (row.bannerList.length === form.bannerList.length) {
              let isChange = false;
              const props = ["bannerId", "sort"];
              for (let i = 0; i < row.bannerList.length; i++) {
                if (
                  equalObjOnProps(row.bannerList[i], form.bannerList[i], props)
                ) {
                  isChange = true;
                  break;
                }
              }
              if (!isChange) {
                delete form.bannerList;
              }
            }
          }
          console.log(row, form);
          let result;
          if (isAdd) {
            result = await bannerGroupStore.addBannerGroup(form);
          } else {
            result = await bannerGroupStore.updateBannerGroup(form);
          }
          if (!result) return;
          done();
          await onSearch();
        });
      }
    });
  }

  async function handleDelete(row) {
    await bannerGroupStore.deleteBannerGroup([row.id]);
    onSearch();
  }
  /** 批量删除 */
  async function onbatchDel() {
    // 返回当前选中的行
    const curSelected = tableRef.value.getTableRef().getSelectionRows();
    await bannerGroupStore.deleteBannerGroup(getKeyList(curSelected, "id"));
    tableRef.value.getTableRef().clearSelection();
    onSearch();
  }
  onMounted(() => {
    onSearch();
  });

  return {
    selectedNum,
    switchLoadMap,
    onChange,
    /** 搜索 */
    onSearch,
    /** 重置 */
    resetForm,
    /** 新增、修改轮播图*/
    openDialog,
    /** 删除轮播图*/
    handleDelete,
    onbatchDel,
    handleSelectionChange,
    handleSizeChange,
    handleCurrentChange,
    onSelectionCancel
  };
}
