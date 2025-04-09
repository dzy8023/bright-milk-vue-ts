import { defineStore } from "pinia";
import { pageSizes } from "@/enums/baseConstant";
import { returnMessage, storeMessage } from "@/utils/message";
import {
  fetchGetOrderPage,
  fetchDeleteOrder,
  fetchQueryOrderDetail,
  fetchCancelOrder,
  fetchConsignOrder,
  fetchRemindOrder,
  fetchRefundOrder
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
        // 用户ID
        memberId: "",
        // 用户名称
        username: "",
        //电话号码
        phone: "",
        // 订单号
        orderSn: "",

        // 订单状态
        status: "",
        // 订单来源
        sourceType: "",
        // 配送类型
        postType: ""
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

    /** 获取订单详情 */
    async queryOrderDetail(data: any) {
      const result = await fetchQueryOrderDetail(data);
      return returnMessage(result, null);
    },
    /**催单 */
    async remindOrder(data: string[]) {
      const result = await fetchRemindOrder(data);
      return storeMessage(result);
    },
    /**发货 */
    async consignOrder(data: string[]) {
      const result = await fetchConsignOrder(data);
      return storeMessage(result);
    },
    /**取消订单 */
    async cancelOrder(data: string[]) {
      const result = await fetchCancelOrder(data);
      return storeMessage(result);
    },
    /**退款 */
    async refundOrder(data: any) {
      const result = await fetchRefundOrder(data);
      return storeMessage(result);
    },
    /** 删除订单信息 */
    async deleteOrder(data: string[]) {
      const result = await fetchDeleteOrder(data);
      return storeMessage(result);
    }
  }
});
