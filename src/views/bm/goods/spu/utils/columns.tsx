import noImg from "@/assets/img/noImg.png";
import dayjs from "dayjs";

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
    minWidth: 130
  },
  {
    label: "分类名称",
    prop: "catName",
    minWidth: 90
  },
  {
    label: "状态",
    prop: "status",
    minWidth: 90,
    slot: "status"
  },
  {
    label: "商品快速展示属性",
    prop: "attrText",
    minWidth: 90,
    cellRenderer: ({ row, props }) => (
      <el-tag size={props.size} type="info">
        {row.attrText}
      </el-tag>
    )
  },
  {
    label: "商品展示价格",
    prop: "price",
    minWidth: 90,
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
    minWidth: 90,
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
    minWidth: 90,
    sortable: true,
    cellRenderer: ({ row, props }) => (
      <el-tag size={props.size} type="warning">
        {row.sales}
      </el-tag>
    )
  },
  {
    label: "创建时间",
    minWidth: 90,
    prop: "createTime",
    sortable: true,
    formatter: ({ createTime }) =>
      dayjs(createTime).format("YYYY-MM-DD HH:mm:ss")
  },
  {
    label: "更新时间",
    minWidth: 90,
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
    minWidth: 40
  },
  {
    label: "属性名称",
    prop: "name",
    minWidth: 50
  },
  {
    label: "属性值",
    prop: "value",
    minWidth: 90
  },
  {
    label: "快速展示",
    prop: "quickShow",
    minWidth: 50,
    slot: "quickShow"
  }
];
