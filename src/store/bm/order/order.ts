import { defineStore } from "pinia";
import { pageSizes } from "@/enums/baseConstant";
import { storeMessage } from "@/utils/message";
import {
  fetchQueryOrder,
  fetchGetOrderPage,
  fetchAddOrder,
  fetchUpdateOrder,
  fetchDeleteOrder,
  fetchChangeOrderStatus
} from "@/api/bm/order/order";
import { storePagination } from "@/store/useStorePagination";

/**
 * 订单信息 Store
 */
export const useOrderStore = defineStore("OrderStore", {
  state() {
    return {
      // 订单信息列表
      dataList: [],
      // 查询表单
      form: {
        // 分类ID
        catId: "",
        // 订单名称
        name: "",
        // 订单状态
        status: ""
      },
      // 分页查询结果
      pagination: {
        currentPage: 1,
        pageSize: 15,
        total: 1,
        pageSizes
      },
      // 加载
      loading: false
    };
  },
  getters: {},
  actions: {
    /** 获取订单信息 */
    getOrderPage: async function () {
      // 整理请求参数
      const data = { ...this.pagination, ...this.form };
      delete data.pageSizes;
      delete data.total;
      delete data.background;
      // 获取订单信息列表
      const res = await fetchGetOrderPage(data);
      // 公共页面函数hook
      const pagination = storePagination.bind(this);
      return pagination(res);
    },

    /** 查询订单 */
    async querySupInfo(data: any) {
      const result = await fetchQueryOrder(data);
      if (result.code !== 200) return [];
      return result.result;
    },

    /** 添加订单信息 */
    async addOrder(data: any) {
      const result = await fetchAddOrder(data);
      return storeMessage(result);
    },
    /** 修改订单信息 */
    async updateOrder(data: any) {
      const result = await fetchUpdateOrder(data);
      return storeMessage(result);
    },

    /** 删除订单信息 */
    async deleteOrder(data: any) {
      const result = await fetchDeleteOrder(data);
      return storeMessage(result);
    },

    /** 修改订单状态 */
    async changeOrderStatus(data: any) {
      const result = await fetchChangeOrderStatus(data);
      return storeMessage(result);
    }
  }
});
