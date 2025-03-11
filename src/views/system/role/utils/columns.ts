import { computed, reactive } from "vue";

// 表格列
export const columns: TableColumnList = [
  { type: "selection", align: "left" },
  {
    type: "index",
    index: (index: number) => index + 1,
    label: "序号",
    width: 60
  },
  // 角色代码
  { label: "角色码", prop: "roleCode" },
  // 描述
  { label: "角色详情", prop: "description" },
  { label: "更新时间", prop: "updateTime", sortable: true },
  { label: "创建时间", prop: "createTime", sortable: true },
  { label: "创建用户", prop: "createUser", slot: "createUser", width: 130 },
  { label: "更新用户", prop: "updateUser", slot: "updateUser", width: 130 },
  { label: "操作", fixed: "right", width: 240, slot: "operation" }
];

// 添加规则
export const rules = reactive({
  // 角色代码
  roleCode: [{ required: true, message: "输入权限码", trigger: "blur" }],
  // 描述
  description: [{ required: true, message: "输入权限详情", trigger: "blur" }]
});

// 权限显示图标类名
export const iconClass = computed(() => [
  "w-[22px]",
  "h-[22px]",
  "flex",
  "justify-center",
  "items-center",
  "outline-none",
  "rounded-[4px]",
  "cursor-pointer",
  "transition-colors",
  "hover:bg-[#0000000f]",
  "dark:hover:bg-[#ffffff1f]",
  "dark:hover:text-[#ffffffd9]"
]);
