<template>
  <div class="clearfix">
    <span>选择商品属性</span>
    <el-form ref="form" v-model="tempData.spuAttrs">
      <el-form-item
        v-for="(item, index) in spu.spuAttrs"
        :key="item.id"
        :label="item.name"
      >
        <el-input
          v-show="false"
          v-model="tempData.spuAttrs[index].id"
          type="hidden"
        />
        <el-select
          v-model="tempData.spuAttrs[index].value"
          style="width: 250px; margin-right: 20px"
          :multiple="item.select == 1"
          filterable
          clearable
          allow-create
          default-first-option
          placeholder="请选择或输入值"
        >
          <el-option
            v-for="(val, vidx) in item.value.split(';')"
            :key="vidx"
            :label="val"
            :value="val"
          />
        </el-select>
        <el-checkbox
          v-model="tempData.spuAttrs[index].quickShow"
          :true-value="1"
          :false-label="0"
          >快速展示</el-checkbox
        >
      </el-form-item>
    </el-form>
  </div>
  <el-divider />
  <div class="clearfix">
    <span>选择销售属性</span>
    <el-form ref="saleform" :model="tempData.saleAttrs">
      <el-form-item
        v-for="(item, index) in spu.saleAttrs"
        :key="item.id"
        :label="item.name"
      >
        <el-input
          v-show="false"
          v-model="tempData.saleAttrs[index].id"
          type="hidden"
        />
        <el-checkbox-group v-model="tempData.saleAttrs[index].value">
          <span v-if="item.value != ''">
            <el-checkbox
              v-for="val in item.value.split(';')"
              :key="val"
              :label="val"
              :value="val"
            />
          </span>
          <div style="display: inline; margin-left: 20px">
            <el-button
              v-show="!inputVisible[index].view"
              class="button-new-tag"
              size="small"
              @click="showInput(index)"
              >+自定义</el-button
            >
            <el-input
              v-show="inputVisible[index].view"
              :ref="
                el => {
                  inputRefs[`saveTagInput${index}`] = el;
                }
              "
              v-model="inputVisible[index].val"
              size="small"
              style="width: 150px"
              @keyup.enter="handleInputConfirm(index)"
              @blur="handleInputConfirm(index)"
            />
          </div>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { AttrItem } from "@/types/attr";
import { ref, nextTick, computed, onMounted } from "vue";
import { SkuAttr, SupAttr } from "./types";
import { filterEmptyArray } from "@/utils/utils";
//默认值
/**
 * 方案一：使用类型参数并手动设置默认值
你可以只使用类型参数，然后在组件内部手动设置默认值。
modelValue值必须传入，因为它会被重置为默认值。
const props = withDefaults(defineProps<{
  modelValue: {
    spuAttrs: (SupAttr & { quickShow: 0 | 1 })[];
    saleAttrs: SkuAttr[];
  };
}>(), {
  modelValue: () => ({
    spuAttrs: [],
    saleAttrs: []
  })
});
方案二：使用默认值参数并手动定义类型
你可以只使用默认值参数，然后手动定义 props 的类型。
可以不传入 modelValue，因为它会被重置为默认值。
const props = defineProps({
  modelValue: {
    type: Object as PropType<{
      spuAttrs: (SupAttr & { quickShow: 0 | 1 })[];
      saleAttrs: SkuAttr[];
    }>,
    default: () => ({
      spuAttrs: [],
      saleAttrs: []
    })
  }
});
 */
// const props = withDefaults(
//   defineProps<{
//     modelValue: {
//       spuAttrs: (SupAttr & { quickShow: 0 | 1 })[];
//       saleAttrs: SkuAttr[];
//     };
//   }>(),
//   {
//     modelValue: () => ({
//       spuAttrs: [],
//       saleAttrs: []
//     })
//   }
// );
const props = defineProps({
  modelValue: {
    type: Object as PropType<{
      spuAttrs: (SupAttr & { quickShow: 0 | 1 })[];
      saleAttrs: SkuAttr[];
      selfDefinedAttrs: SelfDefine[];
    }>,
    default: () => ({
      spuAttrs: [],
      saleAttrs: [],
      selfDefinedAttrs: []
    })
  }
});
interface SelfDefine {
  index: number;
  value: string;
}
const inputRefs = ref({});
const inputVisible = ref<{ view: boolean; val: string }[]>([]);

const spu = ref<{
  spuAttrs: Omit<AttrItem, "type">[];
  saleAttrs: Omit<AttrItem, "type">[];
}>({
  spuAttrs: [
    {
      id: 1,
      name: "颜色",
      icon: "el-icon-color",
      value: "黑色;白色;红色;蓝色",
      desc: "颜色",
      select: 0
    },
    {
      id: 2,
      name: "尺寸",
      icon: "el-icon-s-grid",
      value: "S;M;L;XL",
      desc: "尺寸",
      select: 1
    },
    {
      id: 3,
      name: "材质",
      icon: "el-icon-suitcase",
      value: "棉;棉麻;聚酯纤维;聚乙烯;其他",
      desc: "材质",
      select: 1
    },
    {
      id: 4,
      name: "包装",
      icon: "el-icon-box",
      value: "纸盒;纸箱;塑料盒;塑料箱;其他",
      desc: "包装",
      select: 1
    },
    {
      id: 5,
      name: "产地",
      icon: "el-icon-international",
      desc: "产地",
      select: 0,
      value: "江西;湖南;湖北;广东;四川;河南;河北;山东"
    }
  ],
  saleAttrs: [
    {
      id: 1,
      name: "规格",
      icon: "el-icon-color",
      value: "180ml;200ml;250ml;300ml",
      desc: "规格",
      select: 0
    },
    {
      id: 2,
      name: "包装",
      icon: "el-icon-s-grid",
      value: "袋装;盒装;瓶装;桶装",
      desc: "包装",
      select: 1
    }
  ]
});

