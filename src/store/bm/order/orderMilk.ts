import { defineStore } from "pinia";
import { pageSizes } from "@/enums/baseConstant";
import { message, storeMessage } from "@/utils/message";
import {
  fetchQueryOrderMilk,
  fetchGetOrderMilkPage,
  fetchAddOrderMilk,
  fetchUpdateOrderMilk,
  fetchDeleteOrderMilk,
  fetchChangeOrderMilkStatus
} from "@/api/bm/order/orderMilk";

/**
 * 订奶信息 Store
 */
export const useOrderMilkStore = defineStore("OrderMilkStore", {
  state() {
    return {
      // 订奶信息列表
      dataList: [],
      // 查询表单
      form: {
        // 分类ID
        catId: "",
        // 订奶名称
        name: "",
        // 订奶状态
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
    /** 获取订奶信息 */
    getOrderMilkPage: async function () {
      // 整理请求参数
      const data = { ...this.pagination, ...this.form };
      delete data.pageSizes;
      delete data.total;
      delete data.background;
      // 获取订奶信息列表
      const res = await fetchGetOrderMilkPage(data);
      if (res.code !== 200) {
        message(res.msg, { type: "error", duration: 3000 });
        return false;
      }
      res.result.items.map(item => {
        this.dataList.push({
          ...item,
          value: item.value.split(",")
        });
      });
      this.pagination.total = res.result.total;
      this.pagination.pageSize = res.result.pageSize;
      this.pagination.currentPage = res.result.currentPage;
      return true;
    },

    /** 查询订奶 */
    async querySupInfo(data: any) {
      const result = await fetchQueryOrderMilk(data);
      if (result.code !== 200) return [];
      return result.result;
    },

    /** 添加订奶信息 */
    async addOrderMilk(data: any) {
      const result = await fetchAddOrderMilk(data);
      return storeMessage(result);
    },
    /** 修改订奶信息 */
    async updateOrderMilk(data: any) {
      const result = await fetchUpdateOrderMilk(data);
      return storeMessage(result);
    },

    /** 删除订奶信息 */
    async deleteOrderMilk(data: any) {
      const result = await fetchDeleteOrderMilk(data);
      return storeMessage(result);
    },

    /** 修改订奶状态 */
    async changeOrderMilkStatus(data: any) {
      const result = await fetchChangeOrderMilkStatus(data);
      return storeMessage(result);
    }
  }
});
