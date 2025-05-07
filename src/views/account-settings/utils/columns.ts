import dayjs from "dayjs";
import { reactive } from "vue";
import type { FormRules } from "element-plus";
import ProfileIcon from "@iconify-icons/ri/user-3-line";
import PreferencesIcon from "@iconify-icons/ri/settings-3-line";
import SecurityLogIcon from "@iconify-icons/ri/window-line";
import AccountManagementIcon from "@iconify-icons/ri/profile-line";

export const columns: TableColumnList = [
  {
    type: "index",
    index: (index: number) => index + 1,
    label: "序号",
    width: 60
  },
  // 用户名
  { label: "用户名", prop: "username", width: 180 },
  // 登录Ip
  { label: "IP地址", prop: "ipAddress", width: 140 },
  // 登录Ip归属地
  { label: "IP归属地", prop: "ipRegion" },
  // // 登录时代理
  // { label: $t('userLoginLog_userAgent'), prop: 'userAgent' },
  // 操作类型
  { label: "操作类型", prop: "type" },
  // // 标识客户端是否是通过Ajax发送请求的
  // { label: $t('userLoginLog_xRequestedWith'), prop: 'xRequestedWith', width: 150 },
  // 创建时间也就是操作时间
  {
    label: "操作时间",
    prop: "op_time",
    sortable: true,
    width: 160,
    formatter: ({ operatingTime }) =>
      dayjs(operatingTime).format("YYYY-MM-DD HH:mm:ss")
  }
];

// 修改用户信息规则校验
export const rules = reactive<FormRules<any>>({
  nickname: [{ required: true, message: "昵称必填", trigger: "blur" }],
  email: [{ required: true, message: "昵称必填", trigger: "blur" }]
});

// tab栏内容
import { defineAsyncComponent } from "vue";

export const panes = [
  {
    key: "profile",
    label: "个人信息",
    icon: ProfileIcon,
    component: defineAsyncComponent(
      () => import("@/views/account-settings/profile.vue")
    )
  },
  {
    key: "preferences",
    label: "偏好设置",
    icon: PreferencesIcon,
    component: defineAsyncComponent(
      () => import("@/views/account-settings/preferences.vue")
    )
  },
  {
    key: "securityLog",
    label: "安全日志",
    icon: SecurityLogIcon,
    component: defineAsyncComponent(
      () => import("@/views/account-settings/security-log.vue")
    )
  },
  {
    key: "accountManagement",
    label: "账户管理",
    icon: AccountManagementIcon,
    component: defineAsyncComponent(
      () => import("@/views/account-settings/account-management.vue")
    )
  }
];
