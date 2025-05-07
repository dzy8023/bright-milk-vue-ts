import { defineStore } from "pinia";
import { EventSourcePolyfill } from "event-source-polyfill";
import { formatToken, getToken } from "@/utils/auth";
import { message, storeMessage } from "@/utils/message";
import { fetchUnsubscribe } from "@/api/bm/sse";
import type { SseMessage, SseNotification, TabItem } from "@/types/sseMessage";
import { SseEntityType } from "@/enums/baseConstant";
import { fetchConsignOrder } from "@/api/bm/order/order";

/**
 * 会员信息 Store
 */
export const useSseStore = defineStore("SseStore", {
  state() {
    return {
      sseConnection: null, // SSE 连接
      noticesData: [
        {
          key: "0",
          name: "通知",
          type: SseEntityType.NOTIFICATION,
          list: [],
          emptyText: "暂无通知"
        },
        {
          key: "1",
          name: "消息",
          type: SseEntityType.MESSAGE,
          list: [
            {
              avatar: "https://xiaoxian521.github.io/hyperlink/svg/smile1.svg",
              title: "小铭 评论了你",
              summary: "诚在于心，信在于行，诚信在于心行合一。",
              createdTime: "今天",
              type: 1
            },
            {
              avatar: "https://xiaoxian521.github.io/hyperlink/svg/smile2.svg",
              title: "李白 回复了你",
              summary: "长风破浪会有时，直挂云帆济沧海。",
              createdTime: "昨天",
              type: 1
            },
            {
              avatar: "https://xiaoxian521.github.io/hyperlink/svg/smile5.svg",
              title: "标题",
              summary:
                "请将鼠标移动到此处，以便测试超长的消息在此处将如何处理。本例中设置的描述最大行数为2，超过2行的描述内容将被省略并且可以通过tooltip查看完整内容",
              createdTime: "时间",
              type: 1
            }
          ],
          emptyText: "暂无消息"
        },
        {
          key: "2",
          name: "待办",
          type: SseEntityType.TODO,
          list: [
            {
              id: "1",
              publisher: "小林",
              avatar: "",
              title: "第三方紧急代码变更",
              summary:
                "小林提交于 2024-05-10，需在 2024-05-11 前完成代码变更任务",
              createdTime: "",
              extra: "马上到期",
              status: 4,
              type: 2
            },
            {
              id: "2",
              publisher: "小铭",
              avatar: "",
              title: "版本发布",
              summary: "指派小铭于 2024-06-18 前完成更新并发布",
              createdTime: "",
              extra: "已耗时 8 天",
              status: 2,
              type: 2
            },
            {
              id: "3",
              publisher: "小林",
              avatar: "",
              title: "新功能开发",
              summary: "开发多租户管理",
              createdTime: "",
              extra: "进行中",
              status: 1,
              type: 2
            },
            {
              id: "4",
              publisher: "小林",
              avatar: "",
              title: "任务名称",
              summary: "任务需要在 2030-10-30 10:00 前启动",
              createdTime: "",
              extra: "未开始",
              status: 0,
              type: 2
            }
          ] as SseMessage[],
          emptyText: "暂无待办"
        }
      ] as TabItem[],
      // 加载
      loading: false
    };
  },
  getters: {},
  actions: {
    /** 初始化 SSE */
    async initSSE() {
      this.sseConnection = new EventSourcePolyfill("api/sse/subscribe", {
        headers: {
          token: formatToken(getToken().token)
        },
        heartbeatTimeout: 300000
      });
      this.sseConnection.onopen = () => {
        message("SSE 连接成功", { type: "success", duration: 3666 });
        console.log("SSE 连接成功");
      };
      this.sseConnection.onerror = event => {
        message("SSE 连接失败", { type: "error", duration: 3666 });
        console.log("SSE 连接失败", event);
        this.sseConnection.close();
        this.sseConnection = null;
      };
      this.sseConnection.onmessage = event => {
        try {
          const data = JSON.parse(event.data);
          switch (data.type) {
            case 0:
              data.content = JSON.parse(data.content);
              // 这里假设你已经在某个地方定义了 SseNotification 类型
              const notificationData = data as SseNotification;
              const index = this.noticesData[0].list.findIndex(
                item => item.id === notificationData.id
              );
              if (index !== -1) {
                this.noticesData[0].list[index] = notificationData;
              } else {
                this.noticesData[0].list.unshift(notificationData);
              }
              break;
            case 1:
              this.noticesData[1].list.unshift(data.data);
              break;
            default:
              break;
          }
          console.log("SSE 接收到数据", data);
        } catch (error) {
          console.log("SSE 解析数据失败", error);
        }
      };
    },
    async closeSSE() {
      if (this.sseConnection) {
        const res = await fetchUnsubscribe();
        const bool = storeMessage(res);
        if (bool) {
          this.sseConnection.close();
          this.sseConnection = null;
        }
        return bool;
      }
    },
    /**发货 */
    async handleConsign(data: SseNotification) {
      const index = this.noticesData[data.type].list.findIndex(
        item => item.id === data.id
      );
      if (index !== -1) {
        const res = await fetchConsignOrder([data.id]);
        if (storeMessage(res)) {
          this.noticesData[data.type].list[index].content.status = 3;
          console.log("发货成功", this.noticesData[data.type]);
        } else {
          message("发货失败", { type: "error", duration: 3666 });
        }
      }
    }
  }
});
