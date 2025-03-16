import { apiHttp } from "@/utils/http";

export const fetchUploadFile = (data: File) => {
  const formData = new FormData();
  formData.append("file", data);
  return apiHttp.request<any>(
    "post",
    "common/upload",
    { data: formData },
    { headers: { "Content-Type": "multipart/form-data" } }
  );
};
