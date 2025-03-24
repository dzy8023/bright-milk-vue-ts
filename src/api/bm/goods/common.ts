import { apiHttp } from "@/utils/http";

export const fetchUploadFile = (data: File[]) => {
  const formData = new FormData();
  data.forEach(file => formData.append("files", file));
  return apiHttp.request<any>(
    "post",
    "common/upload",
    { data: formData },
    { headers: { "Content-Type": "multipart/form-data" } }
  );
};
