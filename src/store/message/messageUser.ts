import { defineStore } from "pinia";
import {
  fetchDeleteUserMessageByIds,
  fetchGetMessageDetailById,
  fetchGetUserMessageList,
  fetchUpdateUserMarkAsRead
} from "@/api/message/messageUser";
import { pageSizes } from "@/enums/baseConstant";
import { storePagination } from "@/store/useStorePagination";
import { storeMessage } from "@/utils/message";
import { decode } from "js-base64";

/**
 * 系统消息 Store
 */
export const useMessageUserStore = defineStore("messageUserStore", {
  state() {
    return {
      // 系统消息列表
      datalist: [],
      // 消息详情
      messageDetail: {},
      // 查询表单
      form: {
        // 消息标题
        title: undefined,
        // 0:未读 1:已读
        status: "",
        // 消息类型
        messageType: undefined
      },
      // 分页查询结果
      pagination: {
        currentPage: 1,
        pageSize: 150,
        total: 100,
        pageSizes
      },
      // 加载
      loading: false
    };
  },
  getters: {},
  actions: {
    /** 获取系统消息 */
    async getMessageList() {
      // 整理请求参数
      const data = { ...this.pagination, ...this.form };
      delete data.pageSizes;
      delete data.total;
      delete data.background;

      // 获取系统消息列表
      const result = await fetchGetUserMessageList(data);

      // 公共页面函数hook
      const pagination = storePagination.bind(this);
      return pagination(result);
    },

    /** 根据消息id获取消息详情 */
    async getMessageDetailById(id: string) {
      const result = await fetchGetMessageDetailById({ id });

      if (result.code === 200) {
        this.messageDetail = result.result;

        // 解码消息内容
        this.messageDetail.content = decode(this.messageDetail?.content);
      }
    },

    /** 用户将消息标为已读 */
    async updateUserMarkAsRead(data: any) {
      const result = await fetchUpdateUserMarkAsRead(data);
      return storeMessage(result);
    },

    /** 用户删除系统消息 */
    async deleteUserMessageByIds(data: any) {
      const result = await fetchDeleteUserMessageByIds(data);
      return storeMessage(result);
    }
  }
});
