/**登录信息 */
export type LoginResult = {
  /**用户名 */
  username: string;
  /**头像 */
  avatar: string;
  /**用户id */
  id: string;
  /**手机号 */
  phone: string;
  /**昵称 */
  nickname?: string;
  /**余额 */
  balance?: number;
  /**积分 */
  integration?: number;
};

/**用户信息 */
export type ProfileDetail = Omit<
  LoginResult,
  "token" | "phone" | "balance" | "integration"
> & {
  //复用LoginResult的属性，排除token
  /**生日 */
  birthday?: string;
  /**性别 */
  gender?: Gender;
};
/**性别 */
export type Gender = "男" | "女";
/**个人信息修改的请求参数 */
export type ProfileParams = Pick<
  ProfileDetail,
  "nickname" | "gender" | "birthday"
>;
