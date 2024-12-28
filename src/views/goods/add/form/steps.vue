<script setup lang="ts">
import { h, ref, shallowRef } from "vue";
// https://plus-pro-components.com/components/steps-form.html
import "plus-pro-components/es/components/steps-form/style/css";
import { PlusStepsForm } from "plus-pro-components";
import { Edit, Medal, Sell, Finished } from "@element-plus/icons-vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { message } from "@/utils/message";
// useRenderIcon("ep:set-up")
const stepForm = shallowRef([
  {
    title: "基本信息",
    icon: Edit,
    form: {
      modelValue: {},
      columns: [
        {
          label: "名称",
          width: 120,
          prop: "name",
          valueType: "copy",
          tooltip: "名称最多显示6个字符"
        },
        {
          label: "状态",
          width: 120,
          prop: "status",
          valueType: "select",
          options: [
            {
              label: "未解决",
              value: "0",
              color: "red"
            },
            {
              label: "已解决",
              value: "1",
              color: "blue"
            },
            {
              label: "解决中",
              value: "2",
              color: "yellow"
            },
            {
              label: "失败",
              value: "3",
              color: "red"
            }
          ]
        }
      ]
    }
  },
  {
    title: "规格参数",
    icon: Medal,
    form: {
      modelValue: {},
      columns: [
        {
          label: "标签",
          width: 120,
          prop: "tag"
        },
        {
          label: "执行进度",
          width: 200,
          prop: "progress"
        },
        {
          label: "评分",
          width: 200,
          prop: "rate",
          valueType: "rate"
        },
        {
          label: "是否显示",
          width: 100,
          prop: "switch",
          valueType: "switch"
        }
      ]
    }
  },
  {
    title: "销售属性",
    icon: useRenderIcon("ep:set-up"),
    form: {
      modelValue: {},
      columns: [
        {
          label: "销售属性",
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
  },
  {
    title: "SKU信息",
    icon: Sell,
    form: {
      modelValue: {},
      columns: [
        {
          label: "SKU信息",
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
const active = ref(0);
const next = (actives: number, values: any) => {
  if (active.value <= stepForm.value.length) {
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
};
const pre = (actives: number) => {
  if (active.value == stepForm.value.length + 1) {
    active.value -= 3;
  } else if (active.value > 0) {
    active.value--;
  }
};
</script>

<template>
  <PlusStepsForm
    :active="active"
    simple
    class="w-[800px] m-auto"
    :data="stepForm as any"
    @next="next"
    @pre="pre"
  >
    <template #title="{ title }">{{ title }}</template>
  </PlusStepsForm>
</template>
