import { defineStore } from "pinia";
import { pageSizes } from "@/enums/baseConstant";
import { message, returnMessage, storeMessage } from "@/utils/message";
import {
  fetchGetAttrPage,
  fetchQueryAttr,
  fetchChangeAttrStatus,
  fetchDeleteAttr,
  fetchAddAttr,
  fetchUpdateAttr,
  fetchCatIdsByAttrId,
  fetchGetAttrList,
  fetchAttrNotRelateList,
  fetchGetAttrListByCatId
} from "@/api/bm/goods/attr";

/**
 * 属性信息 Store
 */
export const useAttrStore = defineStore("AttrStore", {
  state() {
    return {
      // 属性信息列表
      dataList: [],
      // 属性列表数据
      attrList: [],
      // 查询表单
      form: {
        // 属性名
        name: undefined,
        // 类型
        type: undefined
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
    /** 获取属性信息 */
    getAttrPage: async function () {
      // 整理请求参数
      const data = { ...this.pagination, ...this.form };
      delete data.pageSizes;
      delete data.total;
      delete data.background;
      // 获取属性信息列表
      const res = await fetchGetAttrPage(data);
      if (res.code !== 200) {
        message(res.msg, { type: "error", duration: 3000 });
        return false;
      }
      this.dataList = res.result.items.map(item => ({
        ...item,
        value: item.value.split(";")
      }));
      this.pagination.total = res.result.total;
      this.pagination.pageSize = res.result.pageSize;
      this.pagination.currentPage = res.result.currentPage;
      return true;
    },

    /** 查询属性 */
    async queryUser(data: any) {
      const result = await fetchQueryAttr(data);
      if (result.code !== 200) return [];
      return result.result;
    },

    /** 添加属性信息 */
    async addAttr(data: any) {
      const result = await fetchAddAttr(data);
      return storeMessage(result);
    },
    /** 修改属性信息 */
    async updateAttr(data: any) {
      const result = await fetchUpdateAttr(data);
      return storeMessage(result);
    },

    /** 删除属性信息 */
    async deleteAttr(data: any) {
      const result = await fetchDeleteAttr(data);
      return storeMessage(result);
    },

    /** 修改属性状态 */
    async changeAttrStatus(data: any) {
      const result = await fetchChangeAttrStatus(data);
      return storeMessage(result);
    },
    async getCatIdsByAttrId(id: number) {
      const result = await fetchCatIdsByAttrId(id);
      return result;
    },
    /**获取属性列表 */
    async getAttrList(data?: any) {
      const result = await fetchGetAttrList(data);
      this.attrList = returnMessage(result).map(item => ({
        ...item,
        choose: 0,
        attrId: item.id
      }));
    },
    /**获取分类关联属性列表 */
    async getAttrListByCatId(data: any) {
      const result = await fetchGetAttrListByCatId(data);
      return returnMessage(result);
    },
    /**  获取未关联的属性列表 */
    async getAttrNotRelateList(data: any) {
      const result = await fetchAttrNotRelateList(data);
      this.attrList = returnMessage(result).map(item => ({
        ...item,
        choose: 0,
        attrId: item.id
      }));
    }
  }
});
