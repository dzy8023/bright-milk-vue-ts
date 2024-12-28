// ReUpload.d.ts
import type { UploadUserFile } from "element-plus";

// 定义组件的 Props 类型
export interface ReUploadProps {
  modelValue: UploadUserFile[]; // 上传的文件列表
  action: string; // 上传请求的地址
  multiple: boolean; // 是否支持多文件上传
  limit: number; // 限制上传的文件数量
}

// 定义组件的 Emits 类型
export interface ReUploadEmits {
  "update:modelValue": (value: UploadUserFile[]) => void; // 更新文件列表
}

// 定义组件实例类型
export interface ReUploadInstance {
  reset: () => void; // 重置上传状态
  getFiles: () => UploadUserFile[]; // 获取当前文件列表
}

// Vue 组件类型声明
declare const ReUpload: {
  (
    props: ReUploadProps,
    context: {
      emit: (event: keyof ReUploadEmits, ...args: any[]) => void;
    }
  ): ReturnType<typeof import("vue").defineComponent>;
};

export default ReUpload;
