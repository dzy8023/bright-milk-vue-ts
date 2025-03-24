import {
  computed,
  Fragment,
  h,
  type Ref,
  ref,
  shallowRef
  // onMounted,
  // onBeforeUnmount
} from "vue";
// https://plus-pro-components.com/components/steps-form.html
import { Edit, Medal, Sell, Finished } from "@element-plus/icons-vue";

import { message } from "@/utils/message";
import type {
  FieldValues,
  OptionsRow,
  PlusStepFromRow
} from "plus-pro-components";
import ReUpload from "@/components/ReUpload";
import { ElButton } from "element-plus";
import type { UploadUserFile } from "element-plus";
import type { ReUploadInstance } from "@/components/ReUpload/src/ReUpload";
import Skutab from "../form/skutab.vue";
import { useCategoryStore } from "@/store/bm/goods/category";
import { useCommonStore } from "@/store/bm/goods/common";
import AttrCheckbox from "@/views/components/attrCheckbox/utils/attr-checkbox.vue";
import { useColumns } from "@/views/components/attrCheckbox/utils/hook";
import { useAttrStore } from "@/store/bm/goods/attr";
import type { skuItem, spuItem } from "./types";
import type {
  AttrFormInLine,
  SkuAttr
} from "@/views/components/attrCheckbox/utils/types";
import type { SupAttr } from "@/views/components/attrCheckbox/utils/types";
import Finalstep from "../form/finalstep.vue";
import { useSpuInfoStore } from "@/store/bm/goods/spu";
import { useSkuInfoStore } from "@/store/bm/goods/sku";

/**
 * 图片自动上传，在系统管理里面内嵌一个minio后台管理系统，或者增加一个图片清理功能
 */
