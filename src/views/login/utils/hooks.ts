import { ElMessage, type FormInstance } from "element-plus";
import { h, ref } from "vue";
import { getTopMenu, initRouter } from "@/router/utils";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/system/user";
import { message } from "@/utils/message";
import { addDialog, closeDialog } from "@/components/ReDialog";
import { deviceDetection } from "@pureadmin/utils";
import totpDialog from "../components/totp-dialog.vue";

export const currentPage = ref("default");
export function useLogin() {
  const loading = ref(false);
  // 0普通登录，1邮箱登录，其中0为普通登录
  const router = useRouter();
  const userStore = useUserStore();
  const formRef = ref();

  /** 返回到默认登录页面 */
  const onBack = () => {
    currentPage.value = "default";
  };
  /**双因素认证弹窗 */
  const onTotpDialog = (token?: string) => {
    addDialog({
      title: `双因素认证`,
      width: "45%",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      open: () => {
        formRef.value?.focusFirstInput();
      },
      contentRenderer: ({ options, index }) =>
        h(totpDialog, {
          ref: formRef,
          closeDialog: () => closeDialog(options, index, { command: "sure" }),
          onVerify: async (code: any) => {
            formRef.value.loading = true;
            console.log(code);
            if (token) {
              const res = await userStore.loginOtpVerify({ token, code });
              if (res) {
                await complete();
              }
            }
            formRef.value.loading = false;
            closeDialog(options, index, { command: "sure" });
          }
        })
    });
  };
  const complete = async () => {
    // 获取后端路由
    await initRouter();
    router.push(getTopMenu(true).path).then(() => {
      ElMessage.closeAll();
      message("登录成功", { type: "success" });
    });
  };
  /**
   * 登录
   * @param formEl
   */
  const onLogin = async (formEl: FormInstance | undefined, ruleForm: any) => {
    if (!formEl) return;
    // 开始登录
    await formEl.validate(async valid => {
      if (valid) {
        loading.value = true;
        const result = await userStore.loginByUsername(ruleForm);
        switch (result.code) {
          case 200:
            // 登录成功
            await complete();
            break;
          case 207:
            // 双因素认证
            onTotpDialog(result.result.token);
            break;
          case 403 | 401 | 208:
            // 登录失败
            message(result.msg, { type: "error" });
            break;
        }
        loading.value = false;
      }
    });
  };
  const handleEmailLogin = () => {
    currentPage.value = "email";
  };
  return {
    loading,
    onBack,
    onTotpDialog,
    onLogin,
    handleEmailLogin
  };
}
