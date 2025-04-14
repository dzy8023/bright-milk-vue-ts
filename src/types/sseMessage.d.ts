export type SseEntity = {
  id: string;
  /**发送方id */
  publisher: string;
  /**事件标题 */
  title: string;
  /**事件封面 */
  avatar: string;
  /**事件简介 */
  summary: string;
  /**已读状态 */
  status: number;
  /**事件类型 */
  type: number;
  /**创建时间 */
  createdTime: string;
};
/**sse通知 */
export type SseNotification = SseEntity & {
  /**通知类型 */
  childType?: number;
  /**通知内容 */
  content?: any;
};
/**sse消息 */
export type SseMessage = SseEntity & {
  /**消息内容 */
  content: any;
  /**消息类型 */
  extra?: string;
};
export interface ListItem {
  avatar: string;
  title: string;
  datetime: string;
  type: string;
  description: string;
  status?: "primary" | "success" | "warning" | "info" | "danger";
  extra?: string;
}

export interface TabItem {
  key: string;
  name: string;
  list: SseMessage[] | SseNotification[];
  type: number;
  emptyText: string;
}