export function useStepsForm() {
  const categoryStore = useCategoryStore();
  const commonStore = useCommonStore();
  const attrStore = useAttrStore();
  const spuInfoStore = useSpuInfoStore();
  const skuInfoStore = useSkuInfoStore();
  const reUploadSingleRef = ref<ReUploadInstance>();
  const reUploadMultipleRef = ref<ReUploadInstance>();
  const data = ref<FieldValues[]>([
    {
      name: "鲜牛奶",
      catIds: [],
      price: 5.8,
      discount: 0.5,
      image: [],
      mainImage: [],
      desc: "好喝"
    },
    {
      attr: {}
    }
  ]);
  const spu = ref({
    name: "",
    category: [],
    price: 0,
    discount: 0,
    desc: "",
    //商品图片
    image: [] as UploadUserFile[],
    //商品图集
    mainImage: [] as UploadUserFile[],
    attr: {},
    skus: []
  });
  const finalSpu = ref<spuItem>({
    name: "",
    price: 0,
    discount: 0,
    desc: "",
    attrText: "",
    mainImage: "",
    category: "",
    spuAttrs: [],
    images: []
  });
  const finalSku = ref<skuItem[]>([]);
  const active = ref(0);
  let catId = 0;
  const categoryOptions: Ref<OptionsRow[]> = ref([]);
  const attrData = ref<AttrFormInLine>();
  const { attrCheckboxRef, columns, tableData, handleSubmit } = useColumns();

  // 添加内容修改标记
  const isDirty = ref(false);

  // 监听表单内容变化
  const markAsDirty = () => {
    isDirty.value = true;
  };

  const getCategoryTreeData = async () => {
    categoryOptions.value = [];
    await categoryStore.getCategoryTree();
    const convertCategory = items => {
      return items.map(item => ({
        ...item,
        status: item.status == 0, // 将 status 改为 disabled
        children: item.children ? convertCategory(item.children) : [] // 递归处理子分类
      }));
    };
    categoryOptions.value = convertCategory(categoryStore.treeData); // 转换并赋值
    console.log(categoryOptions.value);
  };
  const getExtandData = () => {
    return {
      name: spu.value.name,
      category: spu.value.category,
      price: spu.value.price,
      discount: spu.value.discount,
      image: spu.value.image,
      desc: spu.value.desc,
      spuName: spu.value.name
    };
  };

  let _spuImages = [];
  let _spuReps: any = {};

  const uploadSpuImages = async () => {
    spu.value.mainImage.push(...spu.value.image);
    console.log("上传商品图片", spu.value.mainImage);
    const spuImages = await commonStore.uploadFile(
      spu.value.mainImage.map(item => item.raw)
    );
    _spuImages = spuImages;
    console.log("上传成功", _spuImages, spuImages);
    return spuImages;
  };
  const saveSpuInfo = async (spuImages: string[]) => {
    const spuResData = {
      catId: catId,
      catName: spu.value.category.slice(-1)[0].name,
      name: spu.value.name,
      attrText: finalSpu.value.attrText,
      price: spu.value.price,
      discount: spu.value.discount,
      desc: spu.value.desc,
      //取最后一项
      image: spuImages?.slice(-1)[0] || _spuImages.slice(-1)[0],
      //去除最后一项，剩下的为图集
      mainImage: spuImages?.slice(0, -1) || _spuImages.slice(0, -1),
      spuAttrs: finalSpu.value.spuAttrs.map(item => ({
        ...item,
        attrName: item.name
      }))
    };
    console.log("spuResData", spuResData);
    const spuReps = await spuInfoStore.createSpuInfo(spuResData);
    _spuReps = spuReps;
    console.log("spuRes", _spuReps, spuReps);
    return spuReps;
  };
  const saveSkuInfo = async (spuReps: any) => {
    const skuResData = [];
    finalSku.value.forEach((item, index) => {
      const skuRes = {
        spuId: spuReps?.id || _spuReps.id,
        name: item.name,
        attrText: item.attrText,
        desc: item.desc,
        price: item.price,
        discount: item.discount,
        image: tableData.value[index].image[0].raw,
        skuAttrs: item.skuAttrs.map(item => ({ ...item, attrName: item.name }))
      };
      skuResData.push(skuRes);
    });
    console.log("skuResData", skuResData);
    const skuReps = await skuInfoStore.createSkuInfoBatch(skuResData);
    console.log("skuReps", skuReps);
  };
  // getCategoryTreeData();
  const getCategory = (catIds: any[]) => {
    const category = [];
    if (catIds.length !== 0 && catIds[0] !== "") {
      let temp = categoryOptions.value;
      let idx = 1;
      catIds.map(id => {
        idx = temp.findIndex(
          item =>
            item.id.toString() === id &&
            category.push({
              id: item.id,
              name: item.name
            })
        );
        if (idx === -1) {
          console.warn("找不到分类", id);
          return;
        }
        temp = temp[idx].children;
      });
    }
    return category;
  };
  const readFileAsDataURL = (file: UploadUserFile): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => {
        resolve(e.target?.result as string);
      };
      reader.onerror = error => {
        reject(error);
      };
      reader.readAsDataURL(file.raw);
    });
  };

  const stepForm = shallowRef<PlusStepFromRow[]>([
    {
      title: "基本信息",
      icon: Edit,
      form: {
        modelValue: data.value[0],
        labelWidth: "110px",
        footerAlign: "center",
        onChange: () => markAsDirty(),
        columns: [
          {
            label: "商品名称",
            prop: "name",
            valueType: "input",
            tooltip: "名称最多64个字符",
            fieldProps: {
              autocomplete: "on",
              maxlength: 64
            }
          },
          {
            label: "选择分类",
            prop: "catIds",
            valueType: "cascader",
            fieldProps: {
              props: {
                value: "id",
                label: "name",
                disabled: "status"
              },

              filterable: true,
              clearable: true,
              onFocus: () => {
                if (categoryOptions.value.length === 0) {
                  getCategoryTreeData();
                }
              }
            },
            fieldSlots: {
              default: ({ node, data }) =>
                h("span", null, [
                  h("span", null, data.name),
                  !node.isLeaf && h("span", null, ` (${data.children.length})`)
                ])
            },
            options: computed(() => categoryOptions.value),
            colProps: {
              span: 10
            }
          },
          {
            label: "商品价格",
            prop: "price",
            valueType: "input-number",
            fieldProps: {
              precision: 2,
              min: 0,
              step: 1
            },
            colProps: {
              span: 8
            }
          },
          {
            label: "商品折扣",
            prop: "discount",
            valueType: "input-number",
            fieldProps: {
              precision: 2,
              min: 0,
              step: 1
            },
            colProps: {
              span: 6
            }
          },
          {
            label: "商品描述",
            prop: "desc",
            valueType: "textarea",
            fieldProps: {
              clearable: false,
              showWordLimit: true,
              maxlength: 128,
              autosize: { minRows: 2, maxRows: 5 }
            }
          },
          {
            label: "商品图片",
            prop: "image",
            renderField(_, onChange) {
              return h(Fragment, [
                h(ReUpload, {
                  ref: reUploadSingleRef,
                  multiple: false,
                  limit: 1,
                  modelValue: spu.value.image,
                  "onUpdate:modelValue": (files: UploadUserFile[]) => {
                    spu.value.image = files;
                    onChange(files.map(f => f.url));
                  }
                }),
                h(
                  ElButton,
                  {
                    type: "primary",
                    onClick: async () => {
                      if (reUploadSingleRef.value) {
                        const files = reUploadSingleRef.value.getFiles();
                        console.log("上传", files);
                        const res = await commonStore.uploadFile(
                          files.map(f => f.raw)
                        );
                        console.log(res);
                        onChange(files.map(f => f.url));
                      } else {
                        console.warn("ReUpload 实例未初始化");
                      }
                    }
                  },
                  () => "上传"
                )
              ]);
            }
          },
          {
            label: "商品图集",
            prop: "mainImages",
            renderField(_, onChange) {
              return h(Fragment, [
                h(ReUpload, {
                  multiple: true,
                  modelValue: spu.value.mainImage,
                  ref: reUploadMultipleRef,
                  limit: 10,
                  "onUpdate:modelValue": (files: UploadUserFile[]) => {
                    spu.value.mainImage = files;
                    onChange(files.map(f => f.url));
                  }
                }),
                h(
                  ElButton,
                  {
                    type: "primary",
                    onClick: async () => {
                      if (reUploadMultipleRef.value) {
                        const files = reUploadMultipleRef.value.getFiles();
                        console.log("上传", files);
                        const res = await commonStore.uploadFile(
                          files.map(f => f.raw)
                        );
                        console.log(res);
                        onChange(files.map(f => f.url));
                      } else {
                        console.warn("ReUpload 实例未初始化");
                      }
                    }
                  },
                  () => "上传"
                )
              ]);
            }
          }
        ]
        // rules: {
        //   name: [
        //     {
        //       required: true,
        //       message: "请输入商品名称",
        //       trigger: "blur"
        //     },
        //     {
        //       max: 64,
        //       message: "名称最多64个字符",
        //       trigger: "blur"
        //     }
        //   ],
        //   catIds: [
        //     {
        //       type: "array",
        //       required: true,
        //       message: "请选择商品分类",
        //       trigger: "blur"
        //     }
        //   ],
        //   //价格要大于0, 且最多两位小数
        //   price: [
        //     { required: true, message: "请输入商品价格", trigger: "blur" },
        //     {
        //       type: "number",
        //       min: 0.01,
        //       message: "价格必须为大于0的数字",
        //       trigger: "blur"
        //     }
        //   ],
        // discount: [
        //     { required: true, message: "请输入商品折扣", trigger: "blur" },
        //     {
        //       type: "number",
        //       min: 0.01,
        //       message: "折扣必须为大于0的数字",
        //       trigger: "blur"
        //     }
        //   ],
        //   image: [
        //     { required: true, message: "请上传商品图片", trigger: "change" }
        //   ]
        // }
      }
    },
    {
      title: "规格参数",
      icon: Medal,
      form: {
        modelValue: data.value[2],
        columns: [
          {
            label: "商品规格属性",
            prop: "image",
            renderField: (_, onChange) => {
              if (!attrData.value?.spuAttrs) {
                return h(
                  "div",
                  { class: "loading-placeholder" },
                  "数据加载中..."
                );
              }
              return h(Fragment, [
                h(AttrCheckbox, {
                  ref: attrCheckboxRef,
                  modelValue: attrData.value,
                  "onUpdate:modelValue": (value: AttrFormInLine) => {
                    attrData.value = value;
                    onChange(value);
                  },
                  onSubmit: (
                    data: {
                      spuAttrs: (SupAttr & { quickShow: 0 | 1 })[];
                      saleAttrs: SkuAttr[];
                    },
                    skus,
                    extandData
                  ) => {
                    handleSubmit(data, skus, extandData);
                    onChange({ skus, data });
                  }
                })
              ]);
            }
          }
        ]
      }
    },
    {
      title: "SKU信息",
      icon: Sell,
      form: {
        modelValue: {},
        columns: [
          {
            hasLabel: false,
            label: "SKU信息",
            prop: "time",
            renderField: _ => {
              return (
                <Skutab
                  onUpdate:tableData={(value: any) => {
                    tableData.value = value;
                  }}
                  tableData={tableData.value}
                  columns={columns}
                />
              );
            }
          }
        ]
      }
    },
    {
      title: "保存完成",
      icon: Finished,
      form: {
        modelValue: {},
        columns: [
          {
            hasLabel: false,
            label: "SKU信息",
            prop: "time",
            renderField: _ => {
              return (
                <Finalstep
                  spu={finalSpu.value}
                  skus={finalSku.value}
                  onUploadSpuImages={uploadSpuImages}
                  onSaveSpuInfo={saveSpuInfo}
                  onSaveSkuInfo={saveSkuInfo}
                />
              );
            }
          }
        ]
      }
    }
  ]);
  const usePreFinalSpu = async () => {
    //构建finalSpu与finalSku
    let spuAttrText = "",
      spuAttrs = [];
    attrData.value.spuAttrs.forEach(item => {
      if (item.value) {
        if (item.quickShow === 1) {
          spuAttrText +=
            (Array.isArray(item.value) ? item.value.join("") : item.value) +
            ";";
        }
        spuAttrs.push({
          attrId: item.id,
          name: item.name,
          value: Array.isArray(item.value) ? item.value.join(";") : item.value,
          quickShow: item.quickShow
        });
      }
    });
    // 处理 spu.mainImages
    const mainImagePromises = spu.value.mainImage.map(item => {
      if (item.raw && item.url.startsWith("blob:")) {
        return readFileAsDataURL(item);
      }
      return Promise.resolve(item.url);
    });
    const mainImage = await Promise.all(mainImagePromises);
    spu.value.mainImage.forEach((item, index) => {
      item.url = mainImage[index];
    });
    // 处理 spu.image
    if (
      spu.value.image[0]?.raw &&
      spu.value.image[0]?.url.startsWith("blob:")
    ) {
      spu.value.image[0].url = await readFileAsDataURL(spu.value.image[0]);
    }
    return {
      spuAttrs,
      spuAttrText
    };
  };
  const usePreFinalSku = async () => {
    let skuAttrs = [];
    attrData.value.saleAttrs.forEach(item => {
      if (item.value) {
        skuAttrs.push({
          attrId: item.id,
          name: item.name,
          value: item.value.join(";")
        });
      }
    });
    return { skuAttrs };
  };

  const preNext = async (step: number) => {
    try {
      switch (step) {
        case 0:
          spu.value["name"] = String(data.value[0]["name"]);
          spu.value["category"] = getCategory(
            data.value[0]["catIds"].toString().split(",")
          );
          spu.value["price"] = Number(data.value[0]["price"]);
          spu.value["discount"] = Number(data.value[0]["discount"]);
          spu.value["desc"] = String(data.value[0]["desc"]);
          //上传文件
          const sfiles = reUploadSingleRef.value.getFiles();
          const mfiles = reUploadMultipleRef.value.getFiles();
          console.log("上传文件", sfiles, mfiles);

          //获取attrData
          const _catId = spu.value.category.slice(-1)[0].id;
          if (_catId !== catId) {
            const res = await attrStore.getAttrListByCatId({ catId: _catId });
            const temp = { spuAttrs: [], saleAttrs: [] } as AttrFormInLine;
            res.map(item => {
              if (item.type === 0) {
                temp.spuAttrs.push({
                  ...item,
                  id: item.attrId,
                  options: item.value.split(";"),
                  value: "",
                  quickShow: 0
                });
              } else if (item.type === 1) {
                temp.saleAttrs.push({
                  ...item,
                  id: item.attrId,
                  options: item.value.split(";"),
                  value: []
                });
              }
            });
            // 设置属性数据
            attrData.value = temp;
            console.log("attrData loaded", attrData.value);
            catId = _catId;
          }
          break;
        case 1:
          if (attrCheckboxRef.value) {
            const extendData = getExtandData();
            console.log("extendData", extendData);
            attrCheckboxRef.value.submit(extendData);
            console.log("tableData", tableData.value);
          } else {
            console.warn("AttrCheckbox 实例未初始化");
          }
          break;
        case 2:
          const { spuAttrText, spuAttrs } = await usePreFinalSpu();
          finalSpu.value = {
            ...spu.value,
            images: spu.value.mainImage.map(item => item.url),
            category: spu.value.category.slice(-1)[0].name,
            attrText: spuAttrText,
            mainImage: spu.value.image[0]?.url || "",
            spuAttrs: spuAttrs
          };
          const { skuAttrs } = await usePreFinalSku();
          const tempFinalSku = [];
          tableData.value.forEach(async item => {
            const tempSkuAttrs = [];
            let tempSkuAttrText = "",
              tempSpuAttrText = "";
            if (item.image[0]?.raw && item.image[0].url.startsWith("blob:")) {
              item.image[0].url = await readFileAsDataURL(item.image[0]);
            }
            //循环item的属性，获取sku开头的属性值
            Object.keys(item).forEach(key => {
              if (key.startsWith("spu") && item[key].quickShow === 1) {
                tempSpuAttrText += item[key].value.join("") + ";";
              }
              if (key.startsWith("sku")) {
                skuAttrs.forEach(skuAttr => {
                  if (Number(key.split("-")[1]) === skuAttr.attrId) {
                    tempSkuAttrText += item[key] + ";";
                    tempSkuAttrs.push({
                      attrId: skuAttr.attrId,
                      name: skuAttr.name,
                      value: item[key]
                    });
                  }
                });
              }
            });
            tempFinalSku.push({
              ...item,
              image: item.image[0]?.url || "",
              attrText: tempSpuAttrText + tempSkuAttrText,
              skuAttrs: tempSkuAttrs
            });
          });
          finalSku.value = tempFinalSku;
          console.log(
            "完成",
            finalSpu.value,
            "finalSku",
            finalSku.value,
            tableData.value
          );
          break;
        case 3:
          // 保存数据
          // 1. 保存spu
          // 1.1 保存图片,最后一项为主图
          const spuImages = await uploadSpuImages();
          //1.2 保存spu
          const spuReps = await saveSpuInfo(spuImages);
          // 2 保存sku
          saveSkuInfo(spuReps);
          // 3. 保存完成
          console.log("保存完成");
          break;
        default:
          console.warn("step 超出范围");
          break;
      }
    } catch (error) {
      console.error("preNext error:", error);
    }
  };
  const next = async () => {
    if (active.value <= stepForm.value.length) {
      await preNext(active.value);
      console.log("spu", spu.value, "data", data.value);
      active.value++;
      if (active.value === stepForm.value.length) {
        active.value++;
        isDirty.value = false; // 最后一步完成后，重置修改标记
        message(
          h("p", null, [
            h("span", null, "Message can be "),
            h("i", { style: "color: teal" }, "VNode")
          ])
        );
      }
    } else {
      message("已经是最后一步了");
    }
  };
  const pre = () => {
    if (active.value == stepForm.value.length + 1) {
      active.value -= 3;
    } else if (active.value > 0) {
      active.value--;
    }
  };
  const openMessage = () => {
    message(
      h("p", null, [
        h("span", null, "Message can be "),
        h("i", { style: "color: teal" }, "VNode")
      ])
    );
  };

  return {
    stepForm,
    active,
    data,
    next,
    pre,
    isDirty,
    uploadSpuImages,
    saveSpuInfo,
    saveSkuInfo,
    openMessage
  };
}
