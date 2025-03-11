// 添加或者修改表单元素
export interface FormItemProps {
  // 用户名
  username: string;
  // 昵称
  nickname: string;
  // 邮箱
  email: string;
  // 手机号
  phone: string;
  // 密码
  password: string;
  // 头像
  avatar: string;
  // 性别
  gender: number;
  //状态
  status: boolean;
}

// 添加或修改表单Props
export interface FormProps {
  formInline: FormItemProps;
}
