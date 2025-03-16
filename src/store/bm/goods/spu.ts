import { defineStore } from "pinia";
import { pageSizes } from "@/enums/baseConstant";
import { message, returnMessage, storeMessage } from "@/utils/message";
import {
  fetchQuerySpuInfo,
  fetchGetSpuInfoPage,
  fetchAddSpuInfo,
  fetchUpdateSpuInfo,
  fetchDeleteSpuInfo,
  fetchChangeSpuInfoStatus,
  fetchGetAttrListBySpuId
} from "@/api/bm/goods/spu";

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
    getSpuInfoPage: async function () {
      // 整理请求参数
      const data = { ...this.pagination, ...this.form };
      delete data.pageSizes;
      delete data.total;
      delete data.background;
      // 获取商品信息列表
      const res = await fetchGetSpuInfoPage(data);
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
      const result = await fetchQuerySpuInfo(data);
      if (result.code !== 200) return [];
      return result.result;
    },

    /** 添加商品信息 */
    async addSpuInfo(data: any) {
      const result = await fetchAddSpuInfo(data);
      return storeMessage(result);
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
      const result = await fetchGetAttrListBySpuId({ spuId: spuId });
      return returnMessage(result);
    }
  }
});
