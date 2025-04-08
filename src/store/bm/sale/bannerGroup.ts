import { defineStore } from "pinia";
import { pageSizes } from "@/enums/baseConstant";
import { storeMessage } from "@/utils/message";
import {
  fetchAddBannerGroup,
  fetchChangeBannerGroupStatus,
  fetchDeleteBannerGroup,
  fetchGetBannerGroupPage,
  fetchUpdateBannerGroup
} from "@/api/bm/sale/bannerGroup";
import { storePagination } from "@/store/useStorePagination";

/**
 * 轮播图组信息 Store
 */
export const useBannerGroupStore = defineStore("BannerGroupStore", {
  state() {
    return {
      // 轮播图组信息列表
      dataList: [],
      // 查询表单
      form: {
        // 轮播图组名
        name: undefined,
        //分类id
        catId: undefined,
        // 状态
        status: undefined
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
    /** 获取轮播图组分组信息 */
    getBannerGroupPage: async function () {
      // 整理请求参数
      const data = { ...this.pagination, ...this.form };
      delete data.pageSizes;
      delete data.total;
      delete data.background;

      // 获取轮播图组分组信息列表
      const result = await fetchGetBannerGroupPage(data);

      // 公共页面函数hook
      const pagination = storePagination.bind(this);
      return pagination(result);
    },

    /** 添加轮播图组信息 */
    async addBannerGroup(data: any) {
      const result = await fetchAddBannerGroup(data);
      return storeMessage(result);
    },
    /** 修改轮播图组信息 */
    async updateBannerGroup(data: any) {
      const result = await fetchUpdateBannerGroup(data);
      return storeMessage(result);
    },

    /** 删除轮播图组信息 */
    async deleteBannerGroup(data: any) {
      const result = await fetchDeleteBannerGroup(data);
      return storeMessage(result);
    },
    /**更改状态 */
    async changeBannerGroupStatus(data: string) {
      const result = await fetchChangeBannerGroupStatus(data);
      return storeMessage(result);
    }
  }
});