const tempData = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emits("update:modelValue", val);
  }
});
const emits = defineEmits(["update:modelValue", "submit"]);
const data = {
  spuAttrs: [] as (SupAttr & { quickShow: 0 | 1 })[],
  saleAttrs: [] as SkuAttr[]
};
const initData = () => {
  inputVisible.value = Array.from(
    { length: spu.value.saleAttrs.length },
    () => ({
      view: false,
      val: ""
    })
  );
  if (!tempData.value.spuAttrs) {
    console.log("initData", tempData.value);
    tempData.value.spuAttrs = spu.value.spuAttrs.map(item => ({
      id: item.id,
      name: item.name,
      value: "",
      quickShow: 0
    }));
    tempData.value["saleAttrs"] = spu.value["saleAttrs"].map(item => ({
      id: item.id,
      name: item.name,
      value: []
    }));
    tempData.value["selfDefinedAttrs"] = [];
  } else if (tempData.value.selfDefinedAttrs) {
    console.log("不初始化", tempData.value);
    tempData.value.selfDefinedAttrs.forEach(item => {
      spu.value.saleAttrs[item.index].value += ";" + item.value;
    });
  }
};
initData();

const showInput = (index: number) => {
  // 显示输入框并隐藏按钮
  inputVisible.value[index].view = true;
  // 让输入框自动聚焦
  nextTick(() => {
    const inputRef = inputRefs.value[
      `saveTagInput${index}`
    ] as HTMLInputElement;
    if (inputRef) {
      inputRef.focus();
    }
  });
};

const handleInputConfirm = (index: number) => {
  // 隐藏输入框并显示按钮
  inputVisible.value[index].view = false;
  // 处理输入的值（例如保存到数据中）
  const inputValue = inputVisible.value[index].val.trim().replaceAll(";", "");
  if (inputValue) {
    // 这里可以添加处理输入值的逻辑
    spu.value.saleAttrs[index].value += ";" + inputValue;
    tempData.value.selfDefinedAttrs.push({ index, value: inputValue });
  }
  // 清空输入框
  inputVisible.value[index].val = "";
};

const generateSaleAttrs = () => {
  const result: any[] = []; // 用于存储最终的笛卡尔积结果
  let temp: any[] = []; // 用于临时存储当前组合
  // 递归函数，用于生成笛卡尔积
  const cartesianProduct = (index: number) => {
    if (index === data.saleAttrs.length) {
      // 如果已经遍历完所有属性集合，将当前组合加入结果
      result.push([...temp]);
      return;
    }
    // 遍历当前属性集合的每个元素
    for (let i = 0; i < data.saleAttrs[index].value.length; i++) {
      temp.push({
        id: data.saleAttrs[index].id,
        name: data.saleAttrs[index].name,
        value: data.saleAttrs[index].value[i]
      }); // 将当前元素加入临时组合
      cartesianProduct(index + 1); // 递归处理下一个属性集合
      temp.pop(); // 回溯，移除当前元素
    }
  };
  cartesianProduct(0); // 从第一个属性集合开始
  return result;
};

const submit = (extandData?: any) => {
  data.spuAttrs = [];
  data.saleAttrs = [];
  console.log("submit", tempData.value);
  // 过滤掉没有选择的属性，并重新赋值给 data.value
  tempData.value.spuAttrs.map(item => {
    //item.value不为undefined
    if (item.value && item.value.length !== 0) {
      let value = item.value;
      if (value instanceof Array) {
        value = value.join(";");
      }
      data.spuAttrs.push({
        id: item.id,
        name: item.name,
        value: value,
        quickShow: item.quickShow,
        props: "spu-" + item.id
      });
    }
  });
  tempData.value.saleAttrs.map(item => {
    if (item.value.length !== 0) {
      data.saleAttrs.push({
        id: item.id,
        name: item.name,
        value: item.value,
        props: "sku-" + item.id
      });
    }
  });
  // 计算笛卡尔积
  const cartesianProduct = filterEmptyArray(generateSaleAttrs());
  const skus = [];
  cartesianProduct.forEach(item => {
    let sku = {};
    let spu = {};
    item.map(attr => (sku = { ...sku, [`sku-${attr.id}`]: attr.value }));
    data.spuAttrs.map(
      attr =>
        (spu = {
          ...spu,
          [`spu-${attr.id}`]: {
            value: attr.value,
            quickShow: attr.quickShow
          }
        })
    );
    skus.push({
      ...sku,
      ...spu
    });
  });
  emits("submit", data, skus, extandData);
};

defineExpose({
  submit
});
</script>
