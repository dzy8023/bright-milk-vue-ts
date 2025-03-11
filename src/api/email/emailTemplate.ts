import type { PageResult } from "@/types/result";
import { apiHttp } from "@/utils/http";

/** 邮件模板表---获取邮件模板表列表 */
export const fetchGetEmailTemplateList = (data: any) => {
  return apiHttp.request<PageResult<any>>(
    "get",
    `emailTemplate/getEmailTemplateList/${data.currentPage}/${data.pageSize}`,
    { params: data }
  );
};

/** 邮件模板表---获取模板类型字段 */
export const fetchGetEmailTypes = () => {
  return apiHttp.request<any>("get", "emailTemplate/getEmailTypes");
};

/** 邮件模板表---添加邮件模板表 */
export const fetchAddEmailTemplate = (data: any) => {
  return apiHttp.request<object>("post", "emailTemplate/addEmailTemplate", {
    data
  });
};

/** 邮件模板表---更新邮件模板表 */
export const fetchUpdateEmailTemplate = (data: any) => {
  return apiHttp.request<object>("put", "emailTemplate/updateEmailTemplate", {
    data
  });
};

/** 邮件模板表---删除邮件模板表 */
export const fetchDeleteEmailTemplate = (data: any) => {
  return apiHttp.request<object>(
    "delete",
    "emailTemplate/deleteEmailTemplate",
    { data }
  );
};
