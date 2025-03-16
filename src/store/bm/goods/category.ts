import { defineStore } from "pinia";
import { pageSizes } from "@/enums/baseConstant";
import { message, returnMessage, storeMessage } from "@/utils/message";
import { storePagination } from "@/store/useStorePagination";
import {
  fetchGetCategoryPage,
  fetchQueryCategory,
  fetchChangeCategoryStatus,
  fetchDeleteCategory,
  fetchAddCategory,
  fetchUpdateCategory,
  fetchGetCategoryTree,
  fetchGetAttrListByCatId,
  fetchBatchUpdateCategory,
  fetchCategoryRelateAttr
} from "@/api/bm/goods/category";

/**
 * 分类信息 Store
 */
export const useCategoryStore = defineStore("CategoryStore", {
  state() {
    return {
      // 分类信息列表
      dataList: [],
      treeData: [],
      // 查询表单
      form: {
        // 分类名
        name: undefined,
        // 手机号
        phone: undefined,
        // 性别
        gender: undefined,
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
    /** 获取分类信息 */
    getCategoryPage: async function () {
      // 整理请求参数
      const data = { ...this.pagination, ...this.form };
      delete data.pageSizes;
      delete data.total;
      delete data.background;

      // 获取分类信息列表
      const result = await fetchGetCategoryPage(data);

      // 公共页面函数hook
      const pagination = storePagination.bind(this);
      return pagination(result);
    },
    /** 获取分类树 */
    async getCategoryTree() {
      const result = await fetchGetCategoryTree();
      if (result.code === 200) {
        this.treeData = result.result;
        return true;
      } else {
        message(result.msg, { type: "error", duration: 3666 });
        return false;
      }
    },

    /** 查询分类 */
    async queryUser(data: any) {
      const result = await fetchQueryCategory(data);
      if (result.code !== 200) return [];
      return result.result;
    },

    /** 添加分类信息 */
    async addCategory(data: any) {
      const result = await fetchAddCategory(data);
      return storeMessage(result);
    },
    /** 修改分类信息 */
    async updateCategory(data: any) {
      const result = await fetchUpdateCategory(data);
      return storeMessage(result);
    },

    /** 删除分类信息 */
    async deleteCategory(data: any) {
      const result = await fetchDeleteCategory(data);
      return storeMessage(result);
    },

    /** 修改分类状态 */
    async changeCategoryStatus(data: any) {
      const result = await fetchChangeCategoryStatus(data);
      return storeMessage(result);
    },
    /**获取分类列表 */
    async getAttrListByCatId(data: any) {
      const result = await fetchGetAttrListByCatId(data);
      return returnMessage(result);
    },
    /**批量更新分类 */
    async batchUpdateCategory(data: any) {
      const result = await fetchBatchUpdateCategory(data);
      return storeMessage(result);
    },
    /**分类关联属性 */
    async categoryRelateAttr(data: any) {
      const result = await fetchCategoryRelateAttr(data);
      return storeMessage(result);
    }
  }
});
