import { computed } from "vue";

/** 是否默认 */
export const isDefaultOptions = [
  { value: true, label: "是" },
  { value: false, label: "否" }
];

/** 是否显示 */
export const isDefaultVisibleOptions = [
  { value: true, label: "显示" },
  { value: false, label: "不显示" }
];

/** 性别 */
export const genderConstant = [
  { value: 1, label: "男" },
  { value: 0, label: "女" }
];

/** 默认状态 */
export const userStatus = [
  { value: 0, label: "启用" },
  { value: 1, label: "禁用" }
];

/** 是否启用状态 */
export const enabledOrNotStatus = [
  { value: true, label: "启用" },
  { value: false, label: "禁用" }
];
/**订单状态 */
export const orderStatus = [
  { value: 1, label: "待付款", color: "" },
  { value: 2, label: "待发货", color: "" },
  { value: 3, label: "待收货", color: "" },
  { value: 4, label: "已完成", color: "" },
  { value: 5, label: "已取消", color: "" },
  { value: 6, label: "退款中", color: "" },
  { value: 7, label: "已退款", color: "" },
  { value: 8, label: "已删除", color: "" }
];
/**状态校验 */
export const verifyStatusMap = {
  remind: new Set<number>([1]),
  consign: new Set<number>([2]),
  cancel: new Set<number>([1, 2]),
  refund: new Set<number>([6]),
  delete: new Set<number>([5, 7, 8])
};
/** 订单来源 */
export const orderSourceType: {
  value: number;
  label: string;
  type: "success" | "warning" | "info" | "primary" | "danger";
}[] = [
  { value: 1, label: "miniapp", type: "success" },
  { value: 2, label: "h5", type: "warning" } // 修正了这里的拼写错误
];
/**配送方式 */
export const orderPostType: {
  value: number;
  label: string;
  type: "success" | "warning" | "info" | "primary" | "danger";
}[] = [
  { value: 1, label: "自取", type: "success" },
  { value: 2, label: "配送", type: "warning" }
];

/** 是否已读 */
export const isReadStatus = [
  { value: "", label: "全部" },
  { value: "true", label: "已读" },
  { value: "false", label: "未读" }
];

/** 分页默认数组个数 */
export const pageSizes: number[] = [15, 30, 50, 100, 150];
export const tableSelectButtonClass = computed(() => [
  "!h-[20px]",
  "reset-margin",
  "!text-gray-500",
  "dark:!text-white",
  "dark:hover:!text-primary"
]);
// export const UserAvatar = 'http://116.196.101.14:9000/auth-admin/avatar/user.jpg';
export const UserAvatar =
  "https://thirdwx.qlogo.cn/mmopen/vi_32/DYAIOgq83eoj0hHXhgJNOTSOFsS4uZs8x1ConecaVOB8eIl115xmJZcT4oCicvia7wMEufibKtTLqiaJeanU2Lpg3w/132";

export const iconClass = computed(() => {
  return [
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
  ];
});
export const MaxCategoryLayer = 3;

export const SseEntityType = {
  NOTIFICATION: 0,
  MESSAGE: 1,
  TODO: 2
};
export const SseNotificationType = {
  /**数据导出 */
  DATA_EXPORT: 0,
  /**订单发货 */
  ORDER_CONSIGN: 1
};
export const SseMessageStatus = [
  "primary",
  "success",
  "warning",
  "info",
  "danger"
];
export const SseNotificationTypeKeys = ["DATA_EXPORT"];
