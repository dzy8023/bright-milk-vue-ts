import UserinfoDialog from "@/components/ReTable/Userinfo/UserinfoDialog.vue";
import MemberInfoDialog from "@/components/ReTable/Userinfo/MemberInfoDialog.vue";
import { addDialog } from "@/components/ReDialog/index";

/**
 * * 查看用户信息
 * @param userId
 */
export const selectUserinfo = async (userId: string) => {
  addDialog({
    title: "查看用户信息",
    draggable: true,
    contentRenderer: (): JSX.Element => <UserinfoDialog userId={userId} />
  });
};
/**
 * * 查看会员信息
 * @param userId
 */
export const selectMemberInfo = async (memberId: string) => {
  addDialog({
    title: "查看会员信息",
    draggable: true,
    contentRenderer: (): JSX.Element => <MemberInfoDialog memberId={memberId} />
  });
};
