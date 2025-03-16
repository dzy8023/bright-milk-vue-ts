import { defineStore } from "pinia";
import { pageSizes } from "@/enums/baseConstant";
import { message, storeMessage } from "@/utils/message";
import {
  fetchQuerySkuInfo,
  fetchGetSkuInfoPage,
  fetchAddSkuInfo,
  fetchUpdateSkuInfo,
  fetchDeleteSkuInfo,
  fetchChangeSkuInfoStatus,
  fetchGetAttrListBySkuId
} from "@/api/bm/goods/sku";

/**
 * 商品信息 Store
 */
export const useSkuInfoStore = defineStore("SkuInfoStore", {
  state() {
    return {
      // 商品信息列表
      dataList: [],
      // 查询表单
      form: {
        // 分类ID
        catId: "",
        // 商品名称
        name: "",
        // 商品状态
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
    /** 获取商品信息 */
    getSkuInfoPage: async function () {
      // 整理请求参数
      const data = { ...this.pagination, ...this.form };
      delete data.pageSizes;
      delete data.total;
      delete data.background;
      // 获取商品信息列表
      const res = await fetchGetSkuInfoPage(data);
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

    /** 查询商品 */
    async querySupInfo(data: any) {
      const result = await fetchQuerySkuInfo(data);
      if (result.code !== 200) return [];
      return result.result;
    },

    /** 添加商品信息 */
    async addSkuInfo(data: any) {
      const result = await fetchAddSkuInfo(data);
      return storeMessage(result);
    },
    /** 修改商品信息 */
    async updateSkuInfo(data: any) {
      const result = await fetchUpdateSkuInfo(data);
      return storeMessage(result);
    },

    /** 删除商品信息 */
    async deleteSkuInfo(data: any) {
      const result = await fetchDeleteSkuInfo(data);
      return storeMessage(result);
    },

    /** 修改商品状态 */
    async changeSkuInfoStatus(data: any) {
      const result = await fetchChangeSkuInfoStatus(data);
      return storeMessage(result);
    },
    /** 获取属性列表 */
    async getAttrListBySkuId(skuId: string) {
      const result = await fetchGetAttrListBySkuId({ skuId });
      return storeMessage(result);
    }
  }
});
