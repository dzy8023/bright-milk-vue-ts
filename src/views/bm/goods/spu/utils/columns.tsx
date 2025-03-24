import noImg from "@/assets/img/noImg.png";
import dayjs from "dayjs";
import { reactive } from "vue";
import type { FormRules } from "element-plus";

export const columns: TableColumnList = [
  {
    type: "expand",
    slot: "expand"
  },
  {
    label: "勾选列", // 如果需要表格多选，此处label必须设置
    type: "selection",
    fixed: "left",
    reserveSelection: true // 数据刷新后保留选项
  },
  {
    label: "商品编号",
    prop: "id",
    width: 90
  },
  {
    label: "商品图片",
    prop: "image",
    cellRenderer: ({ row }) => (
      <el-image
        fit="cover"
        preview-teleported={true}
        src={row.image || noImg}
        preview-src-list={Array.of(row.image || noImg)}
        class="w-[80px] h-[80px] rounded-full align-middle"
      />
    ),
    width: 90
  },
  {
    label: "商品名称",
    prop: "name",
    slot: "name",
    width: 140
  },
  {
    label: "分类名称",
    prop: "catName",
    width: 100
  },
  {
    label: "状态",
    prop: "status",
    width: 90,
    slot: "status"
  },
  {
    label: "商品快速展示属性",
    prop: "attrText",
    width: 120,
    cellRenderer: ({ row, props }) => (
      <el-tag size={props.size} type="info">
        {row.attrText}
      </el-tag>
    )
  },
  {
    label: "商品展示价格",
    prop: "price",
    width: 90,
    sortable: true,
    cellRenderer: ({ row, props }) => (
      <el-tag size={props.size} type="danger">
        {row.price.toFixed(2)}
      </el-tag>
    )
  },
  {
    label: "商品折扣",
    prop: "discount",
    width: 90,
    sortable: true,
    cellRenderer: ({ row, props }) => (
      <el-tag size={props.size} type="success">
        {row.discount.toFixed(2)}
      </el-tag>
    )
  },
  {
    label: "商品销量",
    prop: "sales",
    width: 90,
    sortable: true,
    cellRenderer: ({ row, props }) => (
      <el-tag size={props.size} type="warning">
        {row.sales}
      </el-tag>
    )
  },
  {
    label: "商品描述",
    prop: "desc",
    width: 180
  },
  {
    label: "创建时间",
    width: 120,
    prop: "createTime",
    sortable: true,
    formatter: ({ createTime }) =>
      dayjs(createTime).format("YYYY-MM-DD HH:mm:ss")
  },
  {
    label: "更新时间",
    width: 120,
    prop: "updateTime",
    sortable: true,
    formatter: ({ updateTime }) =>
      dayjs(updateTime).format("YYYY-MM-DD HH:mm:ss")
  },
  {
    label: "操作",
    fixed: "right",
    width: 180,
    slot: "operation"
  }
];
export const childrenColumns: TableColumnList = [
  {
    label: "属性id",
    prop: "attrId",
    width: 140
  },
  {
    label: "属性名称",
    prop: "attrName",
    width: 140
  },
  {
    label: "属性值",
    prop: "value",
    width: 140
  },
  {
    label: "快速展示",
    prop: "quickShow",
    width: 140,
    slot: "quickShow"
  }
];
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
  catIds: [
    {
      type: "array",
      required: true,
      message: "请选择商品分类",
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
