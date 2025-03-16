import { defineStore } from "pinia";
import { pageSizes } from "@/enums/baseConstant";
import { message, storeMessage } from "@/utils/message";
import {
  fetchQueryGetMilk,
  fetchGetGetMilkPage,
  fetchAddGetMilk,
  fetchUpdateGetMilk,
  fetchDeleteGetMilk,
  fetchChangeGetMilkStatus
} from "@/api/bm/order/getMilk";

/**
 * 取奶信息 Store
 */
export const useGetMilkStore = defineStore("GetMilkStore", {
  state() {
    return {
      // 取奶信息列表
      dataList: [],
      // 查询表单
      form: {
        // 分类ID
        catId: "",
        // 取奶名称
        name: "",
        // 取奶状态
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
    /** 获取取奶信息 */
    getGetMilkPage: async function () {
      // 整理请求参数
      const data = { ...this.pagination, ...this.form };
      delete data.pageSizes;
      delete data.total;
      delete data.background;
      // 获取取奶信息列表
      const res = await fetchGetGetMilkPage(data);
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

    /** 查询取奶 */
    async querySupInfo(data: any) {
      const result = await fetchQueryGetMilk(data);
      if (result.code !== 200) return [];
      return result.result;
    },

    /** 添加取奶信息 */
    async addGetMilk(data: any) {
      const result = await fetchAddGetMilk(data);
      return storeMessage(result);
    },
    /** 修改取奶信息 */
    async updateGetMilk(data: any) {
      const result = await fetchUpdateGetMilk(data);
      return storeMessage(result);
    },

    /** 删除取奶信息 */
    async deleteGetMilk(data: any) {
      const result = await fetchDeleteGetMilk(data);
      return storeMessage(result);
    },

    /** 修改取奶状态 */
    async changeGetMilkStatus(data: any) {
      const result = await fetchChangeGetMilkStatus(data);
      return storeMessage(result);
    }
  }
});
