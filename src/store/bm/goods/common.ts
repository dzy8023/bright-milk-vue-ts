import { defineStore } from "pinia";
import { returnMessage } from "@/utils/message";
import { fetchUploadFile } from "@/api/bm/goods/common";

/**
 * 属性信息 Store
 */
export const useCommonStore = defineStore("CommonStore", {
  state() {
    return {};
  },
  getters: {},
  actions: {
    /**上传文件 */
    async uploadFile(data: File[]) {
      const result = await fetchUploadFile(data);
      return returnMessage(result);
    }
  }
});
