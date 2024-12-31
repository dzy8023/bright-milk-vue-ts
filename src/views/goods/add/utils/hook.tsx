import { computed, Fragment, h, type Ref, ref, shallowRef } from "vue";
// https://plus-pro-components.com/components/steps-form.html
import { Edit, Medal, Sell, Finished } from "@element-plus/icons-vue";

import { message } from "@/utils/message";
import type {
  FieldValues,
  OptionsRow,
  PlusStepFromRow
} from "plus-pro-components";
import { getCategoryTreeApi } from "@/api/category";
import ReUpload from "@/components/ReUpload";
import AttrCheckbox from "@/views/components/attrCheckbox/utils/attr-checkbox.vue";
import { ElButton } from "element-plus";
import type { UploadUserFile } from "element-plus";
import type { ReUploadInstance } from "@/components/ReUpload/src/ReUpload";
import type {
  SkuAttr,
  SupAttr
} from "@/views/components/attrCheckbox/utils/types";
import { useColumns } from "@/views/components/attrCheckbox/utils/hook";
import Skutab from "../form/skutab.vue";

/**
 * 图片自动上传，在系统管理里面内嵌一个minio后台管理系统，或者增加一个图片清理功能
 */
export function useStepsForm() {
  const data = ref<FieldValues[]>([
    {
      name: "鲜牛奶",
      catIds: [],
      price: 5.8,
      image: [],
      mainImages: [],
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
    desc: "",
    image: [] as UploadUserFile[],
    mainImages: [] as UploadUserFile[],
    attr: {},
    skus: []
  });
  const active = ref(0);
  const categoryOptions: Ref<OptionsRow[]> = ref([]);
  const { attrCheckboxRef, columns, tableData, handleSubmit } = useColumns();

  const getCategoryTreeData = async () => {
    categoryOptions.value = [];
    const res = await getCategoryTreeApi();
    const convertCategory = items => {
      return items.map(item => ({
        name: item.name, // 将 name 改为 label
        id: item.id,
        status: item.status == 0, // 将 status 改为 disabled
        children: item.children ? convertCategory(item.children) : [] // 递归处理子分类
      }));
    };
    categoryOptions.value = convertCategory(res.result); // 转换并赋值
    console.log(categoryOptions.value);
  };
  const getExtandData = () => {
    return {
      name: spu.value.name,
      category: spu.value.category,
      price: spu.value.price,
      image: spu.value.image.map(f => f.url)[0],
      desc: data.value[0].desc,
      spuName: spu.value.name
    };
  };
  // getCategoryTreeData();

  const stepForm = shallowRef<PlusStepFromRow[]>([
    {
      title: "基本信息",
      icon: Edit,
      form: {
        modelValue: data.value[0],
        labelWidth: "110px",
        footerAlign: "center",
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
            options: computed(() => categoryOptions.value),
            colProps: {
              span: 12
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
              span: 12
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
                  multiple: true,
                  limit: 1,
                  modelValue: spu.value.image,
                  "onUpdate:modelValue": (files: UploadUserFile[]) => {
                    spu.value.image = files;
                    onChange(files.map(f => f.url));
                  }
                })
              ]);
            }
          },
          {
            label: "商品图集",
            prop: "mainImages",
            renderField(_, onChange) {
              const reUploadRef = ref<ReUploadInstance>();
              return h(Fragment, [
                h(ReUpload, {
                  multiple: true,
                  modelValue: spu.value.mainImages,
                  ref: reUploadRef,
                  limit: 10,
                  "onUpdate:modelValue": (files: UploadUserFile[]) => {
                    spu.value.mainImages = files;
                    onChange(files.map(f => f.url));
                  }
                }),
                h(
                  ElButton,
                  {
                    type: "primary",
                    onClick: () => {
                      if (reUploadRef.value) {
                        const files = reUploadRef.value.getFiles();
                        console.log("上传", files);
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
              return h(Fragment, [
                h(AttrCheckbox, {
                  ref: attrCheckboxRef,
                  modelValue: spu.value.attr,
                  "onUpdate:modelValue": value => {
                    spu.value.attr = value;
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
                <Skutab tableData={tableData.value} columns={columns}></Skutab>
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
            label: "保存完成",
            prop: "time",
            valueType: "date-picker"
          },
          {
            label: "要求",
            prop: "demand",
            valueType: "checkbox",
            options: [
              {
                label: "四六级",
                value: "0"
              },
              {
                label: "计算机二级证书",
                value: "1"
              },
              {
                label: "普通话证书",
                value: "2"
              }
            ]
          },
          {
            label: "奖励",
            prop: "price"
          },
          {
            label: "提成",
            prop: "percentage"
          },
          {
            label: "说明",
            prop: "desc",
            valueType: "textarea",
            fieldProps: {
              maxlength: 10,
              showWordLimit: true,
              autosize: { minRows: 2, maxRows: 4 }
            }
          }
        ]
      }
    }
  ]);
  const preNext = (step: number) => {
    switch (step) {
      case 0:
        spu.value["name"] = String(data.value[0]["name"]);
        spu.value["category"] = data.value[0]["catIds"].toString().split(",");
        spu.value["price"] = Number(data.value[0]["price"]);
        spu.value["desc"] = String(data.value[0]["desc"]);
        break;
      case 1:
        if (attrCheckboxRef.value) {
          let extandData = getExtandData();
          console.log("extandData", extandData);
          attrCheckboxRef.value.submit(extandData);
        } else {
          console.warn("AttrCheckbox 实例未初始化");
        }
        break;
      case 2:
        break;
      case 3:
        break;
      default:
        console.warn("step 超出范围");
        break;
    }
  };

  const next = () => {
    if (active.value <= stepForm.value.length) {
      preNext(active.value);
      console.log("spu", spu.value, "data", data.value);
      active.value++;
      if (active.value === stepForm.value.length) {
        active.value++;
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
    console.log("next", active.value);
  };
  const pre = () => {
    if (active.value == stepForm.value.length + 1) {
      active.value -= 3;
    } else if (active.value > 0) {
      active.value--;
    }
    console.log("pre", active.value);
  };

  return { stepForm, active, data, next, pre };
}
