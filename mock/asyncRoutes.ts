// 模拟后端动态生成路由
import { system } from "@/router/enums";
import { defineFakeRoute } from "vite-plugin-fake-server/client";

/**
 * roles：页面级别权限，这里模拟二种 "admin"、"common"
 * admin：管理员角色
 * common：普通角色
 */

const permissionRouter = {
  path: "/permission",
  meta: {
    title: "权限管理",
    icon: "ep:lollipop",
    rank: 10
  },
  children: [
    {
      path: "/permission/page/index",
      name: "PermissionPage",
      meta: {
        title: "页面权限",
        roles: ["admin", "common"]
      }
    },
    {
      path: "/permission/button",
      meta: {
        title: "按钮权限",
        roles: ["admin", "common"]
      },
      children: [
        {
          path: "/permission/button/router",
          component: "permission/button/index",
          name: "PermissionButtonRouter",
          meta: {
            title: "路由返回按钮权限",
            auths: [
              "permission:btn:add",
              "permission:btn:edit",
              "permission:btn:delete"
            ]
          }
        },
        {
          path: "/permission/button/login",
          component: "permission/button/perms",
          name: "PermissionButtonLogin",
          meta: {
            title: "登录接口返回按钮权限"
          }
        }
      ]
    }
  ]
};
const systemManagementRouter = {
  path: "/system",
  meta: {
    icon: "ri:settings-3-line",
    title: "系统管理",
    rank: system
  },
  children: [
    {
      path: "/system/user/index",
      name: "SystemUser",
      meta: {
        icon: "ri:admin-line",
        title: "用户管理",
        roles: ["admin"]
      }
    },
    {
      path: "/system/role/index",
      name: "SystemRole",
      meta: {
        icon: "ri:admin-fill",
        title: "角色管理",
        roles: ["admin"]
      }
    },
    {
      path: "/system/menu/index",
      name: "SystemMenu",
      meta: {
        // icon: "ep:menu",
        icon: "svg-spinners:blocks-scale",
        title: "菜单管理",
        roles: ["admin"]
      }
    }
  ]
};
const goodsManagementRouter = {
  path: "/goods",
  meta: {
    icon: "ep:box",
    title: "商品系统",
    rank: system
  },
  children: [
    {
      path: "/goods/attr/index",
      name: "GoodsAttr",
      meta: {
        icon: "ep:set-up",
        title: "平台属性",
        roles: ["admin"]
      }
    },
    {
      path: "/goods/category/index",
      name: "GoodsCategory",
      meta: {
        icon: "ri:node-tree",
        title: "分类管理",
        roles: ["admin"]
      }
    },
    {
      path: "/goods/goods/index",
      name: "GoodsGoods",
      meta: {
        icon: "ep:milk-tea",
        title: "商品管理",
        roles: ["admin"]
      }
    },
    {
      path: "/goods/add/index",
      name: "GoodsAdd",
      meta: {
        icon: "ri:restaurant-line",
        title: "发布商品",
        roles: ["admin"]
      }
    }
  ]
};

export default defineFakeRoute([
  {
    url: "/get-async-routes",
    method: "get",
    response: () => {
      return {
        success: true,
        data: [permissionRouter, systemManagementRouter, goodsManagementRouter]
      };
    }
  }
]);
