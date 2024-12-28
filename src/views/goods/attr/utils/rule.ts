import { reactive } from "vue";
import type { FormRules } from "element-plus";

/** 自定义表单规则校验 */
export const formRules = reactive(<FormRules>{
  name: [{ required: true, message: "属性名称为必填项", trigger: "blur" }],
  value: [{ required: true, message: "属性值为必填项", trigger: "blur" }],
  type: [
    { required: true, message: "属性类型为必填项", trigger: "blur" },
    { pattern: /^(0|1)$/, message: "属性类型值只能为0或1", trigger: "blur" }
  ]
});
