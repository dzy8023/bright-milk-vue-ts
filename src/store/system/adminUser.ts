import { defineStore } from "pinia";
import { pageSizes } from "@/enums/baseConstant";
import { storeMessage } from "@/utils/message";
import { storePagination } from "@/store/useStorePagination";
import {
  fetchAddAdminUser,
  fetchDeleteAdminUser,
  fetchForcedOffline,
  fetchGetAdminUserList,
  fetchQueryUser,
  fetchUpdateAdminUser,
  fetchUpdateAdminUserByLocalUser,
  fetchUpdateUserPasswordByAdmin,
  fetchUpdateUserPasswordByLocalUser,
  fetchUpdateUserStatusByAdmin
} from "@/api/system/adminUser";

/**
 * 用户信息 Store
 */
export const useAdminUserStore = defineStore("adminUserStore", {
  state() {
    return {
      // 用户信息列表
      dataList: [],
      // 查询表单
      form: {
        // 用户名
        username: undefined,
        // 昵称
        nickname: undefined,
        // 邮箱
        email: undefined,
        // 手机号
        phone: undefined,
        // 性别
        gender: undefined,
        // 状态
        status: undefined
      },
      // 分页查询结果
      pagination: {
        currentPage: 1,
        pageSize: 150,
        total: 1,
        pageSizes
      },
      // 加载
      loading: false
    };
  },
  getters: {},
  actions: {
    /** 获取用户信息 */
    getAdminUserList: async function () {
      // 整理请求参数
      const data = { ...this.pagination, ...this.form };
      delete data.pageSizes;
      delete data.total;
      delete data.background;

      // 获取用户信息列表
      const result = await fetchGetAdminUserList(data);

      // 公共页面函数hook
      const pagination = storePagination.bind(this);
      return pagination(result);
    },

    /** 查询用户 */
    async queryUser(data: any) {
      const result = await fetchQueryUser(data);
      if (result.code !== 200) return [];
      return result.result;
    },

    /** 添加用户信息 */
    async addAdminUser(data: any) {
      const result = await fetchAddAdminUser(data);
      return storeMessage(result);
    },

    /** 修改本地用户信息 */
    async updateAdminUserByLocalUser(data: any) {
      const result = await fetchUpdateAdminUserByLocalUser(data);
      return storeMessage(result);
    },

    /** 修改用户信息 */
    async updateAdminUser(data: any) {
      const result = await fetchUpdateAdminUser(data);
      return storeMessage(result);
    },

    /** 删除用户信息 */
    async deleteAdminUser(data: any) {
      const result = await fetchDeleteAdminUser(data);
      return storeMessage(result);
    },

    /** 更新本地用户密码 */
    async updateUserPasswordByLocalUser(data: any) {
      const result: any = await fetchUpdateUserPasswordByLocalUser(data);
      return storeMessage(result);
    },

    /** 更新用户密码 */
    async updateAdminUserPasswordByManager(data: any) {
      const result: any = await fetchUpdateUserPasswordByAdmin(data);
      return storeMessage(result);
    },

    /** 修改用户状态 */
    async updateUserStatusByAdmin(data: any) {
      const result = await fetchUpdateUserStatusByAdmin(data);
      return storeMessage(result);
    },

    /** 强制用户下线 */
    async forcedOffline(data: any) {
      const result = await fetchForcedOffline(data);
      return storeMessage(result);
    }
  }
});
