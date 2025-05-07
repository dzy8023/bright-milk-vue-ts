import { apiHttp } from "@/utils/http";

/** TOTP测试 */
export const fetchTestTotp = () => {
  return apiHttp.request<any>("get", `2fa/test`);
};
export const fetchTestTotpVerify = (code: string, secret: string) => {
  return apiHttp.request<any>("get", `2fa/test/verify/${code}`, {
    params: {
      secret
    }
  });
};

/** 获取用户totp信息 */
export const fetchUserTotpInfo = () => {
  return apiHttp.request<object>("get", "2fa/info");
};

/** 刷新二维码*/
export const fetchRefreshQrCode = () => {
  return apiHttp.request<any>("get", "2fa/refresh");
};

/** 开启双因素认证*/
export const fetchEnableTotp = (data: any) => {
  return apiHttp.request<any>("put", `2fa/enable/${data}`);
};

/** 关闭双因素认证*/
export const fetchDisableTotp = () => {
  return apiHttp.request<any>("put", `2fa/disable`);
};
