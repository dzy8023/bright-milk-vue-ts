import editForm from "../form/index.vue";
import { addDialog } from "@/components/ReDialog";
import { ref, onMounted, h, type Ref } from "vue";
import type { FormItemProps, TabItem } from "../utils/types";
import { deviceDetection, getKeyList } from "@pureadmin/utils";
import { useBannerStore } from "@/store/bm/sale/banner";

export function useBanner(tableRef: Ref) {
  const formRef = ref();
  const bannerStore = useBannerStore();
  const selectedNum = ref(0);

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
    bannerStore.loading = true;
    await bannerStore.getBannerPage();
    bannerStore.loading = false;
  }

  function openDialog(isAdd: boolean, row?: TabItem) {
    addDialog({
      title: `${isAdd ? "新增" : "修改"}轮播图`,
      props: {
        formInline: {
          ...row,
          image: isAdd ? [] : [{ url: row.image }]
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
          let result;
          const data = { banner: {}, image: null };
          if (isAdd) {
            data.image = form.image[0].raw as File;
            delete form.image;
            data.banner = { ...form };
            result = await bannerStore.addBanner(data);
          } else {
            if (form.image[0].raw) {
              data.image = form.image[0].raw as File;
            }
            delete form.image;
            data.banner = { ...form };
            console.log(form, data);
            result = await bannerStore.updateBanner(data);
          }
          if (!result) return;
          done();
          await onSearch();
        });
      }
    });
  }

  async function handleDelete(row: TabItem) {
    await bannerStore.deleteBanner([row.id]);
    onSearch();
  }
  /** 批量删除 */
  async function onbatchDel() {
    // 返回当前选中的行
    const curSelected = tableRef.value.getTableRef().getSelectionRows();
    await bannerStore.deleteBanner(getKeyList(curSelected, "id"));
    tableRef.value.getTableRef().clearSelection();
    onSearch();
  }

  onMounted(() => {
    onSearch();
  });

  return {
    selectedNum,
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
