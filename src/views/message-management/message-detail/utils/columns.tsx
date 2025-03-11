// 表格列
export const columns: TableColumnList = [
  { type: "selection", align: "left" },
  { label: "标题", prop: "title", slot: "title" },
  { label: "接收时间", prop: "acceptanceTime", sortable: true },
  { label: "消息简介", prop: "extra" }
];
