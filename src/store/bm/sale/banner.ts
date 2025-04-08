import { defineStore } from "pinia";
import { pageSizes } from "@/enums/baseConstant";
import { returnMessage, storeMessage } from "@/utils/message";
import {
  fetchAddBanner,
  fetchDeleteBanner,
  fetchGetBannerList,
  fetchGetBannerPage,
  fetchUpdateBanner
} from "@/api/bm/sale/banner";
import { storePagination } from "@/store/useStorePagination";

/**
 * 轮播图信息 Store
 */
export const useBannerStore = defineStore("BannerStore", {
  state() {
    return {
      // 轮播图信息列表
      dataList: [],
      //所有轮播图
      list: [],
      // 查询表单
      form: {
        // 轮播图名
        name: undefined,
        //跳转类型
        type: undefined,
        // 轮播图分组id
        groupId: undefined
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
    /** 获取轮播图分组信息 */
    getBannerPage: async function () {
      // 整理请求参数
      const data = { ...this.pagination, ...this.form };
      delete data.pageSizes;
      delete data.total;
      delete data.background;

      // 获取轮播图分组信息列表
      const result = await fetchGetBannerPage(data);

      // 公共页面函数hook
      const pagination = storePagination.bind(this);
      return pagination(result);
    },
    /**获取轮播图列表 */
    async getBannerList() {
      const res = await fetchGetBannerList();
      this.list = returnMessage(res);
      return this.list;
    },

    /** 添加轮播图信息 */
    async addBanner(data: { banner: any; image: File }) {
      const result = await fetchAddBanner(data);
      return storeMessage(result);
    },
    /** 修改轮播图信息 */
    async updateBanner(data: { banner: any; image?: File }) {
      const result = await fetchUpdateBanner(data);
      return storeMessage(result);
    },

    /** 删除轮播图信息 */
    async deleteBanner(data: any) {
      const result = await fetchDeleteBanner(data);
      return storeMessage(result);
    }
  }
});
