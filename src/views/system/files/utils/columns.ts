import { reactive } from "vue";

// 表格列
export const columns: TableColumnList = [
  { type: "selection", align: "left" },
  {
    type: "index",
    index: (index: number) => index + 1,
    label: "序号",
    minWidth: 60
  },
  // 文件的名称
  { label: "文件名", prop: "filename", minWidth: 280 },
  // 文件在服务器上的存储路径
  { label: "存储路径", prop: "filepath", minWidth: 280 },
  // 文件的MIME类型
  { label: "文件类型", prop: "fileType", minWidth: 180 },
  // 下载数量
  { label: "下载次数", prop: "downloadCount", minWidth: 115 },
  { label: "更新时间", prop: "updateTime", sortable: true, minWidth: 160 },
  { label: "创建时间", prop: "createTime", sortable: true, minWidth: 160 },
  { label: "创建用户", prop: "createUser", slot: "createUser", minWidth: 130 },
  { label: "更新用户", prop: "updateUser", slot: "updateUser", minWidth: 130 },
  { label: "操作", fixed: "right", width: 180, slot: "operation" }
];

// 添加规则
export const addRules = reactive({
  // 文件在服务器上的存储路径
  filepath: [{ required: true, message: "输入文件路径", trigger: "blur" }],
  // 文件列表
  files: [{ required: true, message: "请选择文件", trigger: "blur" }]
});

// 上传规则
export const uploadRules = reactive({
  // 文件的名称
  filename: [{ required: true, message: "输入文件名", trigger: "blur" }],
  // 文件的MIME类型
  fileType: [{ required: true, message: "输入文件类型", trigger: "blur" }]
});
