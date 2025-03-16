import { h, reactive } from "vue";
import type { FormRules } from "element-plus";
import { ElTag } from "element-plus";

import { isAllEmpty } from "@pureadmin/utils";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";

/**
 * 标签栏菜单类型匹配
 * @param type
 * @param text
 */
const getMenuType = (type: number, text: boolean = false): any => {
  switch (type) {
    case 0:
      return text ? "菜单" : "primary";
    case 1:
      return text ? "iframe" : "warning";
    case 2:
      return text ? "外部链接" : "danger";
  }
};

/** 格式化菜单选项 */
export const formatHigherMenuOptions = (treeList: any) => {
  if (!treeList || !treeList.length) return;
  const newTreeList = [];
  for (let i = 0; i < treeList.length; i++) {
    treeList[i].title = treeList[i].title;
    formatHigherMenuOptions(treeList[i].children);
    newTreeList.push(treeList[i]);
  }
  return newTreeList;
};

export const columns: TableColumnList = [
  { type: "selection", align: "left" },
  {
    label: "菜单名称",
    prop: "title",
    align: "left",
    cellRenderer: ({ row }) => (
      <>
        <span class="inline-block mr-1">
          {h(useRenderIcon(row.icon), {
            style: { paddingTop: "1px" }
          })}
        </span>
        <span>{row.title}</span>
      </>
    ),
    minWidth: 170
  },
  {
    label: "菜单类型",
    prop: "menuType",
    minWidth: 130,
    cellRenderer: ({ row, props }) => (
      <ElTag size={props.size} type={getMenuType(row.menuType)} effect="plain">
        {getMenuType(row.menuType, true)}
      </ElTag>
    )
  },
  { label: "路由路径", prop: "path", minWidth: 230 },
  {
    label: "组件路径",
    prop: "component",
    formatter: ({ path, component }) =>
      isAllEmpty(component) ? path : component,
    minWidth: 200
  },
  { label: "排序", prop: "rank", minWidth: 80, slot: "rank" },
  { label: "是否显示", prop: "visible", slot: "visible", minWidth: 100 },
  {
    label: "更新时间",
    prop: "updateTime",
    sortable: true,
    minWidth: 160
  },
  {
    label: "创建时间",
    prop: "createTime",
    sortable: true,
    minWidth: 160
  },
  {
    label: "创建用户",
    prop: "createUser",
    slot: "createUser",
    minWidth: 130
  },
  {
    label: "更新用户",
    prop: "updateUser",
    slot: "updateUser",
    minWidth: 130
  },
  {
    label: "操作",
    fixed: "right",
    width: 180,
    slot: "operation"
  }
];

/** 自定义表单规则校验 */
export const formRules = reactive<FormRules>({
  title: [{ required: true, message: "菜单名称为必填项", trigger: "blur" }],
  name: [{ required: true, message: "路由名称为必填项", trigger: "blur" }],
  path: [
    {
      required: true,
      message: '路由路径为必填项且为"/"开头',
      trigger: ["blur", "change"],
      pattern: /^\/.*/
    }
  ]
});
