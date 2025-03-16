import { reactive } from "vue";
import type { FormRules } from "element-plus";

/** 自定义表单规则校验 */
export const rules: any = reactive<FormRules>({
  name: [{ required: true, message: "属性名称为必填项", trigger: "blur" }],
  value: [{ required: true, message: "属性值为必填项", trigger: "blur" }]
});
