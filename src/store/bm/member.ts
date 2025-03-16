import { defineStore } from "pinia";
import { pageSizes } from "@/enums/baseConstant";
import { storeMessage } from "@/utils/message";
import { storePagination } from "@/store/useStorePagination";
import {
  fetchGetMemberPage,
  fetchQueryMember,
  fetchChangeMemberStatus,
  fetchDeleteMember,
  fetchAddMember,
  fetchUpdateMember,
  fetchResetPassword
} from "@/api/bm/member";

/**
 * 会员信息 Store
 */
export const useMemberStore = defineStore("MemberStore", {
  state() {
    return {
      // 会员信息列表
      datalist: [],
      // 查询表单
      form: {
        // 会员名
        name: undefined,
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
        pageSize: 10,
        total: 1,
        pageSizes
      },
      // 加载
      loading: false
    };
  },
  getters: {},
  actions: {
    /** 获取会员信息 */
    getMemberPage: async function () {
      // 整理请求参数
      const data = { ...this.pagination, ...this.form };
      delete data.pageSizes;
      delete data.total;
      delete data.background;

      // 获取会员信息列表
      const result = await fetchGetMemberPage(data);

      // 公共页面函数hook
      const pagination = storePagination.bind(this);
      return pagination(result);
    },

    /** 查询会员 */
    async queryUser(data: any) {
      const result = await fetchQueryMember(data);
      if (result.code !== 200) return [];
      return result.result;
    },

    /** 添加会员信息 */
    async addMember(data: any) {
      const result = await fetchAddMember(data);
      return storeMessage(result);
    },
    /** 修改会员信息 */
    async updateMember(data: any) {
      const result = await fetchUpdateMember(data);
      return storeMessage(result);
    },

    /** 删除会员信息 */
    async deleteMember(data: any) {
      const result = await fetchDeleteMember(data);
      return storeMessage(result);
    },

    /** 修改会员状态 */
    async changeMemberStatus(data: any) {
      const result = await fetchChangeMemberStatus(data);
      return storeMessage(result);
    },
    /** 重置密码 */
    async resetPassword(data: any) {
      const result = await fetchResetPassword(data);
      return storeMessage(result);
    }
  }
});
