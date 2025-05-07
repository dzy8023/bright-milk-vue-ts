import { defineStore } from "pinia";
import { returnMessage, storeMessage } from "@/utils/message";
import {
  fetchDisableTotp,
  fetchEnableTotp,
  fetchRefreshQrCode,
  fetchTestTotp,
  fetchTestTotpVerify,
  fetchUserTotpInfo
} from "@/api/bm/totp";

/**
 * 会员信息 Store
 */
export const useTotpStore = defineStore("TotpStore", {
  state() {
    return {
      secret: "",
      qrUrl: "",
      // 加载
      loading: false
    };
  },
  getters: {},
  actions: {
    async testTotp() {
      const result = await fetchTestTotp();
      if (result.code === 200) {
        this.secret = result.result.secret;
        this.qrUrl = result.result.qrUrl;
      }
      return storeMessage(result);
    },
    async testVerify(code: string) {
      const result = await fetchTestTotpVerify(code, this.secret);
      return returnMessage(result);
    },
    async getUserTotpInfo() {
      const res = await fetchUserTotpInfo();
      return returnMessage(res);
    },
    async refreshQrCode() {
      const res = await fetchRefreshQrCode();
      return returnMessage(res);
    },
    async enableTotp(code: string) {
      return await fetchEnableTotp(code);
    },
    async disableTotp() {
      return storeMessage(await fetchDisableTotp());
    }
  }
});
