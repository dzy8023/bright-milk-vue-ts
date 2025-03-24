import editForm from "../form/index.vue";
import { addDialog } from "@/components/ReDialog";
import { h, onMounted, ref } from "vue";
import type { SkuFormItemProps, SkuInfoItem } from "./types";
import { useSkuInfoStore } from "@/store/bm/goods/sku";
import { deviceDetection } from "@pureadmin/utils";
import { ElMessageBox, type FormInstance } from "element-plus";
import SkuInfoDialog from "../form/skuinfo.vue";

export function useSkuInfo() {
  const skuInfoStore = useSkuInfoStore();
  const formRef = ref();

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
    skuInfoStore.loading = true;
    await skuInfoStore.getSkuInfoPage();
    skuInfoStore.loading = false;
  }
  /** 重置表单 */
  const resetForm = async (formEl: FormInstance) => {
    if (!formEl) return;
    formEl.resetFields();
    await onSearch();
  };

  async function openDialog(isAdd: boolean, row?: SkuFormItemProps) {
    const title = isAdd ? "新增" : "修改";
    console.log("add sku", row);
    const res = await skuInfoStore.getSkuAttrWithOptionsListBySpuId({
      spuId: row.id
    });
    addDialog({
      title: `为【${row.name}】${title}sku`,
      props: {
        formInline: {
          spuId: row.id,
          name: row.name,
          status: row.status,
          price: row.price,
          discount: row.discount,
          attrText: row.attrText,
          desc: row.desc,
          attrs: res.map(item => ({
            ...item,
            options: item.options.split(";")
          }))
        } as SkuFormItemProps
      },
      width: "45%",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () =>
        h(editForm, { ref: formRef, formInline: null, visible: false }),
      beforeSure: (done, { options }) => {
        const form = options.props.formInline as SkuFormItemProps;
        formRef.value.getRef().validate(async valid => {
          if (!valid) return;
          const newSkuInfo = {
            skuInfo: { ...form, skuAttrs: form.attrs },
            image: form.image[0].raw
          };
          delete newSkuInfo.skuInfo.image;
          delete newSkuInfo.skuInfo.attrs;
          console.log("newSkuInfo", newSkuInfo);
          skuInfoStore.createSkuInfo(newSkuInfo);
          done();
          await onSearch();
        });
      }
    });
  }

  async function handleView(row) {
    const skuInfoRef = ref();
    if (!row.attrs || row.attrs.length === 0) {
      const res = await skuInfoStore.getAttrListBySkuId(row.id);
      row.attrs = res;
    }
    console.log(row);
    addDialog({
      title: "查看商品详情",
      width: "50%",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: true,
      contentRenderer: (): JSX.Element => (
        <SkuInfoDialog ref={skuInfoRef} skuInfo={row} />
      )
    });
  }
  async function handleDelete(row) {
    ElMessageBox.confirm(
      `确认要<strong>删除</strong><strong style='color:var(--el-color-primary)'>${
        row.name
      }</strong>sku信息吗?`,
      "系统提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        dangerouslyUseHTMLString: true,
        draggable: true
      }
    ).then(async () => {
      await skuInfoStore.deleteSkuInfo([row.id]);
      await onSearch();
    });
  }
  async function handleUpdate(row) {
    console.log("update sku", row);
    const res = await skuInfoStore.getSkuAttrWithOptionsListBySpuId({
      skuId: row.id
    });
    const attrs = res.map(item => ({
      ...item,
      options: item.options.split(";")
    }));
    attrs.forEach(item => {
      if (item.value && !item.options.includes(item.value)) {
        //放在第一位
        item.options.unshift(item.value);
      }
    });
    console.log("res", res);
    addDialog({
      title: `修改【${row.name}】`,
      props: {
        formInline: {
          id: row.id,
          spuId: row.id,
          name: row.name,
          status: row.status,
          price: row.price,
          image: [{ url: row.image }],
          discount: row.discount,
          attrText: row.attrText,
          desc: row.desc,
          attrs: attrs,
          enableOrder: row.enableOrder
        } as SkuFormItemProps
      },
      width: "45%",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef, formInline: null }),
      beforeSure: (done, { options }) => {
        const form = options.props.formInline as SkuFormItemProps;
        formRef.value.getRef().validate(async valid => {
          if (!valid) return;
          const newSkuInfo = {
            skuInfo: { ...form, skuAttrs: form.attrs },
            image: form.image[0].raw
          };
          delete newSkuInfo.skuInfo.image;
          delete newSkuInfo.skuInfo.attrs;
          console.log("newSkuInfo", newSkuInfo);
          await skuInfoStore.updateSkuInfo(newSkuInfo);
          done();
          await onSearch();
        });
      }
    });
  }
  async function handleChangeStatus(row: SkuInfoItem) {
    const res = await skuInfoStore.changeSkuInfoStatus(row.id);
    if (res) {
      row.status = row.status === 0 ? 1 : 0;
    }
    return res;
  }
  onMounted(async () => {
    onSearch();
  });

  return {
    onSearch,
    resetForm,
    openDialog,
    handleDelete,
    handleUpdate,
    handleChangeStatus,
    handleView,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange
  };
}
