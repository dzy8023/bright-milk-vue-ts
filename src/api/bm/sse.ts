import { apiHttp } from "@/utils/http";

export const fetchUnsubscribe = () => {
  return apiHttp.request<any>("put", "sse/unsubscribe");
};
