import { h, reactive } from "vue";
import type { FormRules } from "element-plus";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";

// 表格列
export const columns: TableColumnList = [
  {
    label: "属性编号",
    prop: "id"
  },
  {
    label: "属性名称",
    prop: "name",
    cellRenderer: ({ row }) => (
      <>
        <span class="inline-block mr-1">
          {h(useRenderIcon(row.icon), {
            style: { paddingTop: "1px" }
          })}
        </span>
        <span>{row.name}</span>
      </>
    ),
    minWidth: 90
  },
  {
    label: "属性值",
    prop: "value",
    minWidth: 120,
    cellRenderer: ({ row }) => (
      <>
        {row.value.map((item, i) => (
          <el-tag size="small" type="info" key={i}>
            {item}
          </el-tag>
        ))}
      </>
    )
  },
  {
    label: "属性描述",
    prop: "desc",
    minWidth: 90
  },
  {
    label: "属性类型",
    prop: "type",
    sortable: true,
    minWidth: 90,
    cellRenderer: ({ row }) => (
      <>
        <el-tag size="small" type={row.type === 0 ? "primary" : "success"}>
          {row.type === 0 ? "规格参数" : "销售属性"}
        </el-tag>
      </>
    )
  },
  {
    label: "操作",
    fixed: "right",
    width: 210,
    slot: "operation"
  }
];

/** 自定义表单规则校验 */
export const rules: any = reactive<FormRules>({
  name: [{ required: true, message: "属性名称为必填项", trigger: "blur" }],
  value: [{ required: true, message: "属性值为必填项", trigger: "blur" }],
  type: [
    { required: true, message: "属性类型为必填项", trigger: "blur" },
    { pattern: /^(0|1)$/, message: "属性类型值只能为0或1", trigger: "blur" }
  ]
});
// 树形选择器属性
export const treeProps = {
  value: "id",
  label: "name",
  children: "children",
  disabled: "status"
};
