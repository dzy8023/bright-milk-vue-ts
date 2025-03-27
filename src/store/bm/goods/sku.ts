import { defineStore } from "pinia";
import { pageSizes } from "@/enums/baseConstant";
import { returnMessage, storeMessage } from "@/utils/message";
import {
  fetchQuerySkuInfo,
  fetchGetSkuInfoPage,
  fetchCreateSkuInfoBatch,
  fetchUpdateSkuInfo,
  fetchDeleteSkuInfo,
  fetchChangeSkuInfoStatus,
  fetchGetAttrListBySkuId,
  fetchGetSkuAttrWithOptionsListBySpuId,
  fetchCreateSkuInfo
} from "@/api/bm/goods/sku";
import { storePagination } from "@/store/useStorePagination";

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
        // spuID
        spuId: "",
        // 商品名称
        name: "",
        // 商品状态
        status: "",
        sortBy: "",
        isAsc: false
      },
      // 分页查询结果
      pagination: {
        currentPage: 1,
        pageSize: 20,
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
      // 公共页面函数hook
      const pagination = storePagination.bind(this);
      return pagination(res);
    },

    /** 查询商品 */
    async querySupInfo(data: any) {
      const result = await fetchQuerySkuInfo(data);
      if (result.code !== 200) return [];
      return result.result;
    },
    /** 添加商品信息 */
    async createSkuInfo(data: { skuInfo: any; image: File }) {
      const result = await fetchCreateSkuInfo(data);
      return storeMessage(result);
    },
    /** 添加批量添加skuInfo */
    async createSkuInfoBatch(data: any) {
      const result = await fetchCreateSkuInfoBatch(data);
      return storeMessage(result);
    },
    /** 修改商品信息 */
    async updateSkuInfo(data: { skuInfo: any; image?: File }) {
      const result = await fetchUpdateSkuInfo(data);
      return storeMessage(result);
    },

    /** 删除商品信息 */
    async deleteSkuInfo(data: string[]) {
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
      const result = await fetchGetAttrListBySkuId(skuId);
      return returnMessage(result);
    },
    /**获取skuAttrs列表 */
    async getSkuAttrWithOptionsListBySpuId(data: {
      spuId?: string;
      skuId?: string;
    }) {
      const result = await fetchGetSkuAttrWithOptionsListBySpuId(data);
      return returnMessage(result);
    }
  }
});
