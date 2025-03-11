import { useUserStore } from "@/store/system/user";
import { reactive, ref } from "vue";
import { createFormData } from "@pureadmin/utils";
import { fetchUploadFile } from "@/api/system/system";
import { message } from "@/utils/message";

// 剪裁完成后头像数据
export const cropperBlob = ref();
// 上传地址路径
export const uploadAvatarSrc = ref();

// 剪裁头像是否显示
export const isShow = ref(false);
const userStore = useUserStore();

// 用户信息内容
export const userInfos = reactive({
  avatar: "",
  username: "",
  nickname: "",
  email: "",
  phone: "",
  summary: "",
  password: "",
  sex: ""
});

/** 获取用户信息内容 */
export const onSearchByUserinfo = async () => {
  const data = await userStore.getUserinfo();
  userInfos.summary = data.personDescription;
  userInfos.avatar = data.avatar;
  userInfos.username = data.username;
  userInfos.nickname = data.nickname;
  userInfos.email = data.email;
  userInfos.phone = data.phone;
  userInfos.nickname = data.nickname;
  userInfos.password = data.password;
  userInfos.sex = data.sex;
};

/** 修改头像 */
export const handleSubmitImage = async () => {
  // 上传头像表单
  const formData = createFormData({
    files: new File([cropperBlob.value], "avatar"),
    type: "avatar"
  });

  // 上传头像
  const result = await fetchUploadFile(formData);

  // 上传成功后关闭弹窗
  if (result.code === 200) {
    uploadAvatarSrc.value = result.result.filepath;
    userInfos.avatar = result.result.url;
    message("上传成功", { type: "success" });
    isShow.value = false;
  }
};
