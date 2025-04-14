import { defineStore } from "pinia";
import { returnMessage, storeMessage } from "@/utils/message";
import {
  fetchRevenueData,
  fetchOrderData,
  fetchSaleData,
  fetchMemberData,
  fetchExportData,
  fetchDownloadData,
  fetchSpuSaleData
} from "@/api/bm/data-show/statistics";
import type { PureHttpResponse } from "@/utils/http/types";

/**
 * 属性信息 Store
 */
export const useStatisticsStore = defineStore("StatisticsStore", {
  state() {
    return {
      revenueData: [],
      orderData: [],
      saleData: [],
      memberData: {},
      // 加载
      loading: false
    };
  },
  getters: {},
  actions: {
    async getRevenueData(data: { start: string; end: string }) {
      const res = await fetchRevenueData(data);
      this.revenueData = returnMessage(res, []);
    },
    async getMemberData(data: { start: string; end: string }) {
      const res = await fetchMemberData(data);
      this.memberData = returnMessage(res, {});
    },
    async getOrderData(data: { start: string; end: string }) {
      const res = await fetchOrderData(data);
      this.orderData = returnMessage(res, []);
    },
    async getSaleData(data: { start: string; end: string }) {
      const res = await fetchSaleData(data);
      this.saleData = returnMessage(res, []);
    },
    async getSpuSaleData(id: string, data: { start: string; end: string }) {
      const res = await fetchSpuSaleData(id, data);
      return returnMessage(res, null);
    },
    async downloadData(
      data: { types: number[]; start: string; end: string },
      callback: (response: PureHttpResponse) => void
    ) {
      return fetchDownloadData(data, callback);
    },
    async exportData(data: { types: number[]; start: string; end: string }) {
      const res = await fetchExportData(data);
      return storeMessage(res);
    }
  }
});
