import { defineStore } from "pinia";
import { pageSizes } from "@/enums/baseConstant";
import { returnMessage, storeMessage } from "@/utils/message";
import {
  fetchQuerySpuInfo,
  fetchGetSpuInfoPage,
  fetchCreateSpuInfo,
  fetchUpdateSpuInfo,
  fetchDeleteSpuInfo,
  fetchChangeSpuInfoStatus,
  fetchGetAttrListBySpuId,
  fetchGetSpuInfoMainImage,
  fetchGetAttrWithOptionsList,
  fetchUpdateSpuInfoImage,
  fetchUpdateSpuInfoAttr
} from "@/api/bm/goods/spu";
import { storePagination } from "@/store/useStorePagination";

/**
 * 商品信息 Store
 */
export const useSpuInfoStore = defineStore("SpuInfoStore", {
  state() {
    return {
      // 商品信息列表
      dataList: [],
      // 查询表单
      form: {
        // 分类ID
        catIds: [],
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
    getSpuInfoPage: async function () {
      // 整理请求参数
      const data = { ...this.pagination, ...this.form };
      delete data.pageSizes;
      delete data.total;
      delete data.background;
      // 获取商品信息列表
      const res = await fetchGetSpuInfoPage(data);
      // 公共页面函数hook
      const pagination = storePagination.bind(this);
      return pagination(res);
    },

    /** 查询商品 */
    async querySupInfo(data: any) {
      const result = await fetchQuerySpuInfo(data);
      if (result.code !== 200) return [];
      return result.result;
    },

    /** 发布商品信息 */
    async createSpuInfo(data: any) {
      const result = await fetchCreateSpuInfo(data);
      return returnMessage(result);
    },
    /** 修改商品信息 */
    async updateSpuInfo(data: any) {
      const result = await fetchUpdateSpuInfo(data);
      return storeMessage(result);
    },

    /** 删除商品信息 */
    async deleteSpuInfo(data: any) {
      const result = await fetchDeleteSpuInfo(data);
      return storeMessage(result);
    },

    /** 修改商品状态 */
    async changeSpuInfoStatus(data: any) {
      const result = await fetchChangeSpuInfoStatus(data);
      return storeMessage(result);
    },
    /** 商品管理--- 根据spuInfoId获取规格列表 */
    async getAttrListBySpuId(spuId: string) {
      const result = await fetchGetAttrListBySpuId(spuId);
      return returnMessage(result);
    },
    /**根据spuId与catId获取规格及选项列表 */
    async getAttrWithOptionsList(data: { spuId: string; catId: number }) {
      const result = await fetchGetAttrWithOptionsList(data);
      return returnMessage(result);
    },
    /**根据spuId获取图集 */
    async getSpuInfoMainImage(spuId: string) {
      const result = await fetchGetSpuInfoMainImage(spuId);
      return returnMessage(result);
    },
    /**修改spu图片 */
    async updateSpuInfoImage(data: {
      deleted: any[];
      new: File[];
      spuId: string;
    }) {
      const result = await fetchUpdateSpuInfoImage(data);
      return returnMessage(result);
    },
    /**修改spuAttrs */
    async updateSpuInfoAttr(data: {
      spuId: string;
      deleted: any[];
      added: any[];
      updated: any[];
    }) {
      const result = await fetchUpdateSpuInfoAttr(data);
      return storeMessage(result);
    }
  }
});
