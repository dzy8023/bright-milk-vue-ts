import { reactive } from "vue";
import type { FormRules } from "element-plus";

const validateImage = (rule: any, value: any, callback: any) => {
  if (value && value.length > 0) {
    callback();
  } else {
    callback(new Error("请上传商品图片"));
  }
};
export const rules: any = reactive<FormRules>({
  name: [
    {
      required: true,
      message: "请输入商品名称",
      trigger: "blur"
    },
    {
      max: 64,
      message: "名称最多64个字符",
      trigger: "blur"
    }
  ],
  //价格要大于0, 且最多两位小数
  price: [
    { required: true, message: "请输入商品价格", trigger: "blur" },
    {
      type: "number",
      min: 0.01,
      message: "价格必须为大于0的数字",
      trigger: "blur"
    }
  ],
  discount: [
    { required: true, message: "请输入商品折扣", trigger: "blur" },
    {
      type: "number",
      min: 0.01,
      message: "折扣必须为大于0的数字",
      trigger: "blur"
    }
  ],
  image: [
    {
      required: true,
      validator: validateImage,
      trigger: "change"
    }
  ]
});
