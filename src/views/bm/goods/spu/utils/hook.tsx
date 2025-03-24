import { message } from "@/utils/message";
import { getKeyList, deviceDetection, cloneDeep } from "@pureadmin/utils";
import { ElMessageBox } from "element-plus";
import { type Ref, ref, onMounted, h } from "vue";
import { GOOD_STATUS_0, GOOD_STATUS_1 } from "@/constant/status";
import { useCategoryStore } from "@/store/bm/goods/category";
import { useSpuInfoStore } from "@/store/bm/goods/spu";
import { addDialog } from "@/components/ReDialog/index";
import SpuInfoDialog from "../form/spuinfo.vue";
import editForm from "../form/form.vue";
import skuForm from "@/views/bm/goods/sku/form/index.vue";
import type { FormItemProps, SpuImage } from "./types";
import type { SkuFormItemProps } from "@/views/bm/goods/sku/utils/types";
import type { SpuAttr } from "@/types/attr";
import { useSkuInfoStore } from "@/store/bm/goods/sku";

export function useGoods(tableRef: Ref, treeRef: Ref) {
  const spuInfoStore = useSpuInfoStore();
  const categoryStore = useCategoryStore();
  const skuInfoStore = useSkuInfoStore();
  const switchLoadMap = ref({});
  const higherCatOptions = ref();
  const selectedNum = ref(0);
  const formRef = ref();

  function onChange(row, index) {
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
      .then(async () => {
        switchLoadMap.value[index] = Object.assign(
          {},
          switchLoadMap.value[index],
          {
            loading: true
          }
        );
        await spuInfoStore.changeSpuInfoStatus(row.id);
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
  /**更新spuInfo */
  async function handleUpdate(isAdd: boolean, row) {
    if (!isAdd && !row.mainImage) {
      //获取商品图集
      const res = await spuInfoStore.getSpuInfoMainImage(row.id);
      row.mainImage = res;
    }
    if (!isAdd) {
      const res = await spuInfoStore.getAttrWithOptionsList({
        spuId: row.id,
        catId: row.catId
      });
      console.log("res", res);
      row.attrs = res.map(item => ({
        ...item,
        options: item.options.split(";"),
        value:
          item.choose === 1 ? item.value?.split(";") || [] : (item.value ?? "")
      }));
    }
    const title = isAdd ? "新增" : "修改";
    addDialog({
      title: `${title}商品`,
      props: {
        formInline: {
          id: row?.id ?? "",
          name: row?.name ?? "",
          status: row.status ?? 0,
          image: row?.image ? [{ url: row.image }] : [],
          price: row?.price ?? 0,
          discount: row?.discount ?? 0,
          attrText: row?.attrText ?? "",
          desc: row?.desc ?? "",
          mainImage: row?.mainImage
            ? row.mainImage.map(item => ({ url: item.image, uid: item.id }))
            : [],
          attrs: row?.attrs ? cloneDeep(row.attrs) : []
        } as FormItemProps
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
          console.log("form", form, "row", row);
          const newImage = { deleted: Array<SpuImage>(), new: [] };
          const newAttrs = {
            deleted: Array<SpuAttr>(),
            added: Array<SpuAttr>(),
            updated: Array<SpuAttr>()
          };
          const newSpuInfo = { ...form };
          delete newSpuInfo.mainImage;
          delete newSpuInfo.attrs;
          let stateIds = [];
          if (form.image[0].raw) {
            newImage.new.push(form.image[0].raw);
            newImage.deleted = [{ id: null, spuId: null, image: row.image }];
          }
          //处理图片
          form.mainImage.forEach(item => {
            if (item.raw) {
              newImage.new.push(item.raw);
            } else {
              stateIds.push(item.uid);
            }
          });
          row.mainImage.forEach(item => {
            if (!stateIds.includes(item.id)) {
              newImage.deleted.push(item);
            }
          });
          //处理规格
          for (let i = 0; i < form.attrs.length; i++) {
            if (!form.attrs[i].value || !form.attrs[i].value.length) {
              if (row.attrs[i].id) {
                const temp =
                  row.attrs[i].choose === 1
                    ? {
                        ...row.attrs[i],
                        value: (row.attrs[i].value as string[]).join(";")
                      }
                    : {
                        ...row.attrs[i],
                        value: String(row.attrs[i].value)
                      };
                newAttrs.deleted.push(temp);
              }
            } else {
              const temp =
                form.attrs[i].choose === 1
                  ? {
                      ...form.attrs[i],
                      value: (form.attrs[i].value as string[]).join(";")
                    }
                  : {
                      ...form.attrs[i],
                      value: String(form.attrs[i].value)
                    };
              if (row.attrs[i].id) {
                if (
                  JSON.stringify(form.attrs[i]) !== JSON.stringify(row.attrs[i])
                ) {
                  newAttrs.updated.push(temp);
                }
              } else {
                newAttrs.added.push(temp);
              }
            }
          }
          console.log("newImage", newImage, "newAttrs", newAttrs);
          //更新图片
          if (newImage.new.length || newImage.deleted.length) {
            const res = await spuInfoStore.updateSpuInfoImage({
              ...newImage,
              spuId: row.id
            });
            if (res && form.image[0].raw) {
              newSpuInfo.image = res[0];
            } else {
              newSpuInfo.image = null;
            }
            console.log("update image", res, "newSpuInfo", newSpuInfo);
          } else {
            newSpuInfo.image = null;
          }
          //更新规格
          if (
            newAttrs.added.length ||
            newAttrs.deleted.length ||
            newAttrs.updated.length
          ) {
            await spuInfoStore.updateSpuInfoAttr({
              ...newAttrs,
              spuId: row.id
            });
          }
          //更新spuInfo
          await spuInfoStore.updateSpuInfo(newSpuInfo);
          done();
          await onSearch();
        });
      }
    });
  }
  /**为spu添加sku */
  async function handleAddSku(row) {
    console.log("add sku", row);
    const res = await skuInfoStore.getSkuAttrWithOptionsListBySpuId({
      spuId: row.id
    });
    addDialog({
      title: `为【${row.name}】新增sku`,
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
      contentRenderer: () => h(skuForm, { ref: formRef, formInline: null }),
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

  async function handleDelete(row) {
    await spuInfoStore.deleteSpuInfo(row.id);
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
    spuInfoStore.loading = true;
    await spuInfoStore.getSpuInfoPage();
    console.log("spu", spuInfoStore.dataList);
    spuInfoStore.loading = false;
  }

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    spuInfoStore.form.catIds = [];
    treeRef.value.onTreeReset();
    onSearch();
  };

  function onTreeSelect({ id, selected }) {
    spuInfoStore.form.catIds = selected ? [id] : [];
    onSearch();
  }
  async function onSearchTree() {
    categoryStore.loading = true;
    await categoryStore.getCategoryTree();
    console.log("category", categoryStore.treeData);
    higherCatOptions.value = categoryStore.treeData;
    categoryStore.loading = false;
  }

  onMounted(async () => {
    await Promise.all([onSearch(), onSearchTree()]);
  });
  async function onViewSpuInfo(row) {
    const spuInfoRef = ref();
    if (!row.mainImage) {
      //获取商品图集
      const res = await spuInfoStore.getSpuInfoMainImage(row.id);
      row.mainImage = res;
    }
    if (!row.attrs) {
      const res = await spuInfoStore.getAttrListBySpuId(row.id);
      row.attrs = res;
      row.subLoading = false;
    }
    console.log(row);
    addDialog({
      title: "查看商品详情",
      width: "50%",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: true,
      contentRenderer: (): JSX.Element => (
        <SpuInfoDialog ref={spuInfoRef} spuInfo={row} />
      )
    });
  }

  return {
    selectedNum,
    switchLoadMap,
    onChange,
    deviceDetection,
    onSearch,
    resetForm,
    onbatchDel,
    onTreeSelect,
    handleUpdate,
    handleAddSku,
    handleDelete,
    handleSizeChange,
    onSelectionCancel,
    handleCurrentChange,
    handleSelectionChange,
    onViewSpuInfo
  };
}
