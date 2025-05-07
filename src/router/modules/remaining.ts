const Layout = () => import("@/layout/index.vue");

export default [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/login/index.vue"),
    meta: {
      title: "登录",
      showLink: false,
      rank: 101
    }
  },
  {
    path: "/redirect",
    component: Layout,
    meta: {
      title: "加载中",
      showLink: false,
      rank: 102
    },
    children: [
      {
        path: "/redirect/:path(.*)",
        name: "Redirect",
        component: () => import("@/layout/redirect.vue")
      }
    ]
  },
  {
    path: "/account-settings",
    name: "AccountSettings",
    component: () => import("@/views/account-settings/index.vue"),
    meta: {
      title: "账号设置",
      showLink: false,
      rank: 103
    }
  },
  {
    path: "/message-detail",
    name: "MessageDetail",
    component: () =>
      import("@/views/message-management/message-detail/index.vue"),
    meta: { title: "消息详情", showLink: false, rank: 104 },
    children: [
      {
        path: "/message-detail/:messageType",
        name: "MessageDetailByMessageType",
        component: () =>
          import("@/views/message-management/message-detail/detail-type.vue"),
        meta: { title: "消息详情", showLink: false }
      },
      {
        path: "/message-detail/:messageType/:messageId",
        name: "MessageDetailByMessageId",
        component: () =>
          import(
            "@/views/message-management/message-detail/detail-message-id.vue"
          ),
        meta: { title: "消息详情", showLink: false }
      }
    ]
  }
] satisfies Array<RouteConfigsTable>;
